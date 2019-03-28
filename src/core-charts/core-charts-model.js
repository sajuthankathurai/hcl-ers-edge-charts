/**
 * @customElement
 * @polymer
 * CoreChartsModel holds the getter and setter for all the chartoptions and format the data to an acceptable  format.
 */
export class CoreChartsModel {
    constructor() {
        this.DIV = "div"; /** Constant property for div element. */
        this.ID = "id"; /** Constant property for id selector. */
        this.NONE = "none"; /** Constant property for display property. */
        this.BLOCK = "block"; /** Constant property for display property. */
        this.SCRIPT = "script"; /** Constant property for script tag. */
        this.HEAD = "head"; /** Constant property for head tag. */
        this.CHILDCONTAINER = "childContainer"; /** Constant property for container. */
        this.maxLength = 200; /** Constant property to check max length. */
        this.TOTAL = "Total"; /** Constant property for total values. */
        this.VERTICAL = "vertical"; /** Constant property for vertical alignment. */
        this.DEFAULT = "default"; /** Constant property for default cursor. */
        this.DARK = "dark"; /** Constant property for dark theme. */
        this.GRIDLIGHT = "gridlight"; /** Constant property for gridlight theme. */
        this.SANDSIGNIKA = "sandsignika"; /** Constant property for sandsignika theme. */
        this.SRC = "/node_modules/highcharts/js/themes/dark-unica.js"; /** Constant property for dark-unica path. */
        this.SANDSIGNIKASRC = "/node_modules/highcharts/js/themes/sand-signika.js"; /** Constant property for sand-signika path. */
        this.GRIDLIGHTSRC = "/node_modules/highcharts/js/themes/grid-light.js"; /** Constant property for grid-light path. */
        this.NORMAL = "normal"; /** Constant property for normal stacking. */
        this.SLICED = "sliced"; /** Constant property for sliced plot option. */
        this.DEFAULT = "default"; /** Constant property for default cursor. */
        this.PIE = 'pie'; /** Constant property for pie - horizontal chart type. */
        this.DONUT = 'donut';  /** Constant property for donut  chart type. */
        this.COLUMNRANGE = 'columnrange';  /** Constant property for columnrange  chart type. */
        this.LINE = 'line';  /** Constant property for columnrange  chart type. */
        this.BULLET = 'bullet'; /** Constant property for bullet - horizontal chart type. */
        this.CATEGORY = "category"; /** Constant property for xaxis type category. */
        this.DATETIME = "datetime";
        this.LINEAR = "linear";
        this.sos = false;
        this.BAR = 'bar';
        this._newChartElement = ""; /** Create element and set attribute . */
        this.chartType = ""; /** Create element and set attribute . */
        this._chart = {};
        this._tooltip = {};
        this.daytracker = false;
        this._title = {}; /** Holds title object for the chart . */
        this._subTitle = {}; /** Holds sub title object for the chart . */
        this._legend = {}; /** Holds sub legend object for the chart . */
        this._plotOptions = {}; /** Holds plot option object for the chart . */
        this._yAxisObj = {}; /** Holds y axis object for the chart . */
        this._xAxisObj = {}; /** Holds y axis object for the chart . */
        this._responseObj = {}; /** Holds response object to plot the chart . */
        this._dataObj = {}; /** Holds data object to plot the chart . */
        this._responsive = {}; /** Holds responsive object to plot the chart . */
        this._zone = "UTC";  /** Holds timezone of datetime in the chart . */
        this._timeFormat = "24Hrs"; /** Holds timeformat of datetime in the chart . */
        this._dateFormat = "MM/DD/YYYY"; /** Holds dateformat of datetime in the chart . */
        this.EQUIPMENTLOCAL = "Equipment Local";/** Constant property for Equipment Local zone */
    }


    /**
     * Getter and Setter for chart container.
     *
     * @param {childNodes} holds the html element.
     * @return {String} ELement on which the chart gets plotted.
     */
    get chartContainer() {
        return this._newChartElement;
    }

