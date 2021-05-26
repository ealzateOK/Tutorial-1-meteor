import React, { useState } from 'react';
import { TasksCollection } from '/imports/api/TasksCollection';

export const TaskForm = ({ user }) =>{
  const [text, setText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!text) return;
    TasksCollection.insert({
      text: text.trim(),
      createdAt: new Date(),
      userId: user._id
    });

    setText("");
  };

  return(
    <form className="task-form" onSubmit={handleSubmit}>
      <input
      type="text"
      placeholder="Escribe aquí para agregar tareas nuevas"
      value={text}
      onChange={(e)=> setText(e.target.value)}
      />

      <button 
      type="submit">
        Agregar tarea
      </button>
    </form>
  );
}