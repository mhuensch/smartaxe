<template>
  <div id="app">

    <div class="toast toast-error" v-if="error">
      <button class="btn btn-clear float-right" @click="clearError"></button>
      {{error.name}}: {{error.message}}
      <router-link :to="{ name: error.redirect }" v-if="error.redirect">Try this instead</router-link>
    </div>

    <router-view :key="$route.path" v-on:error="onError"></router-view>

  </div>
</template>

<script>
// import router from '@/router'

function created () {
  // router.onError(error => {
  //   handleError.call(this, error)
  // })

  this.$watch('$route', () => {
    if (this.errorPath === this.$route.path) return
    clearError.call(this)
  }, { deep: true })
}

function onError (error) {
  handleError.call(this, error)
}

function clearError () {
  this.error = null
  this.errorPath = null
}

function handleError (error) {
  this.errorPath = this.$route.path
  this.error = error
}

function data () {
  let model =
    { error: null
    , errorPath: null
    }

  return model
}

let app =
  { name: 'app'
  , data
  , created
  , methods:
    { clearError
    , onError
    }
  }

export default app
</script>

<style>

a {
  text-decoration: underline;
}

</style>
