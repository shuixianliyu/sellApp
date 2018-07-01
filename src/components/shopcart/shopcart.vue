<template>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart"></i>
            </div>
            <div class="number" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">
            ￥{{totalPrice}}
          </div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball"  v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="hideList"></div>
      </transition>
    </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import BScroll from 'better-scroll'

  export default{
    props:{
      selectFoods:{
          type:Array,
          default () {
              return []
          }
      },
      deliveryPrice:{
          type:Number,
          default: 0
      },
      minPrice:{
          type: Number,
          default:0
      }
    },
    data () {
        return {
          balls: [
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            }
          ],
          dropBalls: [],
          fold: false
        }
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
        listShow () {
          return this.fold;
        }
    },
    watch: {
      totalCount () {
        if (!this.totalCount) {
          this.fold = false;
        }
      },
      fold () {
        let show = this.fold;
        if (show) {
            this.$nextTick(() => {
                if (!this.scroll) {
                  this.scroll = new BScroll(this.$refs.listContent, {
                    click: true
                  })
                } else {
                    this.scroll.refresh();
                }
            })
        }
      }
    },
    methods: {
      drop (el) {
          for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if (!ball.show) {
              ball.show = true;
              ball.el = el;
              this.dropBalls.push(ball);
              return;
            }
          }
        },
      beforeDrop (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping (el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList () {
        if (this.totalCount>0) {
          this.fold = !this.fold;
        }
      },
      empty () {
            this.selectFoods.forEach((food) => {
                food.count=0;
            })
      },
      hideList () {
          this.fold=false;
      },
      pay () {
          if (this.totalPrice<this.minPrice) {
              return;
          }
          window.alert(`支付${this.totalPrice}元`)
      }
    },
    components: {cartcontrol}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .shopcart
    position fixed
    bottom 0
    width 100%
    height 44px
    z-index 99
    background-color #141d27
    .content
      display flex
      font-size 0
      color rgba(255,255,255,0.4)
      font-weight 700
      .content-left
        flex 1
        font-size 0
        height 44px
        .logo-wrapper
          position relative
          top -14px
          display inline-block
          width 56px
          height 56px
          margin 0 12px
          padding 6px
          box-sizing border-box
          border-radius 50%
          background-color #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            font-size 24px
            line-height 44px
            background-color #2b343c
            color rgba(255,255,255,0.4)
            text-align center
            &.highlight
              background rgb(0,160,220)
              color #fff
          .number
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display inline-block
          font-size 16px
          vertical-align top
          margin-top 10px
          line-height 24px
          padding-right 12px
          border-right 1px solid rgba(255,255,255,0.1)
          &.highlight
            color #fff
        .desc
          display inline-block
          font-size 12px
          line-height 24px
          vertical-align top
          margin 10px 12px 0 12px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 44px
          font-size 12px
          line-height 44px
          text-align center
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translate3d(0,-100%,0)
      color rgb(7,17,27)
      &.fold-enter-active,&.fold-leave-active
        transition all 0.4s
      &.fold-enter,&.fold-leave-to
        transform translate3d(0,0,0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        border-bottom 1px solid rgba(7,17,27,0.1)
        background #f3f5f7
        .title
          float left
          font-size 14px
          line-height 40px
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
          line-height 40px
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          height 48px
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            font-size 14px
            line-height 24px
            color rgb(7,17,27)
          .price
            position absolute
            top 12px
            right 90px
            margin-right 6px
            line-height 24px
            font-size 14px
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            top 6px
            right 0
            font-size 14px
            line-height 24px
    .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index -2
      background rgba(7,17,27,0.6)
      filter blur(10px)
      &.fade-enter-active,&.fade-leave-active
        transition all 0.4s
      &.fade-enter,&.fade-leave-to
        background rgba(7,17,27,0)
</style>
