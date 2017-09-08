<template>
    <div>
      <NavHeader></NavHeader>
      <NavBread>
        <span>Goods</span>
      </NavBread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods"> 
              Price 
              <svg class="icon icon-arrow-short">
                <use xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterBy">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur': checkAllPrice=='all'}" @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="(item,index) in filterPrice">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur': checkAllPrice == index}">{{item.startPrice}}-{{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                
                <ul>
                  <li v-for="item in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="/static/+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <img src="../../assets/loading-spinning-bubbles.svg" alt="Loading icon" v-show="loading"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <modal :loginAddCart="loginAddCart" @closeDialog="loginAddCart=false">
        <p slot="message">未登录,无法添加到购物车</p>
        <div slot="btnGroup" class="close-btn">
          <el-button  type="primary" @click="loginAddCart=false">关闭</el-button>
        </div>
      </modal>
      <modal :loginAddCart="addCartSuc" @closeDialog="addCartSuc=false">
        <p slot="message">
          <img src="../../../static/success.svg" class="success-icon" alt="Loading icon"/>
          成功添加购物车
          </p>
        <div slot="btnGroup" class="close-btn">
          <el-button type="success" @click="addCartSuc=false">继续购物</el-button>
          <el-button type="info" @click="toCart">查看购物车</el-button>
        </div>
      </modal>
      <NavFooter></NavFooter>
    </div>
</template>
<style>
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .close-btn{
    text-align: center;
  }
  .success-icon{
    width: 16px;
    height: 16px;
    padding-top: 3px;
  }
</style>

<script>
  import '../../assets/css/base.css';
  import '../../assets/css/product.css';
  import NavHeader from './../Header';
  import NavFooter from './../Footer';
  import NavBread from './../NavBread';
  import Modal from './../Modal';
  import api from 'axios';
  export default{
    data() {
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 6,
        busy: true,
        priceLevel: 'all',
        loading: false,
        filterPrice: [
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '2000.00'
          },
          {
            startPrice: '2000.00',
            endPrice: '5000.00'
          }
        ],
        checkAllPrice: 'all',
        filterBy: false,
        overLayFlag: false,
        loginAddCart: false,
        addCartSuc: false
      };
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    methods: {
      getGoodList(flag) {
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceLevel
        };
        this.loading = true;
        api.get('/goods/list', {
          params: param
        }).then((res) => {
          this.loading = false;
          if (res.data.status === '0') {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.data.result.list);
              if (res.data.result.count === 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.data.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        });
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page ++;
          this.getGoodList(true);
        }, 500);
      },
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodList();
      },
      showFilterBy() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      toCart() {
        this.$router.push({ path: `/cart` });
      },
      addCart(productId) {
        api.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          if (res.data.status === '0') {
            this.addCartSuc = true;
            this.$store.commit('updateCartCount', 1);
          } else {
            this.loginAddCart = true;
          }
        });
      },
      setPriceFilter(index) {
        this.checkAllPrice = index;
        this.page = 1;
        this.priceLevel = index;
        this.getGoodList();
        this.closePop();
      }
    },
    mounted() {
      this.getGoodList();
    }
  };
</script>

