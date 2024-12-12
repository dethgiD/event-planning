import { useNavigate } from "react-router-dom";

export default function EventCard({ id, name, description, date, onEdit, onDelete }) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const navigate = useNavigate();

    const handleEdit = (e) => {
        e.stopPropagation(); // Prevent triggering the card's onClick
        onEdit({ id, name, description, date });
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent triggering the card's onClick
        onDelete(id);
    };

    return (
        <div className="card" onClick={() => navigate(`/events/${id}`)}>
            <h3><strong>{name}</strong></h3>
            <p>{description}</p>
            <p>{formattedDate}</p>
            <div className="card-buttons">
                <button className="edit-button" onClick={handleEdit}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="delete-button" onClick={handleDelete}>
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}
