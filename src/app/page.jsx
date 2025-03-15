"use client";
import React, {useState} from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [formData, setFormData] = useState({
    subject: "",
    question: "",
    instructions: "",
  });
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setGeneratedAnswer(message);
      setStreamingMessage("");
    },
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateAnswer = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/integrations/google-gemini/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Subject: ${formData.subject}\nQuestion: ${formData.question}\nAdditional Instructions: ${formData.instructions}\n\nPlease provide a detailed, well-structured academic response.`,
            },
          ],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    } catch (err) {
      setError("Failed to generate answer. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await fetch(
        "/integrations/pdf-generation/markdown-to-pdf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            markdown: `# ${formData.subject}\n\n## Assignment Question\n${formData.question}\n\n## Answer\n${generatedAnswer}`,
            styles: `
            body { font-family: Times New Roman, serif; line-height: 1.6; }
            h1 { color: #1a365d; }
            h2 { color: #2c5282; }
          `,
          }),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.subject.replace(/\s+/g, "_")}_assignment.pdf`;
      a.click();
    } catch (err) {
      setError("Failed to generate PDF. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Assignment Writer
        </h1>
        <p className="text-lg text-gray-600">
          Get detailed, well-structured answers for your academic assignments
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="subject"
          >
            Subject/Topic
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="question"
          >
            Assignment Question/Prompt
          </label>
          <textarea
            id="question"
            name="question"
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.question}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="instructions"
          >
            Additional Instructions (Optional)
          </label>
          <textarea
            id="instructions"
            name="instructions"
            rows="3"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.instructions}
            onChange={handleInputChange}
          />
        </div>

        <button
          onClick={generateAnswer}
          disabled={isLoading || !formData.question}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Answer"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {(streamingMessage || generatedAnswer) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Generated Answer
            </h2>
            <button
              onClick={generatePDF}
              className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900"
            >
              Convert to PDF
            </button>
          </div>
          <div className="prose max-w-none">
            {streamingMessage || generatedAnswer}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;