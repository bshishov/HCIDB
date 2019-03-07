<template>
  <svg width="100%" height="100%" ref="canvas" class="canvas" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrow"
              markerWidth="12" markerHeight="12"
              refX="7" refY="3"
              orient="auto"
              markerUnits="userSpaceOnUse" >
        <path d="M0,0 L0,6 L9,3 z" fill="black" />
      </marker>
      <marker id="circle"
              markerWidth="8" markerHeight="8"
              refX="4" refY="4"
              orient="auto"
              markerUnits="userSpaceOnUse" >
        <circle cx="4" cy="4" r="4" fill="#ccc"></circle>
      </marker>
    </defs>
    <g class="everything">
      <g class="links"></g>
      <g class="nodes">
        <!--<foreignObject :id="node.id" width="160" height="30" class="node" v-for="node in nodes" :key="node.id">-->
          <!--<div xmlns="http://www.w3.org/1999/xhtml" @click="$emit('nodeSelected', node)">-->
            <!--<div class="caption">-->
              <!--{{ node.name }}-->
            <!--</div>-->
          <!--</div>-->
        <!--</foreignObject>-->
      </g>
    </g>
  </svg>
</template>

<script>
  import * as d3 from "d3";
  import {clamp, pointOnRect} from "@/utils";

  class Graph {
    constructor(svgElement, onSelectCallback) {
      console.log('[Graph] DOM-element', svgElement);
      this.svg = d3.select(svgElement);
      this.selectCallback = onSelectCallback;
      let boundingClientRect = svgElement.getBoundingClientRect();

      this.g = this.svg.select('.everything');
      this.linkSelection = this.g
        .select('.links')
        .selectAll('.link');

      this.nodeSelection = this.g
        .select('.nodes')
        .selectAll('.node');

      //add drag capabilities
      let dragHandler = d3.drag()
        .on("start", this.dragStart.bind(this))
        .on("drag", this.dragDrag.bind(this))
        .on("end", this.dragEnd.bind(this));

      //dragHandler(this.nodeSelection);

      //add zoom capabilities
      let zoomHandler = d3.zoom()
        .on("zoom", () => {
          this.g.attr("transform", d3.event.transform)
        });
      zoomHandler(this.svg);

      this.simulation = d3.forceSimulation().nodes([]);
      this.simulation
        .force("chargeForce",  d3.forceManyBody().strength(-500))
        .force("links", d3.forceLink([]).id(d => { return d.id; }).distance(100))
        .force("centerForce", d3.forceCenter(boundingClientRect.width / 2, boundingClientRect.height / 2))
        .force("collisionForce", d3.forceCollide(90).strength(0.3));
      this.simulation.on("tick", this.tickActions.bind(this));
    }

    setData(nodes, links) {
      //nodes = JSON.parse(JSON.stringify(nodes));
      //links = JSON.parse(JSON.stringify(links));

      // Update links
      this.linkSelection
        .data(links, d => { return d.id; })
        .join(enter => enter.append("line")
                            .attr("stroke-width", 1)
                            .attr("class", 'link')
                            .attr('marker-end', "url(#arrow)")
                            .attr('marker-start', "url(#circle)")
                            .style("stroke", 'black'),
              update => {},
              exit => exit.remove()
        );

      // Update nodes
      this.nodeSelection
        .data(nodes, d => { return d.id; })
        .join(enter => enter.append('foreignObject')
                            .attr('width', 160)
                            .attr('height', 30)
                            .attr('class', 'node')
                            .on('click', this.selectCallback)
                            .append('xhtml:div')
                            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
                            .append('xhtml:div')
                            .attr('class', 'caption')
                            .text(d => { return d.name }),
              update => {},
              exit => exit.remove());

      this.linkSelection = this.g.select('.links').selectAll('.link');
      this.nodeSelection = this.g.select('.nodes').selectAll('.node');

      // Restart simulation
      this.simulation.nodes(nodes);
      this.simulation.force("links").links(links);
      this.simulation.alpha(1).restart();
    }

    tickActions() {
      this.nodeSelection
        .attr("x", d => { return d.x - 80; })
        .attr("y", d => { return d.y - 15; });

      this.linkSelection
        .each((d, i) => {
          d.sourceP = pointOnRect(d.target.x,
            d.target.y,
            d.source.x - 80,
            d.source.y - 15,
            d.source.x + 80,
            d.source.y + 15);

          d.targetP = pointOnRect(d.source.x,
            d.source.y,
            d.target.x - 80,
            d.target.y - 15,
            d.target.x + 80,
            d.target.y + 15);
        })
        .attr("x1", d => { return d.sourceP.x; })
        .attr("y1", d => { return d.sourceP.y; })
        .attr("x2", d => { return d.targetP.x; })
        .attr("y2", d => { return d.targetP.y; });
    }

    //Drag functions
    //d is the node
    dragStart(d) {
      if (!d3.event.active)
        this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    //make sure you can't drag the circle outside the box
    dragDrag(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    dragEnd(d) {
      if (!d3.event.active)
        this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  export default {
    name: "Graph",
    props: {
     features: { type: Array, default: [] }
    },
    data() {
      return {
        nodes: [],
        links: [],
        graph: null
      }
    },
    mounted() {
      console.log('[GRAPH] Mounted');
      this.graph = new Graph(this.$refs.canvas, this.onNodeSelected);
    },
    updated() {
      //this.featuresToNodesAndLinks(this.features);
    },
    watch: {
      features(newFeatures) {
        console.log('[GRAPH] Features props changed');
        this.featuresToNodesAndLinks(newFeatures);
      }
    },
    methods: {
      featuresToNodesAndLinks(features) {
        console.log('[GRAPH] Rebuilding nodes and links');

        if (!features)
          return;

        let nodeIds = features.map(f => { return f.id; });
        let usedLinks = [];
        let links = [];
        this.nodes = features.map(f => { return f; });

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

          links.push({
            source: relation.from_id,
            target: relation.to_id,
            id: id
          });
          usedLinks.push(id);
        };

        features.forEach(feature => {
          feature.affects.forEach(addRelation);
          feature.depends.forEach(addRelation);
        });

        this.links = links;
        this.graph.setData(this.nodes, this.links);
        console.log('[GRAPH]', { nodes: this.nodes.length, links: this.links.length });
      },
      onNodeSelected(node) {
        console.log('[Graph] Selected', node);
        this.$emit('nodeSelected', node);
      }
    }
  }
</script>

<style scoped lang="sass">
.canvas
  background-color: #f3f3f3
  border: 1px solid #ccc
  border-radius: 10px
  cursor: grab
  min-width: 600px

</style>

<style lang="sass">
.canvas .node
  font-size: 0.7em
  padding: 2px 4px
  /*background-color: #f5f5f5*/
  background-color: white
  border-radius: 5px
  text-align: center
  cursor: pointer
  border: 1px solid #ccc
  vertical-align: middle
  line-height: 0.9
  /*box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)*/

  div
    display: flex
    flex-flow: row nowrap
    justify-content: center
    height: 100%
    align-items: center
</style>
