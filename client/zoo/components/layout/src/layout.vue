<template>
  <div
    id="app"
    class="layout"
  >
    <div
      id="wrapper"
      class="wrapper"
    >
      <div class="main">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SgLayout",
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "@css/reset.scss";

html,
body,
.layout,
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
