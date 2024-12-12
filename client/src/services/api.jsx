import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  getToken: () => localStorage.getItem('token'),

  fetchEvent: async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${api.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  fetchTasks: async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}/tasks`, {
        headers: { Authorization: `Bearer ${api.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  fetchTaskUpdates: async (taskId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}/taskupdates`, {
        headers: { Authorization: `Bearer ${api.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching task updates:', error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    console.log(taskData);
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
        headers: { 
          Authorization: `Bearer ${api.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData, {
        headers: { 
          Authorization: `Bearer ${api.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${api.getToken()}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  createTaskUpdate: async (updateData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/task-updates`, updateData, {
        headers: { 
          Authorization: `Bearer ${api.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task update:', error);
      throw error;
    }
  },

  deleteTaskUpdate: async (updateId) => {
    try {
      await axios.delete(`${API_BASE_URL}/task-updates/${updateId}`, {
        headers: { Authorization: `Bearer ${api.getToken()}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting task update:', error);
      throw error;
    }
  },

  updateTaskUpdate: async (updateId, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/task-updates/${updateId}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${api.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task update:', error);
      throw error;
    }
  }

};

export default api;