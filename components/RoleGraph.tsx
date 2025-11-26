
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Persona } from '../types';

interface RoleGraphProps {
  personas: Persona[];
  onSelectPersona: (id: string) => void;
  selectedId?: string;
  highlightedIds?: Set<string>;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  val: number;
}

interface Link extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

const RoleGraph: React.FC<RoleGraphProps> = ({ personas, onSelectPersona, selectedId, highlightedIds }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateDims);
    updateDims();
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    if (!svgRef.current || personas.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const width = dimensions.width;
    const height = dimensions.height;

    // Define Nodes
    const nodes: GraphNode[] = personas.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      val: p.category === 'System' ? 15 : 8
    }));

    // Add a central conceptual node if needed, or link highly connected ones
    // For now, let's link based on simple logic: System nodes to Central, others to System
    const centralNodeId = 'cis';
    const links: Link[] = [];

    personas.forEach(p => {
       if (p.id !== centralNodeId) {
           // Link to declared relationships first
           if (p.relationships && p.relationships.length > 0) {
               p.relationships.forEach(rel => {
                   // only add if target exists
                   if (personas.find(per => per.id === rel)) {
                        links.push({ source: p.id, target: rel, value: 2 });
                   }
               });
           }
           
           // If no specific relationship, link to CIS or Orchestrator
           if (!p.relationships || p.relationships.length === 0) {
               links.push({ source: p.id, target: centralNodeId, value: 1 });
           }
       }
    });

    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(['System', 'Director', 'Specialist', 'Tool', 'Facilitator', 'Creative'])
      .range(['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']);

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<GraphNode, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => (d as any).val * 1.5 + 10));

    // Elements
    const link = svg.append('g')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    nodeGroup.append('circle')
      .attr('r', d => d.val)
      .attr('fill', d => color(d.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'cursor-pointer hover:stroke-indigo-400 transition-all')
      .on('click', (event, d) => onSelectPersona(d.id));

    // Add labels
    nodeGroup.append('text')
      .text(d => d.name.split(' ')[0]) // Short name
      .attr('x', d => d.val + 5)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('class', 'fill-slate-700 dark:fill-slate-300 pointer-events-none select-none font-medium');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Update visuals based on selection/highlight
    useEffect(() => {
        nodeGroup.select('circle')
            .transition()
            .duration(300)
            .attr('stroke', d => {
                if ((d as GraphNode).id === selectedId) return '#6366f1'; // Primary selection color
                return '#fff';
            })
            .attr('stroke-width', d => {
                if ((d as GraphNode).id === selectedId) return 4;
                return 2;
            })
            .attr('opacity', d => {
                // Dim nodes that are NOT highlighted if there is a highlight set
                if (highlightedIds && highlightedIds.size > 0 && !highlightedIds.has((d as GraphNode).id)) {
                    return 0.3;
                }
                return 1;
            });
            
        link.transition().duration(300)
            .attr('opacity', d => {
                 if (highlightedIds && highlightedIds.size > 0) {
                     const sourceId = (d.source as GraphNode).id;
                     const targetId = (d.target as GraphNode).id;
                     if (!highlightedIds.has(sourceId) || !highlightedIds.has(targetId)) {
                         return 0.1;
                     }
                 }
                 return 0.6;
            });

    }, [selectedId, highlightedIds]);

  }, [dimensions, personas, onSelectPersona]); // Only re-run simulation setup on basic props change

  // Separate effect for lightweight updates (selection/highlight) is handled inside the main effect via the nested useEffect pattern or 
  // D3's enter/update/exit pattern if structured differently. 
  // For simplicity in this component, the selection update logic is inside the main effect block above.
  
  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Network Topology</h3>
      </div>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default RoleGraph;
