"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [userName, setUserName] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="px-6 py-4 bg-white/80 backdrop-blur-sm  top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="/logo.png"
              className="h-16 w-16 md:h-20 md:w-20"
              alt="PandaLearn Logo"
            />
            <span className="text-xl md:text-2xl font-bold text-slate-800">
              PandaPilot
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push("/features")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Features
            </button>

            <button
              onClick={() => router.push("/about")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
            >
              About
            </button>

            <button
              onClick={() => router.push("/contact")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() =>router.push("/")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Dashboard
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-3 items-center">
            {userName ? (
              <>
                <span className="text-slate-700 font-medium">
                  Hello, {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <nav className="flex flex-col gap-4">

              <button
                onClick={() => {
                  router.push("/#features");
                  setIsMenuOpen(false);
                }}
                className="text-left text-slate-700 hover:text-emerald-600 font-medium py-2"
              >
                Features
              </button>

              <button
                onClick={() => {
                  router.push("/#about");
                  setIsMenuOpen(false);
                }}
                className="text-left text-slate-700 hover:text-emerald-600 font-medium py-2"
              >
                About
              </button>

              <button
                onClick={() => {
                  router.push("/#contact");
                  setIsMenuOpen(false);
                }}
                className="text-left text-slate-700 hover:text-emerald-600 font-medium py-2"
              >
                Contact
              </button>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-200">
                {userName ? (
                  <>
                    <span className="text-slate-700 font-medium">
                      Hello, {userName}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left text-slate-700"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        router.push("/register");
                        setIsMenuOpen(false);
                      }}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
