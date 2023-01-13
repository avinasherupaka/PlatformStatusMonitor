import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents } from 'actions/incidents'
import { fetchMaintenances } from 'actions/maintenances'
import History from './History'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents,
    maintenances: state.maintenances.maintenances,
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents, fetchMaintenances}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
