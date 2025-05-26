import React, { useState } from "react";

type AuthProps = {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
};

const Auth: React.FC<AuthProps> = ({ login, register }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      await register(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded w-fit max-w-sm">
      <h2 className="text-xl mb-4">{isRegistering ? "Register" : "Login"}</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-2 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-2 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {isRegistering ? (
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      )}

      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-blue-600 underline"
        >
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
