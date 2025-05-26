import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import type { EventData } from "./firebase";

const eventsCollection = collection(db, "events");

// Create new event - make sure to include creatorUid
export const createEvent = async (event: Omit<EventData, "id"> & { creatorUid: string }) => {
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

// Fetch latest event ID created by a specific user
export const fetchUserLatestEventId = async (creatorUid: string): Promise<string | null> => {
  const q = query(
    eventsCollection,
    where("creatorUid", "==", creatorUid),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  return docSnap.id;
};
