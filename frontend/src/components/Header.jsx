import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <header className="bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                CourseGPT
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-teal-400 focus:outline-none transition duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-6">
                  <Link
                    to="/manage-modules"
                    className="text-white hover:text-teal-400 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 hover:bg-white/10"
                  >
                    Manage Modules
                  </Link>
                  <Link
                    to="/generate-lesson"
                    className="text-white hover:text-teal-400 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 hover:bg-white/10"
                  >
                    Generate Lesson
                  </Link>
                </div>
                <div className="flex items-center space-x-6 border-l border-purple-400/30 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-medium shadow-lg">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">
                      {currentUser.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-purple-400/20 to-purple-500/20 text-white hover:from-purple-500/30 hover:to-purple-600/30 px-6 py-2 rounded-xl text-sm font-medium transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-white hover:text-teal-400 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:from-teal-500 hover:to-purple-600 px-6 py-2 rounded-xl text-sm font-medium transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 z-50 transform ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center h-20 px-4">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center shadow-lg">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                      CourseGPT
                    </span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-teal-400 focus:outline-none transition duration-200"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 px-4 py-8 space-y-6">
                {currentUser ? (
                  <>
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-medium shadow-lg">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-lg font-medium">
                        {currentUser.email?.split("@")[0]}
                      </span>
                    </div>
                    <Link
                      to="/manage-modules"
                      className="block text-white hover:text-teal-400 px-4 py-3 rounded-xl text-base font-medium transition duration-200 hover:bg-white/10"
                    >
                      Manage Modules
                    </Link>
                    <Link
                      to="/generate-lesson"
                      className="block text-white hover:text-teal-400 px-4 py-3 rounded-xl text-base font-medium transition duration-200 hover:bg-white/10"
                    >
                      Generate Lesson
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-purple-400/20 to-purple-500/20 text-white hover:from-purple-500/30 hover:to-purple-600/30 px-6 py-3 rounded-xl text-base font-medium transition duration-200 shadow-lg hover:shadow-xl"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-white hover:text-teal-400 px-4 py-3 rounded-xl text-base font-medium transition duration-200 hover:bg-white/10"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:from-teal-500 hover:to-purple-600 px-6 py-3 rounded-xl text-base font-medium transition duration-200 shadow-lg hover:shadow-xl"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
