import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function GenerateLesson() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState(null);
  const [editedLesson, setEditedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  const [modules, setModules] = useState([]);
  const [processPercentage, setProcessPercentage] = useState(0);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/modules/user/${currentUser.uid}`
        );
        setModules(response.data.modules || []);

        // Check if there's a saved lesson in sessionStorage
        const savedLesson = sessionStorage.getItem("tempLesson");
        if (savedLesson) {
          const parsedLesson = JSON.parse(savedLesson);
          setLesson(parsedLesson);
          setEditedLesson(parsedLesson);
          sessionStorage.removeItem("tempLesson");
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };

    if (currentUser) {
      fetchModules();
    }
  }, [currentUser]);

  const generateLesson = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setProcessPercentage(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessPercentage((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/gpt/generate-lesson`,
        {
          topic: topic.trim(),
        }
      );

      setLesson(response.data);
      setEditedLesson(response.data);
      setProcessPercentage(100);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to generate lesson. Please try again."
      );
      console.error("Error:", err);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setTimeout(() => setProcessPercentage(0), 1000);
    }
  };

  const saveLesson = async () => {
    if (!selectedModule) {
      setSaveStatus({
        type: "error",
        message: "Please select a module to save the lesson",
      });
      return;
    }

    try {
      setSaveStatus({ type: "loading", message: "Saving lesson..." });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lessons/`,
        {
          lesson: lesson,
          moduleId: selectedModule,
        }
      );

      setSaveStatus({
        type: "success",
        message: "Lesson saved successfully!",
      });
      setLesson(null);
      setEditedLesson(null);
      setTopic("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: "", message: "" });
      }, 3000);
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: "Failed to save lesson. Please try again.",
      });
      console.log("Error while Saving Lesson to DB", err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLesson(editedLesson);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLesson(lesson);
    setIsEditing(false);
  };

  const handleContentChange = (field, value, index = null) => {
    if (index !== null) {
      setEditedLesson((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) =>
          i === index ? { ...item, content: value } : item
        ),
      }));
    } else {
      setEditedLesson((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const renderKeyTerms = (keyTerms) => {
    if (!keyTerms) return null;

    const terms = Array.isArray(keyTerms)
      ? keyTerms
      : Object.entries(keyTerms).map(([term, definition]) => ({
          term,
          definition,
        }));

    return (
      <ul className="space-y-4">
        {terms.map((item, index) => (
          <li
            key={index}
            className="border-b border-purple-400/20 pb-4 last:border-0"
          >
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.term}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index] = { ...item, term: e.target.value };
                    handleContentChange("keyTerms", newTerms);
                  }}
                  className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                  placeholder="Enter term"
                />
                <textarea
                  value={item.definition}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index] = { ...item, definition: e.target.value };
                    handleContentChange("keyTerms", newTerms);
                  }}
                  className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                  placeholder="Enter definition"
                  rows="2"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xl font-bold text-white">
                  {item.term}
                </span>
                <p className="text-white leading-relaxed pl-4 border-l-2 border-indigo-400/30">
                  {item.definition}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleCreateModule = () => {
    if (editedLesson) {
      // Save the current lesson to sessionStorage before navigating
      sessionStorage.setItem("tempLesson", JSON.stringify(editedLesson));
    }
    navigate("/manage-modules");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Generate Your Lesson
          </h1>
          <p className="mt-3 text-xl text-purple-200">
            Enter a topic and let AI create a comprehensive lesson for you
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic"
              className="flex-1 px-4 py-3 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
            <button
              onClick={generateLesson}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Lesson"
              )}
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-400/20"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin"
                  style={{ transform: `rotate(${processPercentage * 3.6}deg)` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-400">
                    {processPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-purple-400/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300"
                    style={{ width: `${processPercentage}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-purple-200">
                  {processPercentage < 30 && "Analyzing topic..."}
                  {processPercentage >= 30 &&
                    processPercentage < 60 &&
                    "Generating content..."}
                  {processPercentage >= 60 &&
                    processPercentage < 90 &&
                    "Structuring lesson..."}
                  {processPercentage >= 90 && "Finalizing..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/30 border-l-4 border-red-500 p-4 mb-8 rounded-xl">
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
                <p className="text-sm text-red-100">{error}</p>
              </div>
            </div>
          </div>
        )}

        {saveStatus.message && (
          <div
            className={`mb-8 p-4 rounded-xl ${
              saveStatus.type === "error"
                ? "bg-red-500/30 border-l-4 border-red-500"
                : saveStatus.type === "success"
                ? "bg-green-500/30 border-l-4 border-green-500"
                : "bg-blue-500/30 border-l-4 border-blue-500"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className={`h-5 w-5 ${
                    saveStatus.type === "error"
                      ? "text-red-400"
                      : saveStatus.type === "success"
                      ? "text-green-400"
                      : "text-blue-400"
                  }`}
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
                <p
                  className={`text-sm ${
                    saveStatus.type === "error"
                      ? "text-red-100"
                      : saveStatus.type === "success"
                      ? "text-green-100"
                      : "text-blue-100"
                  }`}
                >
                  {saveStatus.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {editedLesson && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="p-6 border-b border-purple-400/20">
              {!isEditing ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        {modules.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-6 bg-purple-900/30 rounded-xl border border-purple-400/30">
                            <p className="text-purple-200 mb-4">
                              No modules found. Create a module first to save
                              your lesson.
                            </p>
                          </div>
                        ) : (
                          <select
                            id="moduleSelect"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className="w-full px-4 py-3 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 appearance-none"
                          >
                            <option
                              value=""
                              className="bg-purple-900 text-white"
                            >
                              -- Choose a module --
                            </option>
                            {modules.map((module) => (
                              <option
                                key={module._id}
                                value={module._id}
                                className="bg-purple-900 text-white"
                              >
                                {module.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {modules.length > 0 && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleCreateModule}
                        className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                      >
                        Create New Module
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveLesson}
                      disabled={
                        saveStatus.type === "loading" || modules.length === 0
                      }
                      className={`px-4 py-2 rounded-xl text-white font-medium transition duration-200 shadow-lg hover:shadow-xl ${
                        saveStatus.type === "loading" || modules.length === 0
                          ? "bg-purple-400/20 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      }`}
                    >
                      {saveStatus.type === "loading"
                        ? "Saving..."
                        : "Save Lesson"}
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
                    >
                      Edit Lesson
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gradient-to-r from-purple-400/20 to-purple-500/20 text-white font-medium rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedLesson.title}
                      onChange={(e) =>
                        handleContentChange("title", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                    />
                  ) : (
                    editedLesson.title
                  )}
                </h2>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Description</h3>
                {isEditing ? (
                  <textarea
                    value={editedLesson.description}
                    onChange={(e) =>
                      handleContentChange("description", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                    rows="3"
                  />
                ) : (
                  <p className="text-white leading-relaxed pl-4 border-l-2 border-indigo-400/30">
                    {editedLesson.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Learning Outcomes
                </h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedLesson.learningOutcomes?.map((outcome, index) => (
                      <input
                        key={index}
                        type="text"
                        value={outcome}
                        onChange={(e) => {
                          const newOutcomes = [
                            ...editedLesson.learningOutcomes,
                          ];
                          newOutcomes[index] = e.target.value;
                          handleContentChange("learningOutcomes", newOutcomes);
                        }}
                        className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-white pl-4 border-l-2 border-indigo-400/30">
                    {editedLesson.learningOutcomes?.map((outcome, index) => (
                      <li key={index} className="leading-relaxed">
                        {outcome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Key Terms</h3>
                <div className="pl-4 border-l-2 border-indigo-400/30">
                  {renderKeyTerms(editedLesson.keyTerms)}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Lesson Content</h3>
                <div className="space-y-6 pl-4 border-l-2 border-indigo-400/30">
                  {editedLesson.content?.map((subTopic, index) => (
                    <div
                      key={index}
                      className="border-b border-purple-400/20 pb-6 last:border-0"
                    >
                      {isEditing ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={subTopic.subTopic}
                            onChange={(e) => {
                              const newContent = [...editedLesson.content];
                              newContent[index] = {
                                ...subTopic,
                                subTopic: e.target.value,
                              };
                              handleContentChange("content", newContent);
                            }}
                            className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 text-lg font-semibold"
                          />
                          <textarea
                            value={subTopic.content}
                            onChange={(e) => {
                              const newContent = [...editedLesson.content];
                              newContent[index] = {
                                ...subTopic,
                                content: e.target.value,
                              };
                              handleContentChange("content", newContent);
                            }}
                            className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                            rows="4"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="text-xl font-bold text-white mb-3">
                            {subTopic.subTopic}
                          </h4>
                          <p className="text-white leading-relaxed">
                            {subTopic.content}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Facts/Examples</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedLesson.examples?.map((example, index) => (
                      <input
                        key={index}
                        type="text"
                        value={example}
                        onChange={(e) => {
                          const newExamples = [...editedLesson.examples];
                          newExamples[index] = e.target.value;
                          handleContentChange("examples", newExamples);
                        }}
                        className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-white pl-4 border-l-2 border-indigo-400/30">
                    {editedLesson.examples?.map((example, index) => (
                      <li key={index} className="leading-relaxed">
                        {example}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateLesson;
