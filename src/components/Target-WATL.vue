<template>
  <div>
    <div class="target">
      <div class="watl-killshot"></div>
      <div class="watl-killshot-2"></div>
      <div class="watl-one-ring">
        <div class="watl-two-ring">
          <div class="watl-three-ring">
            <div class="watl-four-ring">
              <div class="watl-bulls-eye" @click="hit(6)"></div>
            </div>
          </div>
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
  name: 'watl-target',
  data () {
    return {
      bullseye: 6,
      four: 4,
      three: 3,
      two: 2,
      one: 1,
      killshot: 10
    }
  }
  , methods: { hit }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .target {
    position: relative;
    width: 100%;
    height: 100%;
    margin: auto;
  }

  .watl-one-ring {
  	width: 100%;
  	height: 100%;
    box-sizing: border-box;
    border: .1px solid black;
    border-radius: 50%;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
  }

  .watl-two-ring {
    width: 75%;
    height: 75%;
    box-sizing: border-box;
    border: .1px solid black;
    border-radius: 50%;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
    top: 12.5%;
    left: 12.5%
  }

  .watl-three-ring {
    width: 71%;
    height: 71%;
    box-sizing: border-box;
    border: .1px solid black;
    border-radius: 50%;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
    top: 14.5%;
    left: 14.5%
  }

  .watl-four-ring {
    width: 60%;
    height: 60%;
    box-sizing: border-box;
    border: .1px solid black;
    border-radius: 50%;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
    top: 20%;
    left: 20%
  }

  .watl-bulls-eye {
    width: 34%;
    height: 34%;
    box-sizing: border-box;
    border: .1px solid black;
    border-radius: 50%;
    background: #EB0102;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
    top: 33%;
    left: 33%;
  }

  .watl-killshot {
    width: 11%;
    height: 11%;
    box-sizing: border-box;
    background: #002E83;
    border-radius: 50%;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
    top: 14%;
    left: 14%;
  }

  .watl-killshot-2 {
    width: 11%;
    height: 11%;
    box-sizing: border-box;
    background: #002E83;
    border-radius: 50%;
    position: absolute;
    display:flex;
    padding-left: 15px;
    align-items:center;
    top: 14%;
    right: 14%;
  }

</style>
