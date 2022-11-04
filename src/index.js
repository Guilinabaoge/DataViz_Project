import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,interpolateBlues} from 'd3';
import { useMap } from './useMap';
import { Marks } from './Marks';
import { useGas } from './useGas'; 
import { useTest } from './useTest'; 
import { ColorBar } from './ColorBar'
import { HChart} from './HChart';


const width = 3072;
const height = 1920;

const App = () => {
  const map = useMap();
  const gas = useGas(); 
  const test = useTest();
  console.log(test)


  if (!map|| !gas) {
    return <pre>Loading...</pre>;
  }
  
  const rowByState = new Map();
  gas.forEach(d => {
  	rowByState.set(d.state,d);
  })
  
  const colorValue = d => d.diesel;

  const colorScale = scaleSequential(interpolateBlues)
		.domain([min(gas,colorValue),max(gas,colorValue)]);

  ColorBar(colorScale);

  const hChart = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });


  if (document.getElementById("hbar") !== null && document.getElementById("hbar").hasChildNodes() === false && test!==null) {
    document.getElementById("hbar").appendChild(hChart)
    document.getElementById("hbar").firstChild.classList.add("red")
    console.log(document.getElementById("hbar").firstChild)
  } 
  
  
  return (
    <div class="float-parent-element">
      <div class="float-child-element" id="hbar">
      </div>
      <div class="float-child-element">
        <svg class="yellow" width={width} height={height} id="colorbar">
            <g>
                <Marks
                  map={map} 
                  rowByState={rowByState}
                  colorScale = {colorScale}
                  colorValue = {colorValue}
                />
            </g>
        </svg>
      </div>
    </div>
    
  );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
