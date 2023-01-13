import React from 'react'
import classes from './Drawer.scss'
import { Link } from 'react-router'

const components = {
  components: {
    name: 'Components',
    path: '/components',
    icon: 'group_work'
  },
  incidents: {
    name: 'Incidents',
    path: '/incidents',
    icon: 'report'
  },
  maintenances: {
    name: 'Scheduled Maintenance',
    path: '/maintenances',
    icon: 'schedule'
  },
  metrics: {
    name: 'Metrics',
    path: '/metrics',
    icon: 'show_chart'
  },
  users: {
    name: 'Users',
    path: '/users',
    icon: 'account_box'
  },
  settings: {
    name: 'Settings',
    path: '/settings',
    icon: 'settings'
  }
}

const Drawer = () => {
  const drawerItems = Object.keys(components).map((key) => {
    const icon = <i className='material-icons'>{ components[key].icon }</i>
    return (
      <Link key={key} to={components[key].path} className={classes['navi-link']}
        activeClassName={classes.active} onlyActiveOnIndex>
        <span className={classes['large-window']}>{icon}{ components[key].name }</span>
        <span className={classes['small-window']}>{icon}</span>
      </Link>
    )
  })

  return (
    <div className={classes.drawer}>
      <nav className={classes.navi}>
        {drawerItems}
      </nav>
      <div className={classes.logo}>
        <a>Feedbacks are welcome!</a>
      </div>
    </div>
  )
}

export default Drawer
