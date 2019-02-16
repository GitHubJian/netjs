<template>
  <div @click="test1" style="height:300px;width:100%">Hello, SSR{{num}}</div>
</template>

<script>
export default {
  data() {
    return {
      num:1
    };
  },
  mounted(){
    alert(123)
    this.num=2
  },
  methods:{
    test1:function(){
      this.num = 2
      console.log(123)
    }
  }
};
</script>