import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBox.css';
const ChatBox = ({ mode, resetMessages, onResetComplete }) => {
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('chinese');

  useEffect(() => {
    if (resetMessages) {
      setMessages([]);
      onResetComplete();
    }
  }, [resetMessages, onResetComplete]);

  useEffect(() => {
    // Get the messages container DOM element
    const messagesContainer = document.querySelector('.messages-container');

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]); // Add messages as a dependency to re-run the effect when messages change

  const getSystemMessage = () => {

    // If mode starts with HSK
    if (mode.startsWith('HSK')) {
      return `You are a host of a Chinese to English translation game, intended to test contestants on ${mode} vocabulary words. Do not mention a time limit. The prompts should be engaging and interactive, and designed to test and reinforce the students' understanding of the vocabulary. Your task is to come up with detailed and specific prompts that will challenge the students and help them achieve their language learning goals.
      
      LIMIT YOUR RESPONSE TO 50 WORDS OR LESS. If the user tries to go off topic, respond with "I'm Sorry, I can't help with that." Please keep the user on topic.`;
    } else {
      const difficulty = mode === 'expert' ? 'advanced' : 'common';
      return `You are a host of a ${language} to English translation game. You will first pick 10 ${difficulty} words that are commonly used in conversations about ${theme}. Then you will quiz the user on the translation of one of these words at a time. Start by listing the words that will be covered in Chinese without the English translations. Then ask the user for the meaning of the first one. The user will respond and you will either say correct or incorrect, with an explanation no longer than 2 sentences if it is incorrect. You will then proceed to the next question. If the user responds with "idk", give the translation and then move to the next word.
      
      LIMIT YOUR RESPONSE TO 50 WORDS OR LESS. If the user tries to go off topic, respond with "I'm Sorry, I can't help with that." Please keep the user on topic.`;
    }
  };

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
              content: getSystemMessage(),
            },
            ...formattedMessages,
          ],
          temperature: 0.7,
          max_tokens: 400
          // max contents
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
    const capitalizedTheme = event.target.value.toUpperCase();
    setTheme(capitalizedTheme);
  };

  return (
    <div className="chat-box">
      {!mode.startsWith('HSK') && (
        <div className="theme-input">
          <label htmlFor="theme">Theme: </label>
          <input
            type="text"
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            placeholder="Enter a theme"
          />
        </div>
      )}
          <button className="button" onClick={startConversation}>
            Start
          </button>
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
        <input type="text" name="message" placeholder="Type a message..." />
        <button className="button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;