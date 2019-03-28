import {html} from '@polymer/polymer/polymer-element.js';

export const style = html`<style>:host {
  display: block;
  height:100%;
  width:100%; }

.highcharts-root {
      font-family: Arial, Helvetica, sans-serif;
}
.highcharts-pie-series .highcharts-point {
  stroke: #EDE;
  stroke-width: 1px; }

.highcharts-pie-series .highcharts-data-label-connector {
  stroke: silver;
  stroke-dasharray: 1, 1;
  stroke-width: 1px; }
.highcharts-tooltip-box {
  fill-opacity: 0.7;
}
.highcharts-data-labels {
  opacity:1 !important
}
#scorecardkpiTarget{
  font-size: 14px;
  border: 1px solid lightgray;
  border-radius: 5px;
  outline: none;
  text-align: center;
  margin: 8px auto;
  position: relative;
  display: inline-block;
  cursor: pointer;
}
#targetTitle{
   margin-left: 8px;
   margin-right: 8px;
   margin-top: 2px;
   margin-bottom: 2px;
}
#targetText{
   font-weight: bold;
}
#targetAboveValue, #targetBelowValue {
   color: #d3650a;
}
.weather-1{
  height:40px;
  width:40px;
  background: url("./extras/images/weather-sunny.png") no-repeat;
  background-position:center center;
  background-size:contain;
}
.weather-18{
  height:40px;
  width:40px;
  background: url("./extras/images/weather-rain.png") no-repeat;
  background-position:center center;
  background-size:contain;
}
.weather-22{
  height:40px;
  width:40px;
  background: url("./extras/images/weather-22.png") no-repeat;
  background-position:center center;
  background-size:contain;
}

</style>`;