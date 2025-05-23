import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";
import type { User } from "firebase/auth";


const Auth = () => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded w-fit">
      {user ? (
        <div>
          <p className="mb-2">Welcome, {user.displayName}</p>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={signIn}
          className="bg-green-600 px-3 py-1 rounded text-white"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Auth;
