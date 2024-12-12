import React, { useState, useEffect } from 'react';

export default function TaskUpdateForm({ 
  task, 
  eventId, 
  onSubmit, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    updateText: '',
    taskId: task ? task.id : '',
    eventId: eventId,
  });

  useEffect(() => {
    if (task) {
      setFormData(prev => ({
        ...prev,
        taskId: task.id
      }));
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
        <h2>{task ? 'Add Task Update' : 'Create New Task Update'}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            name="updateText"
            value={formData.updateText}
            onChange={handleChange}
            placeholder="Task Update Description"
            required
          />
          <div>
            <button type="submit">
              Add Update
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