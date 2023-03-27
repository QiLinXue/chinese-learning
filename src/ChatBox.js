import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState('');

  useEffect(() => {
    // Get the messages container DOM element
    const messagesContainer = document.querySelector('.messages-container');

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]); // Add messages as a dependency to re-run the effect when messages change

  const startConversation = async () => {
    // Reset the messages state to empty
    setMessages([]);
  
    // Make an API call asking the AI to start the conversation
    const aiResponse = await getAIResponse('Start the conversation.');
    setMessages([{ text: aiResponse, sender: 'ai' }]);
  };

  const getAIResponse = async (message) => {
    try {
      const formattedMessages = messages.map((msg) => {
        return { role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text };
      });

      formattedMessages.push({ role: 'user', content: message });

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful chinese tutor. Your job is to teach the user beginner level chinese vocabulary with the goal of being able to have a basic conversation about ${theme}. Keep all responses shorter than 2 sentences! All new words must be introduced and adapt the difficulty/speed based on the experience the user exhibits during the conversation. After introducing some basic words, you should start asking the user to form sentences.`,
            },
            ...formattedMessages,
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_GPT3_API_KEY}`,
        },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'Sorry, I could not provide a response.';
    }
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    setMessages([...messages, { text: message, sender: 'user' }]);
    event.target.reset();

    const aiResponse = await getAIResponse(message);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: aiResponse, sender: 'ai' },
    ]);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <div className="chat-box">
      <div className="theme-input">
        <label htmlFor="theme">Theme: </label>
        <input
          type="text"
          id="theme"
          value={theme}
          onChange={handleThemeChange}
          placeholder="Enter a theme"
        />
                <button className="button" onClick={startConversation}>Start</button>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user' : 'ai'}`}
          >
            {message.text.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Type a message..."
        />
        <button className="button" type="submit">Send</button>
      </form>
    </div>
  );
};


export default ChatBox;