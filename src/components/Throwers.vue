<template>
  <div>
    <h1>Add Throwers</h1>
    <div style="margin-bottom: 30px; margin-top:30px;">
      <div class="form-horizontal">
        <div class="form-group">
          <div class="col-10">
            <input class="form-input input-lg" type="text" placeholder="Name" @keyup.enter="addThrower()" v-model="newThrower"/>
          </div>
          <div class="col-2">
            <button class="btn btn-lg btn-expanded" @click="addThrower()">Add Thrower</button>
          </div>
        </div>
      </div>
    </div>


    <template v-if="throwers.length > 0">
      <h2>Current Throwers</h2>
      <template v-for="thrower in throwers">
        <div class="form-horizontal">
          <div class="form-group">
            <div class="col-10">
              <input class="form-input input-lg" type="text" placeholder="Name" v-model="thrower.name"/>
            </div>
            <div class="col-2" @click="removeThrower(thrower)">
              <icon name="times" label="remove" scale=2 class="red"></icon>
            </div>
          </div>
        </div>
      </template>
    </template>


    <button class="btn btn-link" :disabled="throwers.length === 0" @click="next()">
      Start a New Match
    </button>

  </div>
</template>


<script>
  import store from '@/store'
  import AppError from '@/errors/AppError.js'
  
  function loadData (to, from, next) {
    store
      .find('tournament', to.params.tournamentId)
      .then(result => {
        if (result.payload.records.length !== 0) return
        // Doing emit rather than passing the error so redirect doesn't occur
        next(vm => { vm.$emit('error', new AppError('No Tournament found!', 'tournaments')) })
      })

    loadThrowers(to.params.tournamentId)
      .then(throwers => {
        // This should not be needed but when the route is updated,
        // vm.setData does not get called.
        if (this) return this.setData(this, throwers)
        next(vm => { vm.throwers = throwers })
      })
      .catch(error => next(error))
  }

  function loadThrowers (tournamentId) {
    let options = { match: { tournament: tournamentId }, sort: { name: true } }
    return store.find('thrower', null, options).then(result => {
      return result.payload.records
    })
  }

  function created () {
    this.tournamentId = this.$route.params.tournamentId

    this.$watch('error', error => {
      // Emit error so that the App can pick up the error
      // just like next() in routing
      this.$emit('error', error)
    })

    this.$watch('throwers', throwers => {
      let replacements = throwers.map(thrower => { return { id: thrower.id, replace: { name: thrower.name } } })
      if (replacements.length === 0) return
      store.update('thrower', replacements)
    }, { deep: true })
  }

  function addThrower () {
    store
      .create('thrower', { name: this.newThrower, tournament: this.tournamentId })
      .then(results => {
        this.throwers.push(results.payload.records[0])
        this.newThrower = null
      })
      .catch(error => { this.error = error })
  }

  function removeThrower (thrower) {
    store
      .delete('thrower', thrower.id)
      .then(() => { this.throwers = this.throwers.filter(t => t.id !== thrower.id) })
  }

  function next () {
    this.$router.push({ name: 'matches' })
  }

  function data () {
    let model =
      { newThrower: null
      , throwers: []
      , error: null
      }
    return model
  }

  let result =
    { beforeRouteEnter: loadData
    , beforeRouteUpdate: loadData
    , tournamentId: null
    , data
    , created
    , methods:
      { addThrower
      , removeThrower
      , next
      }
    }

  export default result
</script>


<style scoped>

.red {
  color: red;
}

.fa-icon {
  margin-top: 3px;
  margin-left: 5px;
}

</style>
