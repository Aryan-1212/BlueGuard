"use client";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RiskChart({ data, width = 300, height = 200 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

    // Add bars
    chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => chartHeight - yScale(d.value))
      .attr("fill", d => d.color)
      .attr("rx", 4)
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke", "#374151")
          .attr("stroke-width", 2);
        
        // Add tooltip
        const tooltip = chart.append("g")
          .attr("class", "tooltip");
        
        tooltip.append("rect")
          .attr("x", xScale(d.name) + xScale.bandwidth() / 2 - 25)
          .attr("y", yScale(d.value) - 35)
          .attr("width", 50)
          .attr("height", 25)
          .attr("fill", "rgba(0,0,0,0.8)")
          .attr("rx", 5);
        
        tooltip.append("text")
          .attr("x", xScale(d.name) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.value) - 20)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "11px")
          .text(`${d.value}%`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("opacity", 0.8)
          .attr("stroke", "none");
        chart.selectAll(".tooltip").remove();
      });

    // Add value labels on bars
    chart.selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .text(d => `${d.value}%`);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`);

    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", "#6b7280")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    chart.append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "10px")
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
