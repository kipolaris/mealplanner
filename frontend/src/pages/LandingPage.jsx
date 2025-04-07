import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/landing-page.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const navigateToMealPlan = () => {
        navigate('/meal-plan');
    };

    return (
        <div className="landing-page-container">
            <h1>Welcome to Meal Planner!</h1>
            <div className="button-container">
                <button className="orange-button" onClick={navigateToMealPlan}>Login</button>
                <button className="orange-button" onClick={navigateToMealPlan}>Sign up</button>
            </div>
        </div>
    );
};

export default LandingPage;