    set chartContainer(childNodes) {
        var containerElementLength = childNodes.length == 0 ? 0 : childNodes.length + 1;
        this._newChartElement = document.createElement(this.DIV);
        this._newChartElement.setAttribute(this.ID, this.CHILDCONTAINER + containerElementLength);
        this._newChartElement.setAttribute("style", "height:100%; ");
    }


    /**
     * Getter and Setter for chart x-axis property.
     *
     * @param {element} obj holds the x-axis for the chart.
     * @return {Object} To show y-axis and its properties on the chart.
     */
    get chart() {
        return this._chart;
    }

    set chart(obj) {
        this._chart = obj.chartObj || {};
        this.apirequest = obj.apirequestObj;
        this.chartIndex = obj.chartIndex;
        this._chart.type = obj.chartTypeObj;
        this.chartType = this._chart.type;
        if(this.chartType == this.LINE && obj.responseObj.min !== undefined){
            this.daytracker = true;
        }
        this._chart.zoomType = this.chartType == this.COLUMNRANGE ? 'y':  this.daytracker ? 'x':undefined;
        this._chart.type = this._chart.type == this.DONUT ? this.PIE :  this._chart.type;
        this._chart.inverted = this.chartType == this.COLUMNRANGE ? true: this._chart.inverted;
        this._chart.events && this._chart.events.clickEventEnabled ? this.addChartEventListener(this._chart.events.clickEventName, this._chart.events.clickEventUniqueId): '';
        
    }


    addChartEventListener(name,id){
        var _self = this;
        name = !!name ? name: 'chartClickEvent';
        id = !!id ? id: 'chart_1';
        this._chart.events = {
            click: function (event) {
                window.dispatchEvent(new CustomEvent(name, {
                    detail: {
                        chartId:id,
                        apiParams : _self.apirequest.params,
                        listened:false
                    },
                    bubble: false,
                    composed: true
                }));
                
            }
        }
    }

    /**
     * Getter and Setter for chart x-axis property.
     *
     * @param {element} obj holds the x-axis for the chart.
     * @return {Object} To show y-axis and its properties on the chart.
     */
    get tooltip() {
        return this._tooltip;
    }

    set tooltip(obj) {
        this._tooltip = obj.tooltipObj;
    }


    /**
     * Getter and Setter for chart title property.
     *
     * @param {element} obj holds the title from the API response/Parent app input.
     * @return {String} To show title on the chart.
     */
    get chartTitle() {
        return this._title;
    }

    set chartTitle(obj) {
        this._title = {};
        this._title = obj.titleObj;
        this._chart.type == this.BULLET ? this.checkBulletTitle() : '';
        this._title.multiple?this._title.text = obj.responseObj : this._title.text = this._title.text ? this.formatTitle(this._title.text) : obj.responseObj;
        if(this._title.enabled !== undefined && !this._title.enabled)
            this._title.text = undefined;
    }

    formatTitle(val) {
        val.length > this.maxLength ? val = val.substring(0, this.maxLength) : val;
        return val;
    }

    /**
     * Method to check the chart title for Bullet chart
     * Set the user title text to first bullet chart
     * Rest of the bullet charts title is set to null
     */
    checkBulletTitle() {
         this._title.style.display = this.NONE;
    }


    /**
     * Getter and Setter for chart subtitle property.
     *
     * @param {element} obj holds the subtitle from the API response/Parent app input.
     * @return {String} To show subtitle on the chart.
     */
    get chartSubTitle() {
        return this._subTitle;
    }

