import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { CoreChartsModel } from './core-charts-model.js';
import { style } from './core-charts-css.js';

/**
 * @customElement
 * @polymer
 *  @description
 * CoreCharts Component can be added by using `<core-chart>` element.
 * CoreCharts is the place where the Chart is actually plotted. Response data is formatted and DataSeries to plot the chart series is passed to plot the chart.
 */

class CoreCharts extends PolymerElement {
    static get template() {
        return html`
        ${style}
            <template is="dom-if" if="[[targetbox]]">
                <span  class= "targetboxclass" id= "scorecardkpiTarget" on-click="_clickevent">           
                    <span id="targetTitle" style$="{{_styleconfig(chartconfig.targetBox,1)}}">
                        <span> Target - </span>
                        <span id="targetText" >Above</span>
                        <span> : </span>
                        <span id="targetAboveValue" style$="{{_styleconfig(chartconfig.targetBox,2)}}"> [[above]] </span>
                        <span> [[aboveText]] </span>
                        <span> | </span>
                        <span id="targetText">Below</span>
                        <span> : </span>
                        <span id="targetBelowValue" style$="{{_styleconfig(chartconfig.targetBox,3)}}"> [[below]] </span>
                        <span> [[belowText]] </span>
                    </span>            
                </span>  
            </template>
            <div id="container" style=" height:90%; width:95%; margin:auto ">
            <div id="addText" ></div></div>
      
      
      `;

    }
    static get properties() {
        return {
            /**
               *@description Apirequest is object having params opted by parent app 
               */

            apirequest: {
                type: Object
            },
            /**
              * @description Based on the Chart type to render the chart. Observer to listen for any change in params
              * @example "charttype": "column"           
              */
            charttype: {
                type: String
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
                type: Object
            },
            /**
             * chartid is Number having unique id for bar, pie or column.
             * @example "chartid": "1" 
            */
            chartid: {
                type: String
            },
            /**
             * chartindex is Number having unique value used for Bullet chart for creating multiple chart instance.
             * @example "chartindex": "0" 
             */
            chartindex: {
                type: Number,
                value: ''
            },
            response:{
                type: Object,
                value: {}
            },

            dataseries: {
                type: Object,
                value: {}                
            },
            targetbox:{
                type: Boolean,
                value:''
            }
            
        };
    }

    constructor() {
        super();
        this.NORMAL = "normal"; /** Constant property for normal stacking. */
        this.SLICED = "sliced"; /** Constant property for sliced plot option. */
        this.DEFAULT = "default"; /** Constant property for default cursor. */
        this.PIE = 'pie'; /** Constant property for pie - horizontal chart type. */
        this.DONUT = 'donut'; /** Constant property for donut chart type. */
        this.COLUMNRANGE = 'columnrange';  /** Constant property for columnrange chart type. */
        this.BULLET = 'bullet';  /** Constant property for bullet - horizontal chart type. */
        this.CATEGORY = "category"; /** Constant property for xaxis type category. */
        this.timeFormat = "24Hrs";
        this.zone = "UTC";
        this.dateFormat = "MM/DD/YYYY"
        this.targetbox = false;
    }

    /**
     * For Getting Instance of Model class - CoreChartsModel.
     * 
     * To set the theme opted by parent app.
     * Call listener event to get the data from datatype element.
     */
    connectedCallback() {
        super.connectedCallback();
        this.CoreChartsModel = new CoreChartsModel();
        this.CoreChartsModel.theme = this.chartconfig.setTheme;
        this.chartType = this.charttype;
        this.chartid == 'emptychart' ? this.setBulletOptions() : this._getChartResponse();;
        
      

    }

    /**
     * Create chart containers and set the chartoptions in order to plot the chart.
     */
    _getChartResponse(){
        if (this.response && this.dataseries && this.dataseries.length > 0) {
            this._setChartContainer();
            this._setChartOptions();
            this._getTargetBox();
        }
    }

    ready() {
        super.ready();
    }

    /**
     * Create chart element and container in order to plot the chart.
     */
    _setChartContainer() {
        this.CoreChartsModel.chartContainer = this.$.container.childNodes;
        this.$.container.appendChild(this.CoreChartsModel.chartContainer);
        this.chartContainerElement = this.CoreChartsModel.chartContainer;
    }

