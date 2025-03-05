import React, { useState, useContext } from "react";
import { executeCode } from "../api";
import { AuthContext } from "../context/AuthContext";
import Layout from "./Layout";
import { ThemeContext } from "../context/ThemeContext";
import {
  AiOutlineReload,
  AiOutlineSetting,
  AiOutlineDownload,
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";

const Editor = () => {
  const [languageId, setLanguageId] = useState(null);
  const [sourceCode, setSourceCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (languageId === null) {
      alert("Please select a language before running the code!");
      return;
    }

    try {
      const response = await executeCode(languageId, sourceCode, userInput, user.token);
      console.log("User Token before executeCode:", user.token);
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err.response?.data?.message || "Execution failed");
    }
  };

  const handleReset = () => {
    setSourceCode("");
    setUserInput("");
    setResult("");
    setError("");
  };

  const handleDownload = () => {
    const blob = new Blob([sourceCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        
        {/* Top Bar with Settings, Refresh, Run */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSettingsOpen(true)} className="text-gray-600 dark:text-gray-300 text-xl">
              <AiOutlineSetting />
            </button>
            <button onClick={handleReset} className="text-gray-600 dark:text-gray-300 text-xl">
              <AiOutlineReload />
            </button>
          </div>
          <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-sm">
            Run
          </button>
        </div>

        <div className="flex flex-grow">
          {/* Left Side - Code Editor */}
          <div className="w-3/5 p-4 border-r flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Code Editor</h2>

            {/* Language Selection */}
            <label htmlFor="language" className="block text-sm font-medium mb-1">Language:</label>
            <select
              id="language"
              value={languageId || ""}
              onChange={(e) => setLanguageId(parseInt(e.target.value))}
              className={`block w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-blue-500 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <option value="" disabled hidden>Select a Language</option>
              <option value={71}>Python</option>
              <option value={50}>C</option>
              <option value={54}>C++</option>
              <option value={62}>Java</option>
              <option value={60}>Go</option>
            </select>

            {/* Code Input */}
            <label htmlFor="code" className="block text-sm font-medium mt-4">Code:</label>
            <textarea
              id="code"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              className={`mt-1 block w-full py-2 px-3 border rounded-md font-mono ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
              rows="16"
            />
          </div>

          {/* Right Side - User Input & Output */}
          <div className="w-2/5 flex flex-col">
            
            {/* User Input Section */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold mb-1">User Input</h3>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={`w-full p-2 border rounded font-mono resize-none ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                }`}
                placeholder="Enter input here..."
                rows="4"
              />
            </div>

            {/* Output Section (Now More Visible) */}
            <div className="flex-1 p-4 mt-2 border rounded-lg overflow-y-auto whitespace-pre-wrap max-h-80">
              <h3 className="text-lg font-semibold mb-2">Output/Errors</h3>
              {error && <p className="text-red-500">{error}</p>}
              {result && (
                <pre className={`p-4 rounded font-mono break-words whitespace-pre-wrap ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                }`}>
                  {result}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Settings Popup */}
        {isSettingsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`w-96 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-600 dark:text-gray-300 text-xl">
                  <AiOutlineClose />
                </button>
              </div>

              {/* Font Size Control */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm font-medium">Font Size:</span>
                <button onClick={() => setFontSize((prev) => Math.max(10, prev - 2))} className="p-1 bg-gray-300 rounded">
                  <AiOutlineMinus />
                </button>
                <span className="text-sm">{fontSize}px</span>
                <button onClick={() => setFontSize((prev) => Math.min(24, prev + 2))} className="p-1 bg-gray-300 rounded">
                  <AiOutlinePlus />
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={theme === "dark"} onChange={toggleTheme} />
                <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                  <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${theme === "dark" ? "translate-x-6" : ""}`} />
                </div>
                <span className="ml-3 text-sm">Dark Mode</span>
              </label>

              {/* Download Button */}
              <button onClick={handleDownload} className="mt-4 flex items-center bg-blue-500 text-white py-2 px-3 rounded">
                <AiOutlineDownload className="mr-2" /> Download Code
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Editor;
