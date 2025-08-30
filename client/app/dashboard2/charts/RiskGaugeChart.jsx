"use client";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RiskGaugeChart({ 
  value, 
  width = 200, 
  height = 140,
  title = "Risk Level"
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const centerX = width / 2;
    const centerY = height - 20;
    const radius = Math.min(width, height) / 3;

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gaugeGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981');

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#eab308');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ef4444');

    // Background arc
    const backgroundArc = d3.arc()
      .innerRadius(radius - 15)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append('path')
      .attr('d', backgroundArc)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', '#e5e7eb');

    // Value arc
    const valueArc = d3.arc()
      .innerRadius(radius - 15)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (Math.PI * value / 100));

    const valueArcPath = svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', 'url(#gaugeGradient)')
      .attr('d', valueArc);

    // Animate the value arc
    valueArcPath
      .transition()
      .duration(2000)
      .attrTween('d', function() {
        const interpolate = d3.interpolate(0, value);
        return function(t) {
          const currentValue = interpolate(t);
          const currentArc = d3.arc()
            .innerRadius(radius - 15)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(-Math.PI / 2 + (Math.PI * currentValue / 100));
          return currentArc({}) || '';
        };
      });

    // Center dot
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 8)
      .attr('fill', '#374151');

    // Needle
    const needleAngle = -Math.PI / 2 + (Math.PI * value / 100);
    const needleLength = radius - 25;
    
    const needleEndX = centerX + needleLength * Math.cos(needleAngle);
    const needleEndY = centerY + needleLength * Math.sin(needleAngle);

    const needle = svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', centerX)
      .attr('y2', centerY - needleLength)
      .attr('stroke', '#374151')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round');

    // Animate needle
    needle
      .transition()
      .duration(2000)
      .attr('x2', needleEndX)
      .attr('y2', needleEndY);

    // Value text
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', '#374151')
      .text('0%')
      .transition()
      .duration(2000)
      .tween('text', function() {
        const interpolate = d3.interpolate(0, value);
        return function(t) {
          d3.select(this).text(`${Math.round(interpolate(t))}%`);
        };
      });

    // Title text
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .text(title);

  }, [value, width, height, title]);

  return (
    <div className="gauge-container flex items-center justify-center" data-testid="risk-gauge-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
}