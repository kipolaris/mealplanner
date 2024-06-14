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
            .then(data => setMealPlan(data))
            .catch(error => console.error('Error fetching meal plan:', error));
    }, []);

    const handleCellClick = (day, meal) => {
        setSelectedCell({ day, meal });
        setIsModalOpen(true); // Use state to control modal visibility
    };

    const handleSaveFood = (food) => {
        const updatedMealPlan = { ...mealPlan };
        const dayIndex = mealPlan.mealDays.findIndex(d => d.name === selectedCell.day);
        updatedMealPlan.mealDays[dayIndex][selectedCell.meal] = food;
        setMealPlan(updatedMealPlan);
        setIsModalOpen(false); // Close modal after saving
    };

    if (!mealPlan) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <h1>Meal Plan</h1>
            <MealPlanTable mealPlan={mealPlan} onCellClick={handleCellClick} />
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
