<template>
  <div id="app border-1px">
    <v-header :seller="seller"></v-header>

    <div class="tab">
      <div class="tab-item"><router-link to="/goods" class="tab-item">商品</router-link></div>
      <div class="tab-item"><router-link to="/ratings" class="tab-item">评论</router-link></div>
      <div class="tab-item"><router-link to="/seller" class="tab-item">卖家</router-link></div>
    </div>

    <keep-alive><router-view :seller="seller"></router-view></keep-alive>

  </div>
</template>

<script>
import axios from 'axios'
import header from './components/header/header.vue'
import {urlParse} from './common/js/util'
import Vue from 'vue'
export default {
  name: 'App',
  data() {
    return{
      seller:{
        // id: (() => {
        //   let queryParam = urlParse();
        //   return queryParam.id;
        // })()
      }
    }
  },
  components: {
    'v-header':header
  },
  created() {
    //do something after creating vue instance

    axios.get('http://localhost:3000/seller').then((response)=>{
      this.seller=response.data;
      // this.seller = Object.assign({}, this.seller, response.data);

      //console.log(this.seller)
    });
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a//相当于 tab-item.a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
