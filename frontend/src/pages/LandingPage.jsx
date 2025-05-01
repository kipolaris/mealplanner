import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/landing-page.css';
import PageTitle from "../components/PageTitle";
import TapeButton from '../components/TapeButton';

const LandingPage = () => {
    const navigate = useNavigate();

    const navigateToMealPlan = () => {
        navigate('/meal-plan');
    };

    return (
        <div className="landing-page-container">
            <PageTitle text="Welcome to Meal Planner!" />
            <div className="button-container">
                <TapeButton text="Log in" onClick={navigate("/menu")}/>
                <TapeButton text="Sign up" onClick={navigateToMealPlan}/>
            </div>
        </div>
    );
};

export default LandingPage;
