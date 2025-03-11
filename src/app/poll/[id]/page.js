// File: app/poll/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (pollData?.data) {
          // Calculate total votes from options
          const totalVoteCount = pollData.data.options.reduce(
            (sum, option) => sum + (option.votes || 0),
            0
          );

          setPoll(pollData.data);
          setTotalVotes(totalVoteCount);
          setLikes(pollData.data.reactions?.like || 0);
          setIsTrending(pollData.data.reactions?.trending > 0);
          setShowResults(!pollData.data.hideResults);
          setComments(pollData.data.comments || []);
        }

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            optionId: selectedOption,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to submit vote");
      }

      // Update the UI with the response data
      if (data.data?.options) {
        // Calculate new total votes from updated options
        const newTotalVotes = data.data.options.reduce(
          (sum, option) => sum + (option.votes || 0),
          0
        );

        setPoll((prev) => ({
          ...prev,
          options: data.data.options,
        }));
        setTotalVotes(newTotalVotes);
      } else {
        // If results are hidden, increment local count
        setPoll((prev) => ({
          ...prev,
          options: prev.options.map((opt) =>
            opt._id === selectedOption
              ? { ...opt, votes: (opt.votes || 0) + 1 }
              : opt
          ),
        }));
        setTotalVotes((prev) => prev + 1);
      }

      setHasVoted(true);
      setShowResults(true);

      // Save to localStorage to remember the vote
      localStorage.setItem(`voted_${id}`, "true");
    } catch (err) {
      console.error("Vote error:", err);
      setError(err.message || "Couldn't register your vote. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add comment");
      }

      const newComment = {
        id: data.data.comment._id,
        text: data.data.comment.text,
        timestamp: "Just now",
      };

      setComments((prevComments) => [newComment, ...prevComments]);
      setComment("");
    } catch (err) {
      console.error("Comment error:", err);
      alert(err.message || "Couldn't add your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "like",
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to like poll");
      }

      // Update UI with the new reactions from server
      setLikes(data.data.reactions.like);
      setHasLiked(true);

      // Save to localStorage
      localStorage.setItem(`liked_${id}`, "true");
    } catch (err) {
      console.error("Like error:", err);
      alert("Could not update like count. Please try again.");
    }
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
                      onClick={() => setSelectedOption(option?._id)}
                      className={`w-full p-4 text-left rounded-lg border ${
                        selectedOption === option._id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                      type="button"
                      aria-pressed={selectedOption === option?._id}
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
                      <div key={option._id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {option.text}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {percentage}% ({option.votes || 0} votes)
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

              <ShareButtons pollId={id} />
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
                  disabled={!comment.trim() || isSubmitting}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    !comment.trim() || isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Adding..." : "Add Comment"}
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
