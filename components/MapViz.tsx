import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BlogPost } from '../types';

interface MapVizProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

const MapViz: React.FC<MapVizProps> = ({ posts, onSelectPost }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);

  // Load World GeoJSON data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(err => console.error("Failed to load map data", err));
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Projection
    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .center([0, 40])
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Draw Countries
    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('class', 'country')
      .attr('fill', '#e2e2e2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('transition', 'fill 0.3s')
      .on('mouseover', function() {
        d3.select(this).attr('fill', '#d1d5db');
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', '#e2e2e2');
      });

    // Draw Pins
    posts.forEach(post => {
      if (post.location) {
        const coords = projection([post.location.lng, post.location.lat]);
        if (coords) {
          const group = g.append('g')
            .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
            .style('cursor', 'pointer')
            .on('click', () => onSelectPost(post));

          // Pin marker (Circle)
          group.append('circle')
            .attr('r', 6)
            .attr('fill', '#eab308') // Primary color
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('class', 'animate-pulse');

          // Label
          group.append('text')
            .attr('y', -12)
            .attr('text-anchor', 'middle')
            .text(post.locationName || '')
            .attr('font-size', '10px')
            .attr('fill', '#333')
            .attr('font-weight', 'bold')
            .style('text-shadow', '1px 1px 0 #fff');
        }
      }
    });

  }, [geoData, posts, onSelectPost]);

  return (
    <div ref={wrapperRef} className="w-full h-full bg-[#a5d5f2]/20 rounded-xl overflow-hidden shadow-inner border border-stone-200">
       {!geoData && (
         <div className="flex items-center justify-center h-full text-stone-400">
           正在加载地图数据...
         </div>
       )}
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-xs text-stone-500 bg-white/80 p-2 rounded">
        Tips: 滚动鼠标可缩放地图，拖拽可移动视角
      </div>
    </div>
  );
};

export default MapViz;
