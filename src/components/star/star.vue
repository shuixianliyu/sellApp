<template>
  <div class="star" :class="starType">
    <span v-for="(item,index) in arrstar" :class="item" class="star-item" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const Length=5;
  const on='on';
  const half='half';
  const off='off';

export default{
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed:{
        starType () {
            return 'star-'+this.size
        },
        arrstar () {
            let result=[];
            let zs=Math.floor(this.score);
            let xs=Math.floor(this.score-zs);
            for (let i=0; i<zs; i++) {
                result.push(on);
            }
            if (xs>=0.5) {
                result.push(half);
            }
            while (result.length<Length) {
                result.push(off);
            }
            return result;
      }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image(star48_on)
        &.half
          bg-image(star48_half)
        &.off
          bg-image(star48_off)
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image(star48_on)
        &.half
          bg-image(star48_half)
        &.off
          bg-image(star48_off)
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image(star48_on)
        &.half
          bg-image(star48_half)
        &.off
          bg-image(star48_off)

</style>
