import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task.jsx';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm'
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

  const user = useTracker(() => Meteor.user());

  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter= user ? { userId: user._id} : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter};

  const tasks = useTracker(() =>{
    if(!user){
      return[];
    }
  
    return TasksCollection.find(
      hideCompleted ? hideCompletedFilter : userFilter, 
      {
      sort: { createdAt: -1 },
      }
    ).fetch();
  }
  );

  const pendingTasksCount = useTracker(() =>{
    if(!user){
      return 0;
    }
    return TasksCollection.find(pendingOnlyFilter).count();
  }
    
  );

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;

  const logout = () => Meteor.logout();

  return(
  
  <div className="app">
    <header>
      <div className="app-bar">
        <div className="app-header">
          <h1>To do list
          {pendingTasksTitle}
          </h1>
        </div>
      </div>
    </header>
    <div className="main">
    {user ? (
    <Fragment> 
      <div className="user" onClick={logout}>
          {user.username}
      </div>
      <TaskForm user = {user}/>

      <div className="filter">
        <button onClick={()=> setHideCompleted(!hideCompleted)}>
          {hideCompleted ? 'Mostrar todas' : 'Mostrar pendientes'}
        </button>
      </div>

      <ul className="tasks">
        { tasks.map(task => (<Task 
        key={ task._id } 
        task={ task } 
        onCheckboxClick={toggleChecked}
        onEditClick={editTask}
        onDeleteClick={deleteTask}
        />
        ))}
      </ul>
      </Fragment>
  ) : (
    <LoginForm/>
  )}
    </div>
  </div>
  
)};
