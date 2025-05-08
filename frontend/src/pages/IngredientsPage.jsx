import React from 'react';
import { useNavigate } from 'react-router-dom';
import '..assets/css/ingredients-page.css';
import { useIngredient } from "../hooks/useIngredient";
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import NewNameModal from "../components/modals/NewNameModal";

const IngredientsPage = () => {
    const navigate = useNavigate();

    const {
        ingredients,
        setIngredients,
        isNameModalOpen,
        setIsNameModalOpen,
        editingIngredient,
        handleAddIngredient,
        handleEditIngredient,
        handleSaveEditedIngredient,
        handleDeleteIngredient
    } = useIngredient();

    const navigateToMenu = () => {
        navigate('/menu');
    }

    if(!ingredients) return <PageTitle text="Loading ingredients..."/>;

    return (
        <div className="app-container">
            <div className="ingredients-header">
                <div className="menu-button">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Ingredients"/>
            </div>
            <div className="ingredients-wrapper">
                <div className="ingredients-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={ingredients}
                        renderCell={(rowIndex) => {
                            const i = ingredients[rowIndex];
                            return (
                                <div className="ingredient-row">
                                    <span className="ingredient-name">{i.name}</span>
                                    <div className="ingredient-icons">
                                        <div className="edit-buttons">
                                            <img
                                                src={require('../assets/images/pencil.png')}
                                                alt="Edit"
                                                className="edit-button"
                                                onClick={() => handleEditIngredient(i)}
                                            />
                                            <img
                                                src={require('../assets/images/trashcan.png')}
                                                alt="Delete"
                                                className="edit-button"
                                                onClick={() => handleDeleteIngredient(i.id)}
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
                                        Add new ingredient
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
                    if (editingIngredient) {
                        handleSaveEditedIngredient(name);
                    } else {
                        handleAddIngredient(name);
                    }
                }}
                itemName="ingredient"
                defaultName={editingIngredient?.name}
            />
        </div>
    )
}

export default IngredientsPage