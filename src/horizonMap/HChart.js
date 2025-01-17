// import {curveLinear,scaleUtc,scaleLinear,schemeGreys,map,extent,max,InternSet,range,axisTop,create,group,area} from 'd3'
import * as d3 from "d3"
import { ColorBar } from "../ColorBar";
import { legendColor } from 'd3-svg-legend'
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/horizon-chart
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/horizon-chart

export function HChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 0, // left margin, in pixels
  width = 350, // outer width, in pixels
  size = 10, // outer height of a single horizon, in pixels
  bands = 5, // number of bands
  padding = 1, // separation between adjacent horizons
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [size, size - bands * (size - padding)], // [bottom, top]
  zDomain, // array of z-values
  scheme = d3.schemeRdYlBu, // color scheme; shorthand for colors
  colors = scheme[Math.max(3, bands)], // an array of colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Compute height.
  const height = zDomain.size * size + marginTop + marginBottom;

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisTop(xScale).ticks(width / 30).tickSizeOuter(3);
  
  // A unique identifier for clip paths (to avoid conflicts).
  const uid = `O-${Math.random().toString(16).slice(2)}`;


  // Construct an area generator.
  const area = d3.area()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y0(yScale(0))
      .y1(i => yScale(Y[i]));

  

  const svg = d3.create("svg")
      .attr("id","horizon_graph")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);
      // .attr("id","hexmap");

  const g = svg.selectAll("g")
    .data(d3.group(I, i => Z[i]))
    .join("g")
      .attr("transform", (_, i) => `translate(0,${i * size + marginTop})`);

  const defs = g.append("defs");

  defs.append("clipPath")
      .attr("id", (_, i) => `${uid}-clip-${i}`)
    .append("rect")
      .attr("y", padding)
      .attr("width", width)
      .attr("height", size - padding);

  defs.append("path")
      .attr("id", (_, i) => `${uid}-path-${i}`)
      .attr("d", ([, I]) => area(I));

  
  g
    .attr("clip-path", (_, i) => `url(${new URL(`#${uid}-clip-${i}`, window.location)})`)
    .selectAll("use")
    .data((d, i) => new Array(bands).fill(i))
    .join("use")
      .attr("fill", (_, i) => colors[i + Math.max(0, 3 - bands)])
      .attr("transform", (_, i) => `translate(0,${i * size})`)
      .attr("xlink:href", (i) => `${new URL(`#${uid}-path-${i}`, window.location)}`);

  g.append("text")
      .attr("x", marginLeft)
      .attr("y", (size + padding) / 3)
      .attr("dy", "0.35em")
      .attr("transform","translate(0,2),scale(0.4)")
      .text(([z]) => z);

  // Since there are normally no left or right margins, don’t show ticks that
  // are close to the edge of the chart, as these ticks are likely to be clipped.
  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(xAxis)
      .call(g => g.selectAll(".tick")
        .filter(d => xScale(d) < 10 || xScale(d) > width - 10)
        .remove())
      .call(g => g.select(".domain").remove());

  const colorValue = d => d.value;

  const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
  .domain([d3.min(data,colorValue),d3.max(data,colorValue)]);

  //TODO refactor this sht code duplication
  var _svg = d3.select("#horizon_legend");
  _svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(40,100) scale(1)");

  var legend = legendColor()
    .labelFormat(d3.format(".3f"))
    .cells(10)
    .shape("rect")
    .titleWidth(10)
    .shapeHeight(60)
    .shapeWidth(60)
    // .orient('horizontal')
    .scale(colorScale);

  _svg.select(".legendQuant")
    .call(legend);

  return svg.node();
}
