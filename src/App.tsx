import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import CreateEventForm from "./components/CreateEventForm";
import EventDetail from "./components/EventDetail";
import EventList from "./components/EventList";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setEventId(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // Show login/register form and pass functions
    return (
      <Auth
        login={login}
        register={register}
        loading={loading}
        error={null}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            WeekendPlan
          </h1>

          <div className="space-y-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {user.email}
            </p>
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {user && !eventId && (
          <>
            <EventList onSelectEvent={setEventId} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mt-6">
              <CreateEventForm
                userUid={user.uid}
                userName={user.email || "Anonymous"}
                onCreated={(id) => setEventId(id)}
              />
            </div>
          </>
        )}

        {user && eventId && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
            <EventDetail
              eventId={eventId}
              currentUserUid={user.uid}
              currentUserName={user.email || "Anonymous"}
            />
            <button
              onClick={() => setEventId(null)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Back to events list
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
