import React from 'react';
import { useNavigate} from "react-router-dom";
import '../assets/css/ingredients-at-home-page.css'
import { useIngredient} from "../hooks/useIngredient";
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import {useHomeIngredients} from "../hooks/useHomeIngredient";
import AddIngredientModal from "../components/modals/AddIngredientModal";
import NewNameModal from "../components/modals/NewNameModal";

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
        handleAddHomeIngredient,
        handleAddNewHomeIngredient,
        handleDeleteHomeIngredient,
        handleEditHomeIngredient,
        handleSaveEditedHomeIngredient,
    } = useHomeIngredients();

    const navigateToMenu = () => navigate('/menu');

    const handleSave = async (selectedIngredient, newIngredientName, quantity) => {
        if (selectedIngredient) {
            await handleAddHomeIngredient(selectedIngredient.id, quantity);
        } else if (newIngredientName.trim()) {
            await handleAddNewHomeIngredient(newIngredientName.trim(), quantity);
        }
    };

    if (!Array.isArray(homeIngredients)) return <PageTitle text="Loading ingredients..." />;

    const sortedHomeIngredients = [...homeIngredients].sort((a, b) =>
        a.ingredient?.name?.localeCompare(b.ingredient?.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="home-ingredients-header">
                <div className="menu-button">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Ingredients at Home" />
            </div>
            <div className="home-ingredients-wrapper">
                <div className="home-ingredients-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={sortedHomeIngredients}
                        renderCell={(rowIndex) => {
                            const hi = sortedHomeIngredients[rowIndex];
                            return (
                                <div className="home-ingredient-row">
                                    <div className="home-ingredient-label-wrapper">
                                        <span className="home-ingredient-name lobster">{hi.ingredient?.name}</span>
                                        <span className="home-ingredient-quantity">({hi.quantity})</span>
                                    </div>
                                    <div className="home-ingredient-icons">
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
                savedIngredients={ingredients}
                savedHomeIngredients={homeIngredients}
            />
            <NewNameModal
                isOpen={isQuantityModalOpen}
                onClose={() => setIsQuantityModalOpen(false)}
                onSave={handleSaveEditedHomeIngredient}
                itemName="quantity"
                defaultName={editingHomeIngredient?.quantity}
            />
        </div>
    );

}

export default IngredientsAtHomePage