    set chartSubTitle(obj) {
        this._subTitle = {};
        this._subTitle = obj.subTitleObj;
        this._chart.type == this.BULLET ? this.checkBulletSubtitleTitle() : '';
        if(obj.chartTypeObj == this.DONUT && obj.responseObj.target !== undefined)
        {
            this._subTitle.align = "center";
            this._subTitle.verticalAlign = "middle";
            this._subTitle.y = -10;
            this._subTitle.text = "<span style='font-size:130%;'>" + obj.responseObj.series[0].y +"</span><br/>" +"<span style='font-size:100%;'>"+ obj.responseObj.uom+ "</span>";
        }
        else if(this._chart.type !== this.BULLET && obj.responseObj.target !== undefined){
            this._subTitle.text = obj.responseObj.series[0] !== undefined ? obj.responseObj.series[0].y + '  ' + obj.responseObj.uom + ' - ' + (this._subTitle.text ? this._subTitle.text : obj.responseObj.subtitle) :
            (this._subTitle.text ? this._subTitle.text : obj.responseObj.subtitle);
        }
        else if (obj.showTotal !== undefined && !!obj.showTotal) {
            this._subTitle.text = obj.responseObj.sum ? this.TOTAL + ' : ' + obj.responseObj.sum + ' - ' + (this._subTitle.text ? this._subTitle.text : obj.responseObj.subtitle) :
                    (this._subTitle.text ? this._subTitle.text : obj.responseObj.subtitle);
            } 
        else {
            this._subTitle.text = this._subTitle.text ? this._subTitle.text : obj.responseObj.subtitle;
        }
    }

    /**
     * Method to check the chart subtitle for Bullet chart
     * Set the user subtitle text to first bullet chart
     * Rest of the bullet charts subtitle is set to null
     */
    checkBulletSubtitleTitle() {
        this._subTitle.style.display = this.NONE;
    }

    /**
     * Getter and Setter for chart legend property.
     *
     * @param {element} obj holds the legend from the API response/Parent app input.
     * @return {Object} To show legend on the chart.
     */
    get chartLegend() {
        return this._legend;
    }

    set chartLegend(obj) {
        if (obj.legendObj) {
            this._legend = obj.legendObj;
            this._legend.align = this._legend.align;
            this._legend.verticalAlign = this._legend.verticalAlign;
            this._legend.layout = this.VERTICAL;
        }
    }

    /**
     * Getter and Setter for chart x-axis property.
     *
     * @param {element} obj holds the x-axis for the chart.
     * @return {Object} To show x-axis and its properties on the chart.
     */
    isXaxisScrollEnabled(enabled) {
        if(enabled) {
            if(this._responseObj.series && this._responseObj.series[0].datasets && this._responseObj.series[0].datasets[0]) {
                if(this._responseObj.series[0].datasets[0].data.length < 5) {
                    return false;
                } else {
                    return true;
                }
            } else if(this._responseObj.series && this._responseObj.series.length > 1  && this._responseObj.series[0].data) {
                    if(this._responseObj.series[0].data.length < 5) {
                        return false;
                    } else return true;
            }        
        } else {
                return false;
        }
    }

    /**
     * Getter for chart x-axis max value.
     *
     * @param {element} response holds the response of API.
     * @return {val} x-axis Max value to plot the chart.
     */
    getMaxLength(enabled) {
        if(enabled) {
            if (this._responseObj.xValues) {
                if (this._responseObj.xValues.length < 5)  {
                    return this._responseObj.xValues.length - 1;
                } else return 4;
            }
        } else {
            return null;
        }
    }

    /**
     * Getter and Setter for chart x-axis property.
     *
     * @param {element} obj holds the x-axis for the chart.
     * @return {Object} To show y-axis and its properties on the chart.
     */
    get xAxis() {
        return this._xAxisObj;
    }

