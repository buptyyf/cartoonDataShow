var React = require('react');
var Header = require('./Header');
var RadarChart = require('./RadarChart');
var LineChart = require('./LineChart');
var CompareChart = require('./CompareChart');
//var Footer = require('./Footer')
var CommentList = require('./CommentList');
var Route = require('react-router').Route;
var Router = require('react-router').Router;
var history = require('react-router/lib/browserHistory');
/*var hashHistory = require('react-router')*/

var DataCharts = React.createClass({
	getInitialState : function(){
        return {
            date: '',
            cartoonName: '',
            webName: ''
        }
    },
    componentDidMount: function(){

    },
    render: function(){
    	return(
        <Router history = {history}>
    		<Route path="/" component={Header}>
    	        <Route path="/data/radar" component={RadarChart} />
    	        <Route path="/data/line" component={LineChart} />
                <Route path="/data/compare" component={CompareChart} />
                <Route path="/data/comment" component={CommentList} />
            </Route>
        </Router>
    	)
    }
});

module.exports = DataCharts;