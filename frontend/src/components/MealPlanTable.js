import React from 'react';

function MealPlanTable({ mealPlan, onCellClick }) {
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
            {['breakfast', 'lunch', 'dinner'].map(meal => (
                <tr key={meal}>
                    <td>{meal.charAt(0).toUpperCase() + meal.slice(1)}</td>
                    {mealPlan.mealDays.map(day => (
                        <td key={day.id} onClick={() => onCellClick(day.name, meal)}>
                            {day[meal] || 'Add'}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default MealPlanTable;
