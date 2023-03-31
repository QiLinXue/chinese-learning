import React from 'react';
import './ChatBox.css';

const SideBar = ({ options, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = React.useState('');

  return (
    <div className="SideBar">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => {
            onSelectOption(option);
            setSelectedOption(option);
          }}
          className={`button ${selectedOption === option ? 'button-selected' : ''}`}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default SideBar;