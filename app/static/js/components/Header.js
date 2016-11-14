var React = require('react');
var ReactEcharts = require('echarts-for-react');
var RadarChart = require('./RadarChart');
var LineChart = require('./LineChart');
var Footer = require('./Footer');
var Link = require('react-router').Link;

var Header = React.createClass({
	componentDidMount: function(){
    	$('.navbar-toggle').collapse();
    	console.log(this.props.children)
    	$('li').on('click',function(e){
    		//console.log(e.target);
    		$('.active').removeClass('active');
    		/*document.getElementsByTagName('li').map(function(single){
    			single.className = "";
    		});*/
    		$(this).addClass('active');
    	});
    },
	render: function(){
		return(
		<div className="container">
		    <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
		    	<div className="container">
				   <div className="navbar-header">
				      <button type="button" className="navbar-toggle" data-toggle="collapse" 
				         data-target="#example-navbar-collapse">
				         <span className="sr-only">切换导航</span>
				         <span className="icon-bar"></span>
				         <span className="icon-bar"></span>
				         <span className="icon-bar"></span>
				      </button>
				      <a className="navbar-brand" href="#">UNICORN DATA</a>
				   </div>
				   <div className="collapse navbar-collapse" id="example-navbar-collapse">
				      <ul className="nav navbar-nav">
				         <li className="active"><Link to="/data/radar">雷达图</Link></li>
				         <li><Link to="/data/line">折线图</Link></li>
				         <li><Link to="/data/compare">对比图</Link></li>
				         <li><Link to="/data/comment">评论</Link></li>
				      </ul>
				      <ul className="nav navbar-nav navbar-right">
				      	 <li><a href="/logout">退出</a></li>
				      </ul>
				   </div>
				</div>
			</nav>
			{ this.props.children || <RadarChart />}
			<Footer />
		</div>
		)
	}

});

module.exports = Header;