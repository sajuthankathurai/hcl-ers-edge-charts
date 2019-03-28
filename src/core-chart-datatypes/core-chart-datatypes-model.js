/**
 *
 * @customElement 
 * @polymer
 * @demo demo/index.html
 * @description 
 * CoreChartDatatypesModel formats the chart response came from api request according to the user request.
 * If the data came is not appropriate  then  this model will format the data according to the chart needed to be shown.
 */
export class CoreChartDatatypesModel {
    constructor() {
        this.BAR = 'bar'; /** Constant property for bar - horizontal chart type. */
        this.PIE = 'pie'; /** Constant property for pie - horizontal chart type. */
        this.DONUT = 'donut';
        this.COLUMN = 'column'; /** Constant property for column - vertical chart type. */
        this.COLUMNRANGE = 'columnrange'; /** Constant property for columnrange  chart type. */
 	    this.BULLET = 'bullet'; /** Constant property for bullet - horizontal chart type. */
        this.ERRORMSG = 'Chart type not supported. Configure the chart type as '; /** Constant property for Error message. */
        this.ERRORMSGBARCOLUMN = 'Chart type not supported. Configure the chart type as Bar or Column '; /** Constant property for Error message. */
        this.ERRORMSGDONUT = 'Chart type not supported. Configure the type as scorecard, donut or bullet '; /** Constant property for Error message. */
        this.ERRORMSGRANGE = 'Chart type not supported. Configure the type as Columnrange '; /** Constant property for Error message. */
        this.CONTENT_TYPE = 'application/json'; /** Content type property for API calls. */
        
        this._handleUrl = ''; /** Parent app API URL to fetch data. */
        this.dataSeries = []; /** Array which holds the data to plot the chart. */
        this.chartResponse = null; /** Property to capture chart data. */

        /** Header property for API calls. */
        this._header = {
            "Content-Type": "application/json"
        }
        this.isArray = false;
        /** Data to pass to single series component. */
        this.chartData = {
            response: null,
            dataseries: null,
            type: null,
            errorMsg: ""
        }
        this.chartDatas = [];

    }

    /**
     * Getter and Setter for API URL property.
     *
     * @param {url} element holds the API URL defined by the Parent app.
     * @return {String} To call the API end point.
     */
    get handleUrl() {
        return this._handleUrl;
    }

    set handleUrl(url) {
        this._handleUrl = url;
    }

    /**
     * Getter and Setter for formatting chart data.
     *
     * @param {obj} element holds the request, response, chartconfig and charttype.
     * @return {Object} To send to single series to plot the chart.
     */
    get formChartDataParams() {
        if(!this.isArray)
            return this.chartData;
        else{
            for(var i=0;i<this.chartDatas.length;i++){
                this.chartDatas[i] = JSON.parse(this.chartDatas[i]);
            }
            return this.chartDatas;
        }
    }

    set formChartDataParams(obj) {
        this._isArray(obj.req, obj.res);
        if(!this.isArray)
            this.formChartData(obj.req, obj.res, obj.chartConfig, obj.charttype);
        else{
            if(obj.res.channels){
                for(var i=0;i<obj.res.channels.length;i++){
                    this.formChartData(obj.req, obj.res.channels[i], obj.chartConfig, obj.charttype);
                    var data = JSON.stringify(this.chartData);
                    //this._parseLegend = JSON.parse(this._parseLegend);
                    this.chartDatas.push(data);
                }
            }
            else{
                for (var i = 0; i < obj.res.length; i++) {
                    for (var j = 0; j < obj.res[i].dataSets.length; j++) {
                        for (var k = 0; k < obj.res[i].dataSets[j].data.length; k++) {
                            obj.res[i].dataSets[j].data[k][1] = parseFloat(obj.res[i].dataSets[j].data[k][1]);
                        }
                    }
                }
                for(var i=0;i<obj.res.length;i++){
                    this.formChartData(obj.req, obj.res[i], obj.chartConfig, obj.charttype);
                    var data = JSON.stringify(this.chartData);
                    //this._parseLegend = JSON.parse(this._parseLegend);
                    this.chartDatas.push(data);
                }
            }

        }
    }

    _isArray(req, res){
            this.isArray= false;
    }




    /**
     * Getter for API header.
     *
     * @return {Object} To call API endpoint to plot the chart.
     */
    get ironAjaxHeader() {
        return this._header;
    }
  
    set ironAjaxHeader(headerObj){
        this._header = headerObj || this._header;
    }

    /**
     * Method to format the chart container.
     * 
     * @param {element} _this holds the instance of core-chart-datatype to access element style.
     * @return {element} To modify the container height to 0 when chart data is empty for Bullet chart.
     */
    checkBulletChartContainer(_this) {
        _this.style.height = '0';
    }


