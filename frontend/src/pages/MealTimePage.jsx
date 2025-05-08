import React from 'react';
import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/mealtime-page.css';
import { useMealPlan } from '../hooks/useMealPlan';
import {useNavigate, useParams} from "react-router-dom";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import TapeButton from "../components/TapeButton";

const MealTimePage = () => {
    const { mealTime } = useParams();

    const {
        mealPlan,
        savedFoods,
        isModalOpen,
        setIsModalOpen,
        setSelectedCell,
        handleSaveFood,
        handleDeleteFood,
        updateMealPlan,
        resetMealTime
    } = useMealPlan();

    const navigate = useNavigate();

    const navigateToMealPlan = () => {
        navigate('/meal-plan');
    };

    const navigateToMenu = () => {
        navigate('/menu')
    }
    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    const handleResetMealTime = () => {
        const mt = mealPlan.mealTimes.find(mt => mt.name === mealTime);
        if (!mt) {
            console.error(`MealTime "${mealTime}" not found`);
            return;
        }
        resetMealTime(mt);
    };


    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <h1 className="loading">Loading meal plan...</h1>;
    }

    return (
        <div className="app-container">
            <div className="mealtime-header">
                <div className="mealtime-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                    <TapeButton text="Back" onClick={navigateToMealPlan} />
                </div>
                <PageTitle text={mealTime} />
            </div>
            <div className="mealtime-table-wrapper">
                <div className="mealtime-container">
                    <TapedTable
                        layout="vertical"
                        columns={['Meals']}
                        rows={mealPlan.days}
                        renderRowLabel={(day) => day.name}
                        renderCell={(rowIndex) => {
                            const day = mealPlan.days[rowIndex];
                            const meal = day.meals.find(m => m.mealTime.name === mealTime);
                            return (
                                <button className="meal-button" onClick={() => handleCellClick(day, meal, mealTime)}>
                                    {meal?.food?.name || ""}
                                </button>
                            );
                        }}
                        handleReset={handleResetMealTime}
                        allowReorder={false}
                    />
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

export default MealTimePage;
