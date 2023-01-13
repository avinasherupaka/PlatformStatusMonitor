import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Link from 'components/common/Link'
import Components from 'components/statusPage/Components'
import Header from 'components/statusPage/Header'
import Incidents from 'components/statusPage/Incidents'
import Metrics from 'components/statusPage/Metrics'
import ScheduledMaintenances from 'components/statusPage/ScheduledMaintenances'
import classes from './Statuses.scss'

export default class Statuses extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      serviceName: PropTypes.string
    }).isRequired
  }

  render () {
    const components = (<Components />)
    const maintenances = (<ScheduledMaintenances />)
    const metrics = (<Metrics />)
    const incidents = (<Incidents classNames='mdl-cell mdl-cell--12-col mdl-list' />)

    return (
      <div>
        <Header />
        {maintenances}
        {components}
        {metrics}
        {incidents}
        <span className={classnames(classes.link)}><Link link='/history' text='Incident History' /></span>
      </div>
    )
  }
}
