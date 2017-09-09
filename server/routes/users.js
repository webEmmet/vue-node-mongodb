var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
require('./../util/util');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next)=>{
  let params = {
    userId: Math.floor(Math.random()*100000000),
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne({userName: params.userName}, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });   
    } else if (doc){
      res.json({
        status: '2',
        msg: '该用户名已被使用',
        result: ''
      })
    } else {
      User.create(params, (err1, doc1)=>{
        if (err) {
          res.json({
            status: '1',
            msg: err1.message
          });   
        } else{
          res.cookie('userId', params.userId, {
            path: '/',
            maxAge: 1000*60*60
          });
          res.cookie('userName', params.userName, {
            path: '/',
            maxAge: 1000*60*60
          });
          res.json({
            status: '0',
            msg: '您已成功注册',
            result: doc1
          });
        }
      });
    }
  });
});

router.post('/login', (req, res, next)=>{
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });   
    } else {
      res.cookie('userId', doc.userId, {
        path: '/',
        maxAge: 1000*60*60
      });
      res.cookie('userName', doc.userName, {
        path: '/',
        maxAge: 1000*60*60
      });
      res.json({
        status: '0',
        msg: '',
        result: doc
      })
    }
  })
});

router.post('/logout', (req, res, next)=>{
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  });
});

// 检查是否登录
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userName) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

// 获取购物车列表
router.get('/cartlist', (req, res, next)=>{
  var userId = req.cookies.userId;
  console.log(userId);
  User.findOne({userId: userId},(err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        });
      }
    }
  });
});

// 购物车删除
router.post('/cartDel', (req, res, next)=>{
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  
  User.update({userId: userId}, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        message: err.message
      })
    } else {
      res.json({
        status: '0',
        message: '',
        result: 'suc'
      });
    }
  });
});

// 购物车数量编辑
router.post('/cartEdit', (req, res, next)=>{
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({'userId': userId, 'cartList.productId':productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  });
});

// 购物车全选
router.post('/editCheckAll', (req, res, next)=>{
  var userId = req.cookies.userId;
  var checkAll = req.body.checkAll === true ? '1' : '0';
  User.findOne({userId: userId}, (err, user)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (user) {
        user.cartList.forEach(function(item) {
          item.checked = checkAll;
        }, this);
        user.save((err,doc)=>{
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
      
    }
  });
});

// 获取购物车商品数量
router.get('/getCartCount', (req, res, next)=>{
  if (req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, (err, doc)=>{
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        var cartCount = 0;
        doc.cartList.forEach((item)=>{
          cartCount += parseInt(item.productNum);
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        });
      }
    });
  }
});

// 获取地址列表
router.get('/addressList', (req, res, next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      });
    }
  });
});

// 增加地址信息
router.post('/addAddress', (req, res, next)=>{
  var userId = req.cookies.userId;
  let object = {
    addressId: req.body.addressId,
    userName: req.body.userName,
    streetName: req.body.streetName,
    postCode: req.body.postCode,
    tel: req.body.tel
  }
  User.findOne({userId: userId}, (err1, doc) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message,
        result: ''
      });
    } else {
      object.isDefault = false;
      doc.addressList.push(object);
      doc.save((err, doc1)=>{
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: doc1
          });
        }
      });
    }
  });
});

// 获取地址信息接口
router.get('/getAddressInfo', (req, res, next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      });
    }
  });
});

// 删除地址信息接口
router.post('/delAddress', (req, res, next)=>{
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  console.log(111)
  User.update({userId: userId}, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      });
    }
  });  
});

// 设置默认收货地址接口
router.post('/setDefaultAddress', (req, res, next)=>{
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.findOne({userId: userId}, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        doc.addressList.forEach((item) => {
          if (item.addressId === addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });
        doc.save((err1, suc)=>{
          if (err) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
    }
  });
});

// 生成订单
router.post('/payment', (req, res, next)=>{
  var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;
  User.findOne({userId: userId}, (err, doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var address = '',goodList = [];
      // 获取当前用户的地址信息
      doc.addressList.forEach((item)=>{
        if (addressId === item.addressId) {
          address = item;
        }
      });
      // 获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if (item.checked === '1') {
          goodList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random()*10+Math.random()*10);
      var r2 = Math.floor(Math.random()*10+Math.random()*10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform + r1+sysDate+r2;

      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodList: goodList,
        orderStatus: '1',
        createDate: createDate
      }
      doc.orderList.push(order);
      doc.save((err1, doc)=>{
        if(err1){
            res.json({
              status:"1",
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            });
          }
      });
    }
  });
});

//订单成功页面
router.get('/paymentSuc', (req, res, next)=>{
  var userId = req.cookies.userId;
  var orderId = req.query.orderId;
  console.log(orderId);
  User.findOne({userId: userId}, (err, doc)=>{
    if (err) {
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    } else {
      var orderTotal = '';
      doc.orderList.forEach((item)=>{
        if (item.orderId === orderId) {
          orderTotal = item.orderTotal;
          res.json({
            status:"0",
            msg:'',
            result:{
              orderId: orderId,
              orderTotal: orderTotal
            }
          });
        }
      });
    }
  });
}); 

module.exports = router;
