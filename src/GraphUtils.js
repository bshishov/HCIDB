function Graph() {
  this.nodes = [];
  this.edges = new Map();
}

Graph.prototype.fromFeatures = function(features) {
  this.nodes = features;

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

    if(edges.has(relation.from_id))
      edges.get(relation.from_id).push(relation.to_id);
    else
      edges.set(relation.from_id, [relation.to_id]);

    usedLinks.push(id);
  };

  features.forEach(feature => {
    feature.affects.forEach(addRelation);
    feature.depends.forEach(addRelation);
    if(!edges.has(feature.id))
      edges.set(feature.id, []);
  });

  this.nodes = nodeIds;
  this.edges = edges;
};

// Tarjan's strongly connected components algorithm
Graph.prototype.stronglyConnectedComponents = function() {
  var index = 0;
  var stack = [];
  var result = [];
  var meta = new Map();

  var graph = this;

  var connect = function connect(node) {
    var entry = {
      onStack: true,
      index: index,
      lowLink: index
    };

    meta.set(node, entry);
    stack.push(node);
    index += 1;

    graph.edges.get(node).forEach(function(adj) {
      if (!meta.has(adj)) {
        // adjacent node has not yet been visited, do it
        connect(adj);
        entry.lowLink = Math.min(entry.lowLink, meta.get(adj).lowLink);
      } else if (meta.get(adj).onStack) {
        entry.lowLink = Math.min(entry.lowLink, meta.get(adj).index);
      }
    });

    // check if node is a root node, pop the stack and generated an SCC
    if (entry.lowLink === entry.index) {
      var scc = [];
      var adj = null;

      do {
        adj = stack.pop();
        meta.get(adj).onStack = false;
        scc.push(adj);
      } while (node !== adj);

      result.push(scc);
    }
  };

  graph.nodes.forEach(function(node) {
    if (!meta.has(node)) {
      connect(node);
    }
  });

  return result;
};

// Based on Donald B. Johnson 1975 paper
// Finding all the elementary circuits of a directed graph
Graph.prototype.findCycles = function() {
  var startNode;
  var stack = [];
  var circuits = [];
  var blocked = new Map();

  // book keeping to prevent Tarjan's algorithm fruitless searches
  var b = new Map();

  var graph = this;

  function addCircuit(start, stack) {
    var orders = [start.order].concat(
      stack.map(function(n) {
        return n.order;
      })
    );

    // prevent duplicated cycles
    // TODO: figure out why this is needed, this is most likely related to
    // startNode being the "least" vertex in Vk
    if (Math.min.apply(null, orders) !== start.order) {
      circuits.push([].concat(stack).concat(start));
    }
  }

  function unblock(u) {
    blocked.set(u, false);

    if (b.has(u)) {
      b.get(u).forEach(function(w) {
        b.get(u).delete(w);
        if (blocked.get(w)) {
          unblock(w);
        }
      });
    }
  }

  function circuit(node) {
    var found = false;

    stack.push(node);
    blocked.set(node, true);

    graph.edges.get(node).forEach(function(w) {
      if (w === startNode) {
        found = true;
        addCircuit(startNode, stack);
      } else if (!blocked.get(w)) {
        if (circuit(w)) {
          found = true;
        }
      }
    });

    if (found) {
      unblock(node);
    } else {
      graph.edges.get(node).forEach(function(w) {
        var entry = b.get(w);

        if (!entry) {
          entry = new Set();
          b.set(w, entry);
        }

        entry.add(node);
      });
    }

    stack.pop();
    return found;
  }

  graph.nodes.forEach(function(node) {
    startNode = node;
    graph.edges.get(node).forEach(circuit);
  });

  return circuits;
};


export default Graph;
