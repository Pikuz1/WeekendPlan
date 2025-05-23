import './App.css'
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in:", user.email);
      } else {
        console.log("Not logged in");
      }
    });

    return () => unsub();
  }, []);

  return <h1>Weekend Plan App</h1>;
}
export default App
