<template>
  <div>
    <div class="target">
      <div class="natf-clutch"></div>
      <div class="natf-clutch-2"></div>
      <div class="natf-blue-ring">
        <div class="natf-red-ring">
          <div class="natf-bulls-eye" @click="hit(5)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function hit (score) {
  this.$emit('hit', score)
}

export default {
  name: 'Target-NATF',
  data () {
    return {
      bullseye: 5,
      red: 3,
      blue: 1,
      clutch: 7
    }
  }
  , methods: { hit }
}
</script>

<style scoped>
  .target {
    position: relative;
    width: 100%;
    height: 100%;
    margin: auto;
  }

  .natf-blue-ring {
  	width: 100%;
  	height: 100%;
    background: blue;
    background:#342F4D; /*rgb(52,47,77);*/
    background: none;
    border: 1px solid #342F4D;
    border-radius: 50%;
    position: absolute;
    top: 15.22%
  }

  .natf-red-ring {
    width: 63%;
    height: 63%;
    background: #E33837; /*rgb(227,56,55);*/
    background: none;
    border: 1px solid #E33837;
    border-radius: 50%;
    position: absolute;
    top: 18.5%;
    left: 18.5%
  }

  .natf-bulls-eye {
    width: 41%;
    height: 41%;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 30%;
    left: 30%
  }

  .natf-clutch {
    width: 9.72%;
    height: 9.72%;
    background: #85BD37;
    border-radius: 50%;
    position: absolute;
    left: 10.24%
  }

  .natf-clutch-2 {
    width: 9.72%;
    height: 9.72%;
    background: #85BD37; /*rgb(133,189,55);*/
    border-radius: 50%;
    position: absolute;
    right: 10.24%
  }

</style>
