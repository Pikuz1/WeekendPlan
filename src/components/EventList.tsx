// src/components/EventList.tsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import type { EventData } from "../types";

interface EventListProps {
  onSelectEvent: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ onSelectEvent }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedEvents: EventData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as EventData;
        loadedEvents.push({
          id: doc.id,
          ...data,
          // convert timestamp to string if needed
          createdAt: data.createdAt
            ? data.createdAt
            : data.createdAt || "",
        });
      });
      setEvents(loadedEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
  
    try {
      await deleteDoc(doc(db, "events", eventId));
      // Optionally, you can show a success message here
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("Failed to delete event.");
    }
  };

  if (loading) return <p>Loading events...</p>;

  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Your Events
      </h2>
      <ul>
        {events.map((event) => (
          <li
            key={event.id}
            className="cursor-pointer p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => event.id && onSelectEvent(event.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {event.eventName}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                I will bring: {event.members?.[event.createdBy]?.dish || "Unknown"}
            </p>
            <button
                onClick={(e) => {
                e.stopPropagation();
                if (event.id) handleDelete(event.id);
                }}
                className="ml-4 text-red-600 hover:text-red-800"
                aria-label={`Delete event ${event.eventName}`}
            >
            Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
