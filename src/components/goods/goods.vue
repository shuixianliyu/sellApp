<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :key="index" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food ,index) in item.foods" class="food-item border-1px" :key="index" @click="selectFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @cartadd="_drop" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopCart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food @cartadd="_drop" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import food from '../food/food.vue'
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
          goods: [],
          listHeight:[],
          scrollY: 0,
          selectedFood:{}
        }
    },
    computed:{
      currentIndex () {
          for (let i=0; i<this.listHeight.length; i++) {
            let height1=this.listHeight[i];
            let height2=this.listHeight[i+1];
            if (!height2||(this.scrollY>=height1 && this.scrollY<height2)) {
                  return i;
            }
          }
          return 0;
      },
      selectFoods () {
          let foods=[];
          this.goods.forEach((good) => {
              good.foods.forEach((food) => {
                  if (food.count) {
                      foods.push(food)
                  }
              })
          })
          return foods;
      }
    },
    watch:{
      selectFoods () {
        this.$emit('selecfood', this.selectFoods);
      }
    },
    created () {
      this.$http.get('/api/goods').then(response => {
          response = response.body;
          if (response.errno === 0) {
            this.goods = response.data;
//            异步获取数据后DOM重新渲染，而这个过程是一个异步过程，要用到nextTick
            this.$nextTick(() => {
              this._initScroll();
              this._calculateHeight();
            });
          }
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods:{
        _initScroll () {
          this.menuScroll=new BScroll(this.$refs.menuWrapper, {
              click:true
          });
          this.foodsScroll=new BScroll(this.$refs.foodsWrapper, {
            probeType: 3,
            click:true
          });
          this.foodsScroll.on('scroll', (pos) => {
              this.scrollY=Math.abs(Math.round(pos.y));
          })
        },
        _calculateHeight () {
            let foodlist=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let height=0;
            this.listHeight.push(height);
            for (let i=0; i<foodlist.length; i++) {
                let item=foodlist[i];
                height+=item.clientHeight;
                this.listHeight.push(height);
            }
        },
        selectMenu (index, event) {
            if (!event._constructed) {
                return;
            }
            let foodlist=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            this.foodsScroll.scrollToElement(foodlist[index], 300);
        },
        _drop (target) {
          // 体验优化,异步执行下落动画
          this.$nextTick(() => {
            this.$refs.shopCart.drop(target);
          });
        },
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood=food;
        this.$refs.food.show();
      }
    },
    components:{shopcart, cartcontrol, food}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      .menu-item
        display table
        width 56px
        height 54px
        padding 0 12px
        font-size 12px
        line-height 14px
        background rgba(7,17,27,0.1)
        &.current
          position relative
          z-index 10
          margin-top -1px
          background-color #fff
          font-weight 700
          .text
            border-none()
        .text
          display table-cell
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image(decrease_3)
            &.discount
              bg-image(discount_3)
            &.guarantee
              bg-image(guarantee_3)
            &.invoice
              bg-image(invoice_3)
            &.special
              bg-image(special_3)
    .foods-wrapper
      flex 1
      .title
        height 26px
        line-height 26px
        padding-left 14px
        font-size 12px
        background-color #f3f5f7
        border-left 1px solid #d9dde1
        color ghb(147,153,159)
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        font-size 0
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 18px
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin-top 2px
            font-size 14px
            line-height 14px
            color rgb(7,17,27)
          .desc,
          .extra
            margin-top 8px
            font-size 10px
            line-height 12px
            color rgb(147,153,159)
            span
              margin-right 12px
          .price
            font-size 0
            line-height 24px
            font-weight 700
            color rgb(147,153,159)
            .now
              font-size 14px
              color rgb(240,20,20)
              margin-right 8px
            .old
              font-size 10px
              text-decoration line-through
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
