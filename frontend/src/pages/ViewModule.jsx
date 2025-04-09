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
      className="flex justify-between items-center cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <button className="text-gray-500 hover:text-gray-700">
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
      <ul className="space-y-2">
        {terms.map((item, index) => (
          <li key={index} className="border-b border-gray-200 pb-2">
            {editingLesson ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.term}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index] = { ...item, term: e.target.value };
                    handleContentChange("keyTerms", newTerms);
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
                <textarea
                  value={item.definition}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index] = { ...item, definition: e.target.value };
                    handleContentChange("keyTerms", newTerms);
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            ) : (
              <>
                <span className="font-semibold">{item.term}</span>
                <p className="text-gray-600">{item.definition}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{module?.name}</h1>
        <button
          onClick={() => navigate("/manage-modules")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back to Modules
        </button>
      </div>

      {saveStatus.message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            saveStatus.type === "error"
              ? "bg-red-100 text-red-700"
              : saveStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {saveStatus.message}
        </div>
      )}

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleLesson(lesson._id)}
            >
              <h2 className="text-2xl font-bold">{lesson.title}</h2>
              <div className="flex items-center space-x-4">
                {editingLesson?._id !== lesson._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLesson(lesson);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit Lesson
                  </button>
                )}
                <button className="text-gray-500 hover:text-gray-700">
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
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        <input
                          type="text"
                          value={editingLesson.title}
                          onChange={(e) =>
                            handleContentChange("title", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </h2>
                      <div className="space-x-2">
                        <button
                          onClick={handleSaveLesson}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader("Description", "description")}
                      {expandedSections.description && (
                        <textarea
                          value={editingLesson.description}
                          onChange={(e) =>
                            handleContentChange("description", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded mt-2"
                          rows="3"
                        />
                      )}
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader(
                        "Learning Outcomes",
                        "learningOutcomes"
                      )}
                      {expandedSections.learningOutcomes && (
                        <div className="space-y-2 mt-2">
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
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader("Key Terms", "keyTerms")}
                      {expandedSections.keyTerms && (
                        <div className="mt-2">
                          {renderKeyTerms(editingLesson.keyTerms)}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader("Lesson Content", "content")}
                      {expandedSections.content && (
                        <div className="space-y-4 mt-2">
                          {editingLesson.content?.map((subTopic, index) => (
                            <div
                              key={index}
                              className="border-b border-gray-200 pb-4"
                            >
                              <div className="space-y-2">
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
                                    handleContentChange("content", newContent);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
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
                                    handleContentChange("content", newContent);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                  rows="3"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      {renderSectionHeader("Examples", "examples")}
                      {expandedSections.examples && (
                        <div className="space-y-2 mt-2">
                          {editingLesson.examples?.map((example, index) => (
                            <input
                              key={index}
                              type="text"
                              value={example}
                              onChange={(e) => {
                                const newExamples = [...editingLesson.examples];
                                newExamples[index] = e.target.value;
                                handleContentChange("examples", newExamples);
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      {renderSectionHeader("Description", "description")}
                      {expandedSections.description && (
                        <p className="text-gray-700 mt-2">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader(
                        "Learning Outcomes",
                        "learningOutcomes"
                      )}
                      {expandedSections.learningOutcomes && (
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {lesson.learningOutcomes?.map((outcome, index) => (
                            <li key={index} className="text-gray-700">
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader("Key Terms", "keyTerms")}
                      {expandedSections.keyTerms && (
                        <div className="mt-2">
                          {renderKeyTerms(lesson.keyTerms)}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      {renderSectionHeader("Lesson Content", "content")}
                      {expandedSections.content && (
                        <div className="space-y-4 mt-2">
                          {lesson.content?.map((subTopic, index) => (
                            <div
                              key={index}
                              className="border-b border-gray-200 pb-4"
                            >
                              <h4 className="text-lg font-medium mb-2">
                                {subTopic.subTopic}
                              </h4>
                              <p className="text-gray-700">
                                {subTopic.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      {renderSectionHeader("Examples", "examples")}
                      {expandedSections.examples && (
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {lesson.examples?.map((example, index) => (
                            <li key={index} className="text-gray-700">
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
  );
}

export default ViewModule;
