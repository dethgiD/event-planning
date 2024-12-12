import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export default function useEventData(eventId) {
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventData = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      const [eventData, tasksData] = await Promise.all([
        api.fetchEvent(eventId),
        api.fetchTasks(eventId)
      ]);

      setEvent(eventData);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError(err);
      setEvent(null);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      const updatedTask = await api.updateTask(taskId, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }, []);

  return {
    event,
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchEventData
  };
}