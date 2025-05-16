import React, { useState } from 'react';

const Counseling = () => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState([]);

  const questions = [
    'What is your favorite subject?',
    'What are your career goals?',
    'Do you prefer studying in a group or alone?',
    'What type of learning environment helps you succeed?',
    'What skills do you want to develop in the next year?',
  ];

  const handleAnswerChange = (e) => {
    const newResponses = [...responses];
    newResponses[step] = e.target.value;
    setResponses(newResponses);
  };

  const handleNextQuestion = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsChatting(true);
      setMessages([
        { sender: 'system', text: 'Thanks for your answers! How can I assist you further today?' }
      ]);
    }
  };

  const handleSendMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: message }]);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'system', text: 'This is an AI response based on your input.' }
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Personalized Counseling</h2>
      {isChatting ? (
        <div className="space-y-4">
          <div className="h-[300px] p-4 border rounded-md overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-[#1D5EC7] text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5EC7]"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e.target.value)}
            />
            <button
              onClick={() => handleSendMessage(document.querySelector('input').value)}
              className="bg-[#1D5EC7] text-white px-4 py-2 rounded-md hover:bg-[#306fd6] transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-medium">{questions[step]}</h4>
          <input
            type="text"
            value={responses[step] || ''}
            onChange={handleAnswerChange}
            placeholder="Your answer..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5EC7]"
          />
          <button
            onClick={handleNextQuestion}
            className="bg-[#1D5EC7] text-white px-4 py-2 rounded-md hover:bg-[#306fd6] transition-colors duration-200"
          >
            {step < questions.length - 1 ? 'Next Question' : 'Finish and Start Chat'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Counseling;
