import React from 'react';
import AddFoodModal from '../components/modals/AddFoodModal';
import '../assets/css/mealtime-page.css';
import { useMealPlan } from '../hooks/useMealPlan';
import {useNavigate, useParams} from "react-router-dom";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import TapeButton from "../components/TapeButton";

const MealtimePage = () => {
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
    } = useMealPlan();

    const navigate = useNavigate();

    const navigateToMealPlan = () => {
        navigate('/meal-plan');
    };
    const handleCellClick = (day, meal, mealtime) => {
        setSelectedCell({ day: day, meal: meal, mealtime: mealtime });
        setIsModalOpen(true);
    };

    if (!mealPlan?.days || mealPlan.days.length === 0) {
        return <h1 className="loading">Loading meal plan...</h1>;
    }

    return (
        <div className="app-container">
            <div className="mealtime-header">
                <TapeButton text="Back" onClick={navigateToMealPlan} />
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
                        handleReset={() => {}}
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

export default MealtimePage;
