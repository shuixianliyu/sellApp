<template>
<div class="seller" ref="seller">
  <div class="seller-content">
    <div class="overview">
      <h1 class="title">{{seller.name}}</h1>
      <div class="desc border-1px">
        <star :size="36" :score="seller.score"></star>
        <span class="ratingCount">({{seller.ratingCount}})</span>
        <span class="sellCount">月售{{seller.sellCount}}单</span>
      </div>
      <div class="remark">
        <ul class="ul">
          <li class="item">
            <h2>起送价</h2>
            <div class="detail"><span class="big-font">{{seller.minPrice}}</span>元</div>
          </li>
          <li class="item">
            <h2>商家配送</h2>
            <div class="detail"><span class="big-font">{{seller.deliveryPrice}}</span>元</div>
          </li>
          <li class="item">
            <h2>平均配送时间</h2>
            <div class="detail"><span class="big-font">{{seller.deliveryTime}}</span>分钟</div>
          </li>
        </ul>
      </div>
      <div class="favorite">
        <span class="icon-favorite" :class="{'active':fold}" @click="choose"></span>
        <span class="text">{{favoriteText}}</span>
      </div>
    </div>
    <split></split>
    <div class="bulletin">
      <h1>公告与活动</h1>
      <p class="border-1px">{{seller.bulletin}}</p>
      <ul v-if="seller.supports" class="content">
        <li v-for="(item,index) in classMap" :key="index" class="every border-1px">
          <span class="icon" :class="item"></span>
          <span class="text">{{seller.supports[index].description}}</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="pics" v-show="seller.pics">
      <h1>商家实景</h1>
      <div class="pic-wrapper" ref="pic">
        <ul ref="ul">
          <li v-for="(item,index) in seller.pics" :key="index">
            <img :src="item" width="120" height="90">
          </li>
        </ul>
      </div>
    </div>
    <split></split>
    <div class="infos" v-show="seller.infos">
      <h1>商家信息</h1>
      <ul>
        <li  v-for="(item,index) in seller.infos" :key="index">{{item}}</li>
      </ul>
    </div>
  </div>
  <shopcart ref="shopCart" :selectFoods="foodsSelect" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
</div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
  import {setStorage, readStorage} from '../../common/js/store'
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
              selectFoods:[],
            fold:(() => {
                  return readStorage(this.seller.id, 'favorite', false)
            })()
          }
    },
    computed:{
          favoriteText () {
            return this.fold?'已收藏':'收藏';
          }
    },
    created () {
      this.classMap=['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch:{
          seller () {
//              seller数据更新DOM渲染还要时间必须延迟回调
              this.$nextTick(() => {
                this._initScroll();
                this._initPics();
              })
          }
    },
    methods:{
          choose (e) {
              if (!e._constructed) {
                  return
              }
              this.fold=!this.fold;
              setStorage(this.seller.id, 'favorite', this.fold);
              console.log(window.localStorage._seller_);
          },
          _initScroll () {
            this.scroll = new BScroll(this.$refs.seller, {
              click: true
            })
          },
          _initPics () {
              if (this.seller.pics) {
                let imgWidth=120;
                let margin=6;
                let width=(imgWidth+margin)*this.seller.pics.length-margin;
                this.$refs.ul.style.width=width+'px';
                  this.picScroll = new BScroll(this.$refs.pic, {
                    scrollX: true,
                    eventPassthrough: 'vertical'
                  });
              }
          }
    },
    components:{star, split, shopcart}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.seller
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .seller-content
    .overview
      padding 18px
      .title
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
      .desc
        display flex
        flex-direction row
        padding 8px 0 18px 0
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        color rgb(77,85,93)
        .ratingCount
          margin 0 12px 0 8px
          line-height 18px
          font-size 10px
        .sellCount
          font-size 10px
          line-height 18px
      .remark
        padding-top 18px
        .ul
          display flex
          flex-direction row
          .item
            flex 1
            flex-direction column
            text-align center
            border-right 1px solid rgba(7,17,27,0.1)
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            .detail
              margin-top 4px
              color rgb(7,17,27)
              .big-font
                font-size 24px
                line-height 24px
            &:last-child
              border 0
    .bulletin
      padding 0 18px
      h1
        margin-top 18px
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
      p
        padding 8px 12px 16px 12px
        font-size 12px
        line-height 24px
        color rgb(240,20,20)
        border-1px(rgba(7,17,27,0.1))
      .every
        padding 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .icon
          display inline-block
          width 16px
          height 16px
          margin-right 6px
          background-size 16px 16px
          background-repeat no-repeat
          vertical-align top
          &.decrease
            bg-image(decrease_4)
          &.discount
            bg-image(discount_4)
          &.guarantee
            bg-image(guarantee_4)
          &.invoice
            bg-image(invoice_4)
          &.special
            bg-image(special_4)
        .text
          font-size 12px
          line-height 16px
          color rgb(7,17,27)
    .pics
      padding 18px
      h1
        margin-bottom 12px
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        ul
          li
            display inline-block
            margin-right 6px
    .infos
      padding 18px
      color rgb(7,17,27)
      h1
        padding-bottom 12px
        border-1px(rgba(7,17,27,0.1))
        font-size 14px
        line-height 14px
      ul
        li
          padding 16px 12px
          border-1px(rgba(7,17,27,0.1))
          font-size 12px
          line-height 16px
    .favorite
      position absolute
      top 18px
      right 18px
      width 36px
      text-align center
      font-size 0
      .icon-favorite
        display block
        margin-bottom 4px
        font-size 24px
        line-height 24px
        color rgba(1,17,27,0.1)
        &.active
          color rgb(240,20,20)
      .text
        display block
        font-size 10px
        color rgb(77,85,93)
        line-height 10px
</style>
