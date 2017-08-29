import Vue from 'vue'
import Router from 'vue-router'
import Tournaments from '@/components/Tournaments'
import Teams from '@/components/Teams'
import Throwers from '@/components/Throwers'
import ThrowersNew from '@/components/Throwers_New'
import Matches from '@/components/Matches'
import MatchesNew from '@/components/Matches_New'
import Round from '@/components/Round'

import Natf from '@/components/Target-NATF'
import Watl from '@/components/Target-WATL'

Vue.use(Router)

export default new Router({
  routes:
    [ { path: '/', name: 'home', redirect: '/tournaments' }
    , { path: '/tournaments', name: 'tournaments', component: Tournaments }
    , { path: '/tournaments/:tournamentId/teams', name: 'teams', component: Teams }
    , { path: '/tournaments/:tournamentId/throwers', name: 'throwers', component: Throwers }
    , { path: '/tournaments/:tournamentId/throwers-new', name: 'throwers-new', component: ThrowersNew }
    , { path: '/tournaments/:tournamentId/matches', name: 'matches', component: Matches }
    , { path: '/tournaments/:tournamentId/matches-new', name: 'matches-new', component: MatchesNew }
    , { path: '/tournaments/:tournamentId/matches/:matchId/rounds/:roundId', name: 'rounds', component: Round }

    , { path: '/watl', name: 'watl', component: Watl }
    , { path: '/natf', name: 'natf', component: Natf }
    ]
})
