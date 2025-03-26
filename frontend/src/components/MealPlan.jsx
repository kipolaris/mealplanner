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

    const navigate = useNavigate();

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    const getValidMealPlan = (data) => {
        return data ? {
            days: data.days || [],
            mealTimes: data.mealTimes || []
        } : { days: [], mealTimes: [] };
    };

    const handleSaveFood = (foodName) => {
        if (!selectedCell.day) {
            console.error('Selected cell information missing');
            return;
        }

        const updatedMealPlan = {...mealPlan};

        const day = updatedMealPlan.days.find(d => d.name === selectedCell.day.name);
        if (!day) {
            console.error(`Day ${selectedCell.day.name} not found in meal plan`);
            return;
        }
        console.log('Day:', day.name);
        console.log('Meal time:', selectedCell.mealtime);

        let mealTimeObject = mealPlan.mealTimes.find(mt => mt.name === selectedCell.mealtime);
        if (!mealTimeObject) {
            console.error(`MealTime ${selectedCell.mealtime} not found in mealTimes.`);
            mealTimeObject = {
                id: undefined,
                name: selectedCell.mealtime,
                order: undefined
            };
        }

        let mealToUpdate = day.meals.find(m => m.name === selectedCell.mealtime);
        if (!mealToUpdate) {
            mealToUpdate = {
                name: selectedCell.mealtime,
                foods: [],
                mealTime: mealTimeObject,
                dayId: day.id
            }
            day.meals.push(mealToUpdate)
        }
        console.log('Meal to update:', mealToUpdate.name);

        const existingFood = savedFoods.find(food => food.name.toLowerCase() === foodName.toLowerCase());

        const foodUpdate = async () => {if (existingFood) {
            console.log(`Food ${foodName} already exists. Not adding to backend.`);
            mealToUpdate.foods.push(existingFood);
            setMealPlan(updatedMealPlan);
            console.log('Updated meal plan:', JSON.stringify(updatedMealPlan));
        } else {
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
                    mealToUpdate.foods.push(savedFood);
                    setMealPlan(updatedMealPlan);
                    console.log('Updated meal plan:', JSON.stringify(updatedMealPlan));
                })
                .catch(error => console.error('Error saving food:', error));
        }};

        const mealPlanUpdate = async () => {
            fetch(`${BackendUrl}/api/meal-plan`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMealPlan),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(JSON.stringify(updatedMealPlan))
                    setMealPlan(data);
                    console.log('Updated meal plan:', JSON.stringify(data));
                })
                .catch(error => console.error('Error saving updated meal plan:', error));
        };

        foodUpdate().then(() => {
            setIsModalOpen(false);
            mealPlanUpdate().then();
        });
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
                    fetch(`${BackendUrl}/api/meal-plan`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedMealPlan),
                    })
                        .then(response => response.json())
                        .then(data => {
                            setMealPlan(data);
                            console.log('Updated meal plan saved successfully:',data);
                        })
                        .catch(error => console.log('Failed to update meal plan:',error));
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
                const updatedMealPlan = {
                    ...mealPlan,
                    mealTimes: [...mealPlan.mealTimes, newMealTime],
                    days: mealPlan.days,
                }
                fetch(`${BackendUrl}/api/meal-plan`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedMealPlan),
                })
                    .then(response => response.json())
                    .catch(error => console.log('Error saving meal plan:',error))

                setMealPlan(updatedMealPlan);
                console.log('Added new meal successfully:', JSON.stringify(mealTimeData));
                console.log('New meal plan:', updatedMealPlan);

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
                    const updatedMealPlan = { ...mealPlan, mealTimes: updatedMealTimes}
                    fetch(`${BackendUrl}/api/meal-plan`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedMealPlan),
                    })
                        .then(response => response.json())
                        .then(data => {
                            setMealPlan(data);
                            console.log('Updated meal plan saved successfully:', data);
                        })
                        .catch(error => console.log('Error saving meal plan:',error));
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
                                                    { mealForDay?.foods?.[0]?.name || "" }
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