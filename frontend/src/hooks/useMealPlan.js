import { useState, useEffect } from 'react';
import { BackendUrl } from '../utils/constants';

export const useMealPlan = () => {
    const [mealPlan, setMealPlan] = useState({ days: [], mealTimes: [] });
    const [savedFoods, setSavedFoods] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState({ day: {}, meal: {}, mealtime: {} });

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched meal plan data:', JSON.stringify(data));
                setMealPlan(getValidMealPlan(data));
            })
            .catch(error => console.error('Error fetching meal plan:', error));

        fetch(`${BackendUrl}/api/foods`)
            .then((response) => response.json())
            .then((data) => {
                setSavedFoods(data);
            })
            .catch((error) => console.error('Error fetching foods:', error));
    }, []);

    const getValidMealPlan = (data) => {
        return data ? {
            days: data.days || [],
            mealTimes: data.mealTimes || []
        } : { days: [], mealTimes: [] };
    };

    const updateMealPlan = (updatedMealPlan) => {
        fetch(`${BackendUrl}/api/meal-plan`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMealPlan),
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                }
                return fetch(`${BackendUrl}/api/meal-plan`);
            })
            .then(response => response.json())
            .then(data => {
                console.log('Meal plan re-fetched after update:', JSON.stringify(data));
                setMealPlan(getValidMealPlan(data));
            })
            .catch(error => console.error('Error updating meal plan:', error));
    };

    const handleSaveFood = (foodName) => {
        if (!selectedCell.day) {
            console.error('Selected cell information missing');
            return;
        }

        const day = mealPlan.days.find(d => d.name === selectedCell.day.name);
        const existingFood = savedFoods.find(food => food.name.toLowerCase() === foodName.toLowerCase());

        const processUpdate = (foodToUse) => {
            const updatedMealPlan = { ...mealPlan };
            const dayToUpdate = updatedMealPlan.days.find(d => d.id === day.id);
            let mealToUpdate = dayToUpdate.meals.find(m => m.name === selectedCell.mealtime);

            if (!mealToUpdate) {
                mealToUpdate = {
                    id: undefined,
                    food: foodToUse,
                    mealTime: updatedMealPlan.mealTimes.find(mt => mt.name === selectedCell.mealtime),
                    dayId: day.id
                };
                dayToUpdate.meals.push(mealToUpdate);
            } else {
                mealToUpdate.food = foodToUse;
            }

            updateMealPlan(updatedMealPlan);
        };

        if (existingFood) {
            processUpdate(existingFood);
        } else {
            const foodData = { name: foodName, id: undefined, description: undefined, ingredients: [] };
            fetch(`${BackendUrl}/api/foods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData)
            })
                .then(response => response.json())
                .then(savedFood => {
                    setSavedFoods(prevFoods => [...prevFoods, savedFood].sort((a, b) => a.name.localeCompare(b.name)));
                    processUpdate(savedFood);
                })
                .catch(error => console.error('Error saving food:', error));
        }
    };

    const handleDeleteFood = (foodId) => {
        fetch(`${BackendUrl}/api/foods/${foodId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setSavedFoods(prevFoods => prevFoods.filter(f => f.id !== foodId));
                    const updatedMealPlan = { ...mealPlan };
                    updatedMealPlan.days.forEach(day => {
                        day.meals.forEach(meal => {
                            if (meal.food.id === foodId) {
                                meal.food = null;
                            }
                        });
                    });
                    updateMealPlan(updatedMealPlan);
                } else {
                    console.error(`Failed to delete food with id ${foodId}`);
                }
            })
            .catch(error => console.error(`Error deleting food with id ${foodId}:`, error));
    };

    const resetMealPlan = () => {
        const mealTimesToPreserve = mealPlan.mealTimes.map(mt => ({ id: mt.id, name: mt.name }));

        fetch(`${BackendUrl}/api/meal-plan/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mealTimes: mealTimesToPreserve })
        })
            .then(response => {
                if (response.ok) {
                    return fetch(`${BackendUrl}/api/meal-plan`);
                }
                throw new Error('Failed to reset meal plan');
            })
            .then(response => response.json())
            .then(data => {
                console.log('Reset meal plan successfully', JSON.stringify(data));
                setMealPlan(data);
            })
            .catch(error => console.error('Error resetting meal plan:', error));
    };

    const resetMealTime = (mealTime) => {
        fetch(`${BackendUrl}/api/meal-plan/reset-meal-time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealTime)
        })
            .then(response => {
                if (response.ok) {
                    return fetch(`${BackendUrl}/api/meal-plan`);
                }
                throw new Error('Failed to reset meal time');
            })
            .then(response => response.json())
            .then(data => {
                console.log('Reset meal time succesfully', JSON.stringify(data));
                setMealPlan(data);
            })
            .catch(error => console.error('Error resetting meal time:', error));
    }

    const resetDay = (day) => {
        fetch(`${BackendUrl}/api/meal-plan/reset-day`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(day)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Reset day successfully', JSON.stringify(data));
                setMealPlan(data);
            })
            .catch(error => console.error('Error fetching day:', error));
    }

    const resetMeal = (meal) => {
        fetch(`${BackendUrl}/api/meal-plan/reset-meal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meal)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Reset meal succesfully', JSON.stringify(data));
                setMealPlan(data);
            })
            .catch(error => console.error('Error fetching meal:', error));
    }

    return {
        mealPlan,
        savedFoods,
        isModalOpen,
        selectedCell,
        setIsModalOpen,
        setSelectedCell,
        handleSaveFood,
        handleDeleteFood,
        updateMealPlan,
        resetMealPlan,
        resetMealTime,
        resetDay,
        resetMeal
    };
};
