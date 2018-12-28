<template>
<div class="shopcar">
  <div class="content" @click="toggleList">
    <div class="content-left">
      <div class="logo-wrapper">
        <div class="logo" :class="{'highlight':totalCount>0}">
          <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
        </div>
        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
      </div>
      <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
      <div class="desc">另需配送费￥{{this.deliveryPrice}}元</div>
    </div>
    <div class="content-right" @click.stop.prevent="pay">
      <div class="pay" :class="payClass">
        {{payDesc}}
      </div>
    </div>
  </div>
  <div class="ball-container">
    <transition-group name="drop" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball" v-for="ball in balls" :key="ball.id" v-show="ball.show">
        <div class="inner inner-hook"></div>
      </div>
    </transition-group>
  </div>
  <transition tag="div" name="fade">
    <div class="shopcar-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="list-content">
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="carcontrol-wrapper">
              <carcontrol :food="food"></carcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
  <transition name="mask-fade">
    <div class="list-mask" @click="hide" v-show="listShow"></div>
  </transition>
</div>
</template>
<script>
import carcontrol from '.././carcontrol/carcontrol.vue'
import BScroll from 'better-scroll'
import { eventBus } from '../../event-bus'

export default {
  data() {
    return {
      balls: [{
          show: false,
          id: 1
        },
        {
          show: false,
          id: 2
        },
        {
          show: false,
          id: 3
        },
        {
          show: false,
          id: 4
        },
        {
          show: false,
          id: 5
        },
      ],
      dropBalls: [],
      fold: true
    }
  },
  methods: {
    drop(el) {
      // console.log(el);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }

      // let ball = this.balls.find(i=>!i.show)
      // ball.show = true
      // ball.el = el
      // this.dropBalls.push(ball)

      // console.log(ball)
    },
    hide() {
      this.fold = true;
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付成功,共计${this.totalPrice}元`);
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      })
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        // console.log('ball:',ball)
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect() //获取小球相当于视口位置
          // let rect = ball.rect
          let x = rect.left - 32; //32为小球的left偏移
          // console.log(x);
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
          //console.log(el)
        }
      }
      // console.log('over-----------------')
    },
    enter(el, done) {
      let rf = el.offsetHeight; //触发浏览器重绘
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
        el.addEventListener('transitionend', done); //执行执行监听，否则不会执行afterEnter
        //done();
      });
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    }
  },
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default () {
        return [{
          price: 10,
          count: 1
        }]; //设置默认值
      }
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `￥还差${diff}元起送`;
      } else {
        return '去结算';
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice)
        return 'not-enough'
      else
        return 'enough'
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs['list-content'], {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show
    }

  },
  components: {
    carcontrol
  },
  created () {
     // 优化体验，异步监听小球平抛动画
     this.$nextTick(() => {
       eventBus.$on('addcar', el=>{
         this.drop(el)
       })
     })
   }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

   @import '../.././common/stylus/mixin.styl'
  .shopcar
    position: fixed
    left: 0
    bottom: 0px
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color:rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27

          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background:#2b343c
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right:0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          font-size: 16px
          padding-right: 12px
          box-sizing: border-box
          border-right:1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          font-size: 12px
          text-align: center
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        // background-color red
        .inner
          width 15px
          height 15px
          border-radius 50%
          background-color #00A0DC
          transition all 0.4s linear
        &.drop-enter-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
    .shopcar-list
      position: absolute
      top: 0
      left: 0
      z-index:-1
      width: 100%
      transform translate3d(0, -100%, 0)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s linear
        transform translate3d(0, -100%, 0) //每个表项相对于当前自身的高度做一个偏移
      &.fade-enter, &.fade-leave-to
        transform translate3d(0, 0, 0)

      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27);
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(7,17,27,0.1)
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .carcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
    .list-mask
      position: fixed
      max-width: 540px
      top: 0
      left: 0
      right: 0
      margin: 0 auto
      width: 100%
      height: 100%
      background: rgba(7,17,27,.6)
      backdrop-filter: blur(10px)
      z-index: -2;
      opacity: 1
      &.mask-fade-enter-active, &.mask-fade-leave-active
        transition: all 0.3s
      &.mask-fade-enter, &.mask-fade-leave-to
        opacity: 0








</style>
