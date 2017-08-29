<template>
  <div>
    <h1>Match</h1>

    <label class="form-label">Games</label>
    <div v-for="key in games.$keys">
      <label class="form-radio">
        <input type="radio" name="game" :value="key" v-model="selectedGame" />
        <i class="form-icon"></i> {{games[key].name}}
      </label>
    </div>


    <label class="form-label">Throwers</label>
    <label class="form-checkbox">
      <input type="checkbox" @change="toggleAllThrowers()" v-model="selectedAllThrowers"/>
      <i class="form-icon"></i> [select all]
    </label>

    <div v-for="thrower in throwers">
      <label class="form-checkbox">
        <input type="checkbox" :value="thrower.id" v-model="selectedThrowers" />
        <i class="form-icon"></i> {{thrower.name}} ({{throwerTeamName(thrower.id)}})
      </label>
    </div>


    <label class="form-label">Team Size</label>
    <div v-for="team in teams">
      {{team.name}} ({{throwerTeamCount(team, selectedThrowers)}})
    </div>

    <button class="btn btn-link" @click="startMatch()">Start Match</button>

  </div>
</template>


<script>
import games from '../games'
let $vm = null

function created () {
  $vm = this
  $vm.tournamentId = $vm.$route.params.tournamentId
  reloadThrowers()
  reloadTeams()
}

function mounted () {
  this.$watch('selectedThrowers', () => {
    $vm.selectedAllThrowers = $vm.selectedThrowers.length === $vm.throwers.length
  }, { deep: true })
}

function reloadThrowers () {
  let options = { match: { tournament: $vm.tournamentId }, sort: { name: true } }
  $vm.$store.find('thrower', null, options).then(result => {
    $vm.throwers = result.payload.records
  })
}

function reloadTeams () {
  let options = { match: { tournament: $vm.tournamentId } }
  $vm.$store.find('team', null, options).then(result => {
    $vm.teams = result.payload.records
  })
}

function toggleAllThrowers () {
  if ($vm.selectedAllThrowers) {
    $vm.selectedThrowers = $vm.throwers.map(thrower => { return thrower.id })
  } else {
    $vm.selectedThrowers = []
  }
}

function throwerTeamName (throwerId) {
  return $vm.teams.filter(team => { return team.throwers.indexOf(throwerId) > -1 })[0].name
}

function throwerTeamCount (team, throwers) {
  return throwers.filter(thrower => { return team.throwers.indexOf(thrower) > -1 }).length
}

function startMatch () {
  $vm.$store.create('match',
    { game: $vm.selectedGame
    , tournament: $vm.tournamentId
    , throwers: $vm.selectedThrowers
    }
  ).then(result => {
    let match = result.payload.records[0]
    $vm.$router.push({ name: 'rounds', params: { matchId: match.id, roundId: 0 } })
  })
}

function data () {
  let model =
    { selectedGame: null
    , selectedThrowers: []
    , selectedAllThrowers: false
    , throwers: []
    , teams: []
    , games: games
    }

  return model
}

let result =
  { tournamentId: null
  , data: data
  , created: created
  , mounted: mounted
  , methods:
    { toggleAllThrowers
    , throwerTeamName
    , throwerTeamCount
    , startMatch
    }
  }

export default result
</script>
