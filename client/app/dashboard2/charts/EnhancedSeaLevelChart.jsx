"use client";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EnhancedSeaLevelChart({ 
  data, 
  width = 600, 
  height = 320 
}) {
  const svgRef = useRef(null);

  // Default data if none provided
  const defaultData = [
    { time: '00:00', actual: 1.82, predicted: null },
    { time: '04:00', actual: 1.84, predicted: null },
    { time: '08:00', actual: 1.86, predicted: null },
    { time: '12:00', actual: 1.88, predicted: null },
    { time: '16:00', actual: 1.87, predicted: 1.89 },
    { time: '20:00', actual: null, predicted: 1.91 },
    { time: '24:00', actual: null, predicted: 1.93 }
  ];

  const chartData = data || defaultData;

  useEffect(() => {
    if (!svgRef.current || !chartData.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.time))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([1.7, 2.0])
      .range([chartHeight, 0]);

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', chartHeight)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.6);

    // Line generators
    const actualLine = d3.line()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y(d => yScale(d.actual))
      .defined(d => d.actual !== null)
      .curve(d3.curveCardinal);

    const predictedLine = d3.line()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y(d => yScale(d.predicted))
      .defined(d => d.predicted !== null)
      .curve(d3.curveCardinal);

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y0(chartHeight)
      .y1(d => yScale(d.actual || d.predicted))
      .defined(d => d.actual !== null || d.predicted !== null)
      .curve(d3.curveCardinal);

    // Add area with animation
    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#areaGradient)')
      .attr('d', area)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Add actual data line
    const actualPath = g.append('path')
      .datum(chartData.filter(d => d.actual !== null))
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', actualLine);

    // Animate actual line
    const actualLength = actualPath.node()?.getTotalLength() || 0;
    actualPath
      .attr('stroke-dasharray', `${actualLength} ${actualLength}`)
      .attr('stroke-dashoffset', actualLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Add predicted data line
    const predictedPath = g.append('path')
      .datum(chartData.filter(d => d.predicted !== null))
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', predictedLine);

    // Animate predicted line
    const predictedLength = predictedPath.node()?.getTotalLength() || 0;
    predictedPath
      .attr('stroke-dasharray', `5,5,${predictedLength}`)
      .attr('stroke-dashoffset', predictedLength)
      .transition()
      .delay(1000)
      .duration(1500)
      .attr('stroke-dashoffset', 0);

    // Add data points
    g.selectAll('.actual-dot')
      .data(chartData.filter(d => d.actual !== null))
      .enter().append('circle')
      .attr('class', 'actual-dot')
      .attr('cx', d => xScale(d.time) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.actual))
      .attr('r', 0)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .transition()
      .delay((d, i) => i * 300)
      .duration(300)
      .attr('r', 5);

    g.selectAll('.predicted-dot')
      .data(chartData.filter(d => d.predicted !== null))
      .enter().append('circle')
      .attr('class', 'predicted-dot')
      .attr('cx', d => xScale(d.time) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.predicted))
      .attr('r', 0)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .transition()
      .delay((d, i) => 1000 + i * 300)
      .duration(300)
      .attr('r', 5);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Add hover interactions
    g.selectAll('circle')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 7);
        const value = d.actual || d.predicted;
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${d.time}: ${value}m`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

    // Add grid
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-chartWidth)
        .tickFormat('')
      )
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.3);

    // Cleanup tooltip on unmount
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };

  }, [chartData, width, height]);

  return (
    <div className="w-full" data-testid="enhanced-sea-level-chart">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
}