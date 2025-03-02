import React, { useState, useEffect } from 'react';
import AddFoodModal from './AddFoodModal';
import './static/css/meal-plan.css';
import arrowUpIcon from './static/images/arrowpointingup.png';
import arrowDownIcon from './static/images/arrowpointingdown.png';

import { BackendUrl } from "../constants";

const MealPlan = () => {
    const [mealPlan, setMealPlan] = useState({ mealDays: [] });
    const [selectedCell, setSelectedCell] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFoods, setSavedFoods] = useState([]);

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched meal plan data:", data);
                setMealPlan(data || { mealDays: [] });
            })
            .catch(error => console.error('Error fetching meal plan:', error));
        fetch(`${BackendUrl}/api/foods`)
            .then((response) => response.json())
            .then((data) => {
                setSavedFoods(data);
            })
            .catch((error) => console.error('Error fetching foods:', error));
    }, []);

    const handleCellClick = (day, meal) => {
        setSelectedCell({ day, meal });
        setIsModalOpen(true);
    };

    const handleSaveFood = (foodName) => {
        if (!selectedCell.day || !selectedCell.meal) {
            console.error('Selected cell information missing');
            return;
        }

        const existingFood = savedFoods.find(food => food.name.toLowerCase() === foodName.toLowerCase());

        const updatedMealPlan = { ...mealPlan };
        const day = updatedMealPlan.mealDays.find(d => d.name === selectedCell.day.name);
        const meal = day.meals.find(m => m.name === selectedCell.meal.name);
        meal.food = foodName;
        setMealPlan(updatedMealPlan);
        setIsModalOpen(false);

        if (existingFood) {
            console.log(`Food "${foodName}" already exists. Not adding to backend.`);
            return;
        }

        const foodData = {
            name: foodName,
            id: undefined,
            description: undefined,
            ingredients: []
        };

        fetch(`${BackendUrl}/api/foods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodData)
        })
            .then(response => response.json())
            .then(savedFood => {
                setSavedFoods(prevFoods => [...prevFoods, savedFood].sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(error => console.error('Error saving food:', error));
    };

    const handleDeleteFood = (foodId) => {
        fetch(`${BackendUrl}/api/foods/${foodId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setSavedFoods(prevFoods => prevFoods.filter(f => f.id !== foodId));
                } else {
                    console.error(`Failed to delete food with id ${foodId}`);
                }
            })
            .catch(error => console.error(`Error deleting food with id ${foodId}:`, error));
    };

    const handleAddMeal = () => {
        const newMealName = prompt('Enter the name of the new meal:');
        if (newMealName) {
            setMealPlan(prevMealPlan => {
                const updatedMealPlan = { ...prevMealPlan };
                if (!updatedMealPlan.meals) {
                    updatedMealPlan.meals = []; // Ensure it's an array
                }
                updatedMealPlan.meals.push({ id: undefined, name: newMealName, foods: undefined });
                console.log('Updated meals:', updatedMealPlan.meals)
                console.log('Updated meal plan:', updatedMealPlan)
                return updatedMealPlan;
            });
        }
    };

    const resetMealPlan = () => {
        fetch(`${BackendUrl}/api/meal-plan/reset`, { method: 'POST' })
            .then(() => {
                setMealPlan(prevMealPlan => ({
                    ...prevMealPlan,
                    mealDays: prevMealPlan.mealDays.map(day => ({
                        ...day,
                        meals: day.meals.map(meal => ({ ...meal, food: '' }))
                    }))
                }));
            })
            .catch(error => console.error('Error resetting meal plan:', error));
    };

    if (!mealPlan?.mealDays || mealPlan.mealDays.length === 0) {
        return <div>Loading meal plan...</div>;
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
                            {mealPlan.mealDays?.map((day, index) => (
                                <th key={index}>{day.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {mealPlan.mealDays?.length > 0 && mealPlan.mealDays[0]?.meals?.map((meal, index) => (
                            <tr key={index}>
                                <td className="meal-name-cell">{meal.name}</td>
                                {mealPlan.mealDays.map((day, idx) => (
                                    <td key={idx} className="food-item" onClick={() => handleCellClick(day, meal)}>
                                        <button>{meal.food || ''}</button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={mealPlan.mealDays.length + 1}>
                                <button className="orange-button" onClick={handleAddMeal}>Add new meal</button>
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

export default MealPlan;