    set xAxis(obj) {
        this._xAxisObj = obj.xAxisObj || {};
        this._responseObj = obj.responseObj;
        this._xAxisObj.multiple ? this.sos = this._xAxisObj.multiple :'';

        // xAxis type is set to datetime only for columnrange, Default it is category for other charts.
        this._xAxisObj.type = this._xAxisObj.type ? this._xAxisObj.type : this.chartType == this.COLUMNRANGE || this.daytracker ? this.DATETIME :this.CATEGORY;
	    this._xAxisObj.categories = this._chart.type == this.BULLET ? this.getBulletChartCategories() : this._responseObj.xValues;
        this._xAxisObj.liveRedraw = false;
        this._xAxisObj.min = this._xAxisObj.multiple || this._responseObj.min || this._responseObj.minValue ? undefined: 0;
        this._xAxisObj.max = this._xAxisObj.multiple || this._responseObj.max? undefined: this.getMaxLength(this._xAxisObj.scrollbar.enabled);
        this._xAxisObj.tickLength = 0;
        this._xAxisObj.tickInterval = this.daytracker ? 3600000 : undefined;
	    this._xAxisObj.labels.format=  this._xAxisObj.multiple ? "{value:%e.%b}":this.chartType == this.COLUMNRANGE? this._dateFormat === "DD/MM/YYYY"? "{value:%d/%m/%Y}" :"{value:%m/%d/%Y}": this.daytracker ? this.getxAxisDayTrackerValues() :"{value}";
        if(this._responseObj.mean !== undefined){
            this.getpayloadBellCurve();
        }
        else
            this._chart.type !== this.BULLET && !this.daytracker ? this._xAxisObj.title.text =  this._xAxisObj.title.text ? this._xAxisObj.title.text : this._responseObj.series ?(this._responseObj.series[0].xaxis || this._responseObj.series[0].xAxis) : '':'';
        this._xAxisObj.scrollbar.enabled = this.chartType == this.COLUMNRANGE || this.daytracker ?false: this._chart.type !== this.BULLET ? this.isXaxisScrollEnabled(this._xAxisObj.scrollbar.enabled) : '';
        this._xAxisObj.labels.events && this._xAxisObj.labels.events.clickEventEnabled ? this.addLabelEventListener(this._xAxisObj,this._xAxisObj.labels.events.clickEventName ? this._xAxisObj.labels.events.clickEventName :"xAxisLabelClickEvent", this._xAxisObj.labels.events.clickEventUniqueId): '';
        
    }


    addLabelEventListener(obj,name,id){
        var _self = this;
        id = !!id ? id: 'chart_1';
        obj.labels.events = {
            click: function (event) { 
                window.dispatchEvent(new CustomEvent(name, {
                    detail: {
                        chartId:id,
                        label:event.target.innerHTML || event.target.textContent,
                        apiParams : _self.apirequest.params,
                        listened:false
                    },
                    bubble: false,
                    composed: true
                }));
                
            }
        }
    }



    getpayloadBellCurve(){
        this._xAxisObj.title.align = "middle";
        this._xAxisObj.title.text = this.getPayloadBellCurveData();
        this.linenum = 0;
        this._xAxisObj.plotLines = [];
        this._responseObj.lowerRange ? this.getplotlinelower():'';
        this._responseObj.upperRange ? this.getplotlineupper():'';
        this._xAxisObj.min = Math.min(this._responseObj.lowerRange?this._responseObj.lowerRange:this._responseObj.minValue, this._responseObj.upperRange ? this._responseObj.upperRange:this._responseObj.minValue, this._responseObj.minValue);
        this._xAxisObj.max = Math.max(this._responseObj.lowerRange?this._responseObj.lowerRange : 0, this._responseObj.upperRange?this._responseObj.upperRange:0, this._responseObj.maxValue);
    }

    getplotlinelower(){
        this._xAxisObj.plotLines[this.linenum++] = {
            'value': this._responseObj.lowerRange,
            'color': 'red',
            'dashStyle': 'shortdash',
            'width': 2,
            'label': {
                'text': this._responseObj.lowerRange,
                'rotation':0
            }
        }
       /* if(this._responseObj.lowerRange < this._responseObj.minValue){
            this._xAxisObj.min = this._responseObj.lowerRange ;
        }*/
        
    }

