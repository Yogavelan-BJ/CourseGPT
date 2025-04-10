import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewModule() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const [expandedLessons, setExpandedLessons] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    learningOutcomes: true,
    keyTerms: true,
    content: true,
    examples: true,
  });

  useEffect(() => {
    const fetchModuleAndLessons = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch module details
        const moduleResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/modules/${moduleId}`
        );
        setModule(moduleResponse.data);

        // Fetch lessons for the module
        const lessonsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/modules/${moduleId}/lessons`
        );
        setLessons(lessonsResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch module details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleAndLessons();
    }
  }, [moduleId]);

  const handleEditLesson = (lesson) => {
    setEditingLesson({ ...lesson });
    if (!expandedLessons[lesson._id]) {
      toggleLesson(lesson._id);
    }
  };

  const handleSaveLesson = async () => {
    try {
      setSaveStatus({ type: "loading", message: "Saving changes..." });

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/lessons/${editingLesson._id}`,
        editingLesson
      );

      setSaveStatus({
        type: "success",
        message: "Lesson updated successfully!",
      });

      // Update the lessons list
      setLessons(
        lessons.map((lesson) =>
          lesson._id === editingLesson._id ? response.data : lesson
        )
      );

      // Clear editing state after 2 seconds
      setTimeout(() => {
        setEditingLesson(null);
        setSaveStatus({ type: "", message: "" });
      }, 2000);
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: "Failed to update lesson. Please try again.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
  };

  const handleContentChange = (field, value, index = null) => {
    if (index !== null) {
      setEditingLesson((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) =>
          i === index ? { ...item, content: value } : item
        ),
      }));
    } else {
      setEditingLesson((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSectionHeader = (title, section) => (
    <div
      className="flex justify-between items-center cursor-pointer group"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-xl font-bold text-teal-400 group-hover:text-teal-300 transition duration-200">
        {title}
      </h3>
      <button className="text-purple-400 hover:text-teal-400 transition duration-200">
        {expandedSections[section] ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );

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
            {editingLesson ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.term}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index] = { ...item, term: e.target.value };
                    handleContentChange("keyTerms", newTerms);
                  }}
                  className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                  placeholder="Enter term"
                />
                <textarea
                  value={item.definition}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index] = { ...item, definition: e.target.value };
                    handleContentChange("keyTerms", newTerms);
                  }}
                  className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                  placeholder="Enter definition"
                  rows="2"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xl font-bold text-teal-400">
                  {item.term}
                </span>
                <p className="text-purple-200 leading-relaxed pl-4 border-l-2 border-teal-400/30">
                  {item.definition}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {module?.name}
            </h1>
            <p className="mt-2 text-lg text-purple-200">
              {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
            </p>
            <div className="mt-4 p-4 bg-purple-900/30 rounded-xl border border-purple-400/30 max-w-2xl">
              <p className="text-sm text-purple-200">
                <span className="font-semibold text-white">Note:</span> Lesson
                content is intentionally concise due to API constraints and
                potential API Gateway time limits.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/manage-modules")}
            className="px-6 py-3 bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-medium rounded-xl hover:from-purple-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Modules
          </button>
        </div>

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

        <div className="space-y-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/10 transition duration-200"
                onClick={() => toggleLesson(lesson._id)}
              >
                <h2 className="text-2xl font-bold text-white">
                  {lesson.title}
                </h2>
                <div className="flex items-center space-x-4">
                  {editingLesson?._id !== lesson._id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLesson(lesson);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-teal-400 to-purple-500 text-white font-medium rounded-xl hover:from-teal-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl"
                    >
                      Edit Lesson
                    </button>
                  )}
                  <button className="text-purple-400 hover:text-teal-400 transition duration-200">
                    {expandedLessons[lesson._id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {expandedLessons[lesson._id] && (
                <div className="px-6 pb-6">
                  {editingLesson?._id === lesson._id ? (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                          <input
                            type="text"
                            value={editingLesson.title}
                            onChange={(e) =>
                              handleContentChange("title", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                          />
                        </h2>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveLesson}
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-medium rounded-xl hover:from-green-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gradient-to-r from-purple-400/20 to-purple-500/20 text-white font-medium rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          {renderSectionHeader("Description", "description")}
                          {expandedSections.description && (
                            <textarea
                              value={editingLesson.description}
                              onChange={(e) =>
                                handleContentChange(
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200 mt-4"
                              rows="3"
                            />
                          )}
                        </div>

                        <div>
                          {renderSectionHeader(
                            "Learning Outcomes",
                            "learningOutcomes"
                          )}
                          {expandedSections.learningOutcomes && (
                            <div className="space-y-2 mt-4">
                              {editingLesson.learningOutcomes?.map(
                                (outcome, index) => (
                                  <input
                                    key={index}
                                    type="text"
                                    value={outcome}
                                    onChange={(e) => {
                                      const newOutcomes = [
                                        ...editingLesson.learningOutcomes,
                                      ];
                                      newOutcomes[index] = e.target.value;
                                      handleContentChange(
                                        "learningOutcomes",
                                        newOutcomes
                                      );
                                    }}
                                    className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          {renderSectionHeader("Key Terms", "keyTerms")}
                          {expandedSections.keyTerms && (
                            <div className="mt-4">
                              {renderKeyTerms(editingLesson.keyTerms)}
                            </div>
                          )}
                        </div>

                        <div>
                          {renderSectionHeader("Lesson Content", "content")}
                          {expandedSections.content && (
                            <div className="space-y-6 mt-4">
                              {editingLesson.content?.map((subTopic, index) => (
                                <div
                                  key={index}
                                  className="border-b border-purple-400/20 pb-6 last:border-0"
                                >
                                  <div className="space-y-4">
                                    <input
                                      type="text"
                                      value={subTopic.subTopic}
                                      onChange={(e) => {
                                        const newContent = [
                                          ...editingLesson.content,
                                        ];
                                        newContent[index] = {
                                          ...subTopic,
                                          subTopic: e.target.value,
                                        };
                                        handleContentChange(
                                          "content",
                                          newContent
                                        );
                                      }}
                                      className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200 text-lg font-semibold"
                                    />
                                    <textarea
                                      value={subTopic.content}
                                      onChange={(e) => {
                                        const newContent = [
                                          ...editingLesson.content,
                                        ];
                                        newContent[index] = {
                                          ...subTopic,
                                          content: e.target.value,
                                        };
                                        handleContentChange(
                                          "content",
                                          newContent
                                        );
                                      }}
                                      className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                                      rows="4"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          {renderSectionHeader("Facts/Examples", "examples")}
                          {expandedSections.examples && (
                            <div className="space-y-2 mt-4">
                              {editingLesson.examples?.map((example, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  value={example}
                                  onChange={(e) => {
                                    const newExamples = [
                                      ...editingLesson.examples,
                                    ];
                                    newExamples[index] = e.target.value;
                                    handleContentChange(
                                      "examples",
                                      newExamples
                                    );
                                  }}
                                  className="w-full px-4 py-2 border border-purple-400/30 bg-white/10 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div>
                        {renderSectionHeader("Description", "description")}
                        {expandedSections.description && (
                          <p className="text-purple-200 leading-relaxed mt-4 pl-4 border-l-2 border-teal-400/30">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      <div>
                        {renderSectionHeader(
                          "Learning Outcomes",
                          "learningOutcomes"
                        )}
                        {expandedSections.learningOutcomes && (
                          <ul className="list-disc list-inside space-y-2 mt-4 text-purple-200 pl-4 border-l-2 border-teal-400/30">
                            {lesson.learningOutcomes?.map((outcome, index) => (
                              <li key={index} className="leading-relaxed">
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div>
                        {renderSectionHeader("Key Terms", "keyTerms")}
                        {expandedSections.keyTerms && (
                          <div className="mt-4 pl-4 border-l-2 border-teal-400/30">
                            {renderKeyTerms(lesson.keyTerms)}
                          </div>
                        )}
                      </div>

                      <div>
                        {renderSectionHeader("Lesson Content", "content")}
                        {expandedSections.content && (
                          <div className="space-y-6 mt-4 pl-4 border-l-2 border-teal-400/30">
                            {lesson.content?.map((subTopic, index) => (
                              <div
                                key={index}
                                className="border-b border-purple-400/20 pb-6 last:border-0"
                              >
                                <h4 className="text-xl font-bold text-teal-400 mb-3">
                                  {subTopic.subTopic}
                                </h4>
                                <p className="text-purple-200 leading-relaxed">
                                  {subTopic.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        {renderSectionHeader("Facts/Examples", "examples")}
                        {expandedSections.examples && (
                          <ul className="list-disc list-inside space-y-2 mt-4 text-purple-200 pl-4 border-l-2 border-teal-400/30">
                            {lesson.examples?.map((example, index) => (
                              <li key={index} className="leading-relaxed">
                                {example}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewModule;
