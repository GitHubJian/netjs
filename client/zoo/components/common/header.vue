<template>
    <div class="header">
        <div class="left" @click="back">
            <img class="back" src="@asset/images/common/back.png" />
        </div>
        <div class="title">诗词学习</div>
        <div class="right" @click="share">
            <img class="more" src="@asset/images/common/more.png" />
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods:{
      back(){
          // TODO
      },
      share(){
          // TODO
      }
  }
};
</script>

<style lang="sass" scoped>
.header{
    display:flex;
    width:100%;
    height:3.2rem;
    line-height:3.2rem;
    background:white;
    border-bottom:1px solid #dddddd;
    position:fixed;
    top:0;
    left:0;
    .left,.right{
        flex:1;
        width:3.2rem;
        max-width:3.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        
        .back{
            height:1.3rem;
            display:block;
        }
        .more{
            width:1.4rem;
        }


    }
    .title{
        flex:1;
        text-align:center;
    }
}

</style>