    getplotlineupper(){
        this._xAxisObj.plotLines[this.linenum++] = {
            'value': this._responseObj.upperRange,
            'color': 'red',
            'dashStyle': 'shortdash',
            'width': 2,
            'label': {
                'text': this._responseObj.upperRange,
                'rotation':0
            }
        }
        /*if(this._responseObj.upperRange > this._responseObj.maxValue){
            this._xAxisObj.min = this._responseObj.upperRange ;
        }*/
    }



    getPayloadBellCurveData(){
        var res = this._responseObj;
        var mean = "<b>Mean: " + '</b>' +  res.mean + '  ';
        mean = res.mean ? mean:'';
        var max = "<b>Max Payload: " + '</b>' +  res.maxValue + '  ';
        max = res.maxValue ? max:'';
        var min = "<b>Min Payload: " + '</b>' +  res.minValue + '  ';
        min = res.minValue ? min:'';
        var stddev = "<b>Std Dev: " + '</b>' +  res.standardDeviation + '  ';
        stddev = res.standardDeviation ? stddev:'';
        var sigmaFactor = "<b>Sigma factor: " + '</b>' +  res.sigmaFactor + '  ';
        sigmaFactor = res.sigmaFactor ? sigmaFactor:'';
        var targetPayload = '<b>Target Payload: ' + '</b>' +  res.targetPayload + '  ';
        targetPayload=  res.targetPayload ? targetPayload:'';
        var tenPercentAbove = "<b>10% above Target Payload: " + '</b>' +  res.payloadsAboveOnePointOneTimesTarget + '  ';
        tenPercentAbove = res.payloadsAboveOnePointOneTimesTarget ? tenPercentAbove:'';
        var twentyPercentAbove = "<b>20% above Target Payload: " + '</b>' +  res.payloadsAboveOnePointTwoTimesTarget + '  ';
        twentyPercentAbove = res.payloadsAboveOnePointTwoTimesTarget ? twentyPercentAbove:'' ;
        var value = '<span style="color:black;">' + mean + max + min + stddev + sigmaFactor +'<br>'+ targetPayload + tenPercentAbove + twentyPercentAbove + '</span>';
        return value;
    }

    getxAxisDayTrackerValues()
    {
        return this._timeFormat === "12Hrs" ? '{value:%I:%M %p}' : '{value:%H:%M}';
    }

    /**
     * Set the categories of Highchart for Bullet chart in below format
     */
    getBulletChartCategories() {
        if(this._responseObj.dataSets) {
            return ['<span style="font-size: 14px"><b>' + this._responseObj.dataSets[0].name + '</b></span><br/>' + '(' + this._responseObj.uom + ')'] 
        }
    }

    /**
     * Getter and Setter for chart y-axis property.
     * Tickinterval for the yaxis is given only for columnrange chart.
     * Axis type is set to datetime only for columnrange chart to treat the data as a milliseconds.
     *
     * @param {element} obj holds the y-axis for the chart.
     * @return {Object} To show y-axis and its properties on the chart.
     */
    get yAxis() {
        return this._yAxisObj;
    }

    set yAxis(obj) {
        this._yAxisObj = obj.yAxisObj || {};
        this._responseObj = obj.responseObj;
	    this._colors = obj.colorObj;
        // yAxis type is set to datetime only for columnrange chart, by default it is linear by highcharts.
        this._yAxisObj.type = this.chartType == this.COLUMNRANGE ? this.DATETIME :this.LINEAR; 
        this._yAxisObj.min = this._responseObj.min && this.chartType == this.COLUMNRANGE ? this._responseObj.min : 0;
        this._yAxisObj.tickLength = 0;
        if(this._chart.type == this.BULLET) {
            this.setYAxisBulletOptions();
        } else {
            this.setYAxisOptions();
        } 
        this._yAxisObj.plotLines === true ? this.yAxisPlotline(obj.apirequestObj.params.target): this._yAxisObj.plotLines = [];
        //this._yAxisObj.minRange = this.chartType == this.COLUMNRANGE ? 3600000 : undefined;
        this._yAxisObj.tickInterval = this.chartType == this.COLUMNRANGE ? 3600000 : undefined;
        this._yAxisObj.labels.enabled = this.chartType == this.COLUMNRANGE && window.innerWidth < 400 ? false : this._yAxisObj.labels.enabled;
        this._yAxisObj.labels.events && this._yAxisObj.labels.events.clickEventEnabled ? this.addLabelEventListener(this._yAxisObj,this._yAxisObj.labels.events.clickEventName ? this._yAxisObj.labels.events.clickEventName :"yAxisLabelClickEvent", this._yAxisObj.labels.events.clickEventUniqueId): '';
        
    }

