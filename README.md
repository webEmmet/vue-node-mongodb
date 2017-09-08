说明
===
这是一个vue+node+mongodb的全栈项目
_____
1、前端采用的是vue2、vue-router、axios、ElementUi、基础vuex技术实现的商城页面，项目流程一目了然。适合入门练习以及更多的掌握vue2的大部分常用api，并初步使用vuex<br>

2、后台没有使用vue-cli自带的node服务器，而是自己用express搭建了一个node服务器，方便与自己所写得数据库进行结合，同时也是为了掌握接口上的一些知识，提升开发的技能以及调试能力<br>

3、数据库采用的是mongodb，自己添加了许多商品信息以及地址信息。目的是为了更多方面的了解前端整体的结构，为以后的提升打下基础。

4、如果对您有所帮助，您可以点击右上角“Star”支持一下<br>

项目运行（nodejs 6.0+）
_____

#克隆到本地
git clone 
或者download文件

#进入文件夹
cd vue-node-mongodb

#安装依赖
npm install

#开启mongodb
这里需要您先将db文件夹里的数据文件导入到mongodb中，并开启mongodb

#打开node服务器localhost:3000
node server/bin/www

#加载前端项目
npm run dev
