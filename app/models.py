from app import app
from app import db
from datetime import datetime
from flask.ext.login import UserMixin

class Info(db.Document):
    name = db.StringField()
    webName = db.StringField()
    hitNum = db.IntField()
    commentNum = db.IntField()
    collectionNum = db.IntField()
    caiNum = db.IntField()
    likeNum = db.IntField()
    url = db.StringField()
    crawlTime = db.StringField()

    def to_json(self):
        return {
            'cartoonName': self.name,
            'webName': self.webName,
            'hitNum': self.hitNum,
            'commentNum': self.commentNum,
            'caiNum': self.caiNum,
            'likeNum': self.likeNum,
            'collectionNum': self.collectionNum,
            'crawlTime': self.crawlTime
        }
class Info_increment(db.Document):
    name = db.StringField()
    webName = db.StringField()
    hitNum = db.IntField()
    commentNum = db.IntField()
    collectionNum = db.IntField()
    caiNum = db.IntField()
    likeNum = db.IntField()
    url = db.StringField()
    crawlTime = db.StringField()

    def to_json(self):
        return {
            'cartoonName': self.name,
            'webName': self.webName,
            'hitNum': self.hitNum,
            'commentNum': self.commentNum,
            'caiNum': self.caiNum,
            'likeNum': self.likeNum,
            'collectionNum': self.collectionNum,
            'crawlTime': self.crawlTime
        }

class Comment(db.Document):
    name = db.StringField()
    webName = db.StringField()
    author = db.StringField()
    avatar = db.StringField()
    sex = db.IntField()#暂时用，以后会去掉
    content = db.StringField()
    commentTime = db.StringField()
    crawlTime = db.StringField()
    def to_json(self):
        return {
            'cartoonName': self.name,
            'webName': self.webName,
            'author': self.author,
            'content': self.content,
            'commentTime': self.commentTime,
            'sex': self.sex,  #暂时用，以后会去掉
            'avatar': self.avatar,
            'crawlTime': self.crawlTime
        }

class User(db.Document, UserMixin):
    username = db.StringField(unique=True)
    password = db.StringField()
    #active = db.BooleanField(default=True)
    def get_id(self):
        return self.username
        