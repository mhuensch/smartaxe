<template>
  <h1>{{title}}</h1>
</template>

<script>
function data () {
  let model =
    { title: 'Showdown'
    , allowTeams: false
    , allowMultipleThrows: true
    }

  return model
}

let result =
  { props: ['currentTeam', 'nextTeam', 'throwers', 'throws']
  , data
  }

export default result
</script>

<style>

</style>
