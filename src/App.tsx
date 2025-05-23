import React, { useState, useEffect} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const auth = getAuth();

function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);

  // Calendar state
  const [date, setDate] = useState<Date>(new Date());

  // Event ID state
  const [eventId, setEventId] = useState<string | null>(null);

  // Dish input state
  const [dish, setDish] = useState("");

  // On user auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Google sign-in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Error signing in: " + (error as Error).message);
    }
  };

  const onDateChange = (
    value: Date | Date[] | null,
    event: React.SyntheticEvent
  ) => {
    if (!value) return; // null guard

    if (Array.isArray(value)) {
      setDate(value[0]);
    } else {
      setDate(value);
    }
  };

  // Sign out
  const logout = () => signOut(auth);

  // Create event with selected date
  const createEvent = async () => {
    if (!user) {
      alert("Please sign in first!");
      return;
    }

    try {
      const eventRef = await addDoc(collection(db, "events"), {
        date: date.toISOString().split("T")[0], // "YYYY-MM-DD"
        createdBy: user.uid,
        members: {},
      });
      setEventId(eventRef.id);
      alert("Event created! Event ID: " + eventRef.id);
    } catch (error) {
      alert("Error creating event: " + (error as Error).message);
    }
  };

  // Add current user’s dish to event members
  const addMyDish = async () => {
    if (!user) {
      alert("Please sign in!");
      return;
    }
    if (!eventId) {
      alert("Create an event first!");
      return;
    }
    if (!dish) {
      alert("Enter your dish!");
      return;
    }

    const eventDocRef = doc(db, "events", eventId);
    const memberField = `members.${user.uid}`;

    try {
      await updateDoc(eventDocRef, {
        [memberField]: {
          name: user.displayName || "Anonymous",
          dish,
        },
      });
      alert("Dish added!");
      setDish("");
    } catch (error) {
      alert("Error adding dish: " + (error as Error).message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">WeekendPlan</h1>

      {!user ? (
        <button
          onClick={signInWithGoogle}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <div className="mb-4">
            <p>
              Signed in as <strong>{user.displayName}</strong>
            </p>
            <button
              onClick={logout}
              className="text-sm text-red-600 underline mt-2"
            >
              Sign out
            </button>
          </div>

          <div className="mb-6">
            <Calendar onChange={onDateChange} value={date} />
          </div>

          <button
            onClick={createEvent}
            className="bg-green-600 text-white py-2 px-4 rounded mb-4"
          >
            Create Event on {date.toDateString()}
          </button>

          {eventId && (
            <div className="mb-6">
              <p>Event ID: <code>{eventId}</code></p>
              <input
                type="text"
                placeholder="What will you cook?"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <button
                onClick={addMyDish}
                className="bg-yellow-500 py-2 px-4 rounded w-full"
              >
                Add My Dish
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
