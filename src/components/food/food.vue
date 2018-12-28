<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
          </div>
          <div class="carcontrol-wrapper">
            <carcontrol :food="food"></carcontrol>
          </div>
          <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count||food.count===0">
            加入购物车
          </div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @selecttype="selecttype" @content="content" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings&&food.ratings.length">
              <li v-for="rating in food.ratings"  v-show="needshow(rating.rateType,rating.text)" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-raing" v-show="!food.ratings||!food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import BScroll from 'better-scroll'
import carcontrol from '.././carcontrol/carcontrol.vue'
import Vue from 'vue'
import { eventBus } from '../../event-bus'
import split from '.././split/split.vue'
import ratingselect from '.././ratingselect/ratingselect.vue'
import {formatDate} from '../.././common/js/date'

const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;

export default {
  data(){
    return{
      showFlag:false,
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:'全部',
        positive:'推荐',
        negative:'吐槽'
      }
    }
  },
  props: {
    food:{
      type:Object
    }
  },
  methods:{
    show(){
      this.showFlag=true;
      this.selectType=ALL;
      this.onlyContent=true;
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll=new BScroll(this.$refs.food,{
            click:true
          });
        }else{
          this.scroll.refresh();
        }
      })
    },
    back(){
      this.showFlag=false
    },
    addFirst(ev){
      // console.log(1)
      if (!ev._constructed) {
        return; //防止pc端两次点击事件
      }else{
        eventBus.$emit('addcar',ev.target)
        Vue.set(this.food,'count',1);
      }
    },
    selecttype (type) {
       this.selectType = type
       // 手动刷新better-scroll重新计算页面高度
       this.$nextTick(() => {
         this.scroll.refresh()
       })
     },
     content () {
       // 手动刷新better-scroll重新计算页面高度
       this.onlyContent=!this.onlyContent
       this.$nextTick(() => {
         this.scroll.refresh()
       })
     },
     needshow(type,text){
       if(this.onlyContent&&!text){
         return false
       }else if(this.selectType==ALL){
         return true
       }else{
         return type===this.selectType
       }
     }
  },
  components: {
    carcontrol,
    split,
    ratingselect
  },
  filters: {
  formatDate (time) {
    let date = new Date(time)
    return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

@import '../.././common/stylus/mixin.styl'

.food
  position: fixed
  left:0
  top: 0
  bottom: 55px
  z-index: 30
  width: 100%
  background: #fff
  transform: translate3d(0,0,0)
  &.move-leave-active,&.move-enter-active
    transform: translate3d(0,0,0)
    transition: all 0.4s linear
  &.move-enter,&.move-leave-to
    transform: translate3d(100%,0,0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100% //高度为0 padding-top100%视觉上为宽高相等
    img
      position: absolute
      top: 0
      left: 0
      height: 100%
      width: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff
  .content
    position: relative
    padding: 18px
    .title
      margin-bottom: 8px
      font-size: 14px
      line-height: 14px
      font-weight: 700
      color: rgb(7,17,27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      font-size: 0
      .sell-count,.rating
        font-size: 10px
        color: rgb(147,153,159)
      .sell-count
        margin-right: 12px
    .price
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
        font-weight: 700
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 149);
        font-weight: 700
    .carcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      font-size: 10px
      background-color: rgb(0,160,220)
      color: rgb(255,255,255)
      border-radius: 12px
  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(77,85,93)
    .text
      line-height: 24px
      font-size: 12px
      padding: 0 8px
      font-weight: 200
      color: rgb(77, 85, 93)
  .rating
    padding-top:18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(77,85,93)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top::16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
      .no-raing
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)
</style>
