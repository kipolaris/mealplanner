import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MealPlanPage from './pages/MealPlanPage';
import MealTimePage from './pages/MealTimePage';
import MealTimesPage from './pages/MealTimesPage';
import './App.css';
import MenuPage from "./pages/MenuPage";
import IngredientsPage from "./pages/IngredientsPage";
import IngredientsAtHomePage from "./pages/IngredientsAtHomePage";
import DayPage from "./pages/DayPage";
import FoodsPage from "./pages/FoodsPage";
import FoodPage from "./pages/FoodPage";
import ShoppingListPage from "./pages/ShoppingListPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/meal-plan" element={<MealPlanPage />} />
                <Route path="/day/:day" element={<DayPage />} />
                <Route path="/meal/:mealTime" element={<MealTimePage />} />
                <Route path="/meal-times" element={<MealTimesPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
                <Route path="/ingredients-at-home" element={<IngredientsAtHomePage />}/>
                <Route path="/foods" element={<FoodsPage />} />
                <Route path="/food/:foodName" element={<FoodPage />} />
                <Route path="/shopping-list" element={<ShoppingListPage /> } />
            </Routes>
        </Router>
    );
}

export default App;