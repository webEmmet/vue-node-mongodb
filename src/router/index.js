import Vue from 'vue';
import Router from 'vue-router';
import GoodList from '../components/views/GoodList';
import Cart from '../components/views/Cart';
import Address from '../components/views/Address';
import orderConfirm from '../components/views/orderConfirm';
import orderSuccess from '../components/views/orderSuccess';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: orderSuccess
    }
  ]
});
