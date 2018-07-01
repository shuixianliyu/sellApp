<template>
<div class="cartcontrol">
  <transition name="translate">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
  </transition>
  <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  <div class="cart-add icon-add_circle" @click.stop.prevent="addCart">
  </div>
</div>
 </template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
export default {
    props:{
        food:{
            type:Object
        }
    },
    methods:{
        addCart (event) {
            if (!event._constructed) {
                return;
            }
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1);
            } else {
              this.food.count++;
            }
            this.$emit('cartadd', event.target);
        },
        decreaseCart (event) {
          if (!event._constructed) {
            return;
          }
          if (this.food.count) {
            this.food.count--;
          }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      transform translate3d(0,0,0)
      .inner
        display inline-block
        font-size 24px
        line-height 24px
        color rgb(0,160,220)
    .cart-count
      display inline-block
      width 24px
      height 12px
      vertical-align top
      padding-top 6px
      text-align center
      font-size 10px
      line-height 24px
      color rgb(147,153,159)

    .cart-add
      display inline-block
      padding 6px
      font-size 24px
      line-height 24px
      color rgb(0,160,220)
    .translate-enter-active,.translate-leave-active
      transition all 0.4s linear
      .inner
        transform rotate(0)
        transition all 0.4s linear
    .translate-enter,.translate-leave-to
      transform translate3d(24px,0,0)
      .inner
        transform rotate(180deg)
</style>
