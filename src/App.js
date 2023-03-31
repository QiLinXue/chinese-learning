import logo from './logo.svg';
import './App.css';
import './ChatBox.css';

import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import SideBar from './SideBar';

function App() {
  const [mode, setMode] = useState('normal');
  const [resetMessages, setResetMessages] = useState(false);

  const handleModeChange = (option) => {
    setMode(option);
    setResetMessages(true);
  };

  const handleResetComplete = () => {
    setResetMessages(false);
  };

  return (
    <div className="App">
      <div className="sidebar">
        <SideBar
          options={['Normal', 'Expert', 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']}
          onSelectOption={handleModeChange}
        />
      </div>
      <div className="content">
        <h1 className="title">AI Language Tutor</h1>
        <div className="chat-box-container">
          <ChatBox mode={mode} resetMessages={resetMessages} onResetComplete={handleResetComplete} />
        </div>
      </div>
    </div>
  );
}

export default App;