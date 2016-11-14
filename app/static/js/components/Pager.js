var Addons = require("react/lib/ReactWithAddons");
var React = require('react');

var Pager = React.createClass({
    getDefaultProps : function(){
        return{
            page:1,
            pages:1
        }
    },
    clickHandler: function(e){
        e.stopPropagation();
        this.props.listComment(e.target.dataset.page);

    },
    render : function(){
        var cx = React.addons.createFragment;
        console.log(React);
        console.log(Addons);
        console.log(cx);
        if(this.props.page == 1) {
            var preClass = 'previous disabled'
        } else {
            var preClass = 'previous'
        }
        if(this.props.page == this.props.pages) {
            var nextClass = 'next disabled'
        } else {
            var nextClass = 'next'
        }
        /*var preClass = cx({
            'previous':true,
            'disabled':this.props.page == 1
        });
        var nextClass = cx({
            'next':true,
            'disabled':this.props.page == this.props.pages
        });*/

        return(
            <ul className="pager">
                <li className={preClass}  onClick={this.clickHandler}>
                    <a href="#" data-page={this.props.page-1}>&larr;Prev</a>
                </li>
                <li>
                    <span>{this.props.page}/{this.props.pages}</span>
                </li>
                <li className={nextClass}  onClick={this.clickHandler}>
                    <a href="#" data-page={this.props.page+1}>Next&rarr;</a>
                </li>
            </ul>
        )
    }
});

module.exports = Pager;