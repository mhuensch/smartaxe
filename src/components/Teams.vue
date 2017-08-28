<template>
  <div>
    <h1>Create Teams</h1>
    <label>Teams:</label>
    <form class="form-horizontal">

      <template v-for="team in teams">
        <div class="form-group">
          <div class="col-10">
            <input class="form-input input-lg" type="text" placeholder="Name" v-model="team.name"/>
          </div>
          <div class="col-10">
            <button @click="removeTeam(team.id)">remove</button>
          </div>
        </div>
      </template>

    </form>

    <div class="col-2">
      <button class="btn btn-lg btn-expanded" @click="addTeam()">Add Team</button>
    </div>

    <router-link :to="{ name: 'throwers' }">
      <span v-if="teams.length == 0">
        Skip: Throw as Individuals
      </span>
      <span v-else>
        Throwers: Add Throwers
      </span>
    </router-link>

  </div>
</template>


<script>
let $vm = null

function created () {
  $vm = this
  $vm.tournamentId = $vm.$route.params.tournamentId
  reloadTeams()
}

function mounted () {
  this.$watch('$data.teams', (teams) => {
    let replacements = teams.map(team => { return { id: team.id, replace: { name: team.name } } })
    if (replacements.length === 0) return
    $vm.$store.update('team', replacements)
  }, { deep: true })
}

function addTeam () {
  $vm.$store
    .create('team', { name: null, tournament: $vm.tournamentId })
    .then(reloadTeams)
}

function removeTeam (id) {
  $vm.$store
    .delete('team', id)
    .then(reloadTeams)
}

function reloadTeams () {
  let options = { match: { tournament: $vm.tournamentId } }
  $vm.$store.find('team', null, options).then(result => {
    $vm.teams = result.payload.records
  })
}

function data () {
  let model =
    { teams: []
    }

  return model
}

let result =
  { tournamentId: null
  , data: data
  , created: created
  , mounted: mounted
  , methods:
    { addTeam: addTeam
    , removeTeam: removeTeam
    }
  }

export default result
</script>
