"use client";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AIPage() {
  const [messages, setMessages] = useState([]); // [{role: "user", text: ""}, {role: "ai", text: ""}]
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMessage = { role: "user", text: query };
    setMessages((prev) => [...prev, newMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "No response" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error connecting to server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl border border-gray-200 flex flex-col h-[80vh]">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          AI Assistant 🤖
        </h1>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 border rounded-lg bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-500 text-sm">🤖 AI is typing...</div>
          )}

          {/* <div ref={chatEndRef} /> */}
        </div>

        {/* Input Box */}
        <form
          onSubmit={handleAsk}
          className="mt-4 flex items-center gap-2 border rounded-lg px-3"
        >
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 p-3 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleAsk(e);
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
          >
            <FiSend className="text-lg" />
          </button>
        </form>

        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="mt-2 text-sm text-red-500 hover:underline self-center"
          >
            Clear Chat
          </button>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
