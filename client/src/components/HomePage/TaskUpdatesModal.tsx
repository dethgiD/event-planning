import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface TaskUpdate {
  id: string;
  updateText: string;
  updatedAt?: string;
}

interface TaskUpdatesModalProps {
  taskUpdates: TaskUpdate[];
  onClose: () => void;
  onDeleteUpdate: (id: string) => void;
  onUpdateUpdate: (id: string) => void;
  isOpen: boolean; // Added to control modal visibility
}

const TaskUpdatesModal: React.FC<TaskUpdatesModalProps> = ({ 
  taskUpdates, 
  onClose, 
  isOpen, 
  onDeleteUpdate,
  onUpdateUpdate
}) => {
  // If modal is not open, return null
  if (!isOpen) return null;

  // Prevent body scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle keyboard events
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Task Updates</h2>
        </div>

        <div className="p-4">
          {taskUpdates.length === 0 ? (
            <p className="text-gray-500 text-center">No updates available for this task.</p>
          ) : (
            <div className="space-y-4">
              {taskUpdates.map((update) => (
                <div 
                  key={update.id} 
                  className="bg-gray-100 p-3 rounded-md"
                >
                  <p className="text-gray-800">{update.updateText}</p>
                  {update.updatedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(update.updatedAt).toLocaleString()}
                    </p>
                  )}

                  <div className="space-x-4 flex items-center">
                    <FaEdit 
                      onClick={() => onUpdateUpdate(update.id)} 
                      className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                      size={20} 
                      title="Update"
                    />
                    <FaTrashAlt 
                      onClick={() => onDeleteUpdate(update.id)} 
                      className="text-red-500 cursor-pointer hover:text-red-600"
                      size={20} 
                      title="Delete"
                    />
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskUpdatesModal;