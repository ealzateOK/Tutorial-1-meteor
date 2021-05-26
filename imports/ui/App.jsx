import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task.jsx';
import { TaskForm } from './TaskForm';
const toggleChecked = ({ _id, isChecked }) => {
  TasksCollection.update(_id,{
    $set: {
      isChecked: !isChecked
    }
  })
};

const editTask = ({_id}) =>TasksCollection.update(_id);
const deleteTask = ({_id}) => TasksCollection.remove(_id);

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch()
  );
  return(
  <div className="app">
    <header>
      <div className="app-bar">
        <div className="app-header">
          <h1>To do list</h1>
        </div>
      </div>
    </header>
    <div className="main">
      <TaskForm/>
      <div className="filter">
        <button onClick={()=> setHideCompleted(!hideCompleted)}>
          {hideCompleted ? 'Mostrar todas' : 'Mostrar pendientes'}
        </button>
      </div>
      <ul className="tasks">
        { tasks.map(task => <Task 
        key={ task._id } 
        task={ task } 
        onCheckboxClick={toggleChecked}
        onEditClick={editTask}
        onDeleteClick={deleteTask}/>) }
      </ul>
    </div>
  </div>
)};
