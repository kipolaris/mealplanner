import React, {useEffect, useState} from 'react';
import AddFoodModal from './AddFoodModal';
import './static/css/meal-plan.css';

import {BackendUrl} from "../constants";

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

        const foodData = {
            name: foodName,
            id: undefined,
            description: undefined,
            ingredients: []
        };

        const updatedMealPlan = { ...mealPlan };
        const day = updatedMealPlan.mealDays.find(d => d.name === selectedCell.day.name);
        console.log('Day:', day.name);
        const mealToUpdate = day.meals.find(m => m.name === selectedCell.meal.name);
        if (mealToUpdate.foods.find(food => food.name.toLowerCase() === foodName.toLowerCase())) {
            mealToUpdate.foods = [...mealToUpdate.foods.filter(food => food.name.toLowerCase() !== foodName.toLowerCase()), existingFood];
        } else {
            mealToUpdate.foods = [...mealToUpdate.foods, existingFood || foodData ];
        }
        setMealPlan(updatedMealPlan);
        console.log('Updated meal plan:', updatedMealPlan)
        setIsModalOpen(false);

        if (existingFood) {
            console.log(`Food ${foodName} already exists. Not adding to backend.`);
            return;
        }

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
                    const updatedMealPlan = { ...mealPlan };
                    updatedMealPlan.mealDays.forEach(day => {
                        day.meals.forEach(meal => {
                            meal.foods = meal.foods.filter(f => f.id !== foodId);
                        });
                    });
                    setMealPlan(updatedMealPlan);

                    console.log('Food deleted successfully');
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
                return {
                    ...prevMealPlan,
                    mealDays: prevMealPlan.mealDays.map(day => ({
                        ...day,
                        meals: [...(day.meals || []), { id: undefined, name: newMealName, foods: [] }]
                    })),
                };
            });
        }

    };

    const resetMealPlan = () => {
        fetch(`${BackendUrl}/api/meal-plan/reset`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    setMealPlan(prevMealPlan => ({
                        ...prevMealPlan,
                        mealDays: prevMealPlan.mealDays.map(day => ({
                            ...day,
                            meals: day.meals.map(meal => ({ ...meal, foods: [] })) // Clear all foods in each meal
                        }))
                    }));
                    console.log('Meal plan reset successfully', mealPlan);
                }
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
                                        <button>
                                            {meal.foods.length > 0 ? meal.foods[meal.foods.length - 1].name : ''}
                                        </button>
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
