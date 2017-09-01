<template>
	<div>
    <div class="round-label">Round {{roundCount}} : {{game.title}}</div>
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
        <h2>{{tournament.target}}</h2>
        <template v-for="ring in target">
          <button class="btn btn-lg" @click="handleTargetHit(ring.value)">{{ring.name}}</button>
        </template>
        <button class="btn btn-lg">Undo Last</button>
      </div>

      <div class="row-item">
        <component :is="match.game"
          v-on:gameover="onGameover"
          v-bind:currentTeam="currentTeam"
          v-bind:nextTeam="nextTeam"
          v-bind:throwers="throwers"
          v-bind:throws="throws">
        </component>
      </div>
    </div>


    <div :class="['modal', { 'active': winner }]" v-if="winner">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <button class="btn btn-clear float-right" @click="backToMatch()"></button>
          <div class="modal-title h5">Game Over!</div>
        </div>
        <div class="modal-body">
          <div class="content">
            <span class="gameover-label">Winner: {{winner.name}}</span>
            <span class="gameover-label">Score: {{winningScore}}</span>
          </div>
          <br /><br />
          <!-- <button class="btn btn-link btn-large">Exit</button> -->
          <button class="btn btn-primary btn-large" @click="createNewRound">Play Another Round</button>
        </div>
        <!-- <div class="modal-footer">
          ...
        </div> -->
      </div>
    </div>

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
    .then(() => {
      // This should not be needed but when the route is updated,
      // vm.setData doesnt get called.
      if (this) return this.setData(this, result.data)

      next(vm => vm.setData(vm, result.data))
    })
    .catch(() => next('/'))
    // TODO: implement better error handling
}

function loadData (result) {
  return loadTournament(result)
    .then(loadMatch)
    .then(loadRounds)
    .then(loadThrowers)
    //
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
    , sort: { started: true }
    }

  return store
    .find('round', null, options)
    .then(response => {
      result.data.rounds = JSON.parse(JSON.stringify(response.payload.records))

      result.data.round = result.data.rounds
        .filter(round => round.id === result.params.roundId)[0]

      result.data.roundCount = result.data.rounds.indexOf(result.data.round) + 1

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
  vm.target = targets[vm.tournament.target]
  vm.game = games[vm.match.game].data()
}

function created () {
  // SEE: https://github.com/vuejs/vue-router/issues/1357
  if (!routeEntered) {
    loadData({ params: this.$route.params, data: {} }).then(result => setData(this, result.data))
  }
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

function backToMatch () {
  this.$router.push({ name: 'matches' })
}

function createNewRound () {
  this.winner = null
  this.$store.create('round',
    { tournament: this.tournament.id
    , match: this.match.id
    , turnSize: this.round.turnSize
    , throwers: this.throwers.map(t => t.id)
    , team1: this.nextTeam
    , team2: this.currentTeam
    , started: new Date()
    }
  ).then(result => {
    let round = result.payload.records[0]
    this.$router.push({ name: 'rounds', params: { tournamentId: this.tournament.id, match: this.match.id, roundId: round.id } })
  })
}

function onGameover (results) {
  this.winner = this.throwers.filter(t => t.id === results.thrower)[0]
  this.winningScore = results.score
}

function data () {
  let model =
    { tournament: {}
    , match: {}
    , round: {}
    , rounds: []
    , throwers: []
    , target: {}
    , game: {}
    , throws: []
    , currentTeam: {}
    , currentThrower: {}
    , nextTeam: {}
    , nextThrower: {}
    , throwCount: 1
    , roundCount: 0
    , winner: null
    , winningScore: 0
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
    , backToMatch
    , createNewRound
    , onGameover
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

  .gameover-label {
    display: block;
  }

</style>
