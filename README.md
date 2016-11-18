# cartoonDataShow
从各大动漫网站抓取到数据后存储在mongodb中，然后用python(flask)提供的路由和接口，在前端用react+echarts进行数据展示

* 运行环境python3.4、mongodb
* 配置方法：
 * windows用户可以在目录下执行python -m venv flask，得到flask框架然后再通过flask\Scripts\activate.bat或flask\Scripts\activate进入virtualenv虚拟环境。
 * 执行npm install，安装js依赖包，再执行pip install -r requirements.txt安装项目所需的python库，此时，你已经具备了运行整个工程的前提，然后再执行python run.py，通过访问localhost:5000就可以访问了

#####因为一开始就需要登陆，所以可以先进http://localhost:5000/signup 进行注册