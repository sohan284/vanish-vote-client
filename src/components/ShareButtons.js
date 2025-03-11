"use client";
import { useState } from "react";

export default function ShareButtons({ pollId }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      // Create the full URL using the poll ID
      const pollUrl = `${window.location.origin}/poll/${pollId}`;
      await navigator.clipboard.writeText(pollUrl);

      // Show copied state
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = `${window.location.origin}/poll/${pollId}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this poll!",
          url: `${window.location.origin}/poll/${pollId}`,
        });
      } else {
        handleCopyLink();
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Share this poll
      </h3>
      <div className="flex space-x-2">
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition duration-200"
          title="Share"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
