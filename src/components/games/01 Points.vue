<template>
  <div>
    <h2>{{title}}</h2>

    <div v-for="score in scores" class="score">
      {{score.name}}: {{score.points}}
    </div>

  </div>
</template>


<script>
function mounted () {
  this.scores = this.throwers.map(thrower => {
    return { id: thrower.id, name: thrower.name, points: 0 }
  })

  this.$watch('throws', () => {
    let newThrow = this.throws[this.throws.length - 1]
    let score = this.scores.filter(s => s.id === newThrow.thrower)[0]
    score.points += newThrow.value

    if (score.points >= this.goal) {
      this.scores = this.throwers.map(thrower => {
        return { id: thrower.id, name: thrower.name, points: 0 }
      })

      this.$emit('gameover', { thrower: newThrow.thrower, score: score.points })
    }
  }, { deep: true })
}

function data () {
  let model =
    { title: 'Points'
    , allowTeams: true
    , allowMultipleThrows: true
    , goal: 10
    , scores: {}
    }

  return model
}

let result =
  { props: ['currentTeam', 'nextTeam', 'throwers', 'throws']
  , data
  , mounted
  }

export default result
</script>


<style>
  .score {
    font-size: 24px;
  }
</style>
