<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @selecttype="selecttype" @content="content" :selectType="selectType" :onlyContent="onlyContent"  :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" v-show="needshow(rating.rateType,rating.text)" class="rating-item">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content-wrapper">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="rating-time">
                {{rating.rateTime|formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import split from '.././split/split.vue'
import {formatDate} from '../.././common/js/date'
import star from '.././star/star.vue'
import ratingselect from '.././ratingselect/ratingselect.vue'
import axios from 'axios'

const ALL = 2;

export default {
  props: {
    seller:{
      type:Object
    },
  },
  components: {
    star,
    split,
    ratingselect
  },
  data() {
    return {
      ratings:[],
      selectType:ALL,
      onlyContent:true,
    }
  },
  methods: {
    selecttype(type) {
      this.selectType=type
      this.$nextTick(()=>{
        this.ratingScroll.refresh()
      })
    },
    content() {
      this.onlyContent=!this.onlyContent
      this.$nextTick(()=>{
        this.ratingScroll.refresh()
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
  created() {
    //do something after creating vue instance
    axios.get('http://localhost:3000/ratings').then(response=>{
      this.ratings=response.data;
      this.$nextTick(() => {
      if (!this.ratingScroll) {
        this.ratingScroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      } else {
        this.ratingScroll.refresh()
      }
    })
      // console.log(response)
    })
  },
  filters:{
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

  @import '../.././common/stylus/mixin.styl'

  .ratings
    position: absolute
    top:174px
    bottom: 0
    width: 100%
    left: 0
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 30%
        padding: 6px 0
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          font-weight: 700
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          font-weight: 700
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding-left: 24px
        .score-wrapper
          margin-bottom:8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            font-size: 12px
            font-weight: 700
            color: rgb(7, 17, 27)
            vertical-align: top
          .star
            margin: 0 12px
            display: inline-block
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            font-size: 12px
            font-weight: 700
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            font-weight: 700
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding:0 18px
      .rating-item
        position: relative
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content-wrapper
          flex: 1
          .name
            font-size: 10px
            line-height: 12px
            color: rgb(7,17,27)
            margin-bottom: 4px
          .star-wrapper
            font-size: 0
            margin-bottom: 6px
            .star
              display: inline-block
              margin-right: 6px
            .time
              font-size: 10px
              font-weight: 200
              color: rgb(147,153,159)
              line-height: 12px
          .text
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
            margin-bottom: 8px
          .recommend
            font-size: 0
            .icon-thumb_up
              display: inline-block
              font-size: 12px
              color: rgb(0,160,220)
              line-height: 16px
            .icon-thumb_down
              display: inline-block
              font-size: 12px
              color: rgb(183,187,191)
              line-height: 16px
            .item
              display: inline-block
              padding: 0 6px
              margin: 0 0 4px 8px
              font-size: 9px
              line-height: 16px
              color: rgb(147,153,159)
              border: 1px solid rgba(7,17,27,0.1)
          .rating-time
            position: absolute
            right: 18px
            top:18px
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)

</style>