    setBulletOptions() {
        this.emptyChartConfig = {};
        this.CoreChartsModel.chartTitle = {
            titleObj: this.chartconfig.title
        };
        this.emptyChartConfig.title = this.CoreChartsModel.chartTitle;
        this.emptyChartConfig.subtitle = this.chartconfig.subtitle;
        this.emptyChartConfig.credits = { enabled: false };
        this._setChartContainer();
        this._setEmptyChartOption();
    }

    _setEmptyChartOption() {
        var chartElement = this.chartContainerElement;
        this.charts = new Highcharts.chart(chartElement, this.emptyChartConfig);
    }


    _getTargetBox(){
        if(this.targetbox !== undefined && this.targetbox){
            this.above =  this.response.assetsAboveTarget;
            this.aboveText = this.above > 1 ? ' assets ':'asset';
            this.below = this.response.assetsBelowTarget;
            this.belowText = this.below > 1 ? ' assets': 'asset';
            this.clickEnable = this.chartconfig.targetBox.clickEventEnabled;
            this.clickEventName = this.chartconfig.targetBox.clickEventName;
            this.clickEventId = this.chartconfig.targetBox.clickEventUniqueId;

        }
    }
    
    _clickevent(){
        this.CoreChartsModel._targetBoxclickevent(this.clickEnable,this.clickEventName,this.clickEventId);
    }

    _styleconfig(config,ele){
        var styleText = "";
        var styleObj ={};
        if(!!config){
            switch(ele){
                case 1: 
                    if(!!config.text && !!config.text.style){
                        styleObj = config.text.style;
                        break;
                    }else return "";
                case 2: 
                    if(!!config.aboveTarget && !!config.aboveTarget.style){
                        styleObj = config.aboveTarget.style;
                        break;
                    }else return "";
                case 3:
                    if(!!config.aboveTarget && !!config.belowTarget.style){
                        styleObj = config.belowTarget.style;
                        break;
                    }else return "";
            }   
            for(var key in styleObj){
                styleText+=key+":"+styleObj[key]+";";
            }
        }
        return styleText;
    }

    /**
     * Call setters and set value for properties in model class - Single-series-model 
     * 
     * To call setter for chart title property.
     * To call setter for chart Subtitle property.
     * To call setter for chart legend property.
     * To call setter for chart plotOptions property.
     * To call setter for chart xAxis property.
     * To call setter for chart yAxis property.
     * To call the getter for Chart properties and assign them back to chartConfig.
     * This will pass through additional parameteres to highcharts. 
     */
    _formChartOptions() {
        this.CoreChartsModel.chart = {
            chartObj: this.chartconfig.chart,
            chartTypeObj: this.chartType,
            chartIndex: this.chartindex,
            responseObj: this.response,
            apirequestObj:this.apirequest
        };
        this.CoreChartsModel.tooltip = {
            tooltipObj: this.chartconfig.tooltip
        };
        this.CoreChartsModel.chartTitle = {
            responseObj: this.response.title,
            titleObj: this.chartconfig.title
        };
        this.CoreChartsModel.chartSubTitle = {
            responseObj: this.response,
            subTitleObj: this.chartconfig.subtitle,
            showTotal: this.chartconfig.showTotal,
            chartTypeObj: this.chartType
        };
        this.CoreChartsModel.chartLegend = {
            legendObj: this.chartconfig.legend,
            chartTypeObj: this.chartType,
            responseObj: this.response
        };
        this.CoreChartsModel.xAxis = {
            xAxisObj: this.chartconfig.xAxis,
            responseObj: this.response
        };
        this.CoreChartsModel.yAxis = {
            yAxisObj: this.chartconfig.yAxis,
            colorObj: this.chartconfig.colors,
            responseObj: this.response,
            apirequestObj: this.apirequest
        };
        this.CoreChartsModel.plotOptions = {
            plotOptionsObj: this.chartconfig.plotOptions,
            colorObj: this.chartconfig.colors,
            responseObj: this.response,
            chartTypeObj: this.chartType,
            apirequestObj: this.apirequest

        };
        this.CoreChartsModel.dataseries = {
            dataseriesObj: this.dataseries
        };


        this.CoreChartsModel.responsive = this.chartconfig.responsive;
        if (this.chartType === this.COLUMNRANGE || this.CoreChartsModel.sos) {
            this.chartconfig["time"] = { timezone: this.zone }
        }
        this.chartconfig["chart"] = this.CoreChartsModel.chart;
        this.chartconfig["title"] = this.CoreChartsModel.chartTitle;
        this.chartconfig["subtitle"] = this.CoreChartsModel.chartSubTitle;
        this.chartconfig["xAxis"] = this.CoreChartsModel.xAxis;
        this.chartconfig["yAxis"] = this.CoreChartsModel.yAxis;
        this.chartconfig["legend"] = this.CoreChartsModel.chartLegend;
        this.chartconfig["tooltip"] = this.CoreChartsModel.tooltip;
        this.chartconfig["series"] = this.CoreChartsModel.dataseries;
        this.chartconfig["credits"] = { enabled: false };
        this.chartconfig["plotOptions"] = this.CoreChartsModel.plotOptions;
        this.chartconfig["responsive"] = this.CoreChartsModel.responsive;
    }

