import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';
import {
  CoreChartDatatypesModel
} from './core-chart-datatypes-model.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '../core-charts/core-charts.js';
import {
  style
} from './core-chart-datatypes-css.js';
/**
* `core-chart-datatypes`
* core-chart-datatypes
*
* @customElement 
* @polymer
* @demo demo/index.html
* @description 
* CoreChartDatatypes Component can be added by using `<core-chart-datatypes>` element.
* CoreChartDatatypes holds the methods for api call and formats the response using 
* CoreChartDatatypesModel. In this class the Api request is made with fully configured 
* chartConfig parameter.
*/
class CoreChartDatatypes extends PolymerElement {
  static get template() {
      return html`
    ${style}
    <div class$="{{applyClass}}" style="text-align:center;height:100%">
          <iron-ajax id="ironId" method="POST"  handle-as="json"   on-error="_handleError"></iron-ajax>
          <div id="autoTest"></div>
          <template class="center-align" is="dom-if" if="{{_isEqualTo(chartindex, 0)}}">
              <template is="dom-if" if="{{showLoader}}">
                  <div class="loader"></div>
              </template>
              <template class="center-align" is="dom-if" if="{{!_showTitle(showMsg, errorStatus)}}">
                  [[errorMessage]]
              </template>
            
                  <template is="dom-if" if="{{_showTitle(showMsg, errorStatus)}}">
                      <core-charts style="height:40%"
                          chartconfig="[[chartconfig]]"
                          chartindex="[[chartindex]]"  
                          chartId="emptychart">
                      </core-charts>
                  </template>
            
          </template>
          <template class="center-align" is="dom-if" if="{{_isEqualTo(chartindex, '')}}">
              <template is="dom-if" if="{{showLoader}}">
                  <div class="loader"></div>
              </template>
              <template class="center-align" is="dom-if" if="{{showMsg}}">
                  [[errorMessage]]
              </template>
          </template>
         
          <template is="dom-if" if="{{!showMsg}}">
              <template is="dom-if" if="{{getresponse}}">
                  <template is="dom-if" if="{{_isEqualTo(chartindex, 0)}}">
                      <core-charts style="height:60%"
                          chartconfig="[[chartconfig]]" 
                          chartType="[[charttype]]" 
                          chartId="[[chartId]]"
                          chartindex="[[chartindex]]"
                          apirequest="[[apirequest]]"
                          response="[[response]]"
                          dataseries="[[dataSeries]]">
                      </core-charts>
                  </template>
              
                  <template is="dom-if" if="{{!_isEqualTo(chartindex, 0)}}">
                     
                          <template is="dom-if" if="{{!_isArray(isArray,1)}}">
                              <core-charts style="height:100%"
                                  chartconfig="[[chartconfig]]" 
                                  chartType="[[charttype]]" 
                                  chartId="[[chartId]]"
                                  chartindex="[[chartindex]]"
                                  apirequest="[[apirequest]]"
                                  response="[[response]]"
                                  dataseries="[[dataSeries]]"
                                  targetbox ="[[targetbox]]">
                              </core-charts>
                          </template>
                      
                          <template is="dom-if" if="{{_isArray(isArray,1)}}">
                           <div style="height:100%; overflow-y:auto;">
                              <template is="dom-repeat" items="[[responses]]">
                                  <core-charts style="height:100%"
                                      chartconfig="[[chartconfig]]" 
                                      chartType="[[charttype]]" 
                                      chartId="[[chartId]]"
                                      chartindex="[[chartindex]]"
                                      apirequest="[[apirequest]]"
                                      response="[[item.response]]"
                                      dataseries="[[item.dataseries]]">
                                  </core-charts>
                              </template>
                           </div>
                          </template>
                  </template>
              </template>
          </template>
      </div>
  `;
  }
  static get properties() {
      return {
           /**
           *@description Apirequest is object having params 
           */
          apirequest: {
              type: Object,
              value: {}
          },
          /**
           * @description Chartconfig is object having properties like barColor(i.e Array), fontSize and fontFamily. 
           * Observer to listen for any change in params
           * @example 
           *"barColor": ["green", "red", "blue"],
           *"fontSize": "13px",
           *"fontFamily": "arial"
           */
          chartconfig: {
              type: Object,
              value: {}
          },
         /**
           * @description Based on the Chart type to render the chart. Observer to listen for any change in params
           * @example "charttype": "column"           
           */
          charttype: {
              type: String,
              value: ''
          },
          /**
           * chartid is Number having unique id for bar, pie or column.
           * @example "chartid": "1" 
            */
          chartid: {
              type: Number,
              value: ''
          },
          /**
           * chartindex is Number having unique value used for Bullet chart for creating multiple chart instance.
           * @example "chartindex": "0" 
           */
          chartindex: {
              type: Number,
              value: ''
          },
          /**
           * @description Array of Chart types supported by the component.
           * @example "supportedcharts": "["pie","bar","column"]"           
           */
          supportedcharts:{
              type: Array,
              value: []
          },

          response:{
              type: Object,
              value: {}
          },

          dataSeries: {
              type: Object,
              value: {}
          },
          responses:{
              type: Array,
              value:[]
          },
          targetbox:{
              type: Boolean,
              value:''
          }
      };
  }

