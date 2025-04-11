import React, { useEffect, useState } from 'react';
import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/mealtime-page.css';
import { useMealPlan } from '../hooks/useMealPlan';

const MealtimePage = ({ mealTime, onClose }) => {
    const {
        mealPlan,
        savedFoods,
        isModalOpen,
        setIsModalOpen,
        setSelectedCell,
        handleSaveFood,
        handleDeleteFood,
        updateMealPlan,
    } = useMealPlan();

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <h1 className="loading">Loading meal plan...</h1>;
    }

    return (
        <div className="app-container">
            <h1 className="meal-view-title">{mealTime}</h1>
            <div className="meal-view-table-wrapper">
                <div className="meal-view-container">
                    <table className="meal-view-table">
                        <thead>
                        <tr>
                            <th>
                                <button className="orange-button" onClick={onClose}>Back</button>
                            </th>
                            <th>Meals</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mealPlan.days.map(day => {
                            const mealForDay = day.meals.find((m) => m.mealTime.name === mealTime);
                            return (
                                <tr key={day.name}>
                                    <td>{day.name}</td>
                                    <td className="food-item" onClick={() => handleCellClick(day, mealForDay, mealTime)}>
                                        <button>
                                            { mealForDay ? (mealForDay.food ? mealForDay.food.name : "") : "" }
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <AddFoodModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveFood}
                        savedFoods={savedFoods}
                        onDeleteFood={handleDeleteFood}
                    />
                </div>
            </div>
        </div>
    );
};

export default MealtimePage;