    yAxisPlotline(target){
        this._yAxisObj.plotLines = [];
        if(!!target){
            this._yAxisObj.max = Math.max(this._yAxisObj.max,parseInt(target));
            this._yAxisObj.plotLines[0] = {
                'value': target,
                'color': 'red',
                'dashStyle': 'shortdash',
                'width': 2,
                'label': {
                    'text': target,
                    'align':"right",
                    'rotation': 0,
                    'x':-5

                }
            }
        }
        return ;
    }

    /**
     * Set the plotBands of Highchart for Bullet chart
     * Set from value as 0
     * Set to value as target from API response
     * Pick color from user config or default to '#bfbfbf'
     */
    setYAxisBulletOptions() {
        this._yAxisObj.title.enabled = false;
        this._yAxisObj.plotBands = [{
            from: 0,
            to: this._responseObj.target,
            color: this._colors ? this._colors[1] : '#bfbfbf'
        }];
    }

    setYAxisOptions() {
        if ((this._responseObj.series && this._responseObj.series[0].datasets && this._responseObj.series[0].datasets.length == 1) || (this._responseObj.series && this._responseObj.series.length > 1)) {
            this._yAxisObj.max = this._responseObj.max? this._responseObj.max: this._yAxisObj.plotLines? this.getProductivityTimeseriesMax():  this.getMaxYaxisValue();
            this._yAxisObj.title.text = this._yAxisObj.title && this._yAxisObj.title.text ? this._yAxisObj.title.text : this._responseObj.series[0].yaxis;
        }else if(this._responseObj.series)
            this._yAxisObj.title.text = this._yAxisObj.title && this._yAxisObj.title.text ? this._yAxisObj.title.text : this._responseObj.series[0].yaxis;
        else
        this._yAxisObj.title.text = this._yAxisObj.title && this._yAxisObj.title.text ? this._yAxisObj.title.text : this._responseObj.yaxis;
    }

    getMaxYaxisValue() {
        var datasets = [];
        var maxValArr = [], maxVal;
        if(this._responseObj.series[0].datasets && this._responseObj.series[0].datasets[0].data) {
            datasets = this._responseObj.series[0].datasets;
            for(var i = 0; i < datasets.length; i++) {
                maxValArr.push(Math.max.apply(null, datasets[i].data));
            }
        maxVal = Math.max.apply(null, maxValArr);
        } else if(this._responseObj.series.length > 1 && this._responseObj.sum) {
            maxVal = this._responseObj.sum;
        }
        return maxVal ? maxVal : undefined;
    }


    getProductivityTimeseriesMax()
    {
        var max=0;
        var Arr=[];
        var data= this._responseObj.series[0].datasets[0].data;
        for (var i=0;i<data.length;i++){
            if(max<data[i].y){
                max = data[i].y;
            }
        }
        return max; 
    }


    get dataseries(){
        return this._dataseries;
    }

