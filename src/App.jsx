import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  History,
  Trash2,
  Copy,
  Check,
  X,
  Menu,
  FileText,
  Settings2,
  ChevronRight,
  Database,
  Moon,
  Sun,
  Loader2,
  Share2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import Doc from "./SwaggerDoc.jsx";

const App = () => {
  const location = useLocation();

  if (location.pathname === "/docs") {
    return <Doc />;
  }

  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState({
    length: "medium",
    format: "bullet",
    tone: "professional",
  });

  const base_url = "/api";

  const fetchHistory = async () => {
    try {
      const res = await fetch(base_url + "/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setSummary("");

    try {
      // Backend API Call
      const response = await fetch(base_url + "/groq/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          options: options,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);
      if (!response.ok) throw new Error("Server error");

      setSummary(data.summary);
      await fetchHistory();
    } catch (error) {
      console.error("Summarization error:", error);
      setSummary(`Error: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteHistoryItem = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`${base_url}/history/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const loadHistoryItem = (item) => {
    setSummary(item.summary);
    // setInputText(item.originalText);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const OptionBadge = ({ active, onClick, label }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-blue-900">
              Text Summarizer AI
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => (window.location.href = "/docs")}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              API Docs
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 flex flex-col rounded-3xl p-1 transition-all duration-300 bg-white border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>Source Text</span>
                  </div>
                  <div className="flex gap-2">
                    {inputText && (
                      <button
                        onClick={() => setInputText("")}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  className="flex-1 w-full bg-transparent resize-none p-4 focus:outline-none text-base leading-relaxed placeholder-gray-400"
                  placeholder="Paste your article, email, or document here to summarize..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <div className="p-4 bg-gray-50 rounded-b-[20px] flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                        Length
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["short", "medium", "long"].map((l) => (
                          <OptionBadge
                            key={l}
                            label={l}
                            active={options.length === l}
                            onClick={() =>
                              setOptions({ ...options, length: l })
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                        Format
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["paragraph", "bullet"].map((f) => (
                          <OptionBadge
                            key={f}
                            label={f}
                            active={options.format === f}
                            onClick={() =>
                              setOptions({ ...options, format: f })
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                        Tone
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["professional", "casual"].map((t) => (
                          <OptionBadge
                            key={t}
                            label={t}
                            active={options.tone === t}
                            onClick={() => setOptions({ ...options, tone: t })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSummarize}
                    disabled={loading || !inputText}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
                      loading || !inputText
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Summary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`flex-col h-full rounded-3xl overflow-hidden transition-all duration-300 relative bg-white border border-gray-200 shadow-sm ${
                summary ? "flex" : "hidden lg:flex"
              }`}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                  <span>AI Output</span>
                </div>
                {summary && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                {summary ? (
                  <div className="prose max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
                      <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-center font-medium">
                      Ready to summarize
                    </p>
                    <p className="text-center text-sm max-w-xs opacity-75">
                      Configure your settings on the left and hit generate.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <div>
          {showSidebar && (
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          <aside
            className={`fixed inset-y-0 right-0 z-30 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-l border-gray-200 bg-white shadow-2xl md:shadow-none
              ${
                showSidebar
                  ? "translate-x-0"
                  : "translate-x-full md:translate-x-0"
              }
             ${!showSidebar && "hidden md:block"} 
            `}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Database className="w-4 h-4 text-indigo-500" />
                  <span>History</span>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No saved summaries yet</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => loadHistoryItem(item)}
                      className="group relative p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => deleteHistoryItem(item._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          {item.options.length}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          •
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          {item.options.format}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* <div className="p-4 border-t border-gray-200 text-center bg-gray-50/50">
                <p className="text-xs text-gray-400">
                  Data persists locally (Mock DB)
                </p>
              </div> */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
