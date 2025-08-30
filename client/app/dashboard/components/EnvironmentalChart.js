"use client";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EnvironmentalChart({ data, width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the parameters to plot
    const parameters = [
      { key: 'wave_height', name: 'Wave Height', color: '#06b6d4' },
      { key: 'wind_speed', name: 'Wind Speed', color: '#10b981' },
      { key: 'rainfall', name: 'Rainfall', color: '#8b5cf6' }
    ];

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.time))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(parameters, param => d3.max(data, d => d[param.key])) * 1.1
      ])
      .range([chartHeight, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y(d => d.value)
      .curve(d3.curveMonotoneX);

    // Add lines for each parameter
    parameters.forEach((param, index) => {
      const lineData = data.map(d => ({
        time: d.time,
        value: yScale(d[param.key])
      }));

      // Add line
      chart.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", param.color)
        .attr("stroke-width", 2.5)
        .attr("d", line);

      // Add dots
      chart.selectAll(`.dot-${param.key}`)
        .data(lineData)
        .enter()
        .append("circle")
        .attr("class", `dot-${param.key}`)
        .attr("cx", d => d.time)
        .attr("cy", d => d.value)
        .attr("r", 3)
        .attr("fill", param.color)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
          d3.select(this).attr("r", 5);
          
          // Add tooltip
          const tooltip = chart.append("g")
            .attr("class", "tooltip");
          
          tooltip.append("rect")
            .attr("x", xScale(d.time) + xScale.bandwidth() / 2 - 40)
            .attr("y", d.value - 30)
            .attr("width", 80)
            .attr("height", 20)
            .attr("fill", "rgba(0,0,0,0.8)")
            .attr("rx", 5);
          
          tooltip.append("text")
            .attr("x", xScale(d.time) + xScale.bandwidth() / 2)
            .attr("y", d.value - 15)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "10px")
            .text(`${param.name}: ${data.find(item => item.time === d.time)[param.key]}`);
        })
        .on("mouseout", function() {
          d3.select(this).attr("r", 3);
          chart.selectAll(".tooltip").remove();
        });
    });

    // Add legend
    const legend = chart.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${chartWidth - 120}, 10)`);

    parameters.forEach((param, index) => {
      const legendGroup = legend.append("g")
        .attr("transform", `translate(0, ${index * 20})`);

      legendGroup.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 20)
        .attr("y2", 0)
        .attr("stroke", param.color)
        .attr("stroke-width", 2.5);

      legendGroup.append("text")
        .attr("x", 25)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .attr("font-size", "11px")
        .attr("fill", "#374151")
        .text(param.name);
    });

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("fill", "#6b7280");

    chart.append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "11px")
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
