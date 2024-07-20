import React, { useState, useEffect } from 'react';
import AddFoodModal from './components/AddFoodModal';
import { BackendUrl } from "./constants";
import './components/static/css/meal-plan.css';

function App() {
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedCell, setSelectedCell] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFoods, setSavedFoods] = useState(["Pizza", "Salad", "Pasta", "Burger", "Croissant"].sort());

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
    }, []);

    const handleCellClick = (day, meal) => {
        setSelectedCell({ day, meal });
        setIsModalOpen(true);
    };

    const handleSaveFood = (food) => {
        if (!selectedCell.day || !selectedCell.meal) {
            console.error('Selected cell information missing');
            return;
        }

        const updatedMealPlan = { ...mealPlan };
        const dayIndex = updatedMealPlan.mealDays.findIndex(d => d.name === selectedCell.day);
        updatedMealPlan.mealDays[dayIndex][selectedCell.meal] = food;
        setMealPlan(updatedMealPlan);
        setIsModalOpen(false);

        fetch('/api/meal-plan/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ day: selectedCell.day, meal: selectedCell.meal, food })
        }).catch(error => console.error('Error saving food:', error));

        // Add the new food to savedFoods if it doesn't already exist, and sort
        setSavedFoods(prevFoods => {
            const updatedFoods = [...prevFoods];
            if (!updatedFoods.includes(food)) {
                updatedFoods.push(food);
            }
            return updatedFoods.sort();
        });
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
        fetch('/api/saved-foods')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSavedFoods(data.sort()); // Assuming data is an array of saved foods
            })
            .catch(error => console.error('Error fetching saved foods:', error));
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
        fetch('/api/meal-plan/reset', { method: 'POST' })
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
                                <button onClick={resetMealPlan}>Reset</button>
                            </th>
                            {mealPlan.mealDays.map((day, index) => (
                                <th key={index}>{day.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {mealPlan.meals.map((meal, index) => (
                            <tr key={index}>
                                <td>{meal.charAt(0).toUpperCase() + meal.slice(1)}</td>
                                {mealPlan.mealDays.map((day, idx) => (
                                    <td key={idx} className="food-item" onClick={() => showModal(day.name, meal)}>
                                        <button>{day[meal] || ''}</button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={mealPlan.mealDays.length + 1}>
                                <button onClick={handleAddMeal}>Add new meal</button>
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
            />
        </div>
    );
}

export default App;
