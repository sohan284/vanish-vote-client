// File: app/poll/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isTrending, setIsTrending] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Mock poll data for demo purposes
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch poll");
        }

        const pollData = await response.json();

        setPoll(pollData?.data);
        setTotalVotes(pollData?.data?.totalVotes);
        setLikes(pollData?.data?.likes);
        setIsTrending(pollData?.data?.isTrending);
        setShowResults(!pollData?.data?.hideResults);

        // Fetch comments if they're stored separately
        // const commentsResponse = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/comments`
        // );
        // if (commentsResponse.ok) {
        //   const commentsData = await commentsResponse.json();
        //   setComments(commentsData);
        // }

        setLoading(false);
      } catch (err) {
        setError("Couldn't load the poll. Please try again.");
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  // Calculate time left
  useEffect(() => {
    if (!poll) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const expiryTime = new Date(poll.expiresAt);
      const difference = expiryTime - now;

      if (difference <= 0) {
        return "Expired";
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m remaining`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [poll]);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;

    try {
      // In a real app, send the vote to your API
      // Simulate voting
      const updatedPoll = { ...poll };
      const optionIndex = updatedPoll.options.findIndex(
        (opt) => opt.id === selectedOption
      );
      updatedPoll.options[optionIndex].votes += 1;
      updatedPoll.totalVotes += 1;

      setPoll(updatedPoll);
      setHasVoted(true);
      setTotalVotes((prev) => prev + 1);
      setShowResults(true);

      // Save to localStorage to remember the vote
      localStorage.setItem(`voted_${id}`, "true");
    } catch (err) {
      setError("Couldn't register your vote. Please try again.");
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      text: comment,
      timestamp: "Just now",
    };

    setComments([newComment, ...comments]);
    setComment("");
  };

  const handleLike = () => {
    if (hasLiked) return;

    setLikes((prev) => prev + 1);
    setHasLiked(true);

    // Save to localStorage
    localStorage.setItem(`liked_${id}`, "true");
  };

  // Check if user has already voted or liked
  useEffect(() => {
    const hasVotedBefore = localStorage.getItem(`voted_${id}`) === "true";
    const hasLikedBefore = localStorage.getItem(`liked_${id}`) === "true";

    if (hasVotedBefore) {
      setHasVoted(true);
      setShowResults(true);
    }

    if (hasLikedBefore) {
      setHasLiked(true);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Loading poll...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!poll) return null;
  console.log(poll);

  // Calculate percentages for each option
  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timeLeft}
                </div>
                <div className="flex items-center space-x-3">
                  {isTrending && (
                    <span className="flex items-center text-red-500 text-sm">
                      <span className="mr-1">🔥</span> Trending
                    </span>
                  )}
                  <button
                    onClick={handleLike}
                    disabled={hasLiked}
                    className={`flex items-center text-sm ${
                      hasLiked
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {likes}
                  </button>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {poll.question}
              </h1>

              {!hasVoted ? (
                <div className="space-y-3 mb-6">
                  {poll?.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`w-full p-4 text-left rounded-lg border ${
                        selectedOption === option.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                      type="button"
                      aria-pressed={selectedOption === option.id}
                    >
                      {option.text}
                    </button>
                  ))}

                  <button
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className={`mt-4 w-full py-3 px-4 rounded-lg text-white font-medium ${
                      !selectedOption
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Vote
                  </button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {poll?.options?.map((option) => {
                    const percentage = getPercentage(option.votes);

                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {option.text}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {percentage}% ({option.votes} votes)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Total votes: {totalVotes}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Share this poll
                </h3>
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300">
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
                    Copy Link
                  </button>
                  <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300">
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
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Comments
              </h3>

              <div className="flex space-x-2 mb-6">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    !comment.trim()
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Post
                </button>
              </div>

              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {comment.timestamp}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