    /**
     * Method to format the chart data.
     * 
     * @param {element} req holds the request sent from the Parent app to hit API.
     * @param {element} res holds the response from the API hit.
     * @param {element} chartConfig holds the chart configuration input from Parent app.
     * @param {element} chartType holds the type of the chart whether pie, bar or column.
     */
    formChartData(req, res, chartConfig, chartType) {
        this.chartType = chartType;
        this.chartResponse = res;
        this.chartConfig = chartConfig;
        if(this.chartType == this.BULLET) {
            this.formatBulletChartData();
        } else {
            if (this.chartResponse) {
                this.dataSeries = this.getDataSets();
            }
            this.setChartColor();   
            this.setchartData();
        }
        this.chartData.response = this.chartResponse;
        this.chartData.dataseries = this.dataSeries;
    }

    /**
     * Method to format the bullet chart data.
     * 
     * Format the API response to format which highchart bullet chart accepts 
     */
    formatBulletChartData() {
        this.checkBulletChartFormat();
        if(this.chartResponse.dataSets) {
            this.dataSeries = [{
                data: [{
                    y: this.chartResponse.dataSets[0].data[0][0],
                    target: parseInt(this.chartResponse.target),
                    name: this.chartResponse.dataSets[0].name
                }],
                name: this.chartResponse.dataSets[0].name
            }];
        }
    }

    /**
     * Method to show error message for other chart types instead of bullet chart.
     * 
     * When chart type is set to bullet and API responses for other charttype format, show error message
     */
    checkBulletChartFormat() {
        if(this.chartType == this.BULLET && !this.chartResponse.hasOwnProperty('dataSets'))
            this.chartData.errorMsg = this.ERRORMSG;
    }

     /**
     * Method to format the datasets from API response for Pie, Bar, Column chart.
     * 
     * @param {element} i holds the index of dataset.
     * @param {element} chartType holds the type of the chart whether pie, bar or column.
     */
    getDataSets() {
        if (this.chartResponse.series && this.chartResponse.series[0].hasOwnProperty('datasets')) {
            return this.chartResponse.series[0].datasets;
        } else if(this.chartResponse.series){
            return this.chartResponse.series;
        } else if(this.chartResponse.dataSets)
            return this.chartResponse.dataSets;
        else
         return this.chartResponse
        
        
    }

    /**
     * Getter and Setter for chartData property.
     *
     * To make data to fit the chart format ie. pie or bar
     * @param {obj} element holds the data for the chart.
     * @return {Object} To show y-axis and its properties on the chart.
     */

    setchartData() {
        if( this.chartResponse.target !== undefined && this.chartType !== this.DONUT && this.chartType !== this.PIE ){
            this.dataseries = [];
            this.chartData.errorMsg = this.ERRORMSGDONUT;
        }
        else
        this.checkChartFormat(this.chartType, this.dataSeries);
        if (this.chartType == this.PIE || this.chartType == this.DONUT) {
            this.dataSeries = [{
                data: this.dataSeries
            }];
        } else return;
    }
    /**
     * Getter and Setter for chart color property.
     *
     * To set the user defined colors to chart data
     * @return {Object} Dataseries with user preffered color.
     */

    setChartColor() {
        if(this.chartConfig.colors) {
            if(this.dataSeries && this.dataSeries[0] && this.dataSeries[0].data && this.dataSeries[0].data[0] && (this.dataSeries[0].data[0].hasOwnProperty('color') || this.dataSeries[0].data[0].hasOwnProperty('name'))) {
                for(let i = 0; i < this.dataSeries[0].data.length; i++ ) {
                    (this.dataSeries[0].data[i].name || this.dataSeries[0].data[i].color) ? this.dataSeries[0].data[i].color = '' : '';
                } 
            }  else if(this.dataSeries && this.dataSeries[0] &&  (this.dataSeries[0].hasOwnProperty('name') || this.dataSeries[0].hasOwnProperty('color'))) {
                for(let i = 0; i < this.dataSeries.length; i++) {
                    (this.dataSeries[0].name) ? this.dataSeries[i].color = this.chartConfig.colors[i] : '';
                }
            }
        }
    }

    /**
     * Check the format of data whether its in pie or bar format.
     *
     * @param {type} element holds the type of chart.
     * @param {data} element holds the data for the chart.
     */
    checkChartFormat(type, data) {
        if ( type == this.BAR || type == this.COLUMN) {
            if (data && data[0] && data[0].y !== undefined) {
                this.formatChartData(type, data);
            } else {
                this.dataSeries = data;
            }
        } else if(type == this.PIE || type == this.DONUT ) {
            if(data && data[0] && data[0].data) {
                this.dataSeries = [];
                this.chartData.errorMsg = this.ERRORMSGBARCOLUMN;
            }
        }
    }

    /**
     * To format of data to fit into pie or bar format.
     *
     * @param {type} element holds the type of chart.
     * @param {data} element holds the data for the chart.
     */
    formatChartData(type, data) {
        if(data.length) {
            for (let i = 0; i < data.length; i++) {
                let emptyArray = new Array(data.length);
                for(let i=0; i<data.length;i++) {
                    emptyArray[i] = null;
                }
                data[i].data = emptyArray;
                data[i].data.splice(i, 1, data[i].y);
                if(this.chartConfig.colors) {
                    data[i].color = this.chartConfig.colors[i];
                }
            }
        }
    }

}