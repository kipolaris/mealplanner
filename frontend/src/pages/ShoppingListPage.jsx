import React from "react";
import {useNavigate} from "react-router-dom";
import '../assets/css/shopping-list.css'
import '../assets/css/ingredients.css'
import { useIngredient} from "../hooks/useIngredient";
import {useUnitOfMeasure} from "../hooks/useUnitOfMeasure";
import {useCurrency} from "../hooks/useCurrency";
import {useShoppingList} from "../hooks/useShoppingList";
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import AddShoppingItemModal from "../components/modals/AddShoppingItemModal";
import EditShoppingItemModal from "../components/modals/EditShoppingItemModal";
import MergeShoppingItemModal from "../components/modals/MergeShoppingItemModal";
import MergeAmountModal from "../components/modals/MergeAmountModal";
import {useHomeIngredients} from "../hooks/useHomeIngredient";

const ShoppingListPage = () => {
    const navigate = useNavigate();
    const {
        ingredients,
        setIngredients
    } = useIngredient();

    const unitsOfMeasure = useUnitOfMeasure();
    const currencies = useCurrency();

    const {
        homeIngredients,
        pendingMerge,
        setPendingMerge,
        handleAddHomeIngredient,
        isMergeModalOpen,
        setIsMergeModalOpen,
        confirmMergeHomeIngredient
    } = useHomeIngredients();

    const {
        shoppingList,
        editingShoppingItem,
        isAddModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        setIsAddModalOpen,
        isShoppingItemMergeModalOpen,
        setIsShoppingItemMergeModalOpen,
        pendingShoppingItemMerge,
        confirmMergeShoppingItem,
        handleAddNewShoppingItem,
        handleAddShoppingItem,
        handleEditShoppingItem,
        handleSaveEditedShoppingItem,
        handleDeleteShoppingItem,
        resetShoppingList,
        handleCheckShoppingItem
    } = useShoppingList({ingredients, setIngredients, homeIngredients, setPendingMerge, handleAddHomeIngredient, setIsMergeModalOpen});

    const navigateToMenu = () => navigate('/menu');

    const handleSave = async (selectedIngredient, newIngredientName, amount, unitId, price, currencyId) => {
        if (selectedIngredient) {
            await handleAddShoppingItem(selectedIngredient.id, amount, unitId, price, currencyId);
        } else if (newIngredientName.trim()) {
            await  handleAddNewShoppingItem(newIngredientName.trim(), amount, unitId, price, currencyId);
        }
    };

    if (!Array.isArray(shoppingList.items)) return <PageTitle text="Loading shopping list..."/>;

    const sortedShoppingList = shoppingList.items.sort((a, b) =>
        a.ingredient?.name?.localeCompare(b.ingredient?.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                    <TapeButton text="Reset" onClick={resetShoppingList} />
                </div>
                <PageTitle text="Shopping list" />
            </div>
            <div className="shopping-list-wrapper">
                <div className="shopping-list-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={sortedShoppingList}
                        columns={[
                            {
                                header: 'Shopping item',
                                render: (si) => (
                                    <span className="ingredient-name">{si.ingredient.name}</span>
                                )
                            },
                            {
                                header: 'Quantity',
                                render: (si) => (
                                    <span className="ingredient-quantity">{si.amount} {si.unit ? si.unit.abbreviation : "unit"}</span>
                                )
                            },
                            {
                                header: 'Price',
                                render: (si) => (
                                    <span className="ingredient-quantity">{si.price} {si.currency.symbol}</span>
                                )
                            },
                            {
                                header: 'Actions',
                                render: (si) => (
                                    <div className="edit-buttons">
                                        <img
                                            src={require('../assets/images/pencil.png')}
                                            alt="Edit"
                                            className="edit-button"
                                            onClick={() => handleEditShoppingItem(si)}
                                        />
                                        <img
                                            src={require('../assets/images/trashcan.png')}
                                            alt="Delete"
                                            className="edit-button"
                                            onClick={() => handleDeleteShoppingItem(si.id)}
                                        />
                                        <img
                                            src={require('../assets/images/checkbox.png')}
                                            alt="Check"
                                            className="edit-button"
                                            onClick={() => handleCheckShoppingItem(si)}
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
                                    <button className="table-button lobster" onClick={() => setIsAddModalOpen(true)}>
                                        Add shopping item
                                    </button>
                                </td>
                            </tr>
                        }
                    />
                </div>
            </div>
            <AddShoppingItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSave}
                unitsOfMeasure={unitsOfMeasure}
                currencies={currencies}
                savedIngredients={ingredients}
            />
            <EditShoppingItemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEditedShoppingItem}
                shoppingItem={editingShoppingItem}
                unitsOfMeasure={unitsOfMeasure}
                currencies={currencies}
            />
            <MergeShoppingItemModal
                isOpen={isShoppingItemMergeModalOpen}
                onClose={() => setIsShoppingItemMergeModalOpen(false)}
                onSave={confirmMergeShoppingItem}
                amount={pendingShoppingItemMerge?.amount}
                unit={pendingShoppingItemMerge?.unit}
                price={pendingShoppingItemMerge?.price}
                currency={pendingShoppingItemMerge?.currency}
            />
            <MergeAmountModal
                isOpen={isMergeModalOpen}
                onClose={() => setIsMergeModalOpen(false)}
                onSave={confirmMergeHomeIngredient}
                listName="ingredients at home"
                amount={pendingMerge?.amount}
                unit={pendingMerge?.unit}
            />
        </div>
    )
}

export default ShoppingListPage