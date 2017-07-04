import React, { Component, PropTypes } from 'react'

import { Tasks } from '../../api/tasks.js'

// Task Component - represents a single todo item
export default class Task extends Component {
   constructor(props) {
      super(props)

      this.state = {
         isSelected: false,
      }
   }

   render() {

      return (
        <label>MyPomoPlaceholder</label>
      )
   }
}

Task.propTypes = {
}
