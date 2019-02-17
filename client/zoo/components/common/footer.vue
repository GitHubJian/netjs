<template>
    <div class="footer">
        <div class="listen" :class="{active:active==1}" @click="tap(1)"></div>
        <div class="read" :class="{active:active==2}" @click="tap(2)"></div>
        <div class="see" :class="{active:active==3}" @click="tap(3)"></div>
        <div class="practise" :class="{active:active==4}" @click="tap(4)"></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
        active:1
    };
  },
  methods: {
    tap(n) {
        console.log(n)
      this.active = n
    }
  }
};
</script>
<style lang="sass" scoped>
.footer{
    width:100%;
    height:3.5rem;
    position:fixed;
    bottom:0;
    z-index:2;
    display:flex;
    border-top:solid 1px #dddddd;
    background:white;
    div{
        flex:1;
        background-repeat:no-repeat;
        background-position:center;
    }
    .listen{
        background-image:url('~@asset/images/common/ear01.png');
        background-size:auto 2rem;
        
        &.active{
            background-image:url('~@asset/images/common/ear02.png');
        }
    }
    .read{
        background-image:url('~@asset/images/common/mouth01.png');
        background-size:2rem auto;
        &.active{
            background-image:url('~@asset/images/common/mouth02.png');
        }
    }
    .see{
        background-image:url('~@asset/images/common/eye01.png');
        background-size:2rem auto;
        &.active{
            background-image:url('~@asset/images/common/eye02.png');
        }
    }
    .practise{
        background-image:url('~@asset/images/common/hand01.png');
        background-size:auto 2rem;
        &.active{
            background-image:url('~@asset/images/common/hand02.png');
        }
    }
}
</style>
