<template>
  <div>
    <h1>Smart Axe!</h1>
    <p class="sub-header">The sharpest tool in the shed.</p>

    <template v-if="currentTournament">
      <h2>Current Tournament</h2>

      <div class="organization watl-target">
        <button class="btn tournament" @click="continueTournament()">Continue Tournament</button>
      </div>
    </template>


    <h2>Start a New Tournament</h2>

    <div class="organization watl-target">
      <button class="btn tournament" @click="newTournament('WATL')">New WATL Tournament</button>
    </div>

    <div class="organization natf-target">
      <button class="btn tournament" @click="newTournament('NATF')">New NATF Tournament</button>
    </div>

  </div>
</template>


<script>
let $vm = null

function created () {
  $vm = this
  reloadTournaments()
}

function newTournament (target) {
  if ($vm.currentTournament) {
    return $vm.$store
      .delete('tournament', $vm.currentTournament.id)
      .then(() => {
        $vm.currentTournament = null
        newTournament(target)
      })
  }

  $vm.$store
    .create('tournament', { target: target })
    .then(tournament => {
      $vm.currentTournament = tournament.payload.records[0]
      continueTournament()
    })
}

function continueTournament () {
  console.log('CURRENT', $vm.currentTournament)
  $vm.$router.push({ name: 'teams', params: { tournamentId: $vm.currentTournament.id } })
}

function reloadTournaments () {
  $vm.$store.find('tournament').then(result => {
    let records = result.payload.records
    $vm.currentTournament = records.length ? records[0] : null
  })
}

function data () {
  let model =
    { currentTournament: null
    }

  return model
}

let result =
  { data: data
  , created: created
  , methods:
    { newTournament: newTournament
    , continueTournament: continueTournament
    }
  }

export default result
</script>


<style scoped>
  h1 {
    margin-bottom: 0;
  }

  img {
    display: block;
  }

  .sub-header {
    margin-bottom: 3em;
  }

  .organization {
    width: 200px;
    height: 200px;
    position: relative;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-bottom: 30px;
    border: 1px solid #ededed;
    border-radius: 10px;
  }

  .natf-target {
    background-image: url('/static/images/NATF-target.png')
  }

  .watl-target {
    background-image: url('/static/images/WATL-target.png')
  }

  .tournament {
    width:100%;
    position:absolute;
    bottom: 0;
  }

</style>
