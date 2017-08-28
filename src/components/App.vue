<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}
.container {
    display:flex;
    flex-wrap:wrap;
    flex-direction:row;
    justify-content:flex-start;
    align-items:stretch;
    flex-wrap:nowrap;
}

.left {order:1; background:#E33837; flex-basis:100%; }
.middle {order:2; flex-basis:100%;}
.right {order:3; background:#002E83 ;flex-basis:100%;}


button.btn-expanded {
  width: 100%
}

</style>
