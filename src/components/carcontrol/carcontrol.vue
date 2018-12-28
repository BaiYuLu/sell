<template>
  <div class="carcontrol">
    <transition name="move">
      <div class="car-decrease" v-show="food.count>0" @click.stop.prevent="descCar($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="car-content" v-show="food.count>0">{{food.count}}</div>
    <div class="car-add icon-add_circle" @click.stop.prevent="addCar($event)"></div>
  </div>
</template>
<script>
import Vue from 'vue';
import { eventBus } from '../../event-bus'

export default {
  props:{
    food:{
      type:Object
    }
  },
  methods: {
    addCar(event) {

      if (!event._constructed) {
        return; //防止pc端两次点击事件
      }
      else if(!this.food.count){
        // this.food.count=1;
        Vue.set(this.food,'count',1);
      }else{
        this.food.count++;
      }
      this.$nextTick(()=>{
        eventBus.$emit('addcar',event.target)
      })

      //console.log(this.food.count)
    },
    descCar(event){
      if (!event._constructed) {
        return; //防止pc端两次点击事件
      }
      else if (this.food.count) {
        this.food.count--;
      }

    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .carcontrol
    fint-size:0
    .car-decrease
      display: inline-block
      padding: 6px
      transition: all 0.4s linear
      &.move-enter-active,&.move-leave
        opacity: 1
        transform: translate3d(0,0,0)
      &.move-enter,&.move-leave-active
        opacity: 0
        transform: translate3d(24px,0,0)
        .inner
          transform: rotate(180deg)
      .inner
        display: inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
    .car-content
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .car-add
      display: inline-block
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
</style>
