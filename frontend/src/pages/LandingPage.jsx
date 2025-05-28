import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/landing-page.css';
import PageTitle from "../components/PageTitle";
import TapeButton from '../components/TapeButton';

const LandingPage = () => {
    const navigate = useNavigate();

    const navigateToMenu = () => {
        navigate('/menu')
    }

    return (
        <div className="landing-page-container">
            <PageTitle text="Welcome to Forkcast!" />
            <div className="button-container">
                <TapeButton text="Enter" onClick={navigateToMenu}/>
            </div>
        </div>
    );
};

export default LandingPage;
