<template>
    <div class="unlayout">
        <mheader/>
        <div class="main-verse">
            尚新波
        </div>
    </div>
</template>

<script>
import mheader from "@zoo/components/common/header";
export default {
  data() {
    return {};
  },
  components: {
    mheader
  }
};
</script>

<style lang="sass" scoped>
.unlayout{
  padding-top:3.2rem;
  color:black;
}
.main-verse{
  font-family: 'STKaiti';
  text-align: center;
  height:300px;
  background: url('~@asset/images/common/versebk.png');
}
</style>
