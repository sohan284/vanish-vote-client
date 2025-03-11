import Link from "next/link";
import PollsTable from "@/components/PollsTable";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-800 dark:text-blue-400 mb-4">
            VanishVote
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create anonymous polls that disappear when time&apos;s up
          </p>
        </header>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="space-y-4 flex-1">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  Quick, Anonymous Polling
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Create polls that automatically vanish after they expire. No
                  account needed.
                </p>
                <div className="flex flex-wrap gap-4 font-medium">
                  <div className="flex items-center text-teal-600 dark:text-teal-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No login
                  </div>
                  <div className="flex items-center text-teal-600 dark:text-teal-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Private links
                  </div>
                  <div className="flex items-center text-teal-600 dark:text-teal-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Timed expiry
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    href="/create"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                  >
                    Create a Poll
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="/api/placeholder/300/300"
                  alt="Voting Illustration"
                  className="w-64 h-64"
                />
              </div>
            </div>
          </div>
        </div>

        <PollsTable />

        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Create Your Poll
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add a question and options. Set an expiration time (1-24 hours).
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Share the Link
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send the unique link to anyone you want to vote in your poll.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Get Results & Vanish
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View live results. The poll automatically vanishes when
                time&apos;s up.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-8 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2025 VanishVote. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Privacy
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Terms
            </button>
            <button
              id="theme-toggle"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Toggle Dark Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
