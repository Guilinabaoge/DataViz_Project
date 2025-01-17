import {select,selectAll,pointer,scaleTime} from "d3";
import { addMarker } from "./mapbox/mapbox";
import { newQuery } from "./useData/useHex"

var _projection = null;

export function eventHandlers(projection){
    _projection = projection

    selectAll(".hex")
    .on("click",(event) => {
      clickHex(event)
    })
    .on("mouseover",(event,d)=>{
      //TODO hovering effect of hexmap 
    }) ;
  
    select("#horizon_graph")
    .on("mousemove",(event)=>{
      var mouse = pointer(event)
      select(".mouse-line").attr("d",`M ${mouse[0]},500 ${mouse[0]},0`)
      updateTooltipContent(event)})
    .on("mouseover",(event)=>{
      select(".mouse-line").style("opacity", "1")
      select("#tooltip").style("opacity", "1")})
    .on("mouseout",(event)=>{
      select(".mouse-line").style("opacity", "0")
      select("#tooltip").style("opacity", "0")});
    // .on("click",(event,d)=>{ 
    //   //TODO refactor with updateTooltipContent
    //   const mouse_on = timescale.invert(event.screenX);
    //   const year = mouse_on.getFullYear().toString()
    //   const month = mouse_on.getMonth().toString()
    //   const day = mouse_on.getDate().toString()
    //   newQuery(year,month,day)
    // });
}


function updateTooltipContent(event){

  // TODO handle code duplication
  const mouse_on = timescale.invert(event.screenX);
  const year = mouse_on.getFullYear().toString()
  const month = mouse_on.getMonth().toString()
  const day = mouse_on.getDate().toString()
    select("#tooltip").html(`Year:${year}   Month:${(parseInt(month)+1).toString()}   Day:${day}`)
    .style('display', 'block')
    .style('left', `${event.screenX+20}px`)
    .style('top', `${event.screenY+0}px`)
    .style('font-size', 11.5)
  }

const timescale = scaleTime()
  .range([9,1610])
  .domain([new Date().setFullYear(2014,5,7),new Date().setFullYear(2020,9,2)])


function clickHex(event){
  const _lat = event.path[0].transform.baseVal.consolidate().matrix.f;
  const _lng = event.path[0].transform.baseVal.consolidate().matrix.e;
  const [lng,lat] = _projection.invert([_lng,_lat]);
  addMarker({lngLat:{lng:`${lng}`,lat:`${lat}`}})
}


export function makeVerticalLine(){
    const horizonGraph = select("#horizon_graph");
    const mouseG = horizonGraph.append("g").attr("class", "mouse-over-effects");

    mouseG.append("path") // create vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1")
    .style("opacity", "0")

    select("#horizon_container").append("div")
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style("background-color", "#D3D3D3")
      .style('padding', 6)
      .style('display', 'none')
  }


