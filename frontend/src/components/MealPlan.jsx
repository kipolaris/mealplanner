import React, { useState, useEffect } from 'react';
import AddFoodModal from './AddFoodModal';
import './static/css/meal-plan.css';
import arrowUpIcon from './static/images/arrowpointingup.png';
import arrowDownIcon from './static/images/arrowpointingdown.png';

import { BackendUrl} from "../constants";

const MealPlan = () => {
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedCell, setSelectedCell] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFoods, setSavedFoods] = useState([]);

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                const defaultMeals = ['breakfast', 'lunch', 'dinner'];
                const initialMealPlan = {
                    mealDays: [],
                    meals: defaultMeals,
                    ...data
                };
                initialMealPlan.mealDays = initialMealPlan.mealDays.map(day => ({
                    ...day,
                    ...defaultMeals.reduce((acc, meal) => {
                        acc[meal] = '';
                        return acc;
                    }, {})
                }));
                setMealPlan(initialMealPlan);
            })
            .catch(error => console.error('Error fetching meal plan:', error));
        fetch(`${BackendUrl}/api/foods`)
            .then((response) => response.json())
            .then((data) => {
                setSavedFoods(data);
                console.log(data);
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

        // Update meal plan state
        const updatedMealPlan = { ...mealPlan };
        const dayIndex = updatedMealPlan.mealDays.findIndex(d => d.name === selectedCell.day);
        updatedMealPlan.mealDays[dayIndex][selectedCell.meal] = foodName;
        setMealPlan(updatedMealPlan);
        setIsModalOpen(false);

        const foodData = {
            name: foodName,
            id: undefined,
            description: undefined, //food.description || null,
            ingredients: []
        };

        fetch(`${BackendUrl}/api/foods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodData)
        })
            .then(response => response.json())
            .then(savedFood => {
                setSavedFoods(prevFoods => {
                    const updatedFoods = [...prevFoods];
                    if (!updatedFoods.some(f => f.name === savedFood.name)) {
                        updatedFoods.push(savedFood);
                    }
                    return updatedFoods.sort();
                });
            })
            .catch(error => console.error('Error saving food:', error));
    };



    const handleDeleteFood = (foodId) => {
        fetch(`${BackendUrl}/api/foods/${foodId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    console.log(`Food with id ${foodId} deleted successfully`);
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
                updatedMealPlan.meals = [...prevMealPlan.meals, newMealName.toLowerCase()];
                updatedMealPlan.mealDays = updatedMealPlan.mealDays.map(day => ({
                    ...day,
                    [newMealName.toLowerCase()]: ''
                }));
                return updatedMealPlan;
            });
        }
    };

    const fetchSavedFoods = () => {
        fetch(`${BackendUrl}/api/foods`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(`HTTP ${response.status}: ${text}`); });
                }
                return response.json();
            })
            .then(data => setSavedFoods(data))
            .catch(error => console.error('Error fetching foods:', error));
    };



    useEffect(() => {
        fetchSavedFoods();
    }, []);

    const viewMeal = (meal) => {
        window.location.href = `/meal-view/${meal}`;
    };

    const showModal = (day, meal) => {
        setSelectedCell({ day, meal });
        setIsModalOpen(true);
        fetchSavedFoods();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const resetMealPlan = () => {
        fetch(`${BackendUrl}/api/meal-plan/reset`, { method: 'POST' })
            .then(() => {
                const updatedMealPlan = { ...mealPlan };
                updatedMealPlan.mealDays = updatedMealPlan.mealDays.map(day => {
                    const newDay = { ...day };
                    mealPlan.meals.forEach(meal => {
                        newDay[meal] = '';
                    });
                    return newDay;
                });
                setMealPlan(updatedMealPlan);
            })
            .catch(error => console.error('Error resetting meal plan:', error));
    };

    const moveMeal = (index, direction) => {
        const updatedMeals = [...mealPlan.meals];
        if (direction === 'up' && index > 0) {
            [updatedMeals[index - 1], updatedMeals[index]] = [updatedMeals[index], updatedMeals[index - 1]];
        } else if (direction === 'down' && index < updatedMeals.length - 1) {
            [updatedMeals[index + 1], updatedMeals[index]] = [updatedMeals[index], updatedMeals[index + 1]];
        }
        setMealPlan(prevMealPlan => ({
            ...prevMealPlan,
            meals: updatedMeals
        }));
    };

    if (!mealPlan || !mealPlan.mealDays || !mealPlan.meals) {
        return <div>Loading...</div>;
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
                            {mealPlan.mealDays.map((day, index) => (
                                <th key={index}>{day.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {mealPlan.meals.map((meal, index) => (
                            <tr key={index}>
                                <td className="meal-name-cell">
                                    <div className="meal-name-container">
                                        <span className="meal-name">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                                        <div className="arrow-buttons">
                                            <img
                                                src={arrowUpIcon}
                                                alt="Move Up"
                                                className="arrow-button"
                                                onClick={() => moveMeal(index, 'up')}
                                            />
                                            <img
                                                src={arrowDownIcon}
                                                alt="Move Down"
                                                className="arrow-button"
                                                onClick={() => moveMeal(index, 'down')}
                                            />
                                        </div>
                                    </div>
                                </td>
                                {mealPlan.mealDays.map((day, idx) => (
                                    <td key={idx} className="food-item" onClick={() => showModal(day.name, meal)}>
                                        <button>{day[meal] || ''}</button>
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
                onClose={closeModal}
                onSave={handleSaveFood}
                savedFoods={savedFoods}
                onDeleteFood={handleDeleteFood}
            />

        </div>
    );
};

export default MealPlan;
