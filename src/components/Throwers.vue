<template>
  <div>
    <h1>Add Throwers</h1>

    <label>Throwers:</label>
    <template v-for="thrower in throwers">
      <div class="input-group col-10">
        <input class="form-input input-lg" type="text" id="name" placeholder="Name" v-model="thrower.name" />
        <select class="form-select select-lg" v-model="thrower.team" v-if="teams.length > 0">
          <template v-for="team in teams">
            <option :value="team.id">{{team.name}}</option>
          </template>
        </select>
      </div>
      <button @click="removeThrower(thrower.id)">remove</button>
      <br />
    </template>
    <button class="btn btn-lg btn-expanded" @click="addThrower()">Add Thrower</button>


    <button class="btn btn-link" :disabled="throwers.length === 0" @click="next()">
      Next: Start a Match ->
    </button>

    <!-- TODO: continue match as well? -->

  </div>
</template>


<script>
  let $vm = null

  function created () {
    $vm = this
    $vm.tournamentId = $vm.$route.params.tournamentId
    reloadThrowers()
    reloadTeams()
  }

  function mounted () {
    this.$watch('$data.throwers', (throwers) => {
      let replacements = throwers.map(thrower => { return { id: thrower.id, replace: { name: thrower.name, team: thrower.team } } })
      if (replacements.length === 0) return
      $vm.$store.update('thrower', replacements)
    }, { deep: true })
  }

  function addThrower () {
    let teamId = $vm.teams[0] ? $vm.teams[0].id : null
    $vm.$store
      .create('thrower', { name: null, team: teamId, tournament: $vm.tournamentId })
      .then(reloadThrowers)
  }

  function removeThrower (id) {
    $vm.$store
      .delete('thrower', id)
      .then(reloadThrowers)
  }

  function reloadThrowers () {
    let options = { match: { tournament: $vm.tournamentId } }
    $vm.$store.find('thrower', null, options).then(result => {
      $vm.throwers = result.payload.records
      $vm.newThrower = null
    })
  }

  function reloadTeams () {
    let options = { match: { tournament: $vm.tournamentId } }
    $vm.$store.find('team', null, options).then(result => {
      $vm.teams = result.payload.records
    })
  }

  function next () {
    $vm.$router.push({ name: 'matches' })
  }

  function data () {
    let model =
      { throwers: []
      , teams: []
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
