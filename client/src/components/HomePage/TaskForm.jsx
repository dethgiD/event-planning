import React, { useState, useEffect } from 'react';

export default function TaskForm({ 
  task, 
  eventId, 
  onSubmit, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'To Do',
    eventId: eventId
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        dueDate: task.dueDate 
          ? new Date(task.dueDate).toISOString().split('T')[0] 
          : '',
        status: task.status || 'To Do',
        eventId: eventId
      });
    }
  }, [task, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Task Name"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task Description"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="To Do">To Do</option>
            <option value="Completed">Completed</option>
          </select>
          <div>
            <button type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}