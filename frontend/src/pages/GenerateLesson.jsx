import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function GenerateLesson() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState(null);
  const [editedLesson, setEditedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModule, setSelectedModule] = useState(1);
  const { currentUser } = useAuth();
  const saveLesson = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/lessons/", {
        lesson: lesson,
        user: currentUser,
        moduleId: selectedModule,
      });
      console.log(response);
    } catch (err) {
      console.log("Error while Saving Lesson to DB", err.message);
    }
  };
  const generateLesson = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/gpt/generate-lesson",
        {
          topic: topic.trim(),
        }
      );

      setLesson(response.data);
      setEditedLesson(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to generate lesson. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
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
      <ul className="space-y-2">
        {terms.map((item, index) => (
          <li key={index} className="border-b border-gray-200 pb-2">
            {isEditing ? (
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topic"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateLesson}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Lesson"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {editedLesson && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          {!isEditing ? (
            <div className="space-x-2 m-2 flex justify-center items-center">
              <select
                id="moduleSelect"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="">-- Choose a module --</option>
                <option value="92813469">History</option>
              </select>
              <button
                onClick={saveLesson}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Lesson
              </button>
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit Lesson
              </button>
            </div>
          ) : (
            <div className="space-x-2 m-2 flex justify-center items-center">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {isEditing ? (
                <input
                  type="text"
                  value={editedLesson.title}
                  onChange={(e) => handleContentChange("title", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                editedLesson.title
              )}
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            {isEditing ? (
              <textarea
                value={editedLesson.description}
                onChange={(e) =>
                  handleContentChange("description", e.target.value)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded"
                rows="3"
              />
            ) : (
              <p className="text-gray-700">{editedLesson.description}</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
            {isEditing ? (
              <div className="space-y-2">
                {editedLesson.learningOutcomes?.map((outcome, index) => (
                  <input
                    key={index}
                    type="text"
                    value={outcome}
                    onChange={(e) => {
                      const newOutcomes = [...editedLesson.learningOutcomes];
                      newOutcomes[index] = e.target.value;
                      handleContentChange("learningOutcomes", newOutcomes);
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {editedLesson.learningOutcomes?.map((outcome, index) => (
                  <li key={index} className="text-gray-700">
                    {outcome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Key Terms</h3>
            {renderKeyTerms(editedLesson.keyTerms)}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Lesson Content</h3>
            <div className="space-y-4">
              {editedLesson.content?.map((subTopic, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  {isEditing ? (
                    <div className="space-y-2">
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
                        className="w-full px-2 py-1 border border-gray-300 rounded"
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
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="text-lg font-medium mb-2">
                        {subTopic.subTopic}
                      </h4>
                      <p className="text-gray-700">{subTopic.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Examples</h3>
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
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {editedLesson.examples?.map((example, index) => (
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
  );
}

export default GenerateLesson;
