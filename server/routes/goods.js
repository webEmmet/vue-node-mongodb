var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var goods = require('../models/goods');

// 链接mongodb数据库
mongoose.connect('mongodb://localhost:27017/dumall');

mongoose.connection.on('connected',()=>{
    console.log("MongoDB connected success");
});

mongoose.connection.on('error',()=>{
    console.log("MongoDB connected fail");
});

mongoose.connection.on('disconnected',()=>{
    console.log("MongoDB connected disconnected");
});

// 查询商品列表
router.get("/list", (req, res, next)=>{
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let sort = req.query.sort;
    let params = {};
    let skip = (page - 1)*pageSize;
    let priceLevel = req.query.priceLevel;
    var priceGt = '';
    var priceLte = '';
    if (priceLevel !== 'all') {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 500; break;
            case '1': priceGt = 500; priceLte = 1000; break;
            case '2': priceGt = 1000; priceLte = 2000; break; 
            case '3': priceGt = 2000; priceLte = 5000; break;             
        }
        params={
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }

    let goodsModel = goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec((err, doc)=>{
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

// 加入到购物车
router.post('/addCart',(req, res, next)=>{
    var userId = req.cookies.userId;
    var productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({
        userId:userId
    },(err, userDoc)=>{
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach(function(item) {
                    if (item.productId === productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save((err2, doc2)=>{
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status:'0',
                                msg:'',
                                result:'suc'
                            })
                        }
                    });
                } else {
                    goods.findOne({productId:productId},(err1, doc)=>{
                        if (err1) {
                            res.json({
                                status: '1',
                                msg: err1.message
                            });
                        } else {
                            if (doc) {
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save((err2, doc2)=>{
                                    if (err2) {
                                        res.json({
                                            status: '1',
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:'suc'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
});

module.exports = router;
