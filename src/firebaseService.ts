// src/firebaseService.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import type { EventData } from "./firebase";

const eventsCollection = collection(db, "events");

// Create new event
export const createEvent = async (event: Omit<EventData, "id">) => {
  const docRef = await addDoc(eventsCollection, {
    ...event,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update existing event (members or date or note, etc.)
export const updateEvent = async (
  eventId: string,
  data: Partial<EventData>
) => {
  const eventDoc = doc(db, "events", eventId);
  await updateDoc(eventDoc, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Get single event snapshot listener (real-time updates)
export const listenEvent = (
  eventId: string,
  callback: (event: EventData | null) => void
) => {
  const eventDoc = doc(db, "events", eventId);
  return onSnapshot(eventDoc, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as EventData);
    } else {
      callback(null);
    }
  });
};
