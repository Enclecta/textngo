"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import {
  Sparkles,
  Copy,
  Check,
  X,
  Trash2,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Bot,
  Mail,
  FileText,
  MessageSquare,
  Code,
  Wand2,
  Hash,
  CaseUpper,
  CaseLower,
  Pilcrow,
  Heading,
  Smile,
  Hash as NumbersIcon,
  FlipHorizontal2,
  Flame,
  Sun,
  Moon,
  Loader2,
  Zap,
  Sparkle,
  AlertCircle,
  Clock,
  File,
  Type,
  User,
  Github,
  Twitter,
  Mail as ContactIcon,
  Rocket,
  Brain,
  Shield,
  BookOpen,
  Scissors,
  Menu,
  ChevronDown,
  ChevronUp,
  Verified,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

/* ---------------- TEXT UTILS ---------------- */
const removeExtraSpaces = (t: string) => t.replace(/\s+/g, " ").trim();
const removeLineBreaks = (t: string) => t.replace(/\n+/g, " ");
const toUpperCase = (t: string) => t.toUpperCase();
const toLowerCase = (t: string) => t.toLowerCase();
const toSentenceCase = (t: string) =>
  t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
const removeEmojis = (t: string) =>
  t.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
const toTitleCase = (t: string) =>
  t.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
const reverseText = (t: string) => t.split("").reverse().join("");
const removeNumbers = (t: string) => t.replace(/\d/g, "");
const removeSpecialChars = (t: string) => t.replace(/[^\w\s]/g, "");
const toCamelCase = (t: string) =>
  t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

/* ---------------- COMPONENT ---------------- */
export default function Home() {
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [step, setStep] = useState(-1);
  const [feedback, setFeedback] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    lines: 1,
    readingTime: 0,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"simple" | "ai">("simple");
  const [aiLoading, setAiLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const [showStats, setShowStats] = useState(true);

  // Set mounted to true when component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize dark mode
  useEffect(() => {
    if (!mounted) return;

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkMode(prefersDark);
    }
  }, [mounted]);

  // Apply dark mode class
  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode, mounted]);

  // Update stats when text changes
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 1;
    const readingTime = Math.ceil(words / 200);

    setStats({
      words,
      characters: text.length,
      lines,
      readingTime,
    });

    // Update history
    if (step === -1) {
      setHistory([text]);
      setStep(0);
    } else if (history[step] !== text) {
      const updated = history.slice(0, step + 1);
      setHistory([...updated, text]);
      setStep(updated.length);
    }
  }, [text]);

  /* ---------- Toast ---------- */
  const showToast = useCallback((msg: string, icon?: React.ReactNode) => {
    setToast(`${icon ? icon + " " : ""}${msg}`);
    setTimeout(() => setToast(""), 3000);
  }, []);

  /* ---------- History ---------- */
  const undo = () => step > 0 && setText(history[step - 1]);
  const redo = () => step < history.length - 1 && setText(history[step + 1]);

  /* ---------- Keyboard Shortcuts ---------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        copyText();
      }
      // Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") ||
        e.key === "y"
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [text, step, history]);

  /* ---------- Copy / Share ---------- */
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Text copied to clipboard", <Check className="w-4 h-4" />);
    } catch {
      showToast("Failed to copy text", <X className="w-4 h-4" />);
    }
  };

  const shareTool = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", <LinkIcon className="w-4 h-4" />);
    } catch {
      showToast("Failed to copy link", <X className="w-4 h-4" />);
    }
  };

  /* ---------- Text Actions ---------- */
  const applyAction = useCallback(
    (action: () => void, name: string) => {
      action();
      showToast(`${name} applied`, <Sparkles className="w-4 h-4" />);
      setActivePreset(name);
      setTimeout(() => setActivePreset(null), 1000);
    },
    [showToast],
  );

  const clearText = () => {
    setText("");
    showToast("Text cleared", <Trash2 className="w-4 h-4" />);
  };

  /* ---------- Presets ---------- */
  const presets = [
    {
      name: "AI Cleaner",
      action: () =>
        setText(
          toSentenceCase(
            removeExtraSpaces(removeEmojis(removeLineBreaks(text))),
          ),
        ),
      icon: <Bot className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Email Format",
      action: () => setText(removeLineBreaks(removeExtraSpaces(text))),
      icon: <Mail className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Resume Clean",
      action: () =>
        setText(toTitleCase(removeExtraSpaces(removeLineBreaks(text)))),
      icon: <FileText className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Social Media",
      action: () => setText(removeExtraSpaces(text)),
      icon: <MessageSquare className="w-5 h-5" />,
      color: "from-orange-500 to-yellow-500",
    },
    {
      name: "Code Format",
      action: () => setText(text.replace(/^\s+/gm, "").trim()),
      icon: <Code className="w-5 h-5" />,
      color: "from-gray-600 to-gray-800",
    },
  ];

  /* ---------- Text Actions ---------- */
  const textActions = [
    {
      name: "Clean Spaces",
      action: () => removeExtraSpaces,
      icon: <Wand2 className="w-4 h-4" />,
    },
    {
      name: "Remove Lines",
      action: () => removeLineBreaks,
      icon: <Pilcrow className="w-4 h-4" />,
    },
    {
      name: "UPPERCASE",
      action: () => toUpperCase,
      icon: <CaseUpper className="w-4 h-4" />,
    },
    {
      name: "lowercase",
      action: () => toLowerCase,
      icon: <CaseLower className="w-4 h-4" />,
    },
    {
      name: "Sentence Case",
      action: () => toSentenceCase,
      icon: <Type className="w-4 h-4" />,
    },
    {
      name: "Title Case",
      action: () => toTitleCase,
      icon: <Heading className="w-4 h-4" />,
    },
    {
      name: "Camel Case",
      action: () => toCamelCase,
      icon: <Code className="w-4 h-4" />,
    },
    {
      name: "Remove Emojis",
      action: () => removeEmojis,
      icon: <Smile className="w-4 h-4" />,
    },
    {
      name: "Remove Numbers",
      action: () => removeNumbers,
      icon: <NumbersIcon className="w-4 h-4" />,
    },
    {
      name: "Reverse Text",
      action: () => reverseText,
      icon: <FlipHorizontal2 className="w-4 h-4" />,
    },
    {
      name: "Remove Special",
      action: () => removeSpecialChars,
      icon: <Hash className="w-4 h-4" />,
    },
  ];

  /* ---------- Tool of the day ---------- */
  const tools = [
    "AI Output Cleaner",
    "Email Formatter",
    "Resume Optimizer",
    "Social Media Prep",
    "Code Cleaner",
    "Text Normalizer",
    "Case Converter",
  ];
  const todayTool = tools[new Date().getDay() % tools.length];

  /* ---------- Feedback ---------- */
  const submitFeedback = () => {
    if (!feedback.trim()) {
      showToast("Please enter feedback", <AlertCircle className="w-4 h-4" />);
      return;
    }
    setFeedback("");
    showToast("Thanks for your feedback!", <User className="w-4 h-4" />);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const runAI = async (endpoint: string) => {
    if (!text.trim()) {
      showToast("Enter text first", <AlertCircle className="w-4 h-4" />);
      return;
    }

    try {
      setAiLoading(true);
      showToast("AI is working...", <Bot className="w-4 h-4" />);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setText(data.result);
      showToast("AI applied successfully", <Sparkles className="w-4 h-4" />);
    } catch {
      showToast("AI failed. Try again.", <X className="w-4 h-4" />);
    } finally {
      setAiLoading(false);
    }
  };

  // Focus textarea on mount
  useEffect(() => {
    if (mounted && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-6xl">
          <div className="text-center">
            <Loader2 className="inline-block animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="mt-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
              Loading TextnGo...
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-50 animate-fade-in">
          <div className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-90">
            <div className="flex-1 flex items-center gap-2 text-sm">
              {toast.includes("Text copied") && (
                <Check className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("Link copied") && (
                <LinkIcon className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("Text cleared") && (
                <Trash2 className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("applied") && (
                <Sparkles className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("failed") && (
                <X className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("Please enter") && (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("Thanks for") && (
                <User className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.includes("AI is working") && (
                <Bot className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="truncate">
                {toast.replace(/[🚀📋🗑️✨❌💡🙏🤖⚠️]/g, "").trim()}
              </span>
            </div>
            <button
              onClick={() => setToast("")}
              className="text-gray-400 hover:text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-start p-3 sm:p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="w-full max-w-6xl mt-1 sm:mt-2">
          {/* Header - Logo on left, Mode Toggle on right */}
          <header className="flex flex-row justify-between items-center gap-3 mb-4 sm:mb-8">
            {/* Logo on left */}
            <div className="flex-shrink-0">
              <Image
                src={"/images/logo.png"}
                alt="TextnGo Logo"
                width={150}
                height={75}
                className="object-contain sm:w-[180px] md:w-[200px]"
              />
            </div>

            {/* Mode Toggle Switch - Only this in header */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg sm:rounded-xl">
              <button
                onClick={() => setMode("simple")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                  mode === "simple"
                    ? "bg-white dark:bg-gray-900 shadow text-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Simple</span>
              </button>

              <button
                onClick={() => setMode("ai")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                  mode === "ai"
                    ? "bg-white dark:bg-gray-900 shadow text-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>AI</span>
              </button>
            </div>
          </header>

          {/* Quick Actions Bar - Now below header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={copyText}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden xs:inline">Copy</span>
              </button>

              <button
                onClick={clearText}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden xs:inline">Clear</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={step <= 0}
                className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  step <= 0
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>

              <button
                onClick={redo}
                disabled={step >= history.length - 1}
                className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  step >= history.length - 1
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Text Input Area */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
                {/* Textarea */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Your Text
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type your text here..."
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] p-3 sm:p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-800 dark:text-gray-100 dark:bg-gray-900/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 font-mono text-sm sm:text-base leading-relaxed"
                  />
                </div>

                {/* Stats Toggle for Mobile */}
                <div className="sm:hidden mt-3">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Statistics
                    </span>
                    {showStats ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showStats && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs">
                          <Type className="w-3 h-3" />
                          Words
                        </div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {stats.words}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs">
                          <Hash className="w-3 h-3" />
                          Chars
                        </div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {stats.characters}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs">
                          <File className="w-3 h-3" />
                          Lines
                        </div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {stats.lines}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          Read
                        </div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {stats.readingTime}m
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Stats */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Type className="w-4 h-4" />
                      <span className="text-sm font-medium">Words</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                      {stats.words}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm font-medium">Characters</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                      {stats.characters}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <File className="w-4 h-4" />
                      <span className="text-sm font-medium">Lines</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                      {stats.lines}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Read Time</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                      {stats.readingTime}m
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              {mode === "simple" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Text Actions
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {textActions.map((action) => (
                      <button
                        key={action.name}
                        onClick={() => {
                          setText(action.action()(text));
                          showToast(`${action.name} applied`);
                        }}
                        className="group p-3 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {action.icon}
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {action.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "ai" && (
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 border border-indigo-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Actions
                  </h3>

                  <div className="space-y-3">
                    <button
                      disabled={aiLoading}
                      onClick={() => runAI("/api/ai/rewrite")}
                      className="w-full px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {aiLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkle className="w-4 h-4" />
                      )}
                      Rewrite – Professional
                    </button>

                    <button
                      disabled={aiLoading}
                      onClick={() => runAI("/api/ai/fix-grammar")}
                      className="w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {aiLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                      Fix Grammar & Clarity
                    </button>

                    <button
                      disabled={aiLoading}
                      onClick={() => runAI("/api/ai/resume-optimize")}
                      className="w-full px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {aiLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                      Resume Optimizer
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-center gap-2">
                    <Bot className="w-3 h-3" />
                    AI rewrites text intelligently while preserving meaning.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Actions Section */}
            <div className="lg:hidden">
              {/* Actions Toggle */}
              <button
                onClick={() => setShowActions(!showActions)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {mode === "simple" ? "Text Actions" : "AI Actions"}
                </span>
                {showActions ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showActions && (
                <div className="mt-3">
                  {mode === "simple" && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-3 gap-2">
                        {textActions.map((action) => (
                          <button
                            key={action.name}
                            onClick={() => {
                              setText(action.action()(text));
                              showToast(`${action.name} applied`);
                            }}
                            className="p-2 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-gray-600 dark:text-gray-400">
                                {action.icon}
                              </span>
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-full">
                                {action.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {mode === "ai" && (
                    <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-indigo-200 dark:border-gray-700">
                      <div className="space-y-2">
                        <button
                          disabled={aiLoading}
                          onClick={() => runAI("/api/ai/rewrite")}
                          className="w-full px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                        >
                          {aiLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkle className="w-4 h-4" />
                          )}
                          Rewrite – Professional
                        </button>

                        <button
                          disabled={aiLoading}
                          onClick={() => runAI("/api/ai/fix-grammar")}
                          className="w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                        >
                          {aiLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                          Fix Grammar & Clarity
                        </button>

                        <button
                          disabled={aiLoading}
                          onClick={() => runAI("/api/ai/resume-optimize")}
                          className="w-full px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                        >
                          {aiLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                          Resume Optimizer
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-2">
                        <Bot className="w-3 h-3" />
                        AI rewrites text intelligently while preserving meaning.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    TextnGo
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  A professional text utility for everyday productivity
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Verified className="w-3 h-3 sm:w-4 sm:h-4" />
                  Version 1.0 • {new Date().getFullYear()}
                </div>
                <div className="flex gap-4 sm:gap-6">
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Contact</span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Twitter</span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Custom styles */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          @media (max-width: 480px) {
            .xs\\:inline {
              display: inline;
            }
          }
        `}</style>
      </main>
    </>
  );
}