    set dataseries(obj){
        this._dataseries = obj.dataseriesObj || {};
        !!this.apirequest && !!this.apirequest.params && this.apirequest.params.includeWeather ? this.addWeatherDataLabelsToSeries(this._dataseries[0]) : '';
    }
    addWeatherDataLabelsToSeries(datasets) {
        if(datasets){
            datasets.dataLabels = {
                align: 'center',
                verticalAlign:'bottom',
                enabled: true,
                useHTML: true,
                inside:false,
                formatter: function() {
                    if(this.point.weather) {
                        return '<div class="'+("weather-" + this.point.weather.img.imageId)+'"></div>';
                    }
                    return '';
                }
            };
        }
    }
   

     /**
     * Getter and Setter for chart y-axis property.
     *
     * @param {element} obj holds the y-axis for the chart.
     * @return {Object} To show y-axis and its properties on the chart.
     */
    get plotOptions() {
        return this._plotOptionsObj;
    }

    set plotOptions(obj) {
        this._plotOptionsObj = obj.plotOptionsObj || {};     
        !this.sos ? this._plotOptionsObj.series.stacking = !this.daytracker ? this._plotOptionsObj.series.stacking !== false ? this.NORMAL: undefined :undefined:'';
        this._plotOptionsObj.series.cursor = this.DEFAULT;
        this._plotOptionsObj.series.keys = (obj.chartTypeObj == this.PIE ) ? this.SLICED : '';
        this._plotOptionsObj.series.allowPointSelect = (obj.chartTypeObj == this.PIE && obj.responseObj.target === undefined) ? true : '';
	    if(obj.chartTypeObj == this.COLUMNRANGE)
        {
            this._plotOptionsObj[this.COLUMNRANGE] = {"grouping": false};
            this._plotOptionsObj.series.dataLabels.enabled = false;
        }
        if(this._chart.type == this.BULLET) {
            this.setBulletSeriesColors(obj);
        } else {
            this.setSeriesColors(obj);
        }
        if(this.daytracker){
            this._plotOptionsObj[this.LINE] = 
            {
                "linewidth": 2,
                "marker":{
                    "enabled":false
                }
            };
        }
        this._plotOptionsObj.series.clickEventEnabled ? this.addSeriesEventListener(this._plotOptionsObj.series.clickEventName ,this._plotOptionsObj.series.clickEventUniqueId):'';
    }
    /**
     * To dispatch event for drilldown click in chart component.
     * Default event name will be `seriesClickEvent` and chart unique Id is `chart_1` if eventname is not given by parent app.
     *
     * @param {element} name holds the event name from parent app
     * @param {element} id holds the unique chart id from parent app
     */
    addSeriesEventListener(name,id){
        var _self = this;
        name = !!name ? name: 'seriesClickEvent';
        id = !!id ? id: 'chart_1';
        this._plotOptionsObj.series.point = {};
        this._plotOptionsObj.series.point["events"] = {
            click: function (event) {
                window.dispatchEvent(new CustomEvent(name, {
                    detail: {
                        point:event.point,
                        chartId:id,
                        apiParams : _self.apirequest.params,
                        listened:false
                    },
                    bubble: false,
                    composed: true
                }));
                event.preventDefault();
                
            }
        }
    }

    _targetBoxclickevent(enable,event,id){
        var _self = this;
        if(enable){
            event = !!event ? event: 'targetBoxclickevent';
            id = !!id ? id: 'chart_1';
            window.dispatchEvent(new CustomEvent(event, {
                detail: {
                    chartId:id,
                    apiParams : _self.apirequest.params,
                    listened:false
                },
                bubble: false,
                composed: true
            }));
            console.log(id);
            console.log( _self.apirequest.params);
        }

    }

    setBulletSeriesColors(obj) {
        obj.colorObj !== undefined ? this._plotOptionsObj.series.colors = obj.colorObj :
             this._plotOptionsObj.series.color = this._responseObj.dataSets[0].color;
    }

    setSeriesColors(obj) {
        this._plotOptionsObj.series.colors = (obj.colorObj!== undefined) ? obj.colorObj : [];
    }


