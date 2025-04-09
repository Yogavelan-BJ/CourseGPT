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
        `http://localhost:5000/api/modules/user/${currentUser.uid}`
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
      await axios.post("http://localhost:5000/api/modules", {
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Module Management
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Create New Module
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="moduleName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Module Name
            </label>
            <input
              type="text"
              id="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter module name"
            />
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Module
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Your Modules
        </h2>
        {fetchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-sm text-red-600">{fetchError}</p>
          </div>
        )}
        {modules.length === 0 ? (
          <p className="text-gray-500">No modules created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div
                key={module._id}
                onClick={() => navigate(`/view-module/${module._id}`)}
                className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {module.lessons?.length || 0} lessons
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModuleManagement;
