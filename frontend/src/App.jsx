// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MealPlan from './components/MealPlan';
import './components/static/css/meal-plan.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/meal-plan" element={<MealPlan />} />
            </Routes>
        </Router>
    );
}

export default App;
