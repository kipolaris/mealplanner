import React from 'react';

function MealPlanTable({ mealPlan, onCellClick, onAddMeal }) {
    if (!mealPlan || !mealPlan.mealDays || !mealPlan.meals) {
        return null; // Or handle loading state differently
    }

    return (
        <table className="meal-plan-table">
            <thead>
            <tr>
                <th></th>
                {mealPlan.mealDays.map(day => (
                    <th key={day.id}>{day.name}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {mealPlan.meals.map(meal => (
                <tr key={meal}>
                    <td>{meal.charAt(0).toUpperCase() + meal.slice(1)}</td>
                    {mealPlan.mealDays.map(day => (
                        <td key={day.id} onClick={() => onCellClick(day.name, meal)}>
                            {day[meal] || 'Add'}
                        </td>
                    ))}
                </tr>
            ))}
            <tr>
                <td colSpan={mealPlan.mealDays.length + 1}>
                    <button onClick={onAddMeal}>Add Meal</button>
                </td>
            </tr>
            </tbody>
        </table>
    );
}

export default MealPlanTable;
