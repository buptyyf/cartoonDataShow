var React = require('react');
var ReactEcharts = require('echarts-for-react')

var Footer = React.createClass({

	render: function(){
		return(
			<footer>
	            <div className="row">
	                <div className="col-lg-12">
	                    <p>Copyright &copy; UNICORN 2016</p>
	                </div>
	            </div>
	        </footer>
		)
	}

});

module.exports = Footer;