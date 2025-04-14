"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InputField from "@/components/forms/InputField"; // Import InputField component
import ErrorMessage from "@/components/forms/ErrorMessage"; // Import ErrorMessage component

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("client"); // Default to 'client'
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // for loading state
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error on new attempt
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true); // Start loading
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      document.cookie = `token=${data.token}; path=/; HttpOnly; Secure`;

      router.push("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <InputField
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="w-full">
            <InputField
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="role" className="block mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
            >
              <option value="client">Client</option>
              <option value="provider">Provider</option>
            </select>
          </div>
          {error && <ErrorMessage message={error} />}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
