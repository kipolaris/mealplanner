import React from 'react';
import { useNavigate} from "react-router-dom";
import '../assets/css/ingredients.css'
import { useIngredient} from "../hooks/useIngredient";
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import {useHomeIngredients} from "../hooks/useHomeIngredient";
import {useUnitOfMeasure} from "../hooks/useUnitOfMeasure";
import AddIngredientModal from "../components/modals/AddIngredientModal";
import MergeAmountModal from "../components/modals/MergeAmountModal";
import EditQuantityModal from "../components/modals/EditQuantityModal";

const IngredientsAtHomePage = () => {
    const navigate = useNavigate();

    const { ingredients } = useIngredient();
    const {
        homeIngredients,
        setIsAddIngredientModalOpen,
        isAddIngredientModalOpen,
        isQuantityModalOpen,
        setIsQuantityModalOpen,
        editingHomeIngredient,
        isMergeModalOpen,
        setIsMergeModalOpen,
        pendingMerge,
        confirmMergeHomeIngredient,
        handleAddHomeIngredient,
        handleAddNewHomeIngredient,
        handleDeleteHomeIngredient,
        handleEditHomeIngredient,
        handleSaveEditedHomeIngredient,
    } = useHomeIngredients();

    const unitsOfMeasure = useUnitOfMeasure()

    const navigateToMenu = () => navigate('/menu');

    const handleSave = async (selectedIngredient, newIngredientName, amount, unitId) => {
        if (selectedIngredient) {
            await handleAddHomeIngredient(selectedIngredient.id, amount, unitId);
        } else if (newIngredientName.trim()) {
            await handleAddNewHomeIngredient(newIngredientName.trim(), amount, unitId);
        }
    };

    if (!Array.isArray(homeIngredients)) return <PageTitle text="Loading ingredients..." />;

    const sortedHomeIngredients = [...homeIngredients].sort((a, b) =>
        a.ingredient?.name?.localeCompare(b.ingredient?.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Ingredients at Home" />
            </div>
            <div className="content-wrapper">
                <div className="content-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={sortedHomeIngredients}
                        renderCell={(rowIndex) => {
                            const hi = sortedHomeIngredients[rowIndex];
                            return (
                                <div className="ingredient-row">
                                    <div className="ingredient-label-wrapper">
                                        <span className="ingredient-name lobster">{hi.ingredient?.name}</span>
                                        <span className="ingredient-quantity">({hi.amount} {hi.unit.abbreviation})</span>
                                    </div>
                                    <div className="cell-icons">
                                        <img
                                            src={require('../assets/images/pencil.png')}
                                            alt="Edit"
                                            className="edit-button"
                                            onClick={() => handleEditHomeIngredient(hi)}
                                        />
                                        <img
                                            src={require('../assets/images/trashcan.png')}
                                            alt="Delete"
                                            className="edit-button"
                                            onClick={() => handleDeleteHomeIngredient(hi.id)}
                                        />
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
                                    <button className="table-button lobster" onClick={() => setIsAddIngredientModalOpen(true)}>
                                        Add ingredient at home
                                    </button>
                                </td>
                            </tr>
                        }
                    />
                </div>
            </div>

            <AddIngredientModal
                isOpen={isAddIngredientModalOpen}
                onClose={() => setIsAddIngredientModalOpen(false)}
                onSave={handleSave}
                unitsOfMeasure={unitsOfMeasure}
                savedIngredients={ingredients}
            />
            <EditQuantityModal
                isOpen={isQuantityModalOpen}
                onClose={() => setIsQuantityModalOpen(false)}
                onSave={handleSaveEditedHomeIngredient}
                ingredient={editingHomeIngredient}
                unitsOfMeasure={unitsOfMeasure}
            />
            <MergeAmountModal
                isOpen={isMergeModalOpen}
                onClose={() => setIsMergeModalOpen(false)}
                onSave={confirmMergeHomeIngredient}
                listName="home ingredients"
                amount={pendingMerge?.amount}
                unit={pendingMerge?.unit}
            />
        </div>
    );
}

export default IngredientsAtHomePage