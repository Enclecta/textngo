"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function TermsPage() {
  const [darkMode, setDarkMode] = useState(false);
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

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last Updated: May 26, 2026
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Terms of Service
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Please read these terms carefully before using TextnGo
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to TextnGo. By accessing and using our text formatting
                service, you agree to be bound by these Terms & Conditions. If
                you disagree with any part of these terms, please do not use our
                service.
              </p>
            </div>

            <div className="mb-10 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800/30">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
                ⚠️ Important Legal Notice
              </h3>
              <p className="mb-3">
                These Terms contain important information about your legal
                rights, remedies, and obligations. Pay special attention to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Limitation of Liability (Section 5)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Disclaimer of Warranties (Section 6)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>User Responsibilities (Section 3)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-10">
              {[
                {
                  number: "1",
                  title: "Acceptance of Terms",
                  content:
                    "By accessing and using TextnGo, you accept and agree to be bound by these Terms. If you disagree with any part of these terms, please do not use our service.",
                },
                {
                  number: "2",
                  title: "Service Description",
                  content:
                    "TextnGo is a free web-based text formatting tool provided 'as-is' without warranties of any kind. We reserve the right to modify or discontinue the service at any time without notice.",
                },
                {
                  number: "3",
                  title: "User Responsibilities",
                  content:
                    "You agree to use the service lawfully and ethically. You will not use TextnGo for spam, harassment, illegal activities, or any purpose that violates others' rights.",
                  points: [
                    "You retain all rights to text you process",
                    "You are responsible for your text content",
                    "No automated system access without permission",
                    "No circumvention of security measures",
                  ],
                },
                {
                  number: "4",
                  title: "Intellectual Property",
                  content:
                    "The TextnGo platform, including its design, code, features, and branding, is the property of Enclecta. You may not copy, modify, or distribute any part of the service without written permission.",
                },
                {
                  number: "5",
                  title: "Limitation of Liability",
                  content:
                    "To the fullest extent permitted by law, Enclecta shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our service.",
                  warning: true,
                },
                {
                  number: "6",
                  title: "Disclaimer of Warranties",
                  content:
                    "The service is provided 'as is' and 'as available' without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.",
                  warning: true,
                },
                {
                  number: "7",
                  title: "Third-Party Content",
                  content:
                    "Our service may display third-party advertisements or links to external websites. We are not responsible for the content, accuracy, or practices of these third parties.",
                },
                {
                  number: "8",
                  title: "Termination",
                  content:
                    "We reserve the right to terminate or suspend your access to our service immediately, without prior notice, for any conduct that we believe violates these Terms or is harmful to other users.",
                },
                {
                  number: "9",
                  title: "Changes to Terms",
                  content:
                    "We may revise these Terms at any time. By continuing to use the service after changes are posted, you accept the revised Terms. We will update the Last Updated date when changes occur.",
                },
                {
                  number: "10",
                  title: "Governing Law",
                  content:
                    "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Enclecta is established, without regard to its conflict of law provisions.",
                },
              ].map((section) => (
                <div
                  key={section.number}
                  className="border-l-4 border-orange-500 pl-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {section.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {section.title}
                    </h3>
                  </div>

                  {section.warning && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                      <p className="font-medium text-red-700 dark:text-red-300">
                        ⚠️ Important Legal Section
                      </p>
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {section.content}
                  </p>

                  {section.points && (
                    <ul className="space-y-2 ml-4">
                      {section.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <span className="text-xl text-white">ℹ️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                    User Acknowledgement
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    By using TextnGo, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms &
                    Conditions. These Terms constitute the entire agreement
                    between you and Enclecta regarding your use of the service.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Contact Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                For questions about these Terms & Conditions, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:legal@enclecta.com"
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300"
                >
                  ⚖️ legal@enclecta.com
                </a>
                <Link
                  href="/privacy-policy"
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-300"
                >
                  🔒 View Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
