// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "./firebase";
import CreateEventForm from "./components/CreateEventForm";
import EventDetail from "./components/EventDetail";
import EventList from "./components/EventList";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Redirect login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setEventId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            WeekendPlan
          </h1>

          {!user ? (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.332 15.139 1 12.545 1 7.021 1 2.545 5.477 2.545 11s4.476 10 10 10c8.396 0 10-7.496 10-10 0-.671-.069-1.369-.156-2.045H12.545z" />
              </svg>
              Login with Google
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {user.displayName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {user && !eventId && (
          <>
            <EventList onSelectEvent={setEventId} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mt-6">
              <CreateEventForm
                userUid={user.uid}
                userName={user.displayName || "Anonymous"}
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
              currentUserName={user.displayName || "Anonymous"}
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
