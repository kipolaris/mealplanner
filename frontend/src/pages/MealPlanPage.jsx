import React from 'react';
import { useNavigate } from 'react-router-dom';

import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/meal-plan-horizontal.css';

import { useMealPlan } from "../hooks/useMealPlan";
import { useMealTime } from "../hooks/useMealTime";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import TapeButton from "../components/TapeButton";
import NewNameModal from "../components/modals/NewNameModal";

const MealPlanPage = () => {
    const {
        mealPlan,
        savedFoods,
        isModalOpen,
        setIsModalOpen,
        selectedCell,
        setSelectedCell,
        handleSaveFood,
        handleDeleteFood,
        updateMealPlan,
        resetMealPlan,
        resetMeal
    } = useMealPlan();

    const {
        mealTimes,
        handleAddMealTime,
        handleReorder,
        isNameModalOpen,
        setIsNameModalOpen
    } = useMealTime(mealPlan, updateMealPlan);

    const navigate = useNavigate();

    const navigateToMenu = () => {
        navigate('/menu')
    }

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <PageTitle className="loading" text="Loading Meal Plan..." />;
    }

    const sortedSavedFoods = [...savedFoods].sort((a, b) =>
        a.name?.localeCompare(b.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu}/>
                </div>
                <PageTitle text="Meal Plan" />
            </div>
            <div className="meal-plan-table-wrapper">
                <div className="meal-plan-container">
                    <TapedTable
                        layout="horizontal"
                        rows={mealTimes.slice().sort((a, b) => a.order - b.order)}
                        columns={mealPlan.days.map(day => ({
                            header: (
                                <span
                                    className="lobster"
                                    onClick={() => navigate(`/day/${day.name}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {day.name}
                                </span>
                            ),
                            render: (mealTime) => {
                                const mealForDay = day.meals.find(m => m.mealTime.name === mealTime.name);
                                return (
                                    <button
                                        className="meal-button"
                                        onClick={() => handleCellClick(day, mealForDay, mealTime.name)}
                                    >
                                        {mealForDay?.food?.name || ""}
                                    </button>
                                );
                            },
                        }))}
                        renderRowLabel={(mealTime) => (
                            <span className="meal-time-name" onClick={() => navigate(`/meal/${mealTime.name}`)}>
                              {mealTime.name}
                            </span>
                        )}
                        extraBottomRow={
                            <tr>
                                <td colSpan={mealPlan.days.length + 1}>
                                    <button className="table-button lobster" onClick={() => setIsNameModalOpen(true)}>
                                        Add new meal time
                                    </button>
                                </td>
                            </tr>
                        }
                        onReset={resetMealPlan}
                        onReorder={handleReorder}
                        showHeader={true}
                        showRowLabels={true}
                    />
                </div>
            </div>

            <AddFoodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFood}
                onClearMeal={resetMeal}
                meal={selectedCell.meal}
                savedFoods={sortedSavedFoods}
                onDeleteFood={handleDeleteFood}
            />
            <NewNameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSave={handleAddMealTime}
                itemName="meal time"
            />
        </div>
    );
};

export default MealPlanPage;
