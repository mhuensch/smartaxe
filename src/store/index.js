import Vue from 'vue'

const model =
  { tournament:
    { type: String
    , target: String
    , throwers: [ Array('thrower'), 'tournament' ]
    , matches: [ Array('match'), 'tournament' ]
    , rounds: [ Array('round'), 'tournament' ]
    , started: Date
    }
  , thrower:
    { name: String
    , tournament: ['tournament', 'throwers']
    , matches: [ Array('match'), 'throwers' ]
    , rounds: [ Array('round'), 'throwers' ]
    }
  , match:
    { game: String
    , tournament: ['tournament', 'matches']
    , throwers: [ Array('thrower'), 'matches' ]
    , rounds: [ Array('round'), 'match' ]
    }
  , round:
    { tournament: ['tournament', 'rounds']
    , match: ['match', 'rounds']
    , throwers: [ Array('thrower'), 'rounds' ]
    , turnSize: Number
    , team1: Object
    , team2: Object
    , started: Date
    }
  }

// TODO: re-implement once index db adapter can fix bug that doesnt allow you to delete records?
// const indexedDBAdapter = require('fortune-indexeddb')
// const adapter = {adapter: [indexedDBAdapter, {name: 'smart-axe'}]}
// const store = fortune(model, adapter)

const fortune = require('fortune')
const store = fortune(model)

const VueStore = {
  install (Vue, options) {
    Vue.prototype.$store = store
  }
}

Vue.use(VueStore)

export default store
