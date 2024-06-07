import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

import React, { useState } from 'react';
import MealView from './MealView';
import DayView from './DayView';
import FoodProfile from './FoodProfile';
import AddFoodModal from './AddFoodModal';
import './static/css/meal-plan.css';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["Breakfast", "Lunch", "Dinner"];
const savedFoods = ["Pizza", "Salad", "Pasta", "Burger"]; // Example saved foods

const MealPlan = () => {
    const [mealPlan, setMealPlan] = useState(initializeMealPlan());
    const [view, setView] = useState('mealPlan');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cellInfo, setCellInfo] = useState({ day: '', meal: '' });

    const initializeMealPlan = () => {
        let plan = {};
        daysOfWeek.forEach(day => {
            plan[day] = {};
            meals.forEach(meal => {
                plan[day][meal] = "";
            });
        });
        return plan;
    };

    const handleCellClick = (day, meal) => {
        setCellInfo({ day, meal });
        setIsModalOpen(true);
    };

    const handleMealClick = (meal) => {
        setSelectedMeal(meal);
        setView('mealView');
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setView('dayView');
    };

    const handleFoodClick = (food) => {
        setSelectedFood(food);
        setView('foodProfile');
    };

    const handleSaveFood = (food) => {
        const { day, meal } = cellInfo;
        setMealPlan(prevPlan => ({
            ...prevPlan,
            [day]: {
                ...prevPlan[day],
                [meal]: food
            }
        }));
    };

    return (
        <div className="meal-plan-container">
            {view === 'mealPlan' && (
                <div>
                    <h1>Meal Plan</h1>
                    <table className="meal-plan-table">
                        <thead>
                        <tr>
                            <th></th>
                            {daysOfWeek.map(day => (
                                <th key={day}>{day}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {meals.map(meal => (
                            <tr key={meal}>
                                <td>{meal} <button onClick={() => handleMealClick(meal)}>View</button></td>
                                {daysOfWeek.map(day => (
                                    <td key={day} onClick={() => handleCellClick(day, meal)}>
                                        {mealPlan[day][meal]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={handleReset}>Reset</button>
                </div>
            )}
            {view === 'mealView' && <MealView meal={selectedMeal} />}
            {view === 'dayView' && <DayView day={selectedDay} />}
            {view === 'foodProfile' && <FoodProfile food={selectedFood} />}
            <AddFoodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFood}
                savedFoods={savedFoods}
            />
        </div>
    );
};

export default MealPlan;
