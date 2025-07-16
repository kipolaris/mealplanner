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
import {useConfirm} from "../hooks/useConfirm";
import ConfirmModal from "../components/modals/ConfirmModal";

const IngredientsAtHomePage = () => {
    const navigate = useNavigate();

    const { ingredients, setIngredients } = useIngredient();
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
        addHomeIngredient,
        addNewHomeIngredient,
        deleteHomeIngredient,
        editHomeIngredient,
        saveEditedHomeIngredient,
    } = useHomeIngredients(setIngredients);

    const {
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        confirmText,
        confirmAction,
        confirm
    } = useConfirm();

    const unitsOfMeasure = useUnitOfMeasure()

    const navigateToMenu = () => navigate('/menu');

    const handleSave = async (selectedIngredient, newIngredientName, amount, unitId, expirationDate) => {
        if (selectedIngredient) {
            await addHomeIngredient(selectedIngredient.id, amount, unitId, expirationDate);
        } else if (newIngredientName.trim()) {
            await addNewHomeIngredient(newIngredientName.trim(), amount, unitId, expirationDate);
        }
    };

    const handleDeleteHomeIngredient = (homeIngredient) => confirm(`Are you sure you want to delete ${homeIngredient.ingredient.name}?`,() => deleteHomeIngredient(homeIngredient.id))

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
                        columns={[
                            {
                                header: 'Ingredients',
                                render: (hi) => (
                                    <span className="ingredient-name">{hi.ingredient?.name}</span>
                                )
                            },
                            {
                                header: 'Quantity',
                                render: (hi) => (
                                    <span className="ingredient-quantity">{hi.amount} {hi.unit.abbreviation}</span>
                                )
                            },
                            {
                                header: 'Expiration date',
                                render: (hi) => (
                                    <span className="expiration-date">
                                      {hi.expirationDate
                                          ? new Date(hi.expirationDate).toLocaleDateString(undefined, {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric'
                                          })
                                          : '—'}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                render: (hi) => (
                                    <div className="edit-buttons">
                                        <img
                                            src={require('../assets/images/pencil.png')}
                                            alt="Edit"
                                            className="edit-button"
                                            onClick={() => editHomeIngredient(hi)}
                                        />
                                        <img
                                            src={require('../assets/images/trashcan.png')}
                                            alt="Delete"
                                            className="edit-button"
                                            onClick={() => handleDeleteHomeIngredient(hi)}
                                        />
                                    </div>
                                )
                            }
                        ]}
                        allowReorder={false}
                        showHeader={true}
                        showRowLabels={false}
                        extraBottomRow={
                            <tr>
                                <td colSpan={4}>
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
                showExpirationInput={true}
            />
            <EditQuantityModal
                isOpen={isQuantityModalOpen}
                onClose={() => setIsQuantityModalOpen(false)}
                onSave={saveEditedHomeIngredient}
                ingredient={editingHomeIngredient}
                unitsOfMeasure={unitsOfMeasure}
                showExpirationInput={true}
            />
            <MergeAmountModal
                isOpen={isMergeModalOpen}
                onClose={() => setIsMergeModalOpen(false)}
                onSave={confirmMergeHomeIngredient}
                listName="home ingredients"
                amount={pendingMerge?.amount}
                unit={pendingMerge?.unit}
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

export default IngredientsAtHomePage