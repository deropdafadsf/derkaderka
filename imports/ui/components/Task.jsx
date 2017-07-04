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

   toggleChecked() {
      // Set the checked property to the opposite of its current value
      Tasks.update(this.props.task._id, {
         $set: { checked: !this.props.task.checked },
      })
   }

   deleteThisTask() {
      Tasks.remove(this.props.task._id)
   }

   render() {
      const task = this.props.task;
      // Give tasks a different className when they are checked off,
      // so that we can style them nicely in CSS
      const taskClassNameObject = { checked:  task.checked,
                                    selected: this.props.isSelected,
      }

      const taskClassNames = Object.keys(taskClassNameObject).filter((key) => {
         return taskClassNameObject[key]
      })

      const taskClassName = taskClassNames.join(' ')


      return (
         <li onClick={this.props.onClick} className={taskClassName}>
            <input
               type="checkbox"
            checked={task.checked}
            onClick={this.toggleChecked.bind(this)}
            />
            <button onClick={() => this.props.setPomoModalOpen(true)} className="clockButton">
               <i className="fa fa-clock-o"></i>
            </button>

            <span className="text">{task.text} </span>
            <span className="pomoEstimate">({task.pomoCompleted}/{task.pomoEstimate})</span>

            <button className ="delete" onClick={this.deleteThisTask.bind(this)}>
               {/* '&times;' is the symbol for X */}
               &times;
            </button>

         </li>
      )
   }
}

Task.propTypes = {
   // This Component gets the task to display through a react prop
   // we can use proptypes to indicate it is required
   task: PropTypes.object.isRequired,
   onClick: PropTypes.func.isRequired,
   isSelected: PropTypes.bool,
}
