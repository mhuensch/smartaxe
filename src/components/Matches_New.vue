<template>
  <div>
    <h1>Start Match</h1>

    <div class="container">
      <h2>Select Throwers</h2>
      <label class="form-checkbox">
        <input type="checkbox" @change="toggleAllThrowers()" v-model="selectedAllThrowers"/>
        <i class="form-icon"></i> [select all]
      </label>

      <div v-for="thrower in throwers">
        <label class="form-checkbox">
          <input type="checkbox" :value="thrower" v-model="selectedThrowers" />
          <i class="form-icon"></i> {{thrower.name}}
        </label>
      </div>
    </div>

    <div class="container">
      <h2>Select Match Type</h2>
      <div v-for="key in games.$keys">
        <label class="form-radio">
          <input type="radio" name="game" :value="games[key]" v-model="selectedGame" />
          <i class="form-icon"></i> {{games[key].name}}
        </label>
      </div>
    </div>

    <div class="container" v-if="selectedGame && selectedGame.allowMultipleThrows">
      <h2>Select Number of Throws Per Turn</h2>
      <div class="form-group">
        <select class="form-select" v-model="selectedThrows">
          <option value="1">1</option>
          <option value="2" selected="selected">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </div>

    <div class="container" v-if="selectedGame && selectedGame.allowTeams && selectedThrowers.length > 2">
      <h2>Select Teams?</h2>
      <label class="form-radio">
        <input type="radio" name="form-team" checked @change="formTeams(false)"/>
        <i class="form-icon"></i> No, throw as individuals.
      </label>
      <label class="form-radio">
        <input type="radio" name="form-team" @change="formTeams(true)"/>
        <i class="form-icon"></i> Yes, create two teams.
      </label>

      <div v-if="teams" class="split-container">
        <div v-for="team in teams" class="split-item">
          <input class="form-input input-lg" type="text" placeholder="Name" v-model="team.name"/>
          <div v-for="thrower in team.throwers" class="team-thrower" @click="moveToTeam(thrower, team.id)">
            {{thrower.name}}
            <button tabindex="-1">
              <icon :name="team.id === 1 ? 'arrow-circle-right' : 'arrow-circle-left'" label="move" scale=1></icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button class="btn" @click="createMatch()" v-if="isMatchReady()">Start Match</button>

  </div>
</template>


<script>
import games from '../games'
let $vm = null

function created () {
  $vm = this
  $vm.tournamentId = $vm.$route.params.tournamentId
  loadThrowers()
}

function mounted () {
  this.$watch('selectedThrowers', () => {
    $vm.selectedAllThrowers = $vm.selectedThrowers.length === $vm.throwers.length
  }, { deep: true })
}

function loadThrowers () {
  let options = { match: { tournament: $vm.tournamentId } }
  $vm.$store.find('thrower', null, options).then(result => {
    $vm.throwers = result.payload.records
  })
}

function toggleAllThrowers () {
  if ($vm.selectedAllThrowers) {
    $vm.selectedThrowers = $vm.throwers.map(thrower => { return thrower })
  } else {
    $vm.selectedThrowers = []
  }
}

function formTeams (shouldFormTeams) {
  $vm.teams = shouldFormTeams ? [ {id: 1, name: 'Team 1', throwers: []}, {id: 2, name: 'Team 2', throwers: []} ] : null
  if (!$vm.teams) return

  $vm.selectedThrowers.forEach((thrower, index) => {
    $vm.teams[index % 2].throwers.push(thrower)
  })
}

function moveToTeam (thrower, teamId) {
  let toIndex = teamId === 1 ? 1 : 0
  $vm.teams[toIndex].throwers.push(thrower)

  let fromIndex = teamId - 1
  $vm.teams[fromIndex].throwers = $vm.teams[fromIndex].throwers.filter(t => { return t !== thrower })
}

function isMatchReady () {
  /* eslint-disable operator-linebreak */
  return $vm.selectedGame
    && $vm.selectedThrowers.length > 0
    && (!$vm.teams || Math.abs($vm.teams[0].throwers.length - $vm.teams[1].throwers.length) <= 1)
}

function createMatch () {
  $vm.$store.create('match',
    { game: $vm.selectedGame.name
    , tournament: $vm.tournamentId
    , throwers: $vm.selectedThrowers.map(t => t.id)
    }
  ).then(result => createRound(result.payload.records[0]))
}

function createRound (match) {
  let teams = $vm.teams || []
  let team1 = !teams[0] ? null : { id: teams[0].id, name: teams[0].name, throwers: teams[0].throwers.map(t => t.id) }
  let team2 = !teams[1] ? null : { id: teams[1].id, name: teams[1].name, throwers: teams[1].throwers.map(t => t.id) }

  $vm.$store.create('round',
    { tournament: $vm.tournamentId
    , match: match.id
    , turnSize: $vm.selectedThrows
    , started: new Date()
    , throwers: $vm.selectedThrowers.map(t => t.id)
    , team1: team1
    , team2: team2
    }
  ).then(result => {
    let round = result.payload.records[0]
    $vm.$router.push({ name: 'rounds', params: { matchId: match.id, roundId: round.id } })
  })
}

function data () {
  let model =
    { selectedGame: null
    , selectedThrowers: []
    , selectedAllThrowers: false
    , selectedThrows: 2
    , throwers: []
    , teams: null
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
    , createMatch
    , isMatchReady
    , formTeams
    , moveToTeam
    }
  }

export default result
</script>


<style scoped>

.container {
  margin-bottom: 30px;
  display: block;
}

.split-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
}

.split-item {
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 10px;
}

.team-thrower {
  font-size: 1.5em;
  margin-top: .5em;
}

</style>
