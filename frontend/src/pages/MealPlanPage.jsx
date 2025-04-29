import React from 'react';
import { useNavigate } from 'react-router-dom';

import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/meal-plan-page.css';

import { useMealPlan } from "../hooks/useMealPlan";
import { useMealTime } from "../hooks/useMealTime";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";

const MealPlanPage = () => {
    const {
        mealPlan,
        savedFoods,
        isModalOpen,
        setIsModalOpen,
        setSelectedCell,
        handleSaveFood,
        handleDeleteFood,
        updateMealPlan,
        resetMealPlan,
    } = useMealPlan();

    const { mealTimes, handleAddMealTime, handleReorder } = useMealTime(mealPlan, updateMealPlan);

    const navigate = useNavigate();

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <PageTitle className="loading" text="Loading Meal Plan..." />;
    }

    return (
        <div className="app-container">
            <div className="meal-plan-table-wrapper">
                <div className="meal-plan-container">
                    <PageTitle text="Meal Plan" />
                    <TapedTable
                        layout="horizontal"
                        columns={mealPlan.days.map(day => day.name)}
                        rows={mealTimes.slice().sort((a, b) => a.order - b.order)}
                        renderRowLabel={(mealTime) => (
                            <span className="meal-time-name" onClick={() => navigate(`/meal/${mealTime.name}`)}>
                                {mealTime.name}
                            </span>
                        )}
                        renderCell={(rowIndex, colIndex) => {
                            const sortedMealTimes = mealTimes.slice().sort((a, b) => a.order - b.order);
                            const mt = sortedMealTimes[rowIndex];
                            const day = mealPlan.days[colIndex];
                            const mealForDay = day.meals.find(m => m.mealTime.name === mt.name);

                            return (
                                <button
                                    className="meal-button"
                                    onClick={() => handleCellClick(day, mealForDay, mt.name)}
                                >
                                    {mealForDay?.food?.name || ""}
                                </button>
                            );
                        }}
                        extraBottomRow={
                            <tr>
                                <td colSpan={mealPlan.days.length + 1}>
                                    <button className="table-button lobster" onClick={handleAddMealTime}>
                                        Add new meal time
                                    </button>
                                </td>
                            </tr>
                        }
                        handleReset={resetMealPlan}
                        handleReorder={handleReorder}
                        navigate={navigate}
                    />
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

export default MealPlanPage;
