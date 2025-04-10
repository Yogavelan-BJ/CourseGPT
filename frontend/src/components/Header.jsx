import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="h-8 w-8 text-white"
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
              <span className="text-xl font-bold text-white">CourseGPT</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-blue-200 focus:outline-none"
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
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/manage-modules"
                    className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Manage Modules
                  </Link>
                  <Link
                    to="/generate-lesson"
                    className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Generate Lesson
                  </Link>
                </div>
                <div className="flex items-center space-x-4 border-l border-blue-500 pl-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">
                      {currentUser.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden fixed inset-0 bg-blue-600 z-50 transform translate-x-full transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center h-16 px-4">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center space-x-2">
                    <svg
                      className="h-8 w-8 text-white"
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
                    <span className="text-xl font-bold text-white">
                      CourseGPT
                    </span>
                  </Link>
                </div>
                <button
                  type="button"
                  className="text-white hover:text-blue-200 focus:outline-none"
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
              <div className="flex-1 px-4 py-6 space-y-4">
                {currentUser ? (
                  <>
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-lg font-medium">
                        {currentUser.email?.split("@")[0]}
                      </span>
                    </div>
                    <Link
                      to="/manage-modules"
                      className="block text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium transition duration-200"
                    >
                      Manage Modules
                    </Link>
                    <Link
                      to="/generate-lesson"
                      className="block text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium transition duration-200"
                    >
                      Generate Lesson
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-base font-medium transition duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium transition duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-base font-medium transition duration-200"
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
