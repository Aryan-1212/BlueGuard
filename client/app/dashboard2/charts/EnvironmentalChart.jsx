"use client";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EnvironmentalChart({ 
  data, 
  width = 600, 
  height = 256,
  viewMode = 'combined'
}) {
  const svgRef = useRef(null);

  // Default data if none provided
  const defaultData = [
    { time: "00:00", wave_height: 2.1, wind_speed: 25.0, rainfall: 0 },
    { time: "04:00", wave_height: 2.2, wind_speed: 26.5, rainfall: 12.5 },
    { time: "08:00", wave_height: 2.3, wind_speed: 27.8, rainfall: 28.0 },
    { time: "12:00", wave_height: 2.4, wind_speed: 28.5, rainfall: 45.2 },
    { time: "16:00", wave_height: 2.3, wind_speed: 28.0, rainfall: 38.7 },
    { time: "20:00", wave_height: 2.2, wind_speed: 27.2, rainfall: 22.1 },
    { time: "24:00", wave_height: 2.1, wind_speed: 26.8, rainfall: 15.3 }
  ];

  const chartData = data || defaultData;

  useEffect(() => {
    if (!svgRef.current || !chartData.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 60, bottom: 40, left: 50 };
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

    // Different scales for different parameters
    const waveScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.wave_height))
      .range([chartHeight, 0]);

    const windScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.wind_speed))
      .range([chartHeight, 0]);

    const rainfallScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.rainfall)])
      .range([chartHeight, 0]);

    // Line generators
    const waveLine = d3.line()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y(d => waveScale(d.wave_height))
      .curve(d3.curveCardinal);

    const windLine = d3.line()
      .x(d => xScale(d.time) + xScale.bandwidth() / 2)
      .y(d => windScale(d.wind_speed))
      .curve(d3.curveCardinal);

    if (viewMode === 'combined') {
      // Combined view with normalized scales
      const normalizedScale = d3.scaleLinear()
        .domain([0, 1])
        .range([chartHeight, 0]);

      const normalizeWave = d3.scaleLinear()
        .domain(d3.extent(chartData, d => d.wave_height))
        .range([0, 1]);

      const normalizeWind = d3.scaleLinear()
        .domain(d3.extent(chartData, d => d.wind_speed))
        .range([0, 1]);

      const normalizeRain = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.rainfall)])
        .range([0, 1]);

      // Wave height line
      const waveNormLine = d3.line()
        .x(d => xScale(d.time) + xScale.bandwidth() / 2)
        .y(d => normalizedScale(normalizeWave(d.wave_height)))
        .curve(d3.curveCardinal);

      const wavePath = g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 3)
        .attr('d', waveNormLine);

      // Wind speed line
      const windNormLine = d3.line()
        .x(d => xScale(d.time) + xScale.bandwidth() / 2)
        .y(d => normalizedScale(normalizeWind(d.wind_speed)))
        .curve(d3.curveCardinal);

      const windPath = g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3)
        .attr('d', windNormLine);

      // Rainfall bars
      g.selectAll('.rainfall-bar')
        .data(chartData)
        .enter().append('rect')
        .attr('class', 'rainfall-bar')
        .attr('x', d => xScale(d.time))
        .attr('y', chartHeight)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', '#8b5cf6')
        .attr('opacity', 0.6)
        .transition()
        .delay((d, i) => i * 100)
        .duration(1000)
        .attr('y', d => normalizedScale(normalizeRain(d.rainfall)))
        .attr('height', d => chartHeight - normalizedScale(normalizeRain(d.rainfall)));

      // Animate lines
      const waveLength = wavePath.node()?.getTotalLength() || 0;
      wavePath
        .attr('stroke-dasharray', `${waveLength} ${waveLength}`)
        .attr('stroke-dashoffset', waveLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);

      const windLength = windPath.node()?.getTotalLength() || 0;
      windPath
        .attr('stroke-dasharray', `${windLength} ${windLength}`)
        .attr('stroke-dashoffset', windLength)
        .transition()
        .delay(500)
        .duration(2000)
        .attr('stroke-dashoffset', 0);

      // Add dots
      g.selectAll('.wave-dot')
        .data(chartData)
        .enter().append('circle')
        .attr('class', 'wave-dot')
        .attr('cx', d => xScale(d.time) + xScale.bandwidth() / 2)
        .attr('cy', d => normalizedScale(normalizeWave(d.wave_height)))
        .attr('r', 0)
        .attr('fill', '#06b6d4')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .transition()
        .delay((d, i) => 2000 + i * 100)
        .duration(300)
        .attr('r', 4);

      g.selectAll('.wind-dot')
        .data(chartData)
        .enter().append('circle')
        .attr('class', 'wind-dot')
        .attr('cx', d => xScale(d.time) + xScale.bandwidth() / 2)
        .attr('cy', d => normalizedScale(normalizeWind(d.wind_speed)))
        .attr('r', 0)
        .attr('fill', '#10b981')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .transition()
        .delay((d, i) => 2500 + i * 100)
        .duration(300)
        .attr('r', 4);

    } else {
      // Individual view - show one parameter at a time
      const wavePath = g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 3)
        .attr('d', waveLine);

      const waveLength = wavePath.node()?.getTotalLength() || 0;
      wavePath
        .attr('stroke-dasharray', `${waveLength} ${waveLength}`)
        .attr('stroke-dashoffset', waveLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
    }

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "env-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

    if (viewMode === 'combined') {
      g.append('g')
        .call(d3.axisLeft(d3.scaleLinear().domain([0, 1]).range([chartHeight, 0])))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#6b7280');
    } else {
      g.append('g')
        .call(d3.axisLeft(waveScale))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#6b7280');
    }

    // Add grid
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(viewMode === 'combined' 
        ? d3.scaleLinear().domain([0, 1]).range([chartHeight, 0])
        : waveScale
      )
        .tickSize(-chartWidth)
        .tickFormat('')
      )
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.3);

    // Cleanup
    return () => {
      d3.select("body").selectAll(".env-tooltip").remove();
    };

  }, [chartData, width, height, viewMode]);

  return (
    <div className="w-full" data-testid="environmental-chart">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
}