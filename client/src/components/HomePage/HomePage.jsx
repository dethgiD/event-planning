import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import "./cards.css";
import Header from "./Header";
import CreateEditModal from "./CreateEditModal";

const api = "https://event-planning-l5he.onrender.com/api/events/";

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    // Fetch events from the API
    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(api, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    const errorData = await response.json();
                    console.error("Error:", errorData.message || "Unknown error");
                    alert(errorData.message || "Fetching events failed. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchEvents();
    }, []);

    // Handle editing an event (open modal)
    const handleEdit = (event) => {
        setCurrentEvent(event);
        setModalOpen(true);
    };

    // Handle creating a new event (open modal with empty event data)
    const handleCreate = () => {
        setCurrentEvent(null); // Ensure no event data is passed for a new event
        setModalOpen(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentEvent(null);
    };

    // Handle saving an edited or new event
    const handleSave = async (updatedEvent) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(api + (updatedEvent.id || ""), {
                method: updatedEvent.id ? "PUT" : "POST", // PUT for edit, POST for new
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedEvent),
            });
            if (response.ok) {
                const savedEvent = await response.json();
                setEvents((prevEvents) =>
                    updatedEvent.id
                        ? prevEvents.map((e) => (e.id === updatedEvent.id ? savedEvent : e)) // Update edited event
                        : [...prevEvents, savedEvent] // Add new event
                );
                handleCloseModal();
            } else {
                const errorData = await response.json();
                console.error("Error saving event:", errorData.message || "Unknown error");
                alert(errorData.message || "Saving event failed. Please try again.");
            }
        } catch (error) {
            console.error("Error saving event:", error.message);
        }
    };

    // Handle deleting an event
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(api + id, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id)); // Remove deleted event
            } else {
                const errorData = await response.json();
                console.error("Error deleting event:", errorData.message || "Unknown error");
                alert(errorData.message || "Deleting event failed. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting event:", error.message);
        }
    };

    // Map events to EventCard components
    const listEvents = events.map((event) => (
        <div className="column" key={event.id}>
            <EventCard
                id={event.id}
                name={event.name}
                description={event.description}
                date={event.date}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    ));

    return (
        <>
            <Header />
            <div className="row">
                {listEvents}
                <div className="flex justify-center sm:justify-start w-full px-4">
                    <button
                        className="btn bg-blue-500 text-white w-full sm:w-auto py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
                        onClick={handleCreate}
                    >
                        Create Event
                    </button>
                </div>
            </div>
            
            {isModalOpen && (
                <CreateEditModal
                    data={currentEvent}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
