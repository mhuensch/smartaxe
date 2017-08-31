<template>
	<div>
    <div class="round-label">Round {{rounds.indexOf(round) + 1}} : {{match.game}}</div>
    <div class="row">

      <div class="row-item">
        <span class="thrower-label">
          {{currentThrower.name}}
        </span>
        <span class="sub-label" v-if="currentTeam">
          Team: {{currentTeam.name}}
        </span>
        <span class="sub-label">
          Throwing: {{this.throwCount}} of {{round.turnSize}}
        </span>
      </div>

      <div class="row-item" v-if="nextThrower">
        <span class="next-label">
          Next: {{nextThrower.name}}
        </span>
        <span class="sub-label" v-if="nextTeam">
          Team: {{nextTeam.name}}
        </span>
      </div>

    </div>

    <div class="row">
      <div class="fill row-item">
        <template v-for="ring in target">
          <button class="btn btn-lg" @click="handleTargetHit(ring.value)">{{ring.name}}</button>
        </template>
        <button class="btn btn-lg">Undo Last</button>
      </div>

      <div class="row-item">
        <component :is="match.game"></component>
      </div>
    </div>

    <!-- <br />
    <br />
    TOURNAMENT: {{tournament}}
    <br />
    <br />
    MATCH: {{match}}
    <br />
    <br />
    ROUND: {{round}}
    <br />
    <br />
    CURRENT TEAM: {{currentTeam}}
    <br />
    <br />
    NEXT TEAM: {{nextTeam}}
    <br />
    <br />
    THROWS:
    <div v-for="toss in throws">
      {{toss}}
    </div> -->

  </div>
</template>

<script>
import targets from '@/targets'
import store from '../store'
import games from '@/components/games'

let routeEntered = false

function routeEnter (to, from, next) {
  let result = { params: to.params, data: {} }

  routeEntered = true
  loadData(result)
    .then(() => next(vm => vm.setData(vm, result.data)))
    .catch(() => next('/'))
    // TODO: implement better error handling
}

function loadData (result) {
  return loadTournament(result)
    .then(loadMatch)
    .then(loadRounds)
    .then(loadThrowers)
}

function loadTournament (result) {
  return store
    .find('tournament', result.params.tournamentId)
    .then(response => {
      result.data.tournament = response.payload.records[0]
      return result
    })
}

function loadMatch (result) {
  return store
    .find('match', result.params.matchId)
    .then(response => {
      result.data.match = response.payload.records[0]
      return result
    })
}

function loadRounds (result) {
  let options =
    { match:
        { tournament: result.params.tournamentId
        , match: result.params.matchId
        }
    , sort: { started: false }
    }

  return store
    .find('round', null, options)
    .then(response => {
      result.data.rounds = response.payload.records

      result.data.round = result.data.rounds
        .filter(round => round.id === result.params.roundId)[0]

      result.data.currentTeam = result.data.round.team1
      result.data.nextTeam = result.data.round.team2
      return result
    })
}

function loadThrowers (result) {
  return store.find('thrower', result.data.round.throwers)
    .then(response => {
      let data = result.data
      data.throwers = response.payload.records

      let throwers = data.throwers
      let team1 = data.currentTeam || { throwers: [] }
      let team2 = data.nextTeam || { throwers: [] }

      data.currentThrower = throwers.filter(t => t.id === team1.throwers[0])[0] || throwers[0]
      data.nextThrower = throwers.filter(t => t.id === team2.throwers[0])[0] || throwers[1]

      data.currentThrower = data.throwers[0]
      return result
    })
}

function setData (vm, data) {
  Object.getOwnPropertyNames(data).forEach(name => {
    vm[name] = data[name]
  })
}

function created () {
  // SEE: https://github.com/vuejs/vue-router/issues/1357
  if (!routeEntered) {
    loadData({ params: this.$route.params, data: {} }).then(result => setData(this, result.data))
  }

  this.target = targets['WATL']
}

function handleTargetHit (value) {
  this.throws.push(
    { thrower: this.currentThrower.id
    , value: value
    }
  )

  this.throwCount++
  let turnComplete = this.throwCount > this.round.turnSize
  if (turnComplete === false) return

  this.throwCount = 1
  if (!this.nextThrower) return

  let prevTeam = this.currentTeam
  let prevThrower = this.currentThrower

  this.currentTeam = this.nextTeam
  this.currentThrower = this.nextThrower

  this.nextTeam = prevTeam
  if (prevTeam) {
    let nextThrowerIndex = prevTeam.throwers.indexOf(prevThrower.id) + 1
    nextThrowerIndex = prevTeam.throwers.length === nextThrowerIndex ? 0 : nextThrowerIndex
    let nextThrowerId = prevTeam.throwers[nextThrowerIndex]
    this.nextThrower = this.throwers.filter(t => t.id === nextThrowerId)[0]
  } else {
    let nextThrowerIndex = this.throwers.indexOf(this.currentThrower) + 1
    nextThrowerIndex = this.throwers.length === nextThrowerIndex ? 0 : nextThrowerIndex
    this.nextThrower = this.throwers[nextThrowerIndex]
  }
}

function data () {
  let model =
    { tournament: null
    , match: {}
    , round: {}
    , rounds: []
    , throwers: []
    , target: {}
    , throws: []
    , currentTeam: {}
    , currentThrower: {}
    , nextTeam: {}
    , nextThrower: {}
    , throwCount: 1
    }

  return model
}

let result =
  { matchId: null
  , roundId: null
  , data
  , created
  , beforeRouteEnter: routeEnter
  , beforeRouteUpdate: routeEnter
  , methods:
    { setData
    , handleTargetHit
    }
  , components: games
  }

export default result
</script>


<style scoped>
  .fill {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .btn {
    height: 100%;
  }


  .row {
    display: flex;
    flex-direction: row;
  }

  .row-item {
    flex: 1;
    margin: 10px;
  }

  .thrower-label, .next-label {
    font-size: 2em;
    display: block;
    margin-bottom: .2em;
  }

  .next-label {
    color: #999;
  }

  .sub-label {
    display: block;
    color: #666;
  }

  .round-label {
    background:#efefef;
    font-size: 1.5em;
    color: #999;
    margin-bottom: .5em;
  }

</style>
