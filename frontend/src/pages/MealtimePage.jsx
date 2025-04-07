import React, { useEffect, useState } from 'react';
import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/mealtime-page.css';
import { BackendUrl } from '../utils/constants';

const MealtimePage = ({ mealTime, onClose }) => {
    const [mealData, setMealData] = useState({ days: [] });
    const [selectedCell, setSelectedCell] = useState({ day: {}, meal: {} });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFoods, setSavedFoods] = useState([]);

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                const filteredDays = data.days.map(day => ({
                    name: day.name,
                    meal: day.meals.find(m => m.name === mealTime) || { name: mealTime, foods: [] }
                }));
                setMealData({ days: filteredDays });
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

    const handleSaveFood = (foodName) => {
        if (!selectedCell.day || !selectedCell.meal) return;

        const updatedMealData = { ...mealData };
        console.log(mealData);

        const day = updatedMealData.days.find(d => d.name === selectedCell.day.name);
        if (!day) return;

        const existingFood = savedFoods.find(f => f.name.toLowerCase() === foodName.toLowerCase())

        const foodData = {
            name: foodName,
            id: undefined,
            description: undefined,
            ingredients: []
        }

        day.meal.foods.push({ name: foodName });

        setMealData(updatedMealData);
        setIsModalOpen(false);

        if(existingFood){
            console.log(`Food ${foodName} already exists, not adding to backend`);
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
                    const updatedMealData = { ...mealData };
                    updatedMealData.days.forEach(day => {
                        day.meal.foods = day.meal.foods.filter(f => f.id!== foodId);
                    });
                    setMealData(updatedMealData);
                    console.log(`Food with id ${foodId} deleted successfully`);
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
                        {mealData.days.map(day => (
                            <tr key={day.name}>
                                <td>{day.name}</td>
                                <td className="food-item" onClick={() => handleCellClick(day, day.meal)}>
                                    <button>{day.meal.foods[0]?.name || ''}</button>
                                </td>
                            </tr>
                        ))}
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