var React = require('react');
var Pager = require('./Pager');

var CommentList = React.createClass({
	getInitialState : function(){
        return {
            webName: "All",
            cartoonName: "All",
            page: 1,
            pages: 1,
            comments: [],//temp_info,
        }
    },
    componentWillMount: function(){
        this.listComment(1);
    },
    listComment : function(page, webName, cartoonName){
    	var that = this;
    	var stateChange = 0;
    	if (arguments.length == 1) {
    		var data = {
    			page: page,
    			webName: this.state.webName,
    			cartoonName: this.state.cartoonName,
    		};
    	} else {
    		var data = {
    			page: page,
    			webName: webName,
    			cartoonName: cartoonName,
    		};
    		stateChange = 1;
    	}
        $.ajax({
            type: 'post',
            url: '/api/info/comment',
            data: data
        }).done(function (resp) {
            if(resp.status == "success"){
                var pager = resp.pager;
                if (stateChange == 1) {
                	that.setState({
	                    comments: pager.comments,
	                    page: pager.page,
	                    pages: pager.pages,
	                    webName: webName,
	                    cartoonName: cartoonName,
	                });
                } else {
	                that.setState({
	                    comments: pager.comments,
	                    page: pager.page,
	                    pages: pager.pages
	                });
	            }
            }
        }.bind(this));
    },
    componentDidMount: function(){
    	var that = this;
        $("#cartoon-name").change(function(evt){
        	var webName = that.state.webName;
        	that.listComment(1, webName, evt.target.value);
        });
        $("#website").change(function(evt){
        	var cartoonName = that.state.cartoonName;
            that.listComment(1, evt.target.value, cartoonName);
        });
    },
	render: function(){
		var pager_props = {
            page : this.state.page,
            pages : this.state.pages,
            listComment : this.listComment,
        };
        var comments = this.state.comments.map(function(comment){
        	return(
        		<div>
        			<h3>《{comment.cartoonName}》&nbsp;&nbsp;
	                    <small>来源：{comment.webName}({comment.commentTime})&nbsp;&nbsp;&nbsp;&nbsp;昵称：{comment.author}</small>
	                </h3>
	                <p>&nbsp;&nbsp;{comment.content}</p>
	                <hr />
        		</div>
        		);
        });
		return(
			<div className='container'>
                <div className='row'>
                    <div className="col-md-6">
                        选择作品：
                        <select id="cartoon-name" className="form-control">
                        	<option>All</option>
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
                        	<option>All</option>
							<option>腾讯</option>
							<option>网易</option>
							<option>动漫之家</option>
							<option>sf互动传媒</option>
							<option>有妖气</option>
							<option>捧秀</option>
                        </select>
                    </div>
                </div>
                <div className='well gap'>
                    {comments}
                    <Pager {...pager_props}/>
                </div>
            </div>
		)
	}

});

module.exports = CommentList;