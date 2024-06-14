import React, { useState, useEffect } from 'react';
import MealPlanTable from './components/MealPlanTable';
import AddFoodModal from './components/AddFoodModal';
import { BackendUrl } from "./constants";

function App() {
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedCell, setSelectedCell] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [savedFoods, setSavedFoods] = useState(["Pizza", "Salad", "Pasta", "Burger"]); // Initial saved foods

    useEffect(() => {
        fetch(`${BackendUrl}/api/meal-plan`)
            .then(response => response.json())
            .then(data => {
                // Ensure mealPlan has required properties and default meals
                const defaultMeals = ['breakfast', 'lunch', 'dinner'];
                const initialMealPlan = {
                    mealDays: [],
                    meals: defaultMeals,
                    ...data // Merge fetched data
                };
                // Initialize each day with default meals
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
        setIsModalOpen(true); // Use state to control modal visibility
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

    if (!mealPlan || !mealPlan.mealDays || !mealPlan.meals) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <h1>Meal Plan</h1>
            <MealPlanTable mealPlan={mealPlan} onCellClick={handleCellClick} onAddMeal={handleAddMeal} />
            <AddFoodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFood}
                savedFoods={savedFoods}
            />
        </div>
    );
}

export default App;
