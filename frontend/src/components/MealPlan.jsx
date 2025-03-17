import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import AddFoodModal from './AddFoodModal';
import './static/css/meal-plan.css';

import upArrow from "./static/images/arrowpointingup.png";
import downArrow from "./static/images/arrowpointingdown.png";

import {BackendUrl} from "../constants";

const MealPlan = () => {
    const [mealPlan, setMealPlan] = useState({ days: [], mealTimes: [] });
    const [selectedCell, setSelectedCell] = useState({day: {}, meal: {}, mealtime: {}});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFoods, setSavedFoods] = useState([]);

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched meal plan data:", data);
                setMealPlan(data || { days: [], mealTimes: [] });
            })
            .catch(error => console.error('Error fetching meal plan:', error));
        fetch(`${BackendUrl}/api/foods`)
            .then((response) => response.json())
            .then((data) => {
                setSavedFoods(data);
            })
            .catch((error) => console.error('Error fetching foods:', error));
    }, []);

    const navigate = useNavigate();

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    const handleSaveFood = (foodName) => {
        if (!selectedCell.day) {
            console.error('Selected cell information missing');
            return;
        }

        const updatedMealPlan = { ...mealPlan };
        console.log(mealPlan);

        const day = updatedMealPlan.days.find(d => d.name === selectedCell.day.name);
        if (!day) {
            console.error(`Day ${selectedCell.day.name} not found in meal plan`);
            return;
        }
        console.log('Day:', day.name);
        console.log('Meal time:', selectedCell.mealtime);

        let mealToUpdate = day.meals.find(m => m.name === selectedCell.mealtime);
        if (!mealToUpdate) {
            mealToUpdate = {
                name: selectedCell.mealtime,
                foods: []
            }
            day.meals.push(mealToUpdate)
        }
        console.log('Meal to update:', mealToUpdate.name);

        const existingFood = savedFoods.find(food => food.name.toLowerCase() === foodName.toLowerCase());

        const foodData = {
            name: foodName,
            id: undefined,
            description: undefined,
            ingredients: []
        };

        mealToUpdate.foods.push({ name: foodName });

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
                    updatedMealPlan.days.forEach(day => {
                        day.meals.forEach(meal => {
                            Object.keys(meal.foods).forEach(mealDayKey => {
                                if (meal.foods[mealDayKey].id === foodId) {
                                    delete meal.foods[mealDayKey];
                                }
                            });
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

    const handleAddMealTime = () => {
        const newName = prompt('Enter the name of the new meal:');
        const mealTimeData = {
            name: newName,
        };

        fetch(`${BackendUrl}/api/mealtimes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealTimeData)
        })
            .then(response => response.json())
            .then((newMealTime) => {
                setMealPlan((prevMealPlan) => {
                    return {
                        ...prevMealPlan,
                        mealTimes: [...prevMealPlan.mealTimes, newMealTime],
                        days: prevMealPlan.days,
                    };
                });
                console.log('Added new meal successfully:', JSON.stringify(mealTimeData));
                console.log('New meal plan:', mealPlan);
            })
            .catch(error => console.error('Error adding meal:', error));
    };


    const handleReorder = (index1, index2) => {
        if (index1 < 0 || index2 < 0 || index1 >= mealPlan.mealTimes.length || index2 >= mealPlan.mealTimes.length) {
            return;
        }

        const mealTime1 = mealPlan.mealTimes[index1];
        const mealTime2 = mealPlan.mealTimes[index2];

        fetch(`${BackendUrl}/api/mealtimes/reorder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mealTimeId1: mealTime1.id, mealTimeId2: mealTime2.id })
        })
            .then(response => {
                if (response.ok) {
                    const updatedMealTimes = [...mealPlan.mealTimes];
                    [updatedMealTimes[index1], updatedMealTimes[index2]] = [updatedMealTimes[index2], updatedMealTimes[index1]];
                    console.log('Updated meal times:',updatedMealTimes)
                    setMealPlan({ ...mealPlan, mealTimes: updatedMealTimes });
                    console.log('New meal plan:',mealPlan)
                }
            })
            .catch(error => console.error("Error reordering meal times:", error));
    };

    const resetMealPlan = () => {
        const mealTimesToPreserve = mealPlan.mealTimes.map(mt => ({ name: mt.name }));

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
                console.log('Reset meal plan successfully', data);
                setMealPlan(data);
            })
            .catch(error => console.error('Error resetting meal plan:', error));
    };



    if (!mealPlan?.days || mealPlan.days.length === 0) {
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
                            {mealPlan.days?.map((day, index) => (
                                <th key={index}>{day.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                            {mealPlan.mealTimes?.map((mt, index) => (
                                <tr key={mt.id}>
                                    <td className="meal-name-cell">
                                        <div className="meal-time-container">
                                            <span className="meal-time-name" onClick={() => navigate(`/meal-view/${mt.name}`)}>
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
                                                {index < mealPlan.mealTimes.length - 1 && (
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
                                        const mealForDay = day.meals.find((m) => m.name === mt.name);
                                        return (
                                            <td key={idx} className="food-item" onClick={() => handleCellClick(day, mealForDay, mt.name)}>
                                                <button>
                                                    { mealForDay?.foods[0].name || "" }
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

export default MealPlan;