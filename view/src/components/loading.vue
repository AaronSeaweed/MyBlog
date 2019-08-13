<template>
<div class="loading"></div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style scoped>
.loading {
  left: 0;
  top: 0;
  background: url('../assets/img/loading.gif') center center no-repeat #fff;
  width: 100%;
  height: 100px;
  z-index: 1000;
  background-size: 40px;
}
</style>