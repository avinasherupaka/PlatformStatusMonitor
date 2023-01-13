import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'
import componentReducer from 'reducers/components'
import incidentReducer from 'reducers/incidents'
import maintenanceReducer from 'reducers/maintenances'
import metricsReducer from 'reducers/metrics'
import userReducer from 'reducers/users'
import settingsReducer from 'reducers/settings'

const rootReducer = combineReducers({
  components: componentReducer,
  incidents: incidentReducer,
  maintenances: maintenanceReducer,
  user: userReducer,
  settings: settingsReducer,
  metrics: metricsReducer,
  router
})

export default rootReducer
