import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/meal-plan-page.css';

import upArrow from "../assets/images/arrowpointingup.png";
import downArrow from "../assets/images/arrowpointingdown.png";
import {useMealPlan} from "../hooks/useMealPlan";
import {useMealTime} from "../hooks/useMealTime";

const MealPlanPage = () => {
    const {
        mealPlan,
        savedFoods,
        isModalOpen,
        setIsModalOpen,
        setSelectedCell,
        handleSaveFood,
        handleDeleteFood,
        updateMealPlan,
        resetMealPlan,
    } = useMealPlan();

    const [mealTimes, setMealTimes] = useState([]);
    const [isMealPlanLoaded, setIsMealPlanLoaded] = useState(false);

    useEffect(() => {
        if (mealPlan && mealPlan.mealTimes.length > 0) {
            setIsMealPlanLoaded(true);
            setMealTimes(mealPlan.mealTimes);
        }
    }, [mealPlan]);

    const { handleAddMealTime, handleReorder } = useMealTime(mealPlan, updateMealPlan);

    const navigate = useNavigate();

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <h1 className="loading">Loading meal plan...</h1>;
    }

    return (
        <div className="app-container">
            <h1 className="meal-plan-title">Meal Plan</h1>
            <div className="meal-plan-table-wrapper">
                <div className="meal-plan-container">
                    <table className="meal-plan-table">
                        <thead>
                        <tr>
                            <th>
                                <button className="orange-button" onClick={resetMealPlan}>Reset</button>
                            </th>
                            {mealPlan.days?.map((day, index) => (
                                <th key={index}>{day.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                            {mealTimes.map((mt, index) => (
                                <tr key={mt.id}>
                                    <td className="meal-name-cell">
                                        <div className="meal-time-container">
                                            <span className="meal-time-name" onClick={() => navigate(`/meal/${mt.name}`)}>
                                                {mt.name}
                                            </span>
                                            <div className="arrow-buttons">
                                                {index > 0 && (
                                                    <img
                                                        src={upArrow}
                                                        alt="Move up"
                                                        className="arrow-button up-arrow"
                                                        onClick={() => handleReorder(index, index - 1)}
                                                    />
                                                )}
                                                {index < mealTimes.length - 1 && (
                                                    <img
                                                        src={downArrow}
                                                        alt="Move down"
                                                        className="arrow-button down-arrow"
                                                        onClick={() => handleReorder(index, index + 1)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    {mealPlan.days.map((day, idx) => {
                                        const mealForDay = day.meals.find((m) => m.mealTime.name === mt.name);
                                        return (
                                            <td key={idx} className="food-item" onClick={() => handleCellClick(day, mealForDay, mt.name)}>
                                                <button>
                                                    { mealForDay ? (mealForDay.food ? mealForDay.food.name : "") : "" }
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                                <tr>
                                    <td colSpan={mealPlan.days.length + 1}>
                                        <button className="orange-button" onClick={handleAddMealTime}>Add new meal time</button>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <AddFoodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFood}
                savedFoods={savedFoods}
                onDeleteFood={handleDeleteFood}
            />
        </div>
    );
};

export default MealPlanPage;