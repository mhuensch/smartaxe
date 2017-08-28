import Vue from 'vue'

const model =
  { tournament:
    { type: String
    , target: String
    , teams: [ Array('team'), 'tournament' ]
    , throwers: [ Array('thrower'), 'tournament' ]
    , matches: [ Array('match'), 'tournament' ]
    , rounds: [ Array('round'), 'tournament' ]
    }
  , team:
    { name: String
    , throwers: [ Array('thrower'), 'team' ]
    , tournament: ['tournament', 'teams']
    }
  , thrower:
    { name: String
    , team: [ 'team', 'throwers' ]
    , tournament: ['tournament', 'throwers']
    , matches: [ Array('match'), 'throwers' ]
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
    }
  }

const indexedDBAdapter = require('fortune-indexeddb')
const adapter = {adapter: [indexedDBAdapter, {name: 'smart-axe'}]}

const fortune = require('fortune')
const store = fortune(model, adapter)

const VueStore = {
  install (Vue, options) {
    store.$empty = function () {
      ['round', 'match', 'thrower', 'team', 'tournament'].forEach(name => {
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
