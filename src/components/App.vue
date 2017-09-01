<template>
  <div id="app">
    <div class="toast toast-error" v-if="message">
      <button class="btn btn-clear float-right" @click="clearError"></button>
      An Error Occured: {{message}}
    </div>
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
import router from '@/router'

export default {
  name: 'app',
  data () { return { message: null } },
  created () {
    // let self = this
    // this.message = 'BLAH'
    router.onError(e => {
      this.message = e.message
    })
  },
  methods: { clearError () { this.message = null } }
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

a {
  text-decoration: underline;
}

</style>
