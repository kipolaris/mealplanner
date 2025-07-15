import React, {useEffect, useState} from "react";
import { useFoods} from "../hooks/useFoods";
import { useIngredient } from "../hooks/useIngredient";
import { useFoodIngredient } from "../hooks/useFoodIngredient";
import { useUnitOfMeasure } from "../hooks/useUnitOfMeasure";
import { useNavigate, useParams } from "react-router-dom";
import '../assets/css/food.css'
import '../assets/css/ingredients.css'
import paperBackground from '../assets/images/paperbackground.png'
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import TapeButton from "../components/TapeButton";
import AddIngredientModal from "../components/modals/AddIngredientModal";
import EditQuantityModal from "../components/modals/EditQuantityModal";
import pinkFlowerTape from "../assets/images/pinkflowertape.png";
import { BackendUrl } from '../utils/constants';
import {useShoppingList} from "../hooks/useShoppingList";
import {useCurrency} from "../hooks/useCurrency";
import MergeShoppingItemModal from "../components/modals/MergeShoppingItemModal";
import AddFiToShoppingListModal from "../components/modals/AddFiToShoppingListModal";

const FoodPage = () => {
    const { foodName } = useParams();
    const navigate = useNavigate();

    const { foods, setFoods } = useFoods();
    const { ingredients, setIngredients } = useIngredient();
    const unitsOfMeasure = useUnitOfMeasure();
    const currencies = useCurrency();

    const [food, setFood] = useState(null);
    const [isAddToShoppingListModalOpen, setIsAddToShoppingListModalOpen] = useState(false);
    const [foodIngredientToShoppingList, setFoodIngredientToShoppingList] = useState(null);

    useEffect(() => {
        const found = foods.find(f => f.name === foodName);
        if (found) {
            fetch(`${BackendUrl}/api/foods/${found.id}`)
                .then(response => response.json())
                .then(data => {
                    setFood(data);
                });
        }
    }, [foods, foodName]);

    const {
        shoppingList,
        pendingShoppingItemMerge,
        setPendingShoppingItemMerge,
        isShoppingItemMergeModalOpen,
        setIsShoppingItemMergeModalOpen,
        handleAddShoppingItem,
        confirmMergeShoppingItem
    } = useShoppingList(ingredients);

    const {
        foodIngredients,
        editingFoodIngredient,
        isAddIngredientModalOpen,
        setIsAddIngredientModalOpen,
        isQuantityModalOpen,
        setIsQuantityModalOpen,
        handleAddFoodIngredient,
        handleAddNewFoodIngredient,
        handleEditFoodIngredient,
        handleSaveEditedFoodIngredient,
        handleDeleteFoodIngredient,
        handleAddToShoppingList
    } = useFoodIngredient(food?.id, shoppingList, setPendingShoppingItemMerge, setIsShoppingItemMergeModalOpen, handleAddShoppingItem, setIngredients);

    const navigateToMenu = () => {
        navigate('/menu');
    };

    const navigateToFoods = () => {
        navigate('/foods');
    };

    const handleSave = async (selectedIngredient, newIngredientName, amount, unitId) => {
        if (selectedIngredient) {
            await handleAddFoodIngredient(selectedIngredient.id, amount, unitId);
        } else if (newIngredientName.trim()) {
            await handleAddNewFoodIngredient(newIngredientName.trim(), amount, unitId);
        }
    };

    const handleAddFiToShoppingList = (foodIngredient) => {
        setFoodIngredientToShoppingList(foodIngredient);
        setIsAddToShoppingListModalOpen(true);
    }

    if (!food) return <PageTitle text="Loading food..." />

    if (!unitsOfMeasure || !Array.isArray(unitsOfMeasure)) {
        return <PageTitle text="Loading units of measure..." />;
    }

    if (!currencies || !Array.isArray(currencies)) {
        return <PageTitle text="Loading currencies..." />;
    }

    const sortedFoodIngredients = [...foodIngredients].sort((a, b) =>
        a.ingredient?.name?.localeCompare(b.ingredient?.name || '') || 0
    );

    console.log(sortedFoodIngredients);

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                    <TapeButton text="Back" onClick={navigateToFoods} />
                </div>
                <PageTitle text={foodName} />
            </div>
            <div className="content-container two-column">
                <div className="paper-wrapper">
                    <div className="taped-paper" style={{ backgroundImage: `url(${paperBackground})` }}>
                        <img src={pinkFlowerTape} alt="tape" className="tape top-left" />
                        <img src={pinkFlowerTape} alt="tape" className="tape top-right" />
                        <img src={pinkFlowerTape} alt="tape" className="tape bottom-left" />
                        <img src={pinkFlowerTape} alt="tape" className="tape bottom-right" />
                        <div
                            className="editable-description patrick"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                                const newText = e.target.innerText;
                                if (newText !== food.description) {
                                    fetch(`${BackendUrl}/api/foods/${food.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...food, description: newText })
                                    })
                                        .then(response => response.json())
                                        .then(updated => {
                                            const updatedFoods = foods.map(f => f.id === updated.id ? updated : f);
                                            console.log("Updated food:",updated);
                                            setFoods(updatedFoods);
                                        })
                                        .catch(error => console.error("Error saving description:", error));
                                }
                            }}
                        >
                            {food.description || ""}
                        </div>
                    </div>
                </div>
                <div className="ingredients-table-wrapper">
                    <TapedTable
                        layout="vertical"
                        rows={sortedFoodIngredients}
                        renderCell={(rowIndex) => {
                            const fi = sortedFoodIngredients[rowIndex];
                            console.log("Rendering row:", fi);
                            return (
                                <div className="table-row">
                                    <div className="ingredient-label-wrapper">
                                        <span className="ingredient-name patrick">{fi.ingredient?.name || `ingredientId=${fi.ingredient?.id}`}</span>
                                        <span className="ingredient-quantity">({fi?.amount} {fi?.unit ? fi?.unit.abbreviation : "unit"})</span>
                                    </div>
                                    <div className="cell-icons">
                                        <img
                                            src={require('../assets/images/shoppingcart.png')}
                                            alt="Add to shopping list"
                                            className="edit-button"
                                            onClick={() => handleAddFiToShoppingList(fi)}
                                        />
                                        <img
                                            src={require('../assets/images/pencil.png')}
                                            alt="Edit"
                                            className="edit-button"
                                            onClick={() => handleEditFoodIngredient(fi)}
                                        />
                                        <img
                                            src={require('../assets/images/trashcan.png')}
                                            alt="Delete"
                                            className="edit-button"
                                            onClick={() => handleDeleteFoodIngredient(fi)}
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
                                        Add ingredient
                                    </button>
                                </td>
                            </tr>
                        }
                    />
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
                    onSave={handleSaveEditedFoodIngredient}
                    ingredient={editingFoodIngredient}
                    unitsOfMeasure={unitsOfMeasure}
                />
                <AddFiToShoppingListModal
                    isOpen={isAddToShoppingListModalOpen}
                    onClose={() => setIsAddToShoppingListModalOpen(false)}
                    onSave={handleAddToShoppingList}
                    foodIngredient={foodIngredientToShoppingList}
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
            </div>
        </div>
    );
};

export default FoodPage