import React from 'react';
import pinkFlowerTape from '../assets/images/pinkflowertape.png';
import '../assets/css/page-title.css';

const PageTitle = ({ text }) => {
    return (
        <div className="page-title">
            <img
                src={pinkFlowerTape}
                alt="tape"
                className="tape top-right"
            />

            <img
                src={pinkFlowerTape}
                alt="tape"
                className="tape bottom-left"
            />

            {text}
        </div>
    );
};

export default PageTitle;
