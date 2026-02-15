"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400"],
});

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-6`}>
      <div className="max-w-[1100px] w-full bg-white rounded-3xl shadow-xl flex overflow-hidden border border-emerald-100">

        <div className="hidden md:flex w-1/2 items-center justify-center bg-emerald-50">
          <img
            src="/panda-removebg-preview.png"
            alt="Login Illustration"
            className="w-72"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-6 text-center md:text-left">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center md:text-left">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="text-sm text-slate-600 block mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-slate-600 block mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-full font-medium shadow-md transition-all duration-300 w-full ${
              loading
                ? "bg-slate-400 text-white cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-slate-500 mt-6 text-center md:text-left">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-emerald-600 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
