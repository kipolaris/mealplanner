import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useMealTime} from "../hooks/useMealTime";
import TapeButton from "../components/TapeButton";
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import {useMealPlan} from "../hooks/useMealPlan";
import NewNameModal from "../components/modals/NewNameModal";
import {useConfirm} from "../hooks/useConfirm";
import ConfirmModal from "../components/modals/ConfirmModal";

const MealTimesPage = () => {
    const navigate = useNavigate();

    const { mealPlan, updateMealPlan } = useMealPlan();

    const {
        mealTimes,
        addMealTime,
        editMealTime,
        deleteMealTime,
        handleReorder,
        isNameModalOpen,
        setIsNameModalOpen,
        saveEditedMealTime,
        editingMealTime
    } = useMealTime(mealPlan, updateMealPlan);

    const {
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        confirmText,
        confirmAction,
        confirm
    } = useConfirm();

    const navigateToMenu = () => {
        navigate('/menu');
    }

    const handleDeleteMealTime = (mealTime) => confirm(`Are you sure you want to delete ${mealTime.name}?`,() => deleteMealTime(mealTime.id));

    if (!mealTimes) return <PageTitle text="Loading meal times..."/>;

    const sortedMealTimes = mealTimes.slice().sort((a, b) => a.order - b.order);

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
                        rows={sortedMealTimes}
                        columns={[
                            {
                                header: "Reorder",
                                render: (_, rowIndex) => (
                                    <div className="arrow-buttons">
                                        {rowIndex > 0 && (
                                            <img
                                                src={require('../assets/images/arrowup.png')}
                                                alt="Move up"
                                                className="arrow-button"
                                                onClick={() =>
                                                    handleReorder(sortedMealTimes[rowIndex].order, sortedMealTimes[rowIndex - 1].order)
                                                }
                                            />
                                        )}
                                        {rowIndex < sortedMealTimes.length - 1 && (
                                            <img
                                                src={require('../assets/images/arrowdown.png')}
                                                alt="Move down"
                                                className="arrow-button"
                                                onClick={() =>
                                                    handleReorder(sortedMealTimes[rowIndex].order, sortedMealTimes[rowIndex + 1].order)
                                                }
                                            />
                                        )}
                                    </div>
                                ),
                            },
                            {
                                header: "Actions",
                                render: (mt) => (
                                    <div className="edit-buttons">
                                        <img
                                            src={require('../assets/images/pencil.png')}
                                            alt="Edit"
                                            className="edit-button"
                                            onClick={() => editMealTime(mt)}
                                        />
                                        <img
                                            src={require('../assets/images/trashcan.png')}
                                            alt="Delete"
                                            className="edit-button"
                                            onClick={() => handleDeleteMealTime(mt)}
                                        />
                                    </div>
                                ),
                            },
                        ]}
                        renderRowLabel={(mt) => (
                            <span className="meal-time-name">{mt.name}</span>
                        )}
                        showHeader={true}
                        showRowLabels={true}
                        rowLabelHeader="Meal Time"
                        allowReorder={false}
                        extraBottomRow={
                            <tr>
                                <td colSpan={3}>
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
                        saveEditedMealTime(name);
                    } else {
                        addMealTime(name);
                    }
                }}
                itemName="meal time"
                defaultName={editingMealTime?.name}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onSave={confirmAction}
                text={confirmText}
            />
        </div>
    );
}

export default MealTimesPage