    _getUserPreferences() {
        this.CoreChartsModel.zone = {
            zone: this.apirequest.params.zone
        };
        this.CoreChartsModel.dateFormat = {
            dateFormat: this.apirequest.params.dateFormat
        };
        this.CoreChartsModel.timeFormat = {
            timeFormat: this.apirequest.params.timeFormat
        };
        this.zone = this.CoreChartsModel.zone;
        this.dateFormat = this.CoreChartsModel.dateFormat;
        this.timeFormat = this.CoreChartsModel.timeFormat;

    }

    /**
     * Get properties from model class and append it to appropriate chart options.
     *
     * Create high chart instance and plot chart using chart options.
     * Highchart instance.update() is for updating the chart options with formatter functions. 
     */
    _setChartOptions() {
        var _self = this;
        var chartElement = this.chartContainerElement;
        //this._getUserPreferences();
        this._formChartOptions();
        if (_self.chartType == _self.DONUT && _self.response.target !== undefined && window.innerWidth >= 400) {
            this.chartconfig.chart.events = {
                redraw: function () {
                    _self._redraw(_self.charts);
                }
            };
        }
        this.charts = new Highcharts.chart(chartElement,this.chartconfig);


        this.charts.update({

            xAxis: {
                labels: {
                    formatter: function () {
                        if (_self.chartType !== _self.COLUMNRANGE && !_self.CoreChartsModel.daytracker && !_self.CoreChartsModel.sos) {
                            var xValues = typeof (this.value) == "string" ? this.value.split("$$") : this.value;
                            return (xValues.length > 1) ? xValues[1] : this.value;
                        }
                        else
                            return this.axis.defaultLabelFormatter.call(this);
                    }
                }
            },
            yAxis: {
                dateTimeLabelFormats: {
                    millisecond: this.timeFormat === '12Hrs' ? '%I:%M:%S.%L %p' : '%H:%M:%S.%L',
                    second: this.timeFormat === '12Hrs' ? '%I:%M:%S %p' : '%H:%M:%S',
                    minute: this.timeFormat === '12Hrs' ? '%I:%M %p' : '%H:%M',
                    hour: this.timeFormat === '12Hrs' ? '%I:%M %p' : '%H:%M',
                    day: this.timeFormat === '12Hrs' ? '%I:%M %p' : '%H:%M',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'

                }
            },
            tooltip: {
                formatter: function () {
                    var xValues = (!!this.x && typeof (this.x) == "string") ? this.x.split("$$") : '';
                    var XValuesTooltip = (xValues.length > 2) ? xValues[2] : '';
                    if (!_self.chartconfig.tooltipFormat) {
                        return '<span style="font-size:11px">' + XValuesTooltip + '<br/>' + this.series.name + '</span> : <b>' + this.point.y + '</b><br/>';
                    } else {
                        switch (_self.chartconfig.tooltipFormat) {
                            case "Value":
                                if (_self.chartType !== _self.COLUMNRANGE && !_self.CoreChartsModel.daytracker) {
                                    if (_self.chartType == _self.BULLET) {
                                        return '<b>' + this.point.target + '</b><br/><br/><b>' + this.point.y + '</b>';
                                    }else if(_self.CoreChartsModel.sos){
                                        var zone = _self.zone;
                                        let timeFormat = _self.timeFormat === "12Hrs" ? 'hh:mm:ss A' : 'HH:mm:ss';
                                        let dateFormat = _self.dateFormat === "DD/MM/YYYY" ? "DD/MM/YYYY": "MM/DD/YYYY";
                                        let dateTimeFormat = dateFormat + " " + timeFormat;
                                        var toolTipTemp = '<div style = "background:rgba(255,255,255,1); overflow:auto; max-height:200px;pointer-events: auto !important;">';
                                        toolTipTemp = toolTipTemp + window.moment.tz(this.x, zone).format(dateTimeFormat) + '<br>'

                                        var s = [];
                                        this.points.forEach((val, ind) => {
                                                s.push(val.series.name + " : <b> " + val.y.toFixed(2) + '</b>');
                                        })

                                        return toolTipTemp + s.join('<br>') + '</div>'; //toolTipTemp;
                                    }  
                                    else if(_self.response.mean == undefined) {
                                        var tooltipLabel = (!!this.point.options.name) ? this.point.options.name : this.series.name;
                                        var value = (tooltipLabel == "Target" && _self.chartType == _self.DONUT) ? _self.apirequest.params.target : this.point.y;
                                        return '<span><b>' + XValuesTooltip + '<br/>' + value + '</b></span><br/>';
                                    }else{
                                        var xValue =this.point.x;
                                        return '<span><b>'+ xValue + '</b></span>';
    
                                    }
                                }
                                else if(_self.response.mean == undefined) {
                                    let timeFormat = _self.timeFormat === "12Hrs" ? 'hh:mm:ss A' : 'HH:mm:ss';
                                    let dateFormat = _self.dateFormat === "DD/MM/YYYY" ? "DD/MM/YYYY": "MM/DD/YYYY";
                                    let dateTimeFormat = dateFormat + " " + timeFormat;
                                    var zone = _self.zone;
                                    if(_self.CoreChartsModel.daytracker){
                                        var value =  this.point.y;
                                        let hourMinFormat = _self.timeFormat === "12Hrs" ? 'hh:mm A' : 'HH:mm';
                                        return '<span>'+ window.moment.tz(this.point.x, zone).format(hourMinFormat) + ', ' + value + '</span>';
                                    }
                                        else
                                        return '<span ><br/><b>From:</b> ' + window.moment.tz(this.point.low, zone).format(dateTimeFormat) + ' <b> To: </b> ' + window.moment.tz(this.point.high, zone).format(dateTimeFormat) + '</span><br/>';
                                }
                            case "NameAndValue":
                                if (_self.chartType !== _self.COLUMNRANGE && !_self.CoreChartsModel.daytracker) {
                                    if (_self.chartType == _self.BULLET) {
                                        return '<span>Target</span>' + ' : ' + '<b>' + this.point.target + '</b><br/><br/><span style="font-size:11px">'
                                            + this.point.options.name + '</span> : <b>' + this.point.y + '</b>';
                                    }else if(_self.CoreChartsModel.sos){
                                        var zone = _self.zone;
                                        let timeFormat = _self.timeFormat === "12Hrs" ? 'hh:mm:ss A' : 'HH:mm:ss';
                                        let dateFormat = _self.dateFormat === "DD/MM/YYYY" ? "DD/MM/YYYY": "MM/DD/YYYY";
                                        let dateTimeFormat = dateFormat + " " + timeFormat;
                                        var toolTipTemp = '<div style = "background:rgba(255,255,255,1); overflow:auto; max-height:200px;pointer-events: auto !important;">';
                                        toolTipTemp = toolTipTemp + window.moment.tz(this.x, zone).format(dateTimeFormat) + '<br>'

                                        var s = [];
                                        this.points.forEach((val, ind) => {
                                                s.push(val.series.name + " : <b> " + val.y.toFixed(2) + '</b>');
                                        })

                                        return toolTipTemp + s.join('<br>') + '</div>'; //toolTipTemp;
                                    }                                  
                                    else if(_self.response.mean == undefined) {
                                        var tooltipLabel = (!!this.point.options.name) ? this.point.options.name : this.series.name;
                                        var weather = !!this.point.weather && !!this.point.weather.weather ? _self.CoreChartsModel._getweatherintooltip(this.point.weather): '';
                                        var names = typeof (tooltipLabel) == "string" ? tooltipLabel.split("$$") : tooltipLabel;
                                        tooltipLabel= (names.length > 1) ? names[1] : tooltipLabel;
                                        var value = (tooltipLabel == "Target"  && _self.chartType == _self.DONUT) ? _self.apirequest.params.target : this.point.y;
                                        var xvalue = _self.chartconfig.tooltip.xValue? this.x:'';
                                        xvalue = xvalue ? xvalue + '<br/>': '';
                                        return '<span><b>' + XValuesTooltip + '</b>'+xvalue + tooltipLabel + '</span> : <b>' + value + '</b><br/>'+ weather;
                                    }
                                    else{
                                        var tooltipLabel = (!!this.point.options.name) ? this.point.options.name : this.series.name;
                                        var yValue = this.point.y;
                                        var yLable = "Payload Weight("+ _self.response.uom+")";
                                        var xValue =this.point.x;
                                        return '<span><b>' + XValuesTooltip + '</b><br/>' + tooltipLabel + ' : <b>' + yValue + '</b><br/>' + yLable +' : <b>'+xValue + '</b></span>';
    
                                    }
                                }
                                else {
                                    var tooltipLabel = (!!this.point.options.name) ? this.point.options.name : this.series.name;
                                    let timeFormat = _self.timeFormat === "12Hrs" ? 'hh:mm:ss A' : 'HH:mm:ss';
                                    let dateFormat = _self.dateFormat === "DD/MM/YYYY" ? "DD/MM/YYYY": "MM/DD/YYYY";
                                    let dateTimeFormat = dateFormat + " " + timeFormat;
                                    var zone = _self.zone
                                    if(_self.CoreChartsModel.daytracker){
                                        var value =  this.point.y;
                                        let hourMinFormat = _self.timeFormat === "12Hrs" ? 'hh:mm A' : 'HH:mm';
                                        return '<span><b>' + tooltipLabel + '</b><br/> ' + window.moment.tz(this.point.x, zone).format(hourMinFormat) + ', '+ value + '</b></span><br/>';
                                    }
                                    else{
                                        var duration = _self._findDuration(this.point.high - this.point.low);
                                        return '<span><b>' + tooltipLabel + ' <b>(' + duration + ')<br> <b>From: </b>' + window.moment.tz(this.point.low, zone).format(dateTimeFormat) + ' <b> To: </b> ' + window.moment.tz(this.point.high, zone).format(dateTimeFormat) + '</span><br/>';
                                    }
                                }
                               
                            default:
                                return;
                        }
                    }
                },
               
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        formatter: function () {
                            return this.y;
                        }
                    }

                },
                pie: {
                    point: {
                        events: {
                            legendItemClick: function (e) {
                                if (_self.response.target !== undefined)
                                    return false;
                            }
                        }
                    },
                    states: {
                        hover: {
                            enabled: (_self.response.target !== undefined) ? false : true
                        }
                    }

                }
            },
            series: [{
                size: (this.chartType == this.DONUT) ? '100%' : '',
                innerSize: (this.chartType == this.DONUT) ? '65%' : ''
            }],
            legend: {
                labelFormatter: function () {
                    if (_self.chartType == _self.DONUT && _self.response.target !== undefined) {
                        var yValue = (this.name == "Target") ? _self.apirequest.params.target : this.y;
                        return this.name + ' ' + yValue;
                    }
                    else {
                        var dataEnable = _self.chartconfig.legend.data.enabled;
                        var data =  dataEnable && this.y !== undefined ? ' ('+ this.y +')' : ' ';
                        var names = typeof (this.name) == "string" ? this.name.split("$$") : this.name;
                        var name= (names.length > 1) ? names[1] : this.name;
                        return name + data ;
                    }
                }
            }
        });


    }

    _redraw(charts) {
        charts.setTitle(null, { x: charts.plotLeft + (charts.plotWidth * 0.44), y: charts.plotTop + (charts.plotHeight * 0.46), align: 'left', verticalAlign:'' });
    }

    _findDuration(timestamp) {
        var  time  =  parseInt(timestamp,  10);
        var sec_num =  Math.floor(time /  1000);
        var  hours    =  Math.floor(sec_num  /  3600);
        var  minutes  =  Math.floor((sec_num  -  (hours  *  3600))  /  60);
        var  seconds  =  sec_num  -  (hours  *  3600)  -  (minutes  *  60);
        if  (hours    <  10)  { hours    =  "0" + hours; }
        if  (minutes  <  10)  { minutes  =  "0" + minutes; }
        if  (seconds  <  10)  { seconds  =  "0" + seconds; }
        return  hours + ':' + minutes + ':' + seconds;
    }
}

window.customElements.define('core-charts', CoreCharts);
