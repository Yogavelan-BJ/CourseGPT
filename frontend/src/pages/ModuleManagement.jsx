import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function ModuleManagement() {
  const [moduleName, setModuleName] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState("");
  const [modules, setModules] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchModules = async () => {
    try {
      setFetchError("");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/modules/user/${currentUser.uid}`
      );
      setModules(response.data.modules || []);
    } catch (err) {
      setFetchError(err.response?.data?.message || "Failed to fetch modules");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchModules();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSuccess("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/modules`, {
        name: moduleName,
        userId: currentUser.uid,
      });

      setSuccess("Module created successfully!");
      setModuleName("");
      // Immediately fetch updated modules
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      await fetchModules();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to create module");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/generate-lesson")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Lesson Generation
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Module Management
          </h1>
          <p className="mt-3 text-xl text-purple-200">
            Create and manage your learning modules
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="p-6 border-b border-purple-400/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Create New Module
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="moduleName"
                  className="block text-sm font-medium text-purple-200 mb-2"
                >
                  Module Name
                </label>
                <input
                  type="text"
                  id="moduleName"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                  placeholder="Enter module name"
                />
              </div>

              {submitError && (
                <div className="bg-red-500/30 border-l-4 border-red-500 p-4 rounded-xl">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-100">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-500/30 border-l-4 border-green-500 p-4 rounded-xl">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-100">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className=" cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-600 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition duration-200"
              >
                Create Module
              </button>
            </form>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Your Modules
            </h2>
            {fetchError && (
              <div className="bg-red-500/30 border-l-4 border-red-500 p-4 rounded-xl mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-100">{fetchError}</p>
                  </div>
                </div>
              </div>
            )}
            {modules.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">
                  No modules
                </h3>
                <p className="mt-1 text-sm text-purple-200">
                  Get started by creating a new module.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <div
                    key={module._id}
                    onClick={() => navigate(`/view-module/${module._id}`)}
                    className="group p-6 bg-indigo-900/80 backdrop-blur-lg border border-purple-900/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:bg-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white group-hover:text-teal-400 transition-colors duration-200">
                        {module.name}
                      </h3>
                      <svg
                        className="h-5 w-5 text-purple-400 group-hover:text-teal-400 transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-purple-200">
                      {module.lessons?.length || 0}{" "}
                      {module.lessons?.length === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleManagement;
