import Vue from 'vue'

// const model =
//   { tournament:
//     { type: String
//     , target: String
//     , teams: [ Array('team'), 'tournament' ]
//     , throwers: [ Array('thrower'), 'tournament' ]
//     , matches: [ Array('match'), 'tournament' ]
//     , rounds: [ Array('round'), 'tournament' ]
//     , started: Date
//     }
//   , team:
//     { name: String
//     , throwers: [ Array('thrower'), 'team' ]
//     , tournament: ['tournament', 'teams']
//     }
//   , thrower:
//     { name: String
//     , team: [ 'team', 'throwers' ]
//     , tournament: ['tournament', 'throwers']
//     , matches: [ Array('match'), 'throwers' ]
//     }
//   , match:
//     { game: String
//     , tournament: ['tournament', 'matches']
//     , throwers: [ Array('thrower'), 'matches' ]
//     , rounds: [ Array('round'), 'match' ]
//     }
//   , round:
//     { tournament: ['tournament', 'rounds']
//     , match: ['match', 'rounds']
//     , started: Date
//     }
//   }

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

const indexedDBAdapter = require('fortune-indexeddb')
const adapter = {adapter: [indexedDBAdapter, {name: 'smart-axe'}]}

const fortune = require('fortune')
// const store = fortune(model, adapter)
console.log('ADAPTER', adapter)
const store = fortune(model)

const VueStore = {
  install (Vue, options) {
    store.$empty = function () {
      ['round', 'match', 'thrower', 'tournament'].forEach(name => {
        store.find(name).then(result => {
          let ids = result.payload.records.map(r => { return r.id })
          if (ids.length === 0) return
          console.log('clearing', name)
          store.delete(name, ids).then(console.log)
        })
      })
    }
    Vue.prototype.$store = store
  }
}
Vue.use(VueStore)

export default VueStore
