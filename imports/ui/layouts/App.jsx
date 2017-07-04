import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data'

import PropTypes from 'prop-types'
import { Tasks } from '../../api/tasks.js'

import Task from '../components/Task.jsx'
import PomoTimer from '../components/PomoTimer.jsx'

import PomoModal from '../components/PomoModal.jsx'

// App Component - represents the whole app
class App extends Component {
   constructor(props) {
      super(props)

      this.state = {
         hideCompleted: false,
         selectedItem: undefined,
         pomoEstimate: 0,
         pomoModalOpen: false,
      }
      this.pomoOnChange = this.pomoOnChange.bind(this)
      this.setPomoModalOpen= this.setPomoModalOpen.bind(this)
   }

   clickHandler(id) {
      this.setState({selectedItem: id})
   }

   pomoOnChange(event) {
      this.setState({pomoEstimate: event.target.value})
      console.log("fired")
   }

   setPomoModalOpen(open) {
      this.setState({pomoModalOpen: open})
   }

   handleSubmit(event) {
      event.preventDefault()

      // Find the text field via the React ref
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()

      Tasks.insert({
         text,
         createdAt: new Date(), //current time
         pomoEstimate: Number(this.state.pomoEstimate),
         pomoCompleted: 0,
      })

      // clear form
      this.setState({pomoEstimate: 0})
      ReactDOM.findDOMNode(this.refs.textInput).value = ''
   }

   toggleHideCompleted() {
      this.setState({
         hideCompleted: !this.state.hideCompleted,
      })
   }


   renderTasks() {
         let filteredTasks = this.props.tasks
         if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked)
         }
         return filteredTasks.map((task) => {
            const isSelected = task._id === this.state.selectedItem
            return(
               <Task
                  key  = {task._id}
                  task = {task}
                  onClick = { () => {this.clickHandler(task._id)} }
                  isSelected = {isSelected}
                  setPomoModalOpen = {this.setPomoModalOpen}
               />)
         })
   }

   render() {
      return (
         <div className="container">
            <header>
               <h1>Todo List ({this.props.incompleteCount})</h1>

               <label className="hide-completed">
                  <input
                     type="checkbox"
                     readOnly
                     checked={this.state.hideCompleted}
                     onClick={this.toggleHideCompleted.bind(this)}
                  />
               Hide Completed Tasks
               </label>

               <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                  <input
                     type="text"
                     ref="textInput"
                     placeholder="Type to add new task"
                  />
                  <div className="form-group">
                    <label className="sr-only" htmlFor="sel1">Pomo Estimate:</label>
                    <select value={this.state.pomoEstimate} onChange={this.pomoOnChange} className="form-control" id="sel1">
                      <option value="0" >0</option>
                      <option value="1" >1</option>
                      <option value="2" >2</option>
                      <option value="3" >3</option>
                      <option value="4" >4</option>
                    </select>
                  </div>
               </form>
            </header>

            {this.state.pomoModalOpen ? <PomoModal />: ''}

            <ul>
               {this.renderTasks()}
            </ul>
            <div>
               <PomoTimer/>
            </div>
         </div>
      )
   }
}

App.propTypes = {
   tasks: PropTypes.array.isRequired,
   incompleteCount: PropTypes.number.isRequired,
}

export default createContainer(() => {
   return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
   }
}, App)
