import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useMealTime} from "../hooks/useMealTime";
import TapeButton from "../components/TapeButton";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import {useMealPlan} from "../hooks/useMealPlan";
import NewNameModal from "../components/modals/NewNameModal";

const MealTimesPage = () => {
    const navigate = useNavigate();

    const { mealPlan, updateMealPlan } = useMealPlan();

    const {
        mealTimes,
        handleAddMealTime,
        handleEditMealTime,
        handleDeleteMealTime,
        handleReorder,
        isNameModalOpen,
        setIsNameModalOpen,
        handleSaveEditedMealTime,
        editingMealTime
    } = useMealTime(mealPlan, updateMealPlan);

    const navigateToMenu = () => {
        navigate('/menu');
    }

    if (!mealTimes) return <PageTitle text="Loading meal times..."/>;

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Meal Times"/>
            </div>

            <div className="content-wrapper">
                <div className="content-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={mealTimes.slice().sort((a, b) => a.order - b.order)}
                        renderCell={(rowIndex) => {
                            const sortedMealTimes = mealTimes.slice().sort((a, b) => a.order - b.order);
                            const mt = sortedMealTimes[rowIndex];
                            return (
                                <div className="table-row">
                                    <span className="cell-name">{mt.name}</span>
                                    <div className="cell-icons">
                                        <div className="arrow-buttons">
                                            {rowIndex > 0 && (
                                                <img
                                                    src={require('../assets/images/arrowup.png')}
                                                    alt="Move up"
                                                    className="arrow-button"
                                                    onClick={() => handleReorder(mt.order, sortedMealTimes[rowIndex - 1].order)}
                                                />
                                            )}
                                            {rowIndex < sortedMealTimes.length - 1 && (
                                                <img
                                                    src={require('../assets/images/arrowdown.png')}
                                                    alt="Move down"
                                                    className="arrow-button"
                                                    onClick={() => handleReorder(mt.order, sortedMealTimes[rowIndex + 1].order)}
                                                />
                                            )}
                                        </div>
                                        <div className="edit-buttons">
                                            <img
                                                src={require('../assets/images/pencil.png')}
                                                alt="Edit"
                                                className="edit-button"
                                                onClick={() => handleEditMealTime(mt)}
                                            />
                                            <img
                                                src={require('../assets/images/trashcan.png')}
                                                alt="Delete"
                                                className="edit-button"
                                                onClick={() => handleDeleteMealTime(mt.id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                        allowReorder={false}
                        showHeader={false}
                        showRowLabels={false}
                        extraBottomRow={
                            <tr>
                                <td>
                                    <button className="table-button lobster" onClick={() => setIsNameModalOpen(true)}>
                                        Add new meal time
                                    </button>
                                </td>
                            </tr>
                        }
                    />
                </div>
            </div>
            <NewNameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSave={(name) => {
                    if (editingMealTime) {
                        handleSaveEditedMealTime(name);
                    } else {
                        handleAddMealTime(name);
                    }
                }}
                itemName="meal time"
                defaultName={editingMealTime?.name}
            />
        </div>
    );
}

export default MealTimesPage