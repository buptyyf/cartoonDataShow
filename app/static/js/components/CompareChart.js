"use strict";
var React = require('react');
//var CompareChart = require('./CompareChart')
var ReactEcharts = require('echarts-for-react').default;

var CompareChart = React.createClass({
    getInitialState : function(){
        /*var temp_info =  $.ajax({
            type: "post",
            url: "/info/line",
            data: {webName:"腾讯", cartoonName:"镖人"}
        });*/
        return {
            webName: "腾讯",
            kind: "点击数",
            info: [],//temp_info,
        }
    },
	getOption: function() {
        var seriesData = [];
        var dates = [];
        var legendData = [];
        //console.log(this.state.info.length);
        if (this.state.info.length != 0) {
            //console.log(this.state.info);
            this.state.info.map(function(single){
                for (var key in single) {
                    if (key != 'date') {
                        legendData.push(key);
                        seriesData.push({
                            name: key,
                            type: 'line',
                            data: single[key],
                        });
                    } else {
                        if (dates.length == 0) {
                            dates = single[key];
                        }
                    }
                }
            });
        }
        /*console.log(dates);
        console.log(legendData);
        console.log(seriesData);*/
        var option = {
            title: {
                //text: this.state.webName + '《' + this.state.cartoonName + '》数据图',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
            },
            grid: {
                //left: '3%',
                //right: '4%',
                bottom: '15%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            dataZoom: [{
                textStyle: {
                    color: '#8392A5'
                },
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                dataBackground: {
                    areaStyle: {
                        color: '#8392A5'
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8392A5'
                    }
                },
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                }
            }, {
                type: 'inside'
            }],
            xAxis: {
                type: 'category',
                data: dates,
                axisLine: { lineStyle: { color: '#8392A5' } }
            },
            yAxis: {
                type: 'value'   //不可以是category
            },
            series: seriesData
        };
        return option;
    },
    componentWillMount: function(){
        $.ajax({
            type: "post",
            url: "/api/info/compare",
            data: {webName:this.state.webName, kind:this.state.kind}
        }).done(function (resp) {
            //console.log(resp.data);
            if(resp.status == "success"){
                this.setState({
                    info: resp.data,
                });
            }
        }.bind(this));
    },
    componentDidMount: function(){
        var that = this;
        $("#kind").change(function(evt){
            //console.log(evt.target.value);
            $.ajax({
                type: "post",
                url: "/api/info/compare",
                data: {webName:that.state.webName, kind:evt.target.value}
            }).done(function (resp) {
                
                if(resp.status == "success"){
                    that.setState({
                        kind: evt.target.value,
                        info: resp.data,
                    });
                }
            }.bind(this));
        });
        $("#website").change(function(evt){
            //console.log(evt.target.value);
            $.ajax({
                type: "post",
                url: "/api/info/compare",
                data: {webName:evt.target.value, kind:that.state.kind}
            }).done(function (resp) {
                if(resp.status == "success"){
                    that.setState({
                        webName: evt.target.value,
                        info: resp.data,
                    });
                }
            }.bind(this));
        });
    },
    render: function() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className="col-md-6">
                        选择网站：
                        <select id="website" className="form-control">
                          <option>腾讯</option>
                          <option>网易</option>
                          <option>动漫之家</option>
                          <option>sf互动传媒</option>
                          <option>有妖气</option>
                          <option>捧秀</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        选择对比项：
                        <select id="kind" className="form-control">
                          <option>点击数</option>
                          <option>评论数</option>
                          <option>收藏数</option>
                          <option>赞数</option>
                          <option>踩数</option>
                        </select>
                    </div>
                </div>
                <div className='row gap'>
                    <p className= "text-center title">{this.state.webName}[{this.state.kind}]数据对比图</p>
                    <ReactEcharts ref='echarts_react' option={ this.getOption() } />
                    <p className="text-right">注：数据为-1代表此网站不存在该项数据</p>
                </div>
            </div>
        );
    }
});

module.exports = CompareChart;