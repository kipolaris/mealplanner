// src/App.jsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MealPlanPage from './pages/MealPlanPage';
import MealtimePage from './pages/MealtimePage';
import './assets/css/meal-plan-page.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/meal-plan" element={<MealPlanPage />} />
                <Route path="/meal-view/:mealTime" element={<MealtimePageWrapper />} />
            </Routes>
        </Router>
    );
}

const MealtimePageWrapper = () => {
    const { mealTime } = useParams();
    const navigate = useNavigate();
    return <MealtimePage mealTime={mealTime} onClose={() => navigate('/meal-plan')} />;
};

export default App;
