import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Task } from './Task.jsx';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm'; 

const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call('tasks.setIsChecked', _id, !isChecked);
};

const editTask = ({_id}) =>TasksCollection.update(_id);
const deleteTask = ({_id}) => Meteor.call('tasks.remove', _id);

export const App = () => {

  const user = useTracker(() => Meteor.user(), []);

  const [tasks, setTasks] = useState([]);

  const [allTasks, setAllTasks] = useState([]);

  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: false };

  const userFilter = user ? { userId: user._id} : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter};

  const handleHideCompletedOptions = (tareas)=>{
    const filterTasks = hideCompleted
      ? tareas.filter((task) => task.isChecked === false)
      : tareas;

    setTasks(filterTasks);
  };

  
  const initialRenderHideCompleted = useRef(true);

  const initialRender = useRef(true);
  
  useEffect(() => {
    console.log(hideCompleted);
    Meteor.call('tasks.findAll', hideCompleted,(err, res) => {
      if (err){
        console.log(err);
        setTasks([]);
        setAllTasks([]);
      }
        setTasks(res);
        setAllTasks(res);
    });
    
    
  }, [user]);

  useEffect(() => {
    console.log(hideCompleted);
    const filterParams = JSON.stringify(hideCompleted ? pendingOnlyFilter : userFilter);
    console.log(`filtro consulta: ${filterParams}`);
    if(initialRenderHideCompleted.current){
      initialRenderHideCompleted.current = false;

      return;
    }
    Meteor.call('tasks.findAll', hideCompleted,(err, res) => {
      if (err){
        console.log(err);
        setTasks([]);
        setAllTasks([]);
      }
        setTasks(res);
        setAllTasks(res);
    });

    handleHideCompletedOptions(allTasks);
    
  }, [hideCompleted]);

  const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

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
          {user.username} 🚪
          {user.userId}
      </div>
      <TaskForm />

      <div className="filter">
        <button onClick={()=> setHideCompleted(!hideCompleted)}>
          {hideCompleted ? 'Mostrar todas' : 'Ocultar tareas completadas'}
        </button>
      </div>
      

      <ul className="tasks">
        { tasks.map(task => (
        <Task 
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
  
  );
};
