<template>
<div class="ratings" ref="ratings">
  <div>
    <div class="rating-content">
      <div class="left">
        <div class="score">{{seller.score}}</div>
        <div class="text">综合评分</div>
        <div class="percent">高于周边商家{{seller.rankRate}}%</div>
      </div>
      <div class="right">
        <div class="deliveryTime">
          <span class="title">服务态度</span>
          <span class="starType" ><star :size="36" :score="seller.serviceScore"></star></span>
          <span class="serviceScore">{{seller.serviceScore}}</span>
        </div>
        <div class="deliveryTime">
          <span class="title">商品评分</span>
          <span class="starType" ><star :size="36" :score="seller.foodScore"></star></span>
          <span class="serviceScore">{{seller.foodScore}}</span>
        </div>
        <div class="deliveryTime">
          <span class="title">送达时间</span>
          <span class="time">{{seller.deliveryTime}}分钟</span></div>
      </div>
    </div>
    <split></split>
    <ratingselect @select="selectRating" @toggle="toggleContent"
                  :ratings="ratings" :selectType="selectType"
                  :onlyContent="onlyContent" ></ratingselect>
    <div class="rating-wrapper">
      <ul v-show="ratings.length">
        <li class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index">
          <div class="user">
            <div class="pic"><img class="avatar" :src="rating.avatar" width="28" height="28"></div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <span class="star"><star :size="36" :score="rating.score"></star></span>
              <span v-show="rating.deliveryTime" class="delivery">{{rating.deliveryTime}}分钟送达</span>
              <p v-show="rating.text" class="text">{{rating.text}}</p>
              <div class="list">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <ul v-show="rating.recommend.length" class="recommend">
                  <li v-for="(recommend,index) in rating.recommend" :key="index" class="recommend-item">
                    {{recommend}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="time">{{rating.rateTime|formatDate}}</div>
        </li>
      </ul>
      <div v-show="!ratings||!ratings.length">暂无评价</div>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../../common/js/date'
  const ALL=2;

  export default{
      props:{
          seller:{
              type:Object
          },
        foodsSelect:{
          type:Array
        }
      },
      data () {
        return {
          ratings:[],
          selectType:ALL,
          onlyContent:false
        }
      },
    created () {
      this.$http.get('/api/ratings').then(response => {
        response = response.body;
        if (response.errno === 0) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll=new BScroll(this.$refs.ratings, {
              click:true
            });
          })
        }
      })
    },
    methods:{
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
    components:{star, split, ratingselect}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.ratings
  position absolute
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .rating-content
    display flex
    flex-direction row
    padding 18px 0
    .left
      flex 0 0 137px
      border-right 1px solid rgba(7,17,27,0.1)
      text-align center
      @media only screen and (max-width :320px)
        flex 0 0 110px
      .score
        font-size 24px
        color rgb(255,153,0)
        line-height 28px
        margin-bottom 6px
      .text
        font-size 12px
        color rgb(7,17,27)
        line-height 12px
        margin-bottom 8px
      .percent
        font-size 10px
        color rgb(147,153,159)
        line-height 10px
        margin-bottom 6px
    .right
      flex 1
      padding-left 24px
      font-size 12px
      color rgb(7,17,27)
      @media only screen and (max-width :320px)
        padding-left 10px
      .deliveryTime
        margin-bottom 8px
        font-size 0
        .title
          font-size 12px
          color rgb(7,17,27)
          line-height 18px
        .starType
          display inline-block
          margin 0 12px
          line-height 0
          vertical-align top
        .serviceScore
          font-size 12px
          color rgb(255,153,0)
          line-height 18px
        .time
          margin-left 12px
          font-size 12px
          color rgb(147,153,159)
          line-height 18px
        &:last-child
          margin-bottom 0
  .rating-wrapper
    padding 0 18px
    .rating-item
      position relative
      padding 16px 0
      border-1px(rgba(7,17,27,0.1))
      .user
        display flex
        flex-direction row
        .pic
          .avatar
            margin-right 12px
            border-radius 50%
        .content
          font-size 0
          .name
            font-size 10px
            color rgb(7,17,27)
            line-height 12px
            margin-bottom 4px
          .star
            display inline-block
            margin 0 6px 6px 0
            vertical-align middle
          .delivery
            font-size 10px
            color rgb(147,153,159)
            line-height 12px
          .text
            font-size 12px
            color rgb(7,17,27)
            line-height 18px
          .list
            display flex
            flex-direction row
            margin-top 8px
            .icon-thumb_up,.icon-thumb_down
              margin-right 8px
              font-size 12px
              line-height 16px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
            .recommend
              .recommend-item
                display inline-block
                padding 0 6px
                margin-right 8px
                margin-bottom 4px
                font-size 9px
                color rgb(147,153,159)
                line-height 16px
                border 1px solid rgba(7,17,27,0.1)
                border-radius 2px
      .time
        position absolute
        top 16px
        right 0
        font-size 10px
        color rgb(147,153,159)
        line-height 12px
</style>
