"use strict";

var React = require('react');
var ReactEcharts = require('echarts-for-react').default;

var RadarChart = React.createClass({
	getInitialState : function(){
        return {
            dataType: "总量",
            dateTime: this.getYesterdayDate(),
            webName: "腾讯",
            info: [],
        }
    },
    getYesterdayDate: function(){
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();        //日
        var clock = year + "-";
       
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day;

        return clock; 
    },
	getOption: function() {
        var seriesData = [];
        var legendData = [];
        if (this.state.info.length != 0) {
            this.state.info.map(function(single){
                console.log(single);
                var numIndex = [];
                numIndex.push(single.hitNum);
                numIndex.push(single.commentNum);
                numIndex.push(single.collectionNum);
                numIndex.push(single.caiNum);
                numIndex.push(single.likeNum);
                seriesData.push({value: numIndex, name: single.name});
                legendData.push(single.name);
            });
        }
        console.log(seriesData);
        console.log(legendData);
        var option = {
            title: {
                //text: this.state.webName + '漫画数据图'+'\n(截止'+ this.state.dateTime +'数据)',
                top: 1,
                left: 'left',
            },
            tooltip: {},
            legend: {
                //padding: 5,
                //top: 20,
                bottom: 'bottom',
                data: legendData//['镖人', '白狼汐', ]//"BRAVE", "森林人间塾", "漫画社X的复活"
            },
            radar: {
                //shape: 'circle',
                indicator: [
                   { name: '点击量', },
                   { name: '评论数', },
                   { name: '收藏数', },
                   { name: '踩数', },
                   { name: '喜欢数', },
                ],
                //silent: true,
            },
            series: [{
                //name: '镖人 vs 白狼汐',
                type: 'radar',
                data : seriesData
                /*[
                    {
                        value : [4300, 10000, 28000, -1, 50000],
                        name : '镖人'
                    },
                     {
                        value : [5000, 14000, 28000, 31000, 42000],
                        name : '白狼汐'
                    }
                    
                ]*/
            }]
        };
        return option;
    },
    componentWillMount: function(){
        $.ajax({
            type: "post",
            url: "/api/info/radar",
            data: {webName:this.state.webName, dateTime:this.state.dateTime, dataType:this.state.dataType}
        }).done(function (resp) {
            console.log(resp.data);
            if(resp.status == "success"){
                this.setState({
                    info: resp.data,
                });
            }
        }.bind(this));
    },
    componentDidMount: function(){
        var that = this;
    	$("#datetime").datetimepicker({
    		format: 'yyyy-mm-dd',
    		autoclose: true,
    		minView: 'month',
    		//language: 'zh-CN',
    		todayBtn: true,
    		maxView: 'year',
    	});
    	$("#datetime").change(function(evt){
            console.log(evt.target.value);
		  	$.ajax({
                type: "post",
                url: "/api/info/radar",
                data: {webName:that.state.webName, dateTime:evt.target.value, dataType:that.state.dataType}
            }).done(function (resp) {
                var data = resp.data;
                console.log(data);
                if(resp.status == "success"){
                    that.setState({
                        dateTime: evt.target.value,
                        info: resp.data,
                    });
                }
            }.bind(this));
		});
        $("#data-type").change(function(evt){
            console.log(that.state.dateTime);
            console.log(evt.target.value);
            $.ajax({
                type: "post",
                url: "/api/info/radar",
                data: {webName:that.state.webName, dateTime:that.state.dateTime, dataType:evt.target.value}
            }).done(function (resp) {
                if(resp.status == "success"){
                    that.setState({
                        dataType: evt.target.value,
                        info: resp.data,
                    });
                }
            }.bind(this));
        });
        $("#website").change(function(evt){
            console.log(that.state.dateTime);
            console.log(evt.target.value);
            $.ajax({
                type: "post",
                url: "/api/info/radar",
                data: {webName:evt.target.value, dateTime:that.state.dateTime, dataType:that.state.dataType}
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
                    <div className="col-md-4">
                		选择日期：
                        <input readOnly className="form-control" id="datetime" defaultValue={this.getYesterdayDate()} />
                    </div>
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                        选择数据类型：
                        <select id="data-type" className="form-control">
                          <option>总量</option>
                          <option>增量</option>
                        </select>
                    </div>
                </div>
                <div className='row gap'>
                    <p className= "text-center title">{this.state.webName}漫画数据图(截止{this.state.dateTime}数据)</p>
                    <ReactEcharts ref='echarts_react' option={ this.getOption() } />
                    <p className="text-right">注：数据为-1代表此网站不存在该项数据</p>
                </div>
            </div>
        );
    }
});

module.exports = RadarChart;