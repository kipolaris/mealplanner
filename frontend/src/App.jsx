// src/App.jsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MealPlan from './components/MealPlan';
import MealView from './components/MealView';
import './components/static/css/meal-plan.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/meal-plan" element={<MealPlan />} />
                <Route path="/meal-view/:mealTime" element={<MealViewWrapper />} />
            </Routes>
        </Router>
    );
}

const MealViewWrapper = () => {
    const { mealTime } = useParams();
    const navigate = useNavigate();
    return <MealView mealTime={mealTime} onClose={() => navigate('/')} />;
};

export default App;
