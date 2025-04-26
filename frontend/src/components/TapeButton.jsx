import React from 'react';
import '../assets/css/tape-button.css';

const TapeButton = ({ text, onClick, style }) => {
    return (
        <button
            className="tape-button"
            onClick={onClick}
            style={style}
        >
            {text}
        </button>
    );
};

export default TapeButton;
