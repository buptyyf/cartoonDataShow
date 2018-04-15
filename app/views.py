from flask import render_template, request, jsonify, redirect, url_for, flash
from app import app
from app import db, login_manager
import flask_login as flask_login
from .models import Info,Comment,User,Info_increment
import json
import logging
log_file = "./basic_logger.log"
logging.basicConfig(filename = log_file, level = logging.DEBUG)


@login_manager.user_loader
def load_user(id):
    logging.warning(id)
    if id is None:
        redirect('/login')
    user = User()
    user.get_id()
    logging.warning(user.__dict__)
    return user


@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/login')

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    username = request.form['username']
    user = json.loads(User.objects(username=username).to_json())
    if len(user) == 0:
        return 'Username Error!'
    user = user[0]
    logging.error(type(user))
    if request.form['password'] == user['password']:
        user = User()
        user.username = username
        flask_login.login_user(user)#这句之后会自动执load_user(user_loader)的方法，找到指定的用户
        return redirect('/data/radar')

    return 'Password Error'

@app.route("/signup", methods=["GET","POST"])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')

    username = request.form['username']
    password = request.form['password']
    user = User.objects(username=username)
    if len(user) == 0:
        user = User(username=username, password=password)
        if user.save():
            flash("signup success!")
            return redirect('/login')
    flash("用户名已被注册")
    return redirect('/signup')

@app.route("/logout")
@flask_login.login_required
def logout():
    flask_login.logout_user()
    flash("Logged out.")
    return redirect('/login')

@app.route('/data/radar')
@app.route('/data/line')
@app.route('/data/compare')
@app.route('/data/comment')
@flask_login.login_required
def index():
	return render_template('index.html')

'''
url: "/api/info/radar"
type: post
功能: 通过日期和网站名得到数据库中的各个作品的各项(累计)数据，作为填充雷达图的数据
input: {dateTime,webName}
output: 
{
    status:"success",
    data:[object,object,object], #object详见models中的Info数据结构
}
'''


@app.route("/api/info/radar", methods=["POST"])
def get_data_by_datetime_webname():
    dateTime = request.form.get("dateTime")
    webName = request.form.get("webName")
    dataType = request.form.get("dataType")
    if dataType == "总量":
        data = Info.objects(crawlTime__contains=dateTime,webName__contains=webName)
    else:
        data = Info_increment.objects(crawlTime__contains=dateTime,webName__contains=webName)

    return jsonify(status="success", data=data)


'''
url: "/api/info/line"
type: post
功能: 通过漫画名和网站名查找数据库中的某个作品各个时间点的各项(累计)数据
input: {cartoonName,webName}
output: 
{
    status:"success",
    data:[object,object,object], #object详见models中的Info数据结构
}
'''


@app.route("/api/info/line", methods=["POST"])
def get_data_by_cartoonname_webname():
    cartoonName = request.form.get("cartoonName")
    webName = request.form.get("webName")
    data = Info.objects(name__contains=cartoonName,webName__contains=webName).order_by('crawlTime')

    return jsonify(status="success", data=data)


'''
url: "/api/info/compare"
type: post
功能: 通过类型名（点击数、评论数、收藏数、赞数、踩数）和网站名
      查找数据库中的各个作品每个时间点的某项(累计)数据
input: {kind,webName}
output: 
{
    status: "success",
    data: 
    [
        {
            "镖人": [1,2],
            "date":["2016-07-04 22:00:00","2016-07-04 22:05:22"]
        },
        {
            "brave": [3,56],
            "date":["2016-07-04 22:00:00","2016-07-04 22:05:22"]
        }
    ]
}
'''


@app.route("/api/info/compare", methods=["POST"])
def get_data_by_webname_kind():
    webName = request.form.get("webName")
    kind = request.form.get("kind")
    rawData = list(Info.objects(webName__contains=webName).order_by('crawlTime'))
    #仿照m.to_json() for m in paginator.items试试，或者把数据放到前端处理
    if kind == "点击数":
        data = get_data_by_kind(rawData,"hitNum")
    elif kind == "评论数":
        data = get_data_by_kind(rawData,"commentNum")
    elif kind == "收藏数":
        data = get_data_by_kind(rawData,"collectionNum")
    elif kind == "赞数":
        data = get_data_by_kind(rawData,"likeNum")
    else:
        data = get_data_by_kind(rawData,"caiNum")
    return jsonify(status="success", data=data)

'''
功能: 通过类型名（hitNum、commentNum、collectionNum、likeNum、caiNum）和数据库中原始数据
      把数据重新存储到cartoonList的结构中
input: {rawData,kind}
output: 
    [
        {
            "镖人": [1,2],
            "date":["2016-07-04 22:00:00","2016-07-04 22:05:22"]
        },
        {
            "brave": [3,56],
            "date":["2016-07-04 22:00:00","2016-07-04 22:05:22"]
        }
    ]
'''
def get_data_by_kind(rawData, kind):

    #把数据存储为cartoonList = [{"镖人":[1,2],"date":["2016-07-04 22:00:00","2016-07-04 22:05:22"]},{"brave":[3,56],"date":["2016-07-04 22:00:00","2016-07-04 22:05:22"]}]的形式
    
    cartoonList = []
    for single in rawData:
        #logging.error(print(single['name']))
        hasSaved = 0;
        for cartoon in cartoonList:
            if single['name'] in cartoon:
                cartoon[single['name']].append(single[kind])
                cartoon['date'].append(single['crawlTime'].split( )[0])
                hasSaved = 1
                break
        if hasSaved == 0:
            d = dict()
            kindNum = [single[kind]]
            date = [single['crawlTime'].split( )[0]]
            d[single['name']] = kindNum
            d['date'] = date
            cartoonList.append(d)
    #logging.info(print(cartoonList))
    return cartoonList



'''
url: "/api/info/comment"
type: post
功能: 通过页码、网站名和作品名查找数据库中对应的评论内容
input: {page,webName,cartoonName}
output: 
{
    status: "success",
    pager: 
    {
        'page': 1,
        'pages': 2,
        'comments': [object,object,object] #object详见models中的Comment数据结构
    }
}
'''
@app.route("/api/info/comment", methods=["POST"])
def list_comment():
    page = request.form.get("page")
    webName = request.form.get("webName")
    cartoonName = request.form.get("cartoonName")
    if cartoonName == 'All' and webName == "All":
        paginator = Comment.objects().order_by('-commentTime').paginate(page=int(page), per_page=20)
    elif cartoonName == 'All' and webName != 'All':
        paginator = Comment.objects(webName__contains=webName).order_by('-commentTime').paginate(page=int(page), per_page=20)
    elif cartoonName != 'All' and webName == 'All':
        paginator = Comment.objects(name__contains=cartoonName).order_by('-commentTime').paginate(page=int(page), per_page=20)
    else:
        paginator = Comment.objects(webName__contains=webName, name__contains=cartoonName).order_by('-commentTime').paginate(page=int(page), per_page=20)
    pager = {
        'page': paginator.page,
        'pages': paginator.pages,
        'comments': [m.to_json() for m in paginator.items]
    }
    return jsonify(status="success", pager=pager)