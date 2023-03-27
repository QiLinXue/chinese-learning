import logo from './logo.svg';
import './App.css';
import './ChatBox.css';
import ChatBox from './ChatBox';

function App() {
  return (
    <div className="App">
      <div className="sidebar">
        {/* Left Sidebar with words */}
      </div>
      <div className="content">
      <h1 className="title">AI Chinese Tutor</h1>
        <div className="chat-box-container">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default App;
