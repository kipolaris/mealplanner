import React, { useState, useEffect } from 'react';
import MealPlanTable from './MealPlanTable';
import AddFoodModal from './AddFoodModal';

function App() {
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedCell, setSelectedCell] = useState({});

    useEffect(() => {
        fetch('/components/templates/meal-plan.html')
            .then(response => response.json())
            .then(data => setMealPlan(data))
            .catch(error => console.error('Error fetching meal plan:', error));
    }, []);

    const handleCellClick = (day, meal) => {
        setSelectedCell({ day, meal });
        document.getElementById('addFoodModal').style.display = 'block';
    };

    const handleSaveFood = (food) => {
        // Update mealPlan state with new food
        const updatedMealPlan = { ...mealPlan };
        const dayIndex = mealPlan.mealDays.findIndex(d => d.name === selectedCell.day);
        updatedMealPlan.mealDays[dayIndex][selectedCell.meal] = food;
        setMealPlan(updatedMealPlan);
        document.getElementById('addFoodModal').style.display = 'none';
    };

    if (!mealPlan) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <h1>Meal Plan</h1>
            <MealPlanTable mealPlan={mealPlan} onCellClick={handleCellClick} />
            <AddFoodModal onSaveFood={handleSaveFood} />
        </div>
    );
}

export default App;
