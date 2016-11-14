var React = require("react");
var ReactDOM = require("react-dom");
var DataCharts = require("../components/DataCharts");
console.log(DataCharts);
//React.render(React.createElement(DataCharts , null), document.getElementById("data-container"));
ReactDOM.render(<DataCharts/>, document.getElementById("data-container"));
