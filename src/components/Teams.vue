<template>
  <div>
    <h1>Form Teams</h1>

    <div style="margin-bottom: 30px; margin-top:30px;">
      <div class="form-horizontal">
        <div class="form-group">
          <div class="col-10">
            <input class="form-input input-lg" type="text" placeholder="Name" @keyup.enter="addTeam()" v-model="newTeam"/>
          </div>
          <div class="col-2">
            <button class="btn btn-lg btn-expanded" @click="addTeam()">Add Team</button>
          </div>
        </div>
      </div>
    </div>
    <router-link :to="{ name: 'throwers' }" class="sub-header" v-show="teams.length === 0">
      Skip this step and throw as individuals
    </router-link>


    <template v-if="teams.length > 0">
      <h2>Current Teams</h2>
      <div class="form-horizontal">
        <template v-for="team in teams">
          <div class="form-group">
            <div class="col-10">
              <input class="form-input input-lg" type="text" placeholder="Name" v-model="team.name"/>
            </div>
            <div class="col-2">
              <button @click="removeTeam(team.id)" tabindex="-1">
                <icon name="times" label="remove" scale=2 class="red"></icon>
              </button>
            </div>
          </div>
        </template>
      </div>
    </template>


    <router-link :to="{ name: 'throwers' }" v-if="teams.length > 0">
      Continue to Add Throwers
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
    .create('team', { name: $vm.newTeam, tournament: $vm.tournamentId })
    .then(() => {
      $vm.newTeam = null
      reloadTeams()
    })
}

function removeTeam (id) {
  $vm.$store
    .delete('team', id)
    .then(reloadTeams)
}

function reloadTeams () {
  let options = { match: { tournament: $vm.tournamentId }, sort: { name: true } }
  $vm.$store.find('team', null, options).then(result => {
    $vm.teams = result.payload.records
  })
}

function data () {
  let model =
    { newTeam: null
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
    { addTeam: addTeam
    , removeTeam: removeTeam
    }
  }

export default result
</script>


<style scoped>

h1 {
  margin-bottom: 0;
}

.sub-header {
  margin-bottom: 3em;
}

.red {
  color: red;
}

</style>