    _getweatherintooltip(weather){
        let weatherinfo = '<b>'+ weather.img.imageText+ '</b>';
        let weathermsg =  weather.weather.split(',');
        for(let i=0;i<weathermsg.length;i++){
            weatherinfo += '<br>'+ weathermsg[i].replace('-',':')
        }
        return weatherinfo
    }

    /**
     * set theme by default or parent app input.
     *
     * @param {element} val holds the default value or Parent app input value.
     */
    set theme(val) {
        !val || val == undefined ? this.getDefaultTheme() : '';
        if (val == this.DARK) {
            Highcharts.createElement(this.SCRIPT, {
                src: this.SRC
            }, null, document.getElementsByTagName(this.HEAD)[0]);
        } else if (val == this.GRIDLIGHT) {
            Highcharts.createElement(this.SCRIPT, {
                src: this.GRIDLIGHTSRC
            }, null, document.getElementsByTagName(this.HEAD)[0]);
        } else if (val == this.SANDSIGNIKA) {
            Highcharts.createElement(this.SCRIPT, {
                src: this.SANDSIGNIKASRC
            }, null, document.getElementsByTagName(this.HEAD)[0]);
        } else return;
    }

    getDefaultTheme() {
        var headElm = document.getElementsByTagName('head')[0];
        var themeScript = headElm.children[headElm.children.length - 1];
        if (themeScript.outerHTML.indexOf('/css?family=') > 0) {
          headElm.removeChild(themeScript);
        }
        var themeScriptCSS = headElm.children[headElm.children.length - 1];
        if (themeScriptCSS.outerHTML.indexOf('/highcharts/js/themes/') > 0) {
          headElm.removeChild(themeScriptCSS);
        }
    }

    /**
     * Getter and Setter for zone property.
     *
     * @param {element} obj holds the Timezone for the chart.
     * @return {String} To show timezone of data in the chart.
     */

    get zone(){
        return this._zone;
    }

    set zone(obj)
    {
        this._zone = obj.zone !== this.EQUIPMENTLOCAL ? obj.zone: this._zone;
    }

    /**
     * Getter and Setter for timeFormat property.
     *
     * @param {element} obj holds the timeFormat for the chart.
     * @return {String} To show timeFormat of data in the chart.
     */

    get timeFormat()
    {
        return this._timeFormat;
    }

    set timeFormat(obj)
    {
        this._timeFormat = obj.timeFormat;
    }

     /**
     * Getter and Setter for dateFormat property.
     *
     * @param {element} obj holds the dateFormat for the chart.
     * @return {String} To show dateFormat of data in the chart.
     */
    get dateFormat()
    {
        return this._dateFormat;
    }

    set dateFormat(obj)
    {
        this._dateFormat = obj.dateFormat;
    }
    /**
     * Getter and Setter for loader property.
     *
     * @param {element} bool holds the boolean value for loader.
     * @return {Boolean} To show or hide the loader image.
     */
    get responsive() {
        return this._responsive;
    }
    set responsive(val) {
        if (val) {
            this._responsive= {
                rules :[
                    {
                        condition: {
                        maxWidth: 400
                        },
                        chartOptions: {
                            chart:{
                                events:{
                                    redraw: function(){
                                        console.log("fdgfdhgfdg");
                                    }
                                }
                            },
                            legend: {
                                align: 'center',
                                verticalAlign: 'bottom',
                                layout: 'horizontal',
                                maxHeight: 55
                               
                                
                            },
                            title: {
                                style: {
                                    fontWeight:"bold",
                                    fontSize: "14px"
                                }
                            },
                            subtitle: {
                               
                                style: {
                                    fontSize: "12px"
                                }
                            },
                            xAxis: {
                                title: {
                                    style: {
                                        fontSize: "11px"
                                    }
                                },
                                labels: {
                                    autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
                                }
                            },
                            yAxis: {
                                title: {
                                    style: {
                                        fontSize: "11px"
                                    }
                                }
                            },
                            navigator: {
                                enabled: false
                            }
                        }
                    }
                ]
            }
        } else return;
    }
}
