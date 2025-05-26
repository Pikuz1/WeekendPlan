import React, { useState } from "react";
import CalendarView from "./CalendarView"; // import your reusable calendar component
import { createEvent } from "../firebaseService";
import type { EventData } from "../types";

interface Props {
  userUid: string;
  userName: string;
  onCreated: (eventId: string) => void;
}

const CreateEventForm: React.FC<Props> = ({ userUid, userName, onCreated }) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [eventName, setEventName] = useState("");
  const [dish, setDish] = useState("");

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!eventName || !dish || !date) {
      alert("Please fill all fields");
      return;
    }

    const eventData: Omit<EventData, "id"> & { creatorUid: string } = {
      date: date.toISOString().split("T")[0],
      createdBy: userUid,
      creatorUid: userUid,
      eventName,
      members: {
        [userUid]: {
          uid: userUid,
          name: userName,
          dish: [dish],
          note: "",
          isAttending: true,
        },
      },
      createdAt: "", // serverTimestamp() recommended here
      updatedAt: "",
    };

    const eventId = await createEvent(eventData);
    onCreated(eventId);
  };

  return (
    <div className="border p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">Create a new Event</h2>

      {/* Use CalendarView instead of Calendar */}
      <CalendarView onDateSelect={handleDateSelect} />

      <p>Selected Date for the event : {date?.toLocaleDateString()}</p>

      <input
        type="text"
        placeholder="Your name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="text"
        placeholder="Your dish"
        value={dish}
        onChange={(e) => setDish(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        Create Event
      </button>
    </div>
  );
};

export default CreateEventForm;
