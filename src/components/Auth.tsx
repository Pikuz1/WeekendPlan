import { useEffect, useState } from "react";
import {
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  type User,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth, provider } from "../firebase";

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Redirect sign-in error:", error);
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
    // Handles user state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Handles result after redirect (if any)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
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
