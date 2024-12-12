import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import TaskForm from './TaskForm';
import TaskUpdateForm from './TaskUpdateForm'; 
import TaskUpdatesModal from './TaskUpdatesModal';
import useEventData from '../../hooks/useEventData';
import api from '../../services/api';
import './eventpage.css';
import Header from './Header';

export default function EventPage() {
  const { id } = useParams();
  const {
    event, 
    tasks, 
    isLoading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask
  } = useEventData(id);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskUpdateForm, setShowTaskUpdateForm] = useState(false);
  const [showTaskUpdatesModal, setShowTaskUpdatesModal] = useState(false); 
  const [taskUpdates, setTaskUpdates] = useState([]);

  const handleFetchTaskUpdates = useCallback(async (taskId) => {
    try {
      const updates = await api.fetchTaskUpdates(taskId);
      setTaskUpdates(updates);
      setShowTaskUpdatesModal(true);
    } catch (err) {
      console.error('Failed to fetch task updates', err);
    }
  }, []);

  const handleTaskSubmit = useCallback(async (formData) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, formData);
      } else {
        await addTask(formData);
      }
      setShowTaskForm(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Task submission failed', err);
    }
  }, [selectedTask, addTask, updateTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    await deleteTask(taskId);
  }, [deleteTask]);

  const handleTaskUpdateSubmit = useCallback(async (formData) => {
    try {
      const updateData = {
        ...formData,
        taskId: selectedTask.id
      };
      await api.createTaskUpdate(updateData);
      setShowTaskUpdateForm(false);
      setTaskUpdates(prevUpdates => [...prevUpdates, updateData]);
    } catch (err) {
      console.error('Task update failed', err);
    }
  }, [selectedTask]);

  const closeTaskUpdatesModal = useCallback(() => {
    setShowTaskUpdatesModal(false);
    setTaskUpdates([]);
  }, []);

  const handleDeleteTaskUpdate = useCallback(async (updateId) => {
    try {
      await api.deleteTaskUpdate(updateId);
      setTaskUpdates(prevUpdates => prevUpdates.filter(update => update.id !== updateId));
    } catch (err) {
      console.error('Failed to delete task update', err);
    }
  }, []);
  
  const handleUpdateTaskUpdate = useCallback(async (updateId, updatedData) => {
    try {
      const updatedUpdate = await api.updateTaskUpdate(updateId, updatedData);
      setTaskUpdates(prevUpdates => 
        prevUpdates.map(update => 
          update.id === updateId ? updatedUpdate : update
        )
      );
    } catch (err) {
      console.error('Failed to update task update', err);
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading event</div>;

  return (
    <>
      <Header/>
      <div className="event-page-container">
        {event && (
          <div className="event-info">
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <button className="new-task-button" onClick={() => setShowTaskForm(true)}>
              <i className="fas fa-plus-circle"></i> Create New Task
            </button>
          </div>
        )}

        <div className="task-list">
          <h2>Task List</h2>
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Due Date: {new Date(task.dueDate).toISOString().split('T')[0]}</p>

              <div className="task-icons">
                <i className="fas fa-edit" onClick={() => {
                  setSelectedTask(task);
                  setShowTaskForm(true);
                }} title='Edit Task'></i>
                <i className="fas fa-trash-alt" onClick={() => handleDeleteTask(task.id)} title='Delete Task'></i>
                <i className="fas fa-eye" onClick={() => handleFetchTaskUpdates(task.id)} title='See Task Updates'></i>
                <i className="fas fa-plus-circle" onClick={() => {
                  setSelectedTask(task);
                  setShowTaskUpdateForm(true);
                }} title='Add a Task Update'></i>
              </div>
            </div>
          ))}
        </div>

        {showTaskForm && (
          <TaskForm
            task={selectedTask}
            eventId={parseInt(id, 10)}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowTaskForm(false);
              setSelectedTask(null);
            }}
          />
        )}

        {showTaskUpdateForm && (
          <TaskUpdateForm
            task={selectedTask}
            eventId={parseInt(id, 10)}
            onSubmit={handleTaskUpdateSubmit}
            onCancel={() => {
              setShowTaskUpdateForm(false);
              setSelectedTask(null);
            }}
          />
        )}

        <TaskUpdatesModal
          taskUpdates={taskUpdates}
          isOpen={showTaskUpdatesModal}
          onClose={closeTaskUpdatesModal}
          onDeleteUpdate={handleDeleteTaskUpdate} 
          onUpdateUpdate={handleUpdateTaskUpdate} 
        />
      </div>
    </>
  );
}