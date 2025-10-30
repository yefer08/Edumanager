import React from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import TaskList from '../components/TaskList';

const TareasPage = () => {
  return (
    <div className="tareas-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1>Gestión de Tareas Académicas</h1>
          <p>Organiza y gestiona tus actividades de estudio</p>
        </div>
        <TaskList />
      </main>
    </div>
  );
};

export default TareasPage;