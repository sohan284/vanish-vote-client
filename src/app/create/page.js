'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePoll() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [pollType, setPollType] = useState('multiple');
  const [options, setOptions] = useState(['', '']);
  const [expiration, setExpiration] = useState('12');
  const [hideResults, setHideResults] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would make an API call to your backend
      // For now, let's simulate a successful creation
      
      // Simulating an API response with a poll ID
      const pollId = 'poll_' + Math.random().toString(36).substr(2, 9);
      
      // Redirect to the poll page after creation
      router.push(`/poll/${pollId}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
        
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Create a New Poll</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ask something..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Poll Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPollType('multiple')}
                      className={`px-4 py-2 rounded-lg ${
                        pollType === 'multiple' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      Multiple Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPollType('yesno');
                        setOptions(['Yes', 'No']);
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        pollType === 'yesno' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      Yes/No
                    </button>
                  </div>
                </div>
                
                {pollType === 'multiple' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Poll Options
                    </label>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {options.length < 10 && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add another option
                      </button>
                    )}
                  </div>
                )}
                
                <div>
                  <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Poll Expiration
                  </label>
                  <select
                    id="expiration"
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="1">1 hour</option>
                    <option value="3">3 hours</option>
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                  </select>
                </div>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hideResults"
                      checked={hideResults}
                      onChange={() => setHideResults(!hideResults)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hideResults" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Hide results until poll ends
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(!isPrivate)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Private poll (link access only)
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                      isSubmitting 
                        ? 'bg-purple-400 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Poll'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
