<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="raing">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @cartadd="add" :food="food"></cartcontrol>
          </div>
          <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count||food.count===0">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.info"></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent"
                        :ratings="food.ratings" :selectType="selectType"
                        :onlyContent="onlyContent" :desc="desc"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings&&food.ratings.length">
              <!--v-show="needShow(rating.ratingType,rating.text)"-->
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="(rating,index) in food.ratings" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime|formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div v-show="!food.ratings||!food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import Vue from 'vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../../common/js/date'

  const ALL=2;

export default {
    props:{
        food:{
            type:Object
        }
    },
    data () {
        return {
            showFlag:false,
            selectType:ALL,
            onlyContent:false,
          desc:{
            all:'全部',
            positive:'推荐',
            negative:'吐槽'
          }
        }
    },
    methods:{
        show () {
//            初始化状态
            this.showFlag=true;
            this.selectType=ALL;
            this.onlyContent=true;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll=new BScroll(this.$refs.food, {
                click:true
              })
            } else {
//              子元素或者父元素 DOM 结构发生改变的时候，必须重新调用 scroll.refresh() 方法重新计算来确保滚动效果的正常不用每次初始化
              this.scroll.refresh();
            }
          })
        },
        hide () {
          this.showFlag=false;
        },
        addFirst (event) {
            if (!event._constructed) {
                return;
            }
          this.$emit('cartadd', event.target);
          Vue.set(this.food, 'count', 1);
        },
      add (target) {
//            cartcontrol派发事件，food组件监听，并将派发事件的event.target传过来
        this.$emit('cartadd', target);
      },
        needShow (type, text) {
//            评论不显示
            if (this.onlyContent&&!text) {
                return false;
            }
//            评论显示根据上面选择评论类型后传过来的selectType与评论本身ratingType是否一致
            if (this.selectType===ALL) {
                return true;
            } else {
                return type===this.selectType;
            }
        },
        selectRating (type) {
//            等重新渲染DOM后
          this.selectType=type;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        toggleContent (content) {
            this.onlyContent=!content;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        }
    },
    filters:{
        formatDate (time) {
            let date=new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    components:{cartcontrol, split, ratingselect}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .food
    position fixed
    left 0
    top 0
    bottom 46px
    width 100%
    background #fff
    &.move-enter-active,&.move-leave-active
      transition all 0.4s linear
    &.move-enter,&.move-leave-to
      transform translate3d(100%,0,0)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      font-size 0
      .title
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
        line-height 14px
        margin-bottom 8px
      .detail
        font-size 0
        color rgb(147,153,159)
        height 10px
        line-height 10px
        margin-bottom 18px
        .sell-count
          margin-right 12px
          font-size 10px
        .rating
          font-size 10px
      .price
        font-weight 700
        line-height 24px
        .now
          font-size 14px
          color rgb(240,20,20)
          margin-right 8px
          line-height 24px
        .old
          font-size 10px
          color rgb(147,153,159)
          text-decoration line-through
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        height 24px
        padding 0 12px
        box-sizing border-box
        line-height 24px
        font-size 10px
        color #fff
        text-align center
        border-radius 12px
        background rgb(0,160,220)
        z-index 10
    .info
      padding 18px
      font-size 0
      .title
        font-size 14px
        color rgb(7,17,27)
        line-height 14px
        margin-bottom 6px
      .text
        font-size 12px
        color rgb(77,85,93)
        line-height 24px
    .rating
      padding-top 18px
      font-size 0
      .title
        margin-left 18px
        font-size 14px
        color rgb(7,17,27)
        line-height 14px
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            top 16px
            right 0
            font-size 0
            line-height 12px
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147,153,159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right 4px
              line-height 16px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
</style>
