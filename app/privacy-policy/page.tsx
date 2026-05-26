"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last Updated: May 26, 2026
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            {/* Introduction */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                  <span className="text-xl">🔒</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Your Privacy Matters
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    At TextnGo, we&apos;re committed to protecting your privacy
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This Privacy Policy explains how TextnGo (&quot;we&quot;,
                &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects
                your information when you use our text formatting service. We
                take your privacy seriously and are transparent about our
                practices.
              </p>
            </div>

            {/* Key Principles */}
            <div className="mb-10 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800/30">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Our Core Privacy Principles
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    icon: "🚫",
                    title: "No Text Storage",
                    description: "We never store the text you process",
                  },
                  {
                    icon: "🔍",
                    title: "Local Processing",
                    description: "All text processing happens in your browser",
                  },
                  {
                    icon: "📊",
                    title: "Anonymous Analytics",
                    description: "Only anonymous usage data is collected",
                  },
                ].map((principle, index) => (
                  <div
                    key={index}
                    className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg"
                  >
                    <div className="text-2xl mb-2">{principle.icon}</div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {principle.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Information We Collect
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <span>✓</span>
                    Anonymous Usage Data
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    We collect anonymous data to improve our service:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Browser type and version</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Device information (type, operating system)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Feature usage statistics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Error reports (when something goes wrong)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-100 dark:border-red-800/30">
                  <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                    <span>✗</span>
                    Information We Do NOT Collect
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-red-500">✗</div>
                      <div>
                        <span className="font-medium">
                          No Personal Information:
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          We don't collect names, email addresses, or contact
                          information
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-red-500">✗</div>
                      <div>
                        <span className="font-medium">No Text Content:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          The text you process is never sent to our servers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-red-500">✗</div>
                      <div>
                        <span className="font-medium">No User Accounts:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          We don't require accounts or login information
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Third-Party Services
              </h3>

              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  We use third-party services that may collect information:
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl border border-yellow-100 dark:border-yellow-800/30">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <span>🍪</span>
                    Cookies & Analytics
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span>•</span>
                      <span>
                        Google Analytics for anonymous usage statistics
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>•</span>
                      <span>
                        Advertising partners for relevant ads (optional)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>•</span>
                      <span>Performance monitoring services</span>
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    You can control cookies through your browser settings. Most
                    browsers allow you to refuse or delete cookies.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Data Security
              </h3>

              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  We implement appropriate security measures to protect against
                  unauthorized access, alteration, or destruction of data.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                      🔐 Our Security Measures
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• HTTPS encryption for all connections</li>
                      <li>• Regular security audits</li>
                      <li>• No sensitive data storage</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      🤝 Your Responsibility
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Keep your browser updated</li>
                      <li>• Use secure networks</li>
                      <li>• Clear browser data if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                👶 Children's Privacy
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our service is not directed to children under 13. We do not
                knowingly collect personal information from children under 13.
                If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-10 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                📝 Changes to This Policy
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may update this Privacy Policy periodically. We will notify
                users of any material changes by updating the "Last Updated"
                date at the top of this page.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Last Updated:</span> December
                  2023
                </div>
                <div>
                  <span className="font-medium">Effective:</span> December 1,
                  2023
                </div>
                <div>
                  <span className="font-medium">Version:</span> 1.0
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Contact Us
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@enclecta.com"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300"
                >
                  📧 privacy@enclecta.com
                </a>
                <Link
                  href="/terms"
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-300"
                >
                  📄 View Terms & Conditions
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Home */}
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
