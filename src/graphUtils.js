class Graph {
  constructor(params = {}) {
    this.nodeKey = params.nodeKey || 'id';
    this.sourceNodeKey = params.sourceNodeKey || 'source';
    this.targetNodeKey = params.targetNodeKey || 'target';
    this.nodes = params.nodes || new Map();
    this.edges = params.edges || new Map();
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  fromFeatures(features) {
    let nodeIds = features.map(f => { return f.id; });
    let usedLinks = [];
    let edges = new Map();
    let addRelation = function(relation) {
      let id = relation.from_id + '-' + relation.to_id;
      if (usedLinks.includes(id))
        return;

      if(!nodeIds.includes(relation.from_id)) {
        console.log('Missing', relation.from_id);
        return;
      }

      if(!nodeIds.includes(relation.to_id))
        return;

      let edge = {
        source: relation.from_id,
        target: relation.to_id
      };

      if(edges.has(relation.from_id))
        edges.get(relation.from_id).push(edge);
      else
        edges.set(relation.from_id, [edge]);

      usedLinks.push(id);
    };

    features.forEach(feature => {
      this.nodes.set(feature.id, feature);
      feature.affects.forEach(addRelation);
      feature.depends.forEach(addRelation);
      if(!edges.has(feature.id))
        edges.set(feature.id, []);
    });

    this.edges = edges;
  };

  // Tarjan's strongly connected components algorithm
  stronglyConnectedComponents() {
    let index = 0;
    let stack = [];
    let result = [];
    let meta = new Map();

    let connect = function(node) {
      let nodeId = node[this.nodeKey];
      let entry = {
        onStack: true,
        index: index,
        lowLink: index
      };

      meta.set(nodeId, entry);
      stack.push(nodeId);
      index += 1;

      this.edges.get(nodeId).forEach(edge => {
        let adjacentNodeId = edge[this.targetNodeKey];
        if (!meta.has(adjacentNodeId)) {
          // adjacent node has not yet been visited, do it
          connect(this.nodes.get(adjacentNodeId));
          entry.lowLink = Math.min(entry.lowLink, meta.get(adjacentNodeId).lowLink);
        } else if (meta.get(adjacentNodeId).onStack) {
          entry.lowLink = Math.min(entry.lowLink, meta.get(adjacentNodeId).index);
        }
      });

      // check if node is a root node, pop the stack and generated an SCC
      if (entry.lowLink === entry.index) {
        let scc = [];
        let adjacentNodeId = null;

        do {
          adjacentNodeId = stack.pop();
          meta.get(adjacentNodeId).onStack = false;
          scc.push(adjacentNodeId);
        } while (nodeId !== adjacentNodeId);

        result.push(scc.map(nodeId => this.nodes.get(nodeId)));
      }
    }.bind(this);

    this.nodes.forEach(node => {
      let nodeId = node[this.nodeKey];
      if (!meta.has(nodeId)) {
        connect(node);
      }
    });

    return result;
  };

  findCycles() {
    let A = new Map();
    let B = new Map();
    let blocked = new Map();
    let stack = [];
    let cycles = [];
    let s = 0;

    let unblock = function(u) {
      blocked.set(u, false);
      if(B.has(u)) {
        let Bu = B.get(u);
        Bu.forEach(w => {
          Bu.delete(w);
          if (blocked.get(w)) {
            unblock(w);
          }
        });
      }
    }.bind(this);

    let circuit = function(v) {
      let f = false;
      stack.push(v);
      blocked.set(v, true);
      if(A.has(v)) {
        A.get(v).forEach(w => {
          if (w === s) {
            console.log('Found cycle', s, stack);
            cycles.push(stack.map(nodeId => this.nodes.get(nodeId)));
            f = true;
          } else {
            if(!blocked.has(w) || !blocked.get(w)) {
              if(circuit(w))
                f = true;
            }
          }
        });

        if(f) {
          unblock(v);
        } else {
          A.get(v).forEach(w => {
            let entry = B.get(w);
            if (!entry) {
              entry = new Set();
              B.set(w, entry);
            }
            entry.add(w);
          });
        }
      }
      stack.pop();
      return f;
    }.bind(this);

    this.edges.forEach((targets, source) => {
      let entry = A.get(source);
      if(!entry) {
        entry = new Set();
        A.set(source, entry);
      }

      targets.forEach(target => {
        entry.add(target.target);
      });
    });

    A.forEach((adjacentSet, vertex) => {
      s = vertex;

      A.forEach((adj, i) => {
        blocked.set(i, false);
        B.set(i, new Set());
      });

      circuit(s);
    });

    return cycles;
  };

  searchPaths(fromId, toId) {
    // todo: https://efficientcodeblog.wordpress.com/2018/02/15/finding-all-paths-between-two-nodes-in-a-graph/
    console.log('Searching');
    let closed = new Set();
    let fringe = [{id: fromId, parent: null}];
    let paths = [];
    let unwrap = function (node) {
      let n = node;
      let path = [];
      while (n.parent != null){
        path.unshift(this.nodes.get(n.id));
        n = n.parent;
      }
      return path;
    }.bind(this);

    while (true) {
      if (fringe.length === 0)
        break;
      let node = fringe.pop();

      if (node.id === toId) {
        paths.push(unwrap(node));
      } else {
        if (!closed.has(node.id)) {
          closed.add(node.id);
          if (this.edges.has(node.id)) {
            this.edges.get(node.id).forEach(edge => {
              fringe.push({
                id: edge[this.targetNodeKey],
                parent: node
              });
            });
          }
        }
      }
    }

    return paths;
  }
}

export default Graph;
