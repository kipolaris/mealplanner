import React, { useEffect, useState } from 'react';
import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/mealtime-page.css';
import { BackendUrl } from '../utils/constants';

const MealtimePage = ({ mealTime, onClose }) => {
    const [mealPlan, setMealPlan] = useState({ days: [], mealTimes: [] });
    const [selectedCell, setSelectedCell] = useState({ day: {}, meal: {} });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFoods, setSavedFoods] = useState([]);

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                setMealPlan(data);
            })
            .catch(error => console.error('Error fetching meal data:', error));

        fetch(`${BackendUrl}/api/foods`)
            .then(response => response.json())
            .then((data) => setSavedFoods(data))
            .catch(error => console.error('Error fetching foods:', error));
    }, [mealTime]);

    const handleCellClick = (day, meal) => {
        setSelectedCell({ day, meal });
        setIsModalOpen(true);
    };

    const updateMealPlan = (updatedMealPlan) => {
        fetch(`${BackendUrl}/api/meal-plan`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMealPlan),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Meal plan received from backend:', JSON.stringify(data));
                setMealPlan(data);
            })
            .catch(error => console.error('Error saving updated meal plan:', error));
    };

    const handleSaveFood = (foodName) => {
        if (!selectedCell.day || !selectedCell.meal) return;

        const day = mealPlan.days.find(d => d.name === selectedCell.day.name);

        const existingFood = savedFoods.find(f => f.name.toLowerCase() === foodName.toLowerCase())

        const processUpdate = (foodToUse) => {
            const updatedMealData = {...mealPlan}

            const dayToUpdate = updatedMealData.days.find(d => d.id === day.id);
            let mealToUpdate = dayToUpdate.meals.find(m => m.name === mealTime.name);

            if(!mealToUpdate) {
                mealToUpdate = {
                    name: mealTime.name,
                    food: foodToUse,
                    mealTime: mealTime,
                    dayId: day.id
                }
                dayToUpdate.meals.push(mealToUpdate);
            } else {
                mealToUpdate.food = foodToUse;
            }

            updateMealPlan(updatedMealData);
        };

        if (existingFood) {
            console.log(`Food ${foodName} already exists. Not adding to backend.`);
            processUpdate(existingFood);
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
                    const updatedMealData = { ...mealPlan };
                    updatedMealData.days.forEach(day => {
                        day.meals.forEach(meal => {
                            if (meal.food.id === foodId) {
                                meal.food = null;
                            }
                        });
                    });
                    updateMealPlan(updatedMealData);
                } else {
                    console.error(`Failed to delete food with id ${foodId}`);
                }
            })
            .catch(error => console.error(`Error deleting food with id ${foodId}:`,error));
    };

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
                            const mealForDay = day.meals.find((m) => m.mealTime.name === mealTime.name);
                            return (
                                <tr key={day.name}>
                                    <td>{day.name}</td>
                                    <td className="food-item" onClick={() => handleCellClick(day, day.meal)}>
                                        <button>{ mealForDay ? (mealForDay.food ? mealForDay.food.name : "") : ""}</button>
                                    </td>
                                </tr>
                        )})}
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