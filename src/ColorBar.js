import { select,format} from 'd3';
import { legendColor } from 'd3-svg-legend'


export const ColorBar = (colorScale) => {
  var svg = select("#basemap");
  svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(150,20) scale(1)");

  var legend = legendColor()
    .labelFormat(format(".3f"))
    .cells(10)
    .shape("rect")
    .titleWidth(10)
    .shapeHeight(15)
    .shapeWidth(15)
    .scale(colorScale);

  svg.select(".legendQuant")
    .call(legend);
  
};