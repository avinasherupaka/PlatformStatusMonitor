/* eslint-disable max-len */
/* eslint-disable camelcase */
import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { getComponentColor } from 'utils/status'
import classes from './Components.scss'

export default class Components extends React.Component {
  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired).isRequired,
    classNames: PropTypes.string,
    fetchComponents: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchComponents()
  }

  render () {
    var cats = new Set()
    this.props.components.forEach(function (comp) { cats.add(comp.type) })

    const components = [...cats].sort().map((cat) => {
      this.props.components = [].concat(this.props.components).sort(function (a, b) { return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 })
      const raw_components = this.props.components.map(component => {
        if (component.type !== cat) { return null }

        var description_check = ''
        if (component.description == null || component.description === '') {
          // do nothing
        } else {
          description_check = "<a href='" + component.description + "'>more info</a>"
        }

        let statusColor = getComponentColor(component.status)
        return (
          <li key={component.componentID} className={classnames('mdl-shadow--2dp', classes.item)}>
            <span className={classes['item-primary']}>
              <span>{component.name}</span>
              <span className={classes['item-subtitle']} dangerouslySetInnerHTML={{__html: description_check}} />
            </span>
            <span className={classes['item-secondary']} style={{color: statusColor}}>
              {component.status}
            </span>
          </li>
        )
      })

      var catName = cat
      if (cat == null) {
        catName = 'Uncategorized'
      }
      return (
        <div key={catName} className='CompType'>
          <h6>{catName}</h6>
          <ul>
            {raw_components}
          </ul>
        </div>
      )
    })

    return (
      <div className={classes.container}>
        {components}
      </div>
    )
  }
}
