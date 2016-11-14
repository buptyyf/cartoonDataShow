//"use strict";
var React = require('react');
var CompareChart = require('./CompareChart');
var ReactEcharts = require('echarts-for-react').default;

var LineChart = React.createClass({
    getInitialState : function(){
        return {
            cartoonName: "镖人",
            webName: "腾讯",
            info: [],//temp_info,
        }
    },
    componentWillMount: function(){
        $.ajax({
            type: "post",
            url: "/api/info/line",
            data: {webName:this.state.webName, cartoonName:this.state.cartoonName}
        }).done(function (resp) {
            if(resp.status == "success"){
                //console.log(resp.data);
                /*this.state.info = resp.data;
                this.forceUpdate();*/
                this.setState({
                    info: resp.data
                });
            }
        }.bind(this));
    },
	getOption: function() {
        var seriesData = [];
        var dates = [];
        var legendData = [];
        //console.log(this.state.info);
        if (this.state.info.length !== 0) {
            //console.log(this.state.info);
            var hitNum = [];
            var commentNum = [];
            var likeNum = [];
            var collectionNum = [];
            var caiNum = [];
            /*this.state.info.done(function(data){
                return data.map
            })*/
            this.state.info.map(function(single){
                dates.push(single.crawlTime.split(' ')[0]);
                hitNum.push(single.hitNum);
                commentNum.push(single.commentNum);
                likeNum.push(single.likeNum);
                collectionNum.push(single.collectionNum);
                caiNum.push(single.caiNum);
            });
            seriesData.push(
                {
                    name: '点击数',
                    type: 'line',
                    data: hitNum,
                },
                {
                    name: '评论数',
                    type: 'line',
                    data: commentNum,
                },
                {
                    name:'收藏数',
                    type:'line',
                    data: collectionNum,
                },
                {
                    name:'赞数',
                    type:'line',
                    data: likeNum,
                },
                {
                    name:'踩数',
                    type:'line',
                    data: caiNum,
                });
        }
        // console.log(seriesData);
        var option = {
            title: {
                //text: this.state.webName + '《' + this.state.cartoonName + '》数据图',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['点击数','评论数','收藏数','赞数','踩数']
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
            series: seriesData,
        };
        //console.info(option);
        return option;
    },
    componentDidMount: function(){
        var that = this;
        $("#cartoon-name").change(function(evt){
            //console.log(evt.target.value);
            $.ajax({
                type: "post",
                url: "/api/info/line",
                data: {webName:that.state.webName, cartoonName:evt.target.value}
            }).done(function (resp) {
                var data = resp.data;
                //console.log(data);
                if(resp.status == "success"){
                    if (data.length == 0){
                        alert("没有该项数据");
                    }
                    that.setState({
                        cartoonName: evt.target.value,
                        info: resp.data,
                    });

                }
            }.bind(this));
        });
        $("#website").change(function(evt){
            //console.log(evt.target.value);
            $.ajax({
                type: "post",
                url: "/api/info/line",
                data: {webName:evt.target.value, cartoonName:that.state.cartoonName}
            }).done(function (resp) {
                if(resp.status == "success"){
                    if (resp.data.length == 0){
                        alert("没有该项数据");
                    }
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
                        选择作品：
                        <select id="cartoon-name" className="form-control">
                          <option>镖人</option>
                          <option>白狼汐</option>
                          <option>森林人间塾</option>
                          <option>BRAVE</option>
                          <option>杰探</option>
                          <option>漫画社X的复活</option>
                        </select>
                    </div>
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
                </div>
                <div className='row gap'>
                    <p className= "text-center title">{this.state.webName}《{this.state.cartoonName}》数据图</p>
                    <ReactEcharts ref='echarts_react' option={ this.getOption() } />
                    <p className="text-right">注：数据为-1代表此网站不存在该项数据</p>
                </div>
            </div>
        );
    }
});

module.exports = LineChart;