  constructor() {
      super();
      this.errorStatus = ""; /** Holds the status of API error. */
      this.errorMessage = ""; /** Holds the status of API error. */
      this.showMsg = false; /** Holds the flag to show or hide error message. */
      this.showLoader = false; /** Holds the flag to show or hide loading img. */
      this.isArray = false;
      this.getresponse = false;
      this.formatData = {
          response: null,
          dataseries: null,
          type: null,
          errorMsg: ""
      }
  }

  /** 
   *  Get Chart type from properties
   *  Get unique Chart Id from properties
   *  Get Instance of Model class - coreChartDatatypesModel
   **/
  connectedCallback() {
      super.connectedCallback();
      this.chartType = this.charttype;
      this.chartId = "ChartId_" + Math.random();
      this.coreChartDatatypesModel = new CoreChartDatatypesModel();
      if(this.supportedcharts.length>0){
          this.showMsg = this.supportedcharts.indexOf(this.chartType) == -1 ? true:false;
          this.errorMessage = this.showMsg ? this.coreChartDatatypesModel.ERRORMSG + this.supportedcharts.toString(): '';
      }
      if (this.apirequest && !this.showMsg) {
          this._setIronAjaxConfig();
          this.showLoader = true
          this._callIronAjaxApi();
      }
  }

  ready() {
      super.ready();
  }

  /**
   *  To set API Header Params.
   *  To set API Header Auth params.
   *  To set endpoint URL
   *  To set request body for the POST method
   */
  _setIronAjaxConfig() {
      this.coreChartDatatypesModel.handleUrl = this.apirequest ? this.apirequest.handlerURL : '';
      //this.coreChartDatatypesModel.ironAjaxHeader = this.headers;
      //this.$.ironId.headers = this.coreChartDatatypesModel.ironAjaxHeader;
      this.$.ironId.url = this.coreChartDatatypesModel.handleUrl;
      this.$.ironId.contentType="application/json";
      //this.$.ironId.body = this.apirequest.params;
  }


  /**
   * Using Iron Ajax generateRequest() promise
   * Call API to get chart data response.
   */
  _callIronAjaxApi() {
      //this.$.ironId.generateRequest().completes.then((data, res) => {
        let data;
        if(this.chartType=="pie" || this.chartType=="donut"){
        data = {"response":{ 
        "title":"Total College Details",
        "sum":24,
        "series":[ 
        { 
        "name":"Engineering",
        "y":12,
        "color":" #FFD025"
        },
        { 
        "name":"Medical",
        "y":6,
        "color":"#DB8F25"
        },
        { 
        "name":"Arts",
        "y":6,
        "color":"#D4534C"
        }
        ]
        }}; 
         
        } else {
        data = {"response":{ 
        "title":"Monthly Average Rainfall",
        "subtitle": 'Source: WorldClimate.com',
        "xValues":[ 
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
        ],
        "series":[ 
        { 
        "xaxis":"Month",
        "yaxis":"value",
        "datasets":[ 
        {
        "name": 'Tokyo',
        "data": [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
        "name": 'New York',
        "data": [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
        }, {
        "name": 'London',
        "data": [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
        }, {
        "name": 'Berlin',
        "data": [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        }],
        }]
        }
        } 
        }

          this.coreChartDatatypesModel.formChartDataParams = {
              req: this.apirequest,
              res: data.response,
              chartConfig: this.chartconfig,
              charttype: this.chartType
          };
          this.$.autoTest.setAttribute('data', JSON.stringify(data.response));
          this.formatData = this.coreChartDatatypesModel.formChartDataParams;
          this.isArray = this.coreChartDatatypesModel.isArray;
         
          if(!this.isArray)this._checkForError();
          this.showLoader = false;
          !this.errorMessage ? this._setresponse() : '';
     /* }, (rejected) => {
          let req = rejected.request;
          let error = rejected.error;
      });*/
  }

  /**
   * Check for Error message if the API responds with Bar chart
   *  when the User inputs charttype as pie 
   */
  _checkForError() {
      if (this.formatData.errorMsg) {
          this.showMsg = true;
          this.errorMessage = this.formatData.errorMsg;
      } else return;
  }

  

  _isEqualTo(title, string) {
      return title === string;
  }

  /**
   * Check whether to trigger a single core-chart or multiple core-chart based on the response
   * Return true only when multiple charts need to be plotted from single response. i.e 2d Histogram
   */

  _isArray(isArray,value){
      return isArray == value;
  }

  /**
   * Enable the template to call core-chart.
   * Change the getresponse to true if there is successful response.
   * Based on the isArray constant to set the response from model to respective response variables.
   */
  _setresponse(){
      this.getresponse = true;
      if(!this.isArray){
          this.response = this.formatData.response;
          this.dataSeries = this.formatData.dataseries;
      }
      else
          this.responses = this.formatData;
  }

  _showTitle(showMsg, errorStatus) {
      if(showMsg == true && errorStatus == 500) {
          this.style.height = '100px'
          return true;
      } else if(showMsg == true && errorStatus !== 500) {
          return false;
      } else if(showMsg == false) {
          return  true;
      }
  }

  /**
   * To handle the Error part in iron-ajax request
   * when chartIndex exist for Bullet chart, multiple error messages will not be shown
   */
  _handleError(e) {
      const res = e.detail.request; // iron-request
      this.triggerErrorEvent(res);
      this.errorStatus = res.status;
      this.errorMessage = res.response && res.response.responseMessage ?
       res.response.responseMessage : res.statusText;
       this.errorMessage = !!this.errorMessage ? this.errorMessage : 'Internal Server Error';
      this.showLoader = false;
      this.chartType == 'bullet' && this.chartindex !== 0 ? this.coreChartDatatypesModel.checkBulletChartContainer(this) : '';
       this.showMsg = true;
  }

  triggerErrorEvent(res){
      let name = "componentError";
      let id = !!this.chartconfig.uniqueId ? this.chartconfig.uniqueId: 'uniqueId' ;
      window.dispatchEvent(new CustomEvent(name,{
          detail: {
              id:id,
              errorStatus : res.status,
              statusText : res.statusText,
              response : res.response,
              listened:false
          },
          bubble: false,
          composed: true
      }));
      console.log("componentError event fired for chart "+ id);
  }
}

window.customElements.define('core-chart-datatypes', CoreChartDatatypes);