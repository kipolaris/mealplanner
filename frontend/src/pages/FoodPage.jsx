import React, {useEffect, useState} from "react";
import { useFoods} from "../hooks/useFoods";
import { useIngredient } from "../hooks/useIngredient";
import { useFoodIngredient } from "../hooks/useFoodIngredient";
import { useUnitOfMeasure } from "../hooks/useUnitOfMeasure";
import { useNavigate, useParams } from "react-router-dom";
import '../assets/css/pages/food-page.css'
import paperBackground from '../assets/images/paperbackground.png'
import PageTitle from "../components/PageTitle";
import TapedTable from "../components/TapedTable";
import TapeButton from "../components/TapeButton";
import AddIngredientModal from "../components/modals/AddIngredientModal";
import EditQuantityModal from "../components/modals/EditQuantityModal";
import pinkFlowerTape from "../assets/images/pinkflowertape.png";
import { BackendUrl } from '../utils/constants';

const FoodPage = () => {
    const { foodName } = useParams();
    const navigate = useNavigate();

    const { foods, setFoods } = useFoods();
    const { ingredients } = useIngredient();
    const unitsOfMeasure = useUnitOfMeasure()

    const [food, setFood] = useState(null);

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
        handleDeleteFoodIngredient
    } = useFoodIngredient(food?.id);

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

    if (!food) return <PageTitle text="Loading food..." />

    if (!unitsOfMeasure || !Array.isArray(unitsOfMeasure)) {
        return <PageTitle text="Loading units of measure..." />;
    }

    const sortedFoodIngredients = [...foodIngredients].sort((a, b) =>
        a.ingredient?.name?.localeCompare(b.ingredient?.name || '') || 0
    );

    console.log(sortedFoodIngredients);

    return (
        <div className="app-container">
            <div className="food-header">
                <div className="navigation-buttons">
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
                    <div className="ingredients-table-container">
                        <TapedTable
                            layout="vertical"
                            rows={sortedFoodIngredients}
                            renderCell={(rowIndex) => {
                                const fi = sortedFoodIngredients[rowIndex];
                                console.log("Rendering row:", fi);
                                return (
                                    <div className="ingredient-row">
                                        <div className="ingredient-label-wrapper">
                                            <span className="ingredient-name patrick">{fi.ingredient?.name || `ingredientId=${fi.ingredient?.id}`}</span>
                                            <span className="ingredient-quantity">({fi?.amount} {fi?.unit ? fi?.unit.abbreviation : "unit"})</span>
                                        </div>
                                        <div className="ingredient-icons">
                                            <img
                                                src={require('../assets/images/shoppingcart.png')}
                                                alt="Add to shopping list"
                                                className="edit-button"
                                                onClick={() => {}}
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
            </div>
        </div>
    );
};

export default FoodPage