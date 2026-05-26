"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode, mounted]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status) setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("Thanks for contacting us! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      value: "support@enclecta.com",
      description: "For general inquiries & support",
    },
    {
      icon: "🕒",
      title: "Response Time",
      value: "24-48 hours",
      description: "Typical response time",
    },
    {
      icon: "🏢",
      title: "Product by",
      value: "Enclecta",
      description: "Building practical tools",
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have feedback, questions, or business inquiries? We&apos;d love to
              hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                  <span>💬</span>
                  Get in Touch
                </h2>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                        <span className="text-xl">{info.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">
                          {info.value}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Include relevant details for faster response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Check our FAQ page for common questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>We don&apos;t store your message data</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    />
                  </div>

                  {status && (
                    <div
                      className={`p-4 rounded-xl ${
                        status.includes("Thanks")
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30"
                          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          status.includes("Thanks")
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>📨</span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    We respect your privacy. Your information will only be used
                    to respond to your inquiry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
