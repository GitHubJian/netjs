<template>
    <div class="unlayout">
        <mheader/>
        <div class="main-verse">
            <div class="verse-title">早发白帝城</div>
            <div class="verse-auth">唐 ・ 李白</div>
            <div class="verse-content">朝辞白帝彩云间，
                <br>千里江陵一日还。
                <br>两岸猿声啼不住，
                <br>轻舟已过万重山。
                <br>
            </div>
            <div class="line-num">2/x</div>
        </div>
        <div class="prompt">请按上面的诗句给图片正确排序。</div>
        <div class="grey-bg">
            <div class="switch-container">
                <div class="vol">&nbsp;</div>
                <div
                    class="pic"
                    v-for="(item,index) in sort"
                    :class="{
                  'first-pic': item==1,
                  'second-pic': item==2,
                  'third-pic': item==3,
                  'forth-pic': item==4,
                  'selected':firstChoose>0&&item==firstChoose
                }"
                    :key="index"
                    @click="tapThis(item)"
                >
                    <img v-if="index==0" src="@asset/images/demo/catoonlibai-5.png">
                    <img v-if="index==1" src="@asset/images/demo/catoonlibai-6.png">
                    <img v-if="index==2" src="@asset/images/demo/catoonlibai-7.png">
                    <img v-if="index==3" src="@asset/images/demo/catoonlibai-10.png">
                </div>
            </div>
        </div>
        <div class="anno">点击相邻两个图片，可以切换位置</div>
        <mfooter></mfooter>
    </div>
</template>

<script>
import mheader from "@zoo/components/common/header";
import mfooter from '@zoo/components/common/footer';
export default {
  data() {
    return {
      sort: [1, 2, 3, 4],
      firstChoose: 0,
      secondChoose: 0
    };
  },
  methods: {
    tapThis(num) {
      if (this.firstChoose > 0) {
        this.secondChoose = num;
      } else {
        this.firstChoose = num;
      }
    }
  },
  watch:{
    secondChoose(nv,ov){
      if(nv>0){
        let a = this.sort.indexOf(this.firstChoose)
        let b = this.sort.indexOf(this.secondChoose)
        this.sort[a] = this.secondChoose
        this.sort[b] = this.firstChoose
        this.secondChoose = 0
        this.firstChoose =0
      }
    }
  },
  components: {
    mheader,
    mfooter
  }
};
</script>
<style lang="sass" scoped>
.unlayout{
  padding-top:3.2rem;
  padding-bottom:3.5rem;
  color:black;
}
.main-verse{
  font-family: 'STKaiti';
  text-align: center;
  height:255px;
  line-height:2.2rem;
  padding-top:.5rem;
  background: url('~@asset/images/common/versebk.png') bottom no-repeat;
  background-size:100%;
  .verse-title{
    font-size:1.8rem;
  }
  .verse-auth{
    font-size:0.9rem;
  }
  .verse-content{
    font-size:1.5rem;
  }
  .line-num{
    font-size:0.9rem;
    text-align:right;
    padding-right:1rem;
    color:#8f8f8f;
  }
  
}
.prompt{
  font-family:'黑体';
  text-align:center;
  height:2rem;
}
.anno{
  text-align:right;
  padding-right:1rem;
  line-height:2rem;
  font-size:0.8rem;
  color:#8f8f8f;
}
.grey-bg{
  background:#ededed;
  padding:1rem;
}
.switch-container{
  position:relative;
  div{
    &.vol{
      padding-top:50%;
    }
    &.pic{
      position:absolute;
      width:48%;
      img{
        display:block;
        width:100%;
        height:100%;
      }
      &.selected{
        border:solid #f15883 1px;
      }
      
    }
    &.first-pic{
      left:0;
      right:auto;
      top:0;
      bottom:auto;
    }
    &.second-pic{
      left:auto;
      right:0;
      top:0;
      bottom:auto;
    }
    &.third-pic{
      left:0;
      right:0;
      top:auto;
      bottom:0;
    }
    &.forth-pic{
      left:auto;
      right:0;
      top:auto;
      bottom:0;
    }
  }
}
  
</style>
