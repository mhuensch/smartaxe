<template>
  <h1>{{title}}</h1>
</template>

<script>
function data () {
  let model =
    { title: 'Poison Numbers'
    , allowTeams: true
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
