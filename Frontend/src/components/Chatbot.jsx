import React, { useState } from 'react';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');

    try {
      // Make API call to Groq
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: input }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: data.choices[0].message.content },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
      ]);
    }
  };

  const handleChange = (e) => {
    console.log('Input Value:', e.target.value);  // Add this line for debugging
    setInput(e.target.value);
  };

  return (
    <div className="fixed bottom-20 right-6 z-30 bg-white w-1/3 h-4/5 shadow-lg rounded-lg flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h4 className="text-lg font-semibold">Chat with Us</h4>
        <button onClick={onClose} className="text-xl font-bold">
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={handleChange} // Use handleChange here
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
