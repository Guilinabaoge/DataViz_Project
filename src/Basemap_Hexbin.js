import * as d3 from "d3"
import './map_level.css'
import {hexbin} from 'd3-hexbin'
import { ColorBar } from './ColorBar';

export function Hexmap (map_width,height,proj,states,city_info){
  
  //How many hexbins?  
  var _hexbin =  hexbin()
  .extent([[0, 0], [map_width, height]])
  .x(x => x.x)
  .y(y => y.y)
  .radius(map_width/100);
 
  let div = d3
    .create('div')
    .style("width", `${map_width}px`)
    .style("height", `${height}px`)
    .style('overflow', 'hidden');

  let svg = div
    .append('svg')
    .style('overflow', 'hidden')
    .attr("viewBox", `0,0,${map_width},${height}`)
    .attr("id","basemap");

  let path = d3.geoPath().projection(proj);

  let map = svg.append('g');
    map
    .selectAll("path")
    .data(states.features)
    .join("path")
    .attr('class', 'state')
    .attr('d', path)
    .style("fill", function(d) {
      return d3.interpolateBlues(
        0
      );
    })
    .attr("stroke-width", 'px')
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .style("background-color","white")

  
   const city_info_hex = _hexbin(city_info)
   const hex_max = d3.max(city_info_hex.map(o => d3.sum(o.map(d => d.diesel))))
    let hexes = map
      .append("g")
      .attr("id","hexmap")
      .selectAll("path")
      .data(city_info_hex)
      .join("path")
      .attr('class', 'hex')
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .attr("d", _hexbin.hexagon())
      .style("fill", o =>
          d3.interpolateBuGn((d3.sum(o.map(d => d.diesel)) / hex_max) ** 0.25)
      )
      .style("opacity", 1)
      .style("stroke", "#fff")
      .attr("stroke-width", 0.4)

  return div.node();
}


export function makeHexMap(map,fuel_price){
  const width = 900;
  const height = 600;
  const projection = d3.geoMercator()
  .fitSize([width, height], map)

  let projected_points = fuel_price.map((d)=>{
    const [x, y] = projection([Number(d.lng), Number(d.lat)]);
    let diesel = d.diesel;
    return {diesel,x,y}; 
  });

  const hexmap = Hexmap(width,height,projection,map,projected_points);
  document.getElementById("hexmap_container").appendChild(hexmap)
  document.getElementById("hexmap_container").firstChild.setAttribute("id", "hexmap")

  const colorValue = d => d.diesel;

  const colorScale = d3.scaleSequential(d3.interpolateBuGn)
  .domain([d3.min(fuel_price,colorValue),d3.max(fuel_price,colorValue)]);

  ColorBar(colorScale);
}




