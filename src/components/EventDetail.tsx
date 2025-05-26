// src/components/EventDetail.tsx
import React, { useEffect, useState } from "react";
import { listenEvent, updateEvent } from "../firebaseService";
import type { EventData } from "../types";

interface Props {
  eventId: string;
  currentUserUid: string;
  currentUserName: string;
}

const EventDetail: React.FC<Props> = ({ eventId, currentUserUid, currentUserName }) => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [userDish, setUserDish] = useState("");
  const [userNote, setUserNote] = useState("");
  const [isAttending, setIsAttending] = useState(true);

  useEffect(() => {
    const unsubscribe = listenEvent(eventId, (data) => {
      setEvent(data);
      if (data?.members?.[currentUserUid]) {
        const member = data.members[currentUserUid];
        setUserDish(member.dish?.join(", ") || "");
        setUserNote(member.note || "");
        setIsAttending(member.isAttending ?? true);
      }
    });
    return () => unsubscribe();
  }, [eventId, currentUserUid]);

  if (!event) return <p>Loading event...</p>;

  const members = Object.values(event.members || {});

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDish(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNote(e.target.value);
  };

  const handleAttendanceToggle = () => {
    setIsAttending((prev) => !prev);
  };

  const saveDish = async () => {
    const updatedMembers = {
      ...event.members,
      [currentUserUid]: {
        uid: currentUserUid,
        name: currentUserName,
        dish: userDish.split(",").map((d) => d.trim()).filter(Boolean), // fixed property name: dish (not dishes)
        note: userNote,
        isAttending,
      },
    };

    await updateEvent(event.id!, {
      members: updatedMembers,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Event on {event.date}</h2>
      <h3 className="text-lg font-semibold mb-2">Members and their contributions</h3>

      <ul className="mb-4 list-disc list-inside">
        {members.map((m) => (
          <li key={m.uid}>
            {m.name} {m.isAttending === false && "(Not attending)"} <br />
            <strong>Dishes:</strong> {m.dish?.join(", ") || "—"} <br />
            <strong>Note:</strong> {m.note || "—"}
          </li>
        ))}
      </ul>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Comma separated dishes"
          value={userDish}
          onChange={handleDishChange}
          className="border p-2 rounded w-full mb-2"
        />

        <input
          type="text"
          placeholder="Optional note (e.g. allergies, preferences)"
          value={userNote}
          onChange={handleNoteChange}
          className="border p-2 rounded w-full mb-2"
        />

        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={isAttending}
            onChange={handleAttendanceToggle}
          />
          I am attending
        </label>

        <button onClick={saveDish} className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Save my details
        </button>
      </div>
    </div>
  );
};

export default EventDetail;
