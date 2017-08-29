<template>
  <div>
    <h1>Smart Axe!</h1>
    <p class="sub-header">The sharpest tool in the shed.</p>

    <template v-if="tournaments.length > 0">
      <h2>Recent Tournaments</h2>
      <div class="container">
        <template v-for="tournament in tournaments">

            <div @click="continueTournament(tournament)" v-bind:class="[tournament.target === 'WATL' ? 'watl-target' : 'natf-target', 'organization']" >
              <button class="btn tournament">Continue Tournament</button>
            </div>

        </template>
      </div>
    </template>


    <h2>Start a New Tournament</h2>

    <div class="container">
      <div @click="newTournament('WATL')" class="organization watl-target">
        <button class="btn tournament">New WATL Tournament</button>
      </div>

      <div @click="newTournament('NATF')" class="organization natf-target">
        <button class="btn tournament">New NATF Tournament</button>
      </div>
    </div>

  </div>
</template>


<script>
let $vm = null

function created () {
  $vm = this
  loadTournaments()
}

function newTournament (target) {
  $vm.$store
    .create('tournament', { target: target, started: new Date() })
    .then(tournament => {
      continueTournament(tournament.payload.records[0])
    })
}

function continueTournament (tournament) {
  $vm.$router.push({ name: 'throwers-new', params: { tournamentId: tournament.id } })
}

function loadTournaments () {
  $vm.$store.find('tournament', null, { sort: { started: true }, limit: 5 }).then(result => {
    $vm.tournaments = result.payload.records
  })
}

function data () {
  let model =
    { tournaments: []
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

  .container {
    display: flex;
    justify-content: center;
    cursor: pointer;
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
    margin: 10px;
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
