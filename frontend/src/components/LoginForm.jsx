import { useState } from "react";

export default function LoginForm({ onSwitchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/login", { // ✅ Changed to port 5001
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Added for session cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful:", data);
        onLogin(); // notify App.jsx to show Dashboard
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to start creating amazing images
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-500 underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}