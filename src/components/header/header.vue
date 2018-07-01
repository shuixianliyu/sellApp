<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar"><img width="64" height="64" :src=seller.avatar></div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div  v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="detailshow">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="detailshow">
      <span class="bulletin"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper">
          <div class="detail-main">
            <h1>{{seller.name}}</h1>
            <star :size="48" :score="seller.score"></star>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="content">
              <li v-for="(item,index) in classMap" :key="index" class="every">
                <span class="icon" :class="item"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p>{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="close">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue'

  export default {
      props:{
          seller:{
              type:Object
          }
      },
      data () {
          return {
              detailShow:false
          }
    },
      methods:{
          detailshow:function () {
            this.detailShow=true
          },
          close:function () {
            this.detailShow=false
          }
    },
      created () {
          this.classMap=['decrease', 'discount', 'special', 'invoice', 'guarantee']
      },
      components:{star}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .header
    position relative
    background-color rgba(7,17,27.0.5)
    color rgb(255,255,255)
    overflow hidden
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        display inline-block
        margin-right 16px
        vertical-align top
        img
          border-radius 2px
      .content
        display inline-block
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            width 30px
            height 18px
            margin-right 6px
            bg-image(brand)
            background-size 30px 18px
            background-repeat no-repeat
            vertical-align top
          .name
            font-size 16px
            font-weight bold
            line-height 18px
        .description
          margin-bottom 10px
          font-size 12px
          line-height 12px
        .support
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin 0 4px 2px 0
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image(decrease_1)
            &.discount
              bg-image(discount_1)
            &.guarantee
              bg-image(guarantee_1)
            &.invoice
              bg-image(invoice_1)
            &.special
              bg-image(special_1)
          .text
            display inline-block
            font-size 10px
            line-height 12px
      .support-count
        position absolute
        right 12px
        bottom 14px
        height 24px
        padding 0 8px
        background-color rgba(0,0,0,0.2)
        line-height 24px
        border-radius 14px
        text-align center
        .count
          font-size 10px
          margin-right 2px
          vertical-align top
        .icon-keyboard_arrow_right
          font-size 10px
          line-height 24px
    .bulletin-wrapper
      position relative
      padding 0 22px 0 12px
      height 28px
      line-height 28px
      background-color rgba(7,17,27,0.2)
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      .bulletin
        display inline-block
        width 22px
        height 12px
        margin-top 8px
        background-size 22px 12px
        bg-image(bulletin)
        background-repeat no repeat
        vertical-align top
      .bulletin-text
        font-size 10px
        margin 0 4px
        /*vertical-align top*/
      .icon-keyboard_arrow_right
        position absolute
        right 12px
        line-height 28px
        font-size 10px

    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      overflow auto
      z-index 100
      background rgba(7,17,27,0.8)
      .detail-wrapper
        min-height 100%
        overflow hidden
        .detail-main
          margin-top 64px
          padding-bottom 64px
          h1
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
          .star
            padding 2px 0
            margin 16px auto 0 auto
            text-align center
          .title
            display flex
            width 80%
            margin 28px auto 24px
            .line
              position relative
              top -6px
              flex 1
              border-bottom 1px solid rgba(255,255,255,0.2)
            .text
              padding 0 12px
              font-size 14px
          .content
            width 80%
            margin 0 auto
            font-size 0
            .every
              margin 0 12px 12px 12px
              &:last-child
                margin-bottom 0
              .icon
                display inline-block
                width 16px
                height 16px
                margin-right 6px
                background-size 16px 16px
                background-repeat no-repeat
                vertical-align top
                &.decrease
                  bg-image(decrease_2)
                &.discount
                  bg-image(discount_2)
                &.guarantee
                  bg-image(guarantee_2)
                &.invoice
                  bg-image(invoice_2)
                &.special
                  bg-image(special_2)
              .text
                font-size 12px
                line-height 16px
          .bulletin
            box-sizing border-box
            width 80%
            padding 0 12px
            margin 0 auto
            font-size 12px
            line-height 24px
      .detail-close
        width 32px
        height 32px
        margin -64px auto 0 auto
        font-size 32px
    .fade-enter-active,.fade-leave-active
      transition all 0.4s
    .fade-enter,.fade-leave-to
      background rgba(7,17,27,0)
</style>
