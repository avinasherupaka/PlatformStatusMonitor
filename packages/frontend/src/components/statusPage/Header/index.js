/* eslint-disable max-len */
import React from 'react'
import Title from 'components/statusPage/Title'
import SubscriptionMenu from 'components/statusPage/SubscriptionMenu'
import classes from './Header.scss'

import {SetupAutoReload} from 'static/autoReload'
import {getTime} from 'static/loadTime'

export default class Header extends React.Component {

  componentDidMount () {
    window.onload = function () {
      SetupAutoReload()
      getTime()
    }
  }

  render () {
    return (
      <div>
        <div className={classes.intro}>
          <div className={classes.logo}>
            {/* <img src='' alt='logo' width='150px' /> */}
          </div>
          <p>This site lists the current status of several of critical systems, functionalitites and APIs and is manintained manually by our developer group. If you are experiencing an issue with any of the below services and it is listed as “Operational”, please report the issue to the #finance-sos channel. Scroll down the page to see any notices regarding scheduled maintenance and unplanned outages.</p>
        </div>
        <div className={classes.top}>
          <Title />
          <SubscriptionMenu />
        </div>
        <div id='txt' />
      </div>
    )
  }
}
