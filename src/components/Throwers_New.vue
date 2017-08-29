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
            <div class="col-2">
              <button @click="removeThrower(thrower.id)" tabindex="-1">
                <icon name="times" label="remove" scale=2 class="red"></icon>
              </button>
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
  let $vm = null

  function created () {
    $vm = this
    $vm.tournamentId = $vm.$route.params.tournamentId
    reloadThrowers()
  }

  function mounted () {
    this.$watch('$data.throwers', (throwers) => {
      let replacements = throwers.map(thrower => { return { id: thrower.id, replace: { name: thrower.name } } })
      if (replacements.length === 0) return
      $vm.$store.update('thrower', replacements)
    }, { deep: true })
  }

  function addThrower () {
    $vm.$store
      .create('thrower', { name: $vm.newThrower, tournament: $vm.tournamentId })
      .then(() => {
        $vm.newThrower = null
        reloadThrowers()
      })
  }

  function removeThrower (id) {
    $vm.$store
      .delete('thrower', id)
      .then(reloadThrowers)
  }

  function reloadThrowers () {
    let options = { match: { tournament: $vm.tournamentId }, sort: { name: true } }
    $vm.$store.find('thrower', null, options).then(result => {
      $vm.throwers = result.payload.records
      $vm.newThrower = null
    })
  }

  function next () {
    $vm.$router.push({ name: 'matches-new' })
  }

  function data () {
    let model =
      { newThrower: null
      , throwers: []
      }

    return model
  }

  let result =
    { tournamentId: null
    , data: data
    , created: created
    , mounted: mounted
    , methods:
      { addThrower: addThrower
      , removeThrower: removeThrower
      , next: next
      }
    }

  export default result
</script>


<style scoped>

.red {
  color: red;
}

</style>
