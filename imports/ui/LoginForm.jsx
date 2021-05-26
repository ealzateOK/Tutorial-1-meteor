import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();

    Meteor.loginWithPassword(username,password);
  }

  return(
    <form onSubmit={submit} className="login-form">
      <label htmlFor="username">Usuario</label>

      <input
        type="text"
        placeholder="Usuario"
        name="username"
        required
        onChange={e => setUsername(e.target.value)}
      />

      <label htmlFor="password">Contraseña</label>

      <input
        type="password"
        placeholder="Contraseña"
        name="password"
        required
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Ingresar</button>
    </form>
  );
}
