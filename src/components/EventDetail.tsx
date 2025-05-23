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

  useEffect(() => {
    const unsubscribe = listenEvent(eventId, setEvent);
    return () => unsubscribe();
  }, [eventId]);

  if (!event) return <p>Loading event...</p>;

  const members = Object.values(event.members || {});

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDish(e.target.value);
  };

  const saveDish = async () => {
    // update current user's dish in Firestore
    const updatedMembers = {
      ...event.members,
      [currentUserUid]: {
        uid: currentUserUid,
        name: currentUserName,
        dish: userDish
      }
    };

    await updateEvent(event.id!, { members: updatedMembers });
  };

  return (
    <div>
      <h2>Event on {event.date}</h2>

      <h3>Members and their dishes</h3>
      <ul>
        {members.map((m) => (
          <li key={m.uid}>
            {m.name}: {m.dish}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="What are you bringing?"
        value={userDish}
        onChange={handleDishChange}
      />
      <button onClick={saveDish}>Save</button>
    </div>
  );
};

export default EventDetail;
