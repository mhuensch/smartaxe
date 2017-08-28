<template>
	<div>

    <div class="fill">
      <template v-for="ring in target">
        <button class="btn btn-lg" @click="handleTargetHit(ring.value)">{{ring.name}}</button>
      </template>
    </div>

    <div v-for="hit in hits">
      {{hit}}
    </div>

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
  loadRound()
}

function handleTargetHit (value) {
  $vm.hits.push(value)
}

function loadRound () {
  let options = { match: { tournament: $vm.tournamentId, match: $vm.matchId } }
  $vm.$store.find('round', $vm.roundId, options).then(result => {
    if (result.payload.records.length === 0) {
      options.match.id = $vm.roundId
      return $vm.$store.create('round', options.match).then(loadRound)
    }

    $vm.round = result.payload.records[0]
    console.log('ROUND', $vm.round)
    $vm.target = scoring['watl']
  })
}

function data () {
  let model =
    { round: {}
    , target: null
    , hits: []
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
</style>
