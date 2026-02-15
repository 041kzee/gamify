"use client";

import { Oswald } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function ContactPage() {
  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-slate-800">
            Get in Touch
          </h1>
          <img
            src="/contact-removebg-preview.png"
            alt="Contact"
            className="h-40 w-40"
          />
        </div>

        <p className="text-slate-600 mb-12">
          Have questions? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Info Section */}
          <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-slate-800">Email</h2>
              <p className="text-slate-600">your@email.com</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-slate-800">Phone</h2>
              <p className="text-slate-600">+91 98765 43210</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-slate-800">Address</h2>
              <p className="text-slate-600">
                Your Company Name <br />
                Your Street Address <br />
                City, Country
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <form className="bg-white p-8 rounded-3xl shadow-md border border-emerald-100 space-y-6">
            
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-emerald-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-emerald-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full border border-emerald-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              Send Message
            </button>

          </form>
        </div>

      </div>

      <Footer />
    </div>
  );
}
