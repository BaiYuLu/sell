<template>
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
      <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
        <span class="text border-1px">
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
        </span>
      </li>
    </ul>
  </div>
  <div class="foods-wrapper" ref="foodsWrapper">
    <ul>
      <li v-for="item in goods" class="food-list food-list-hook" >
        <h1 class="title">{{item.name}}</h1>
        <ul>
          <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
            <div class="icon"><img width="57" height="57" :src="food.icon"></div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
              <div class="carcontrol-wrapper">
                <carcontrol :food="food"></carcontrol>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <shopcar ref="shopcar" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcar>
  <food :food="selectedFood" ref="food"></food>
</div>
</template>
<script>
import axios from 'axios'
import BScroll from 'better-scroll'
import shopcar from '.././shopcar/shopcar.vue'
import carcontrol from '.././carcontrol/carcontrol.vue'
import food from '.././food/food.vue'

export default {
  name: "",
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood:{}
    }
  },
  created() {
    axios.get('http://localhost:3000/goods').then(response => {
      this.goods = response.data;
      //console.log(this.goods);
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
      });
    })
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        //console.log(height1,height2)
        //console.log(this.scrollY)
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods(){
      let foods=[];
      this.goods.forEach(good=>{
        good.foods.forEach(food=>{
          if(food.count){
            foods.push(food);
          }
        });
      });
      return foods
    }
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true //better-scroll中默认false click事件
      });

      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3, //监听滚动位置
        click: true
      });
      this.foodsScroll.on('scroll', pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, ev) {
      if (!ev._constructed) {
        return; //防止pc端两次点击事件
      }
      //console.log(index);
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300); //实现单击menu右侧list滚动到相应位置
    },
    selectFood(food,ev){
      if (!ev._constructed) {
        return; //防止pc端两次点击事件
      }
      this.selectedFood=food
      this.$refs.food.show()
    }
  },
  components: {
    shopcar,
    carcontrol,
    food
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../.././common/stylus/mixin.styl'

  .goods
    display: flex
    overflow: hidden
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    .menu-wrapper
      flex: 0 0 80px //等分，内容缩放，占用空间
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table //多行垂直居中
        padding: 0 12px
        height: 54px
        width: 56px
        line-height: 14px
        &.current
          font-weight: 700
          background: #fff
          z-index: 10
          margin-top: -1px
          .text
            border-none()

        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
          font-size: 12px

    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc,.extra
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 149);
          .carcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px








</style>
