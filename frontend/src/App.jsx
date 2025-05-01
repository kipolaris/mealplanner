import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MealPlanPage from './pages/MealPlanPage';
import MealtimePage from './pages/MealtimePage';
import './App.css';
import MenuPage from "./pages/MenuPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/meal-plan" element={<MealPlanPage />} />
                <Route path="/meal/:mealTime" element={<MealtimePage />} />
            </Routes>
        </Router>
    );
}

export default App;