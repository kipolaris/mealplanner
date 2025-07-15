import { useEffect, useState} from "react";
import { BackendUrl } from "../utils/constants";

export const useFoodIngredient = (foodId, shoppingList, setPendingShoppingItemMerge, setIsShoppingItemMergeModalOpen, handleAddShoppingItem, setIngredients) => {
    const [foodIngredients, setFoodIngredients] = useState([]);
    const [editingFoodIngredient, setEditingFoodIngredient] = useState(null);
    const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    useEffect(() => {
        if (!foodId) return;

        fetch(`${BackendUrl}/api/foods/${foodId}`)
            .then(response => response.json())
            .then(food => {
                setFoodIngredients(food.ingredients || []);
            })
            .catch(error => console.error("Failed to load food ingredients", error));
    }, [foodId]);

    const handleAddFoodIngredient = (ingredientId, amount, unitId) => {
        const foodIngredientData = {
            id: undefined,
            ingredientId: ingredientId,
            amount: amount,
            unitId: unitId
        }

        fetch(`${BackendUrl}/api/foods/${foodId}/ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodIngredientData)
        })
            .then(response => response.json())
            .then((newFoodData) => {
                console.log('New food ingredients:',newFoodData.ingredients);
                setFoodIngredients(newFoodData.ingredients)
            })
    };

    const handleAddNewFoodIngredient = async (newName, newAmount, unitId) => {
        try {
            const ingredientResponse = await fetch(`${BackendUrl}/api/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { name: newName } )
            });

            const newIngredient = await ingredientResponse.json();

            fetch(`${BackendUrl}/api/ingredients`)
                .then(response => response.json())
                .then(data => setIngredients(data))
                .catch(error => console.log('Error fetching ingredients:',error));

            const foodIngredientData = {
                id: undefined,
                ingredientId: newIngredient.id,
                amount: newAmount,
                unitId: unitId
            };

            await fetch(`${BackendUrl}/api/foods/${foodId}/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodIngredientData)
            });

            await fetch(`${BackendUrl}/api/foods/${foodId}`)
                .then(response => response.json())
                .then(food => {
                    setFoodIngredients(food.ingredients || []);
                });
        } catch (error) {
            console.error('Error creating new food ingredient:',error);
        }
    };

    const handleEditFoodIngredient = (ingredient) => {
        setEditingFoodIngredient(ingredient);
        setIsQuantityModalOpen(true);
    };

    const handleSaveEditedFoodIngredient = (newAmount, unitId) => {
        if(!editingFoodIngredient) return;

        const foodIngredient = {
            id: editingFoodIngredient.id,
            ingredientId: editingFoodIngredient.ingredient.id,
            amount: newAmount,
            unitId: unitId
        }

        fetch(`${BackendUrl}/api/foods/${foodId}/ingredients`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodIngredient)
        })
            .then(response => response.json())
            .then((updatedFood) => {
                setFoodIngredients(updatedFood.ingredients || []);
                setEditingFoodIngredient(null);
                setIsQuantityModalOpen(false);
            })
            .catch(error => console.error('Error editing food ingredient:', error));
    };

    const handleDeleteFoodIngredient = (foodIngredient) => {
        const requestBody = {
            id: foodIngredient.id,
            ingredientId: foodIngredient.ingredient.id,
            amount: foodIngredient.amount,
            unitId: foodIngredient.unit.id
        };

        fetch(`${BackendUrl}/api/foods/${foodId}/ingredients`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (response.ok) {
                    const newFoodIngredients = foodIngredients.filter(fi => fi.id !== foodIngredient.id);
                    console.log(newFoodIngredients);
                    setFoodIngredients(newFoodIngredients);
                }
            })
            .catch(error => console.error(`Error deleting food ingredient with id ${foodIngredient.id} from food with id ${foodId}:`,error));
    };

    const handleAddToShoppingList = (foodIngredient, price, currency) => {
        const existingShoppingItem = shoppingList.items.find(si =>
            si.ingredient.id === foodIngredient.ingredient.id &&
            si.unit.type === foodIngredient.unit.type &&
            si.currency.type === currency.type
        );

        if(existingShoppingItem) {
            setPendingShoppingItemMerge({
                ingredientId: foodIngredient.ingredient.id,
                amount: foodIngredient.amount,
                unit: foodIngredient.unit,
                price: price,
                currency: currency,
                checked: false
            });
            setIsShoppingItemMergeModalOpen(true);
        } else {
            handleAddShoppingItem(foodIngredient.ingredient.id,foodIngredient.amount,foodIngredient.unit.id,price,currency.id);
        }
    }

    return {
        foodIngredients,
        editingFoodIngredient,
        setEditingFoodIngredient,
        isAddIngredientModalOpen,
        setIsAddIngredientModalOpen,
        isQuantityModalOpen,
        setIsQuantityModalOpen,
        handleAddToShoppingList,
        handleAddFoodIngredient,
        handleAddNewFoodIngredient,
        handleEditFoodIngredient,
        handleSaveEditedFoodIngredient,
        handleDeleteFoodIngredient
    };
};
