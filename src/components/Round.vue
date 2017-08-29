<template>
	<div>
    <div class="round-label">Round 2 : Cricket</div>
    <div class="row">
      <div class="row-item">
        <span class="thrower-label">Dugan</span>
        <span class="throw-label">Throw: 1 of 2</span>
      </div>
      <div class="row-item">
        <span class="next-label">Next: Becky</span>
        <span class="throw-label">Leading: Red Team</span>
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

    <!-- <div v-for="thrower in throwers">
      {{thrower.name}}
    </div>

    <div class="fill">
      <template v-for="ring in target">
        <button class="btn btn-lg" @click="handleTargetHit(ring.value)">{{ring.name}}</button>
      </template>
    </div>

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
  loadRound()
}

function handleTargetHit (value) {
  $vm.hits.push(value)
}

function loadRound () {
  let options = { match: { tournament: $vm.tournamentId, match: $vm.matchId } }
  $vm.$store.find('round', $vm.roundId, options).then(result => {
    $vm.round = result.payload.records[0]
    console.log('ROUND', $vm.round)
    $vm.target = scoring['watl']

    loadThrowers()
  })
}

function loadThrowers () {
  $vm.$store.find('thrower', $vm.round.throwers).then(result => {
    $vm.throwers = result.payload.records
  })
}

function data () {
  let model =
    { round: {}
    , target: null
    , hits: []
    , throwers: []
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



<!-- echo $CI
echo $CI_BRANCH
echo $CI_BUILD_NUMBER
echo $CI_BUILD_URL
echo $CI_COMMITTER_EMAIL
echo $CI_COMMITTER_NAME
echo $CI_COMMITTER_USERNAME
echo $CI_COMMIT_ID
echo $CI_MESSAGE
echo $CI_NAME
echo $CI_PULL_REQUEST
echo $CI_REPO_NAME -->
