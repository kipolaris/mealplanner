import React from 'react';
import AddFoodModal from "../components/modals/AddFoodModal";
import { useMealPlan} from "../hooks/useMealPlan";
import { useMealTime } from "../hooks/useMealTime";
import { useNavigate, useParams} from "react-router-dom";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import TapeButton from "../components/TapeButton";
import '../assets/css/meal-plan-vertical.css';
import NewNameModal from "../components/modals/NewNameModal";

const DayPage = () => {
    const { day } = useParams();

    const navigate = useNavigate();

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
        resetDay,
        resetMeal
    } = useMealPlan();

    const {
        mealTimes,
        handleAddMealTime,
        handleReorder,
        isNameModalOpen,
        setIsNameModalOpen
    } = useMealTime(mealPlan, updateMealPlan);

    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <h1 className="loading">Loading meal plan...</h1>;
    }

    const dayObj = mealPlan.days.find(d => d.name === day);
    if (!dayObj) {
        return <h1 className="loading">Day not found</h1>;
    }

    const navigateToMealPlan = () => {
        navigate('/meal-plan');
    }

    const navigateToMenu = () => {
        navigate('/menu')
    }

    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell( { day: day, meal: meal, mealtime: mealtime});
        setIsModalOpen(true);
    }

    const handleResetDay = () => {
        const d = mealPlan.days.find(d => d.id === dayObj.id);
        if (!d) {
            console.error(`Day ${day} not found`);
            return
        }
        resetDay(d);
    }

    return (
        <div className="app-container">
            <div className="meal-plan-item-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                    <TapeButton text="Back" onClick={navigateToMealPlan} />
                </div>
                <PageTitle text={day} />
            </div>
            <div className="vertical-table-wrapper">
                <div className="vertical-table-container">
                    <TapedTable
                        layout="vertical"
                        columns={['Meals']}
                        rows={mealTimes.slice().sort((a, b) => a.order - b.order)}
                        renderRowLabel={(mealTime) => (
                            <span className="meal-time-name" onClick={() => navigate(`/meal/${mealTime.name}`)}>
                                {mealTime.name}
                            </span>
                        )}
                        renderCell={(rowIndex) => {
                            const sortedMealTimes = mealTimes.slice().sort((a, b) => a.order - b.order);
                            const mt = sortedMealTimes[rowIndex];
                            const meal = dayObj.meals.find(m => m.mealTime.name === mt.name);
                            return (
                                <button className="meal-button" onClick={() => handleCellClick(dayObj, meal, mt.name)}>
                                    {meal?.food?.name || ""}
                                </button>
                            );
                        }}
                        extraBottomRow={
                            <tr>
                                <td colSpan={2}>
                                    <button className="table-button lobster" onClick={() => setIsNameModalOpen(true)}>
                                        Add new meal time
                                    </button>
                                </td>
                            </tr>
                        }
                        handleReset={handleResetDay}
                        handleReorder={handleReorder}
                        navigate={navigate}
                    />
                </div>
            </div>
            <AddFoodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFood}
                onClearMeal={resetMeal}
                meal={selectedCell.meal}
                savedFoods={savedFoods}
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

export default DayPage