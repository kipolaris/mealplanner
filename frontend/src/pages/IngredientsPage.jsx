import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIngredient } from "../hooks/useIngredient";
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import NewNameModal from "../components/modals/NewNameModal";
import {useConfirm} from "../hooks/useConfirm";
import ConfirmModal from "../components/modals/ConfirmModal";

const IngredientsPage = () => {
    const navigate = useNavigate();

    const {
        ingredients,
        setIngredients,
        isNameModalOpen,
        setIsNameModalOpen,
        editingIngredient,
        addIngredient,
        editIngredient,
        saveEditedIngredient,
        deleteIngredient
    } = useIngredient();

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

    const handleDeleteIngredient = (ingredient) => confirm(`Are you sure you want to delete ${ingredient.name}?`,() => deleteIngredient(ingredient.id));

    if (!Array.isArray(ingredients)) return <PageTitle text="Loading ingredients..." />;

    const sortedIngredients = [...ingredients].sort((a, b) =>
        a.name?.localeCompare(b.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Ingredients"/>
            </div>
            <div className="content-wrapper">
                <TapedTable
                    layout="vertical"
                    rows={sortedIngredients}
                    columns={[
                        {
                            header: "Ingredient",
                            render: (i) => (
                                <span className="ingredient-name">{i.name}</span>
                            )
                        },
                        {
                            header: "Actions",
                            render: (i) => (
                                <div className="edit-buttons">
                                    <img
                                        src={require('../assets/images/pencil.png')}
                                        alt="Edit"
                                        className="edit-button"
                                        onClick={() => editIngredient(i)}
                                    />
                                    <img
                                        src={require('../assets/images/trashcan.png')}
                                        alt="Delete"
                                        className="edit-button"
                                        onClick={() => handleDeleteIngredient(i)}
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
                            <td colSpan={2}>
                                <button className="table-button lobster" onClick={() => setIsNameModalOpen(true)}>
                                    Add new ingredient
                                </button>
                            </td>
                        </tr>
                    }
                />
            </div>
            <NewNameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSave={(name) => {
                    if (editingIngredient) {
                        saveEditedIngredient(name);
                    } else {
                        addIngredient(name);
                    }
                }}
                itemName="ingredient"
                defaultName={editingIngredient?.name}
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

export default IngredientsPage