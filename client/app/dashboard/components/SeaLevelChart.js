"use client";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function SeaLevelChart({ data, width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.time))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.sea_level) + 0.1])
      .range([chartHeight, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y(d => yScale(d.sea_level))
      .curve(d3.curveMonotoneX);

    // Add gradient
    const gradient = chart.append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(d3.max(data, d => d.sea_level)))
      .attr("x2", 0)
      .attr("y2", yScale(d3.min(data, d => d.sea_level)));

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#06b6d4");

    // Add area
    const area = d3.area()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y0(chartHeight)
      .y1(d => yScale(d.sea_level))
      .curve(d3.curveMonotoneX);

    chart.append("path")
      .datum(data)
      .attr("fill", "url(#line-gradient)")
      .attr("opacity", 0.3)
      .attr("d", area);

    // Add line
    chart.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add dots
    chart.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.time) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.sea_level))
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6);
        
        // Add tooltip
        const tooltip = chart.append("g")
          .attr("class", "tooltip");
        
        tooltip.append("rect")
          .attr("x", xScale(d.time) + xScale.bandwidth() / 2 - 30)
          .attr("y", yScale(d.sea_level) - 40)
          .attr("width", 60)
          .attr("height", 30)
          .attr("fill", "rgba(0,0,0,0.8)")
          .attr("rx", 5);
        
        tooltip.append("text")
          .attr("x", xScale(d.time) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.sea_level) - 25)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .text(`${d.sea_level}m`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4);
        chart.selectAll(".tooltip").remove();
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "12px")
      .attr("fill", "#6b7280");

    chart.append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "12px")
      .attr("fill", "#6b7280");

    // Add grid lines
    chart.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-chartWidth)
        .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.3);

  }, [data, width, height]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
}
