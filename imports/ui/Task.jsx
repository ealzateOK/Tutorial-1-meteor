import React from 'react';
 
export const Task = ({ task, onCheckboxClick, onEditClick, onDeleteClick }) => {
  return (
  <li>
    <input
      type="checkbox"
      checked={!!task.isChecked}
      onClick={() => onCheckboxClick(task)}
      readOnly
    />
    <span>{task.text}</span>
    <button onClick={ () => onEditClick(task)}>Editar</button>
    <button onClick={ () => onDeleteClick(task)}>&times;</button>
    
  </li>
  );
};