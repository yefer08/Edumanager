import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', listo: false });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        setTasks(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      await addDoc(collection(db, 'tasks'), newTask);
      setNewTask({ description: '', listo: false });
      // Refetch tasks
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      setTasks(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (id) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, { listo: !tasks.find(task => task.id === id).listo });
      setTasks(tasks.map(task => task.id === id ? { ...task, listo: !task.listo } : task));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="task-list-container">
      <h1>Lista de Tareas Académicas</h1>
      
      <div className="add-task-section">
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Descripción de la tarea"
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-task-btn">
          Agregar Tarea
        </button>
      </div>

      <ul className="tasks-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.listo ? 'completed' : 'pending'}`}>
            <span className="task-description">
              {task.description} - {task.listo ? 'Completado' : 'Pendiente'}
            </span>
            <div className="task-actions">
              <button 
                onClick={() => handleUpdateTask(task.id)}
                className={`status-btn ${task.listo ? 'mark-pending' : 'mark-completed'}`}
              >
                {task.listo ? 'Marcar como Pendiente' : 'Marcar como Completado'}
              </button>
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="delete-btn"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;