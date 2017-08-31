<template>
	<div>
    <div class="round-label">Round {{rounds.indexOf(round) + 1}} : {{match.game}}</div>
    <div class="row">
      <div class="row-item">

        <span class="thrower-label">
          {{currentThrower.name}}
        </span>
        <span class="team-label" v-if="currentTeam">
          Team: {{currentTeam.name}}
        </span>
        <span class="throw-label">
          Throw: 1 of {{round.turnSize}}
        </span>

      </div>

      <div class="row-item" v-if="nextThrower">

        <span class="next-label">
          Next: {{nextThrower.name}}
        </span>
        <span class="throw-label" v-if="nextTeam">
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
        Scoring
      </div>
    </div>

    <!-- MATCH: {{match}}
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
    HITS:
    <div v-for="hit in hits">
      {{hit}}
    </div> -->

  </div>
</template>

<script>
import scoring from '../scoring'

let $vm = null

function created () {
  $vm = this
  $vm.tournamentId = $vm.$route.params.tournamentId
  $vm.matchId = $vm.$route.params.matchId
  $vm.roundId = $vm.$route.params.roundId
  loadMatch()
  loadRounds()
}

function handleTargetHit (value) {
  $vm.hits.push(value)
}

function loadMatch () {
  $vm.$store.find('match', $vm.matchId).then(result => {
    $vm.match = result.payload.records[0]
  })
}

function loadRounds () {
  let options =
    { match: { tournament: $vm.tournamentId, match: $vm.matchId }
    , sort: { started: false }
    }

  $vm.$store.find('round', null, options).then(result => {
    $vm.rounds = result.payload.records
    $vm.round = $vm.rounds.filter(round => round.id === $vm.roundId)[0]
    $vm.currentTeam = $vm.round.team1
    $vm.nextTeam = $vm.round.team2

    $vm.target = scoring['watl']

    loadThrowers()
  })
}

function loadThrowers () {
  $vm.$store.find('thrower', $vm.round.throwers).then(result => {
    $vm.throwers = result.payload.records

    let team1 = $vm.round.team1 || { throwers: [] }
    let team2 = $vm.round.team2 || { throwers: [] }

    $vm.currentThrower = $vm.throwers.filter(thrower => thrower.id === team1.throwers[0])[0] || $vm.throwers[0]
    $vm.nextThrower = $vm.throwers.filter(thrower => thrower.id === team2.throwers[0])[0] || $vm.throwers[1]
  })
}

function data () {
  let model =
    { match: {}
    , round: {}
    , rounds: []
    , throwers: []
    , target: {}
    , hits: []
    , currentTeam: {}
    , currentThrower: {}
    , nextTeam: {}
    , nextThrower: {}
    }

  return model
}

let result =
  { matchId: null
  , roundId: null
  , data
  , created
  , methods:
    { handleTargetHit
    }
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

  .thrower-label {
    font-size: 2em;
    display: block;
    margin-bottom: .2em;
  }

  .team-label {
    display: block;
    color: #666;
  }

  .throw-label {
    color: #666;
  }

  .next-label {
    font-size: 2em;
    color: #999;
    display: block;
  }

  .round-label {
    background:#efefef;
    font-size: 1.5em;
    color: #999;
    margin-bottom: .5em;
  }

</style>
