import { useEffect, useState} from "react";
import { BackendUrl } from "../utils/constants";

export const useFoodIngredient = (foodId) => {
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
            .then((newFoodIngredient) => {
                console.log('New ingredient added:', newFoodIngredient);
                setFoodIngredients(prevFoodIngredients => [...prevFoodIngredients,newFoodIngredient])
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

            const foodIngredientData = {
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
            ingredientId: editingFoodIngredient.id,
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

    const handleDeleteFoodIngredient = (foodIngredientId) => {
        fetch(`${BackendUrl}/api/foods/${foodId}/ingredients`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodIngredientId)
        })
            .then(response => {
                if (response.ok) {
                    const newFoodIngredients = foodIngredients.filter(fi => fi.id !== foodIngredientId);
                    setFoodIngredients(newFoodIngredients);
                }
            })
            .catch(error => console.error(`Error deleting food ingredient with id ${foodIngredientId} from food with id ${foodId}:`,error));
    };

    return {
        foodIngredients,
        editingFoodIngredient,
        setEditingFoodIngredient,
        isAddIngredientModalOpen,
        setIsAddIngredientModalOpen,
        isQuantityModalOpen,
        setIsQuantityModalOpen,
        handleAddFoodIngredient,
        handleAddNewFoodIngredient,
        handleEditFoodIngredient,
        handleSaveEditedFoodIngredient,
        handleDeleteFoodIngredient
    };
};
