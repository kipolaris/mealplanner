import { BackendUrl} from "../utils/constants";
import {useEffect, useState} from "react";

export const useIngredient = () => {
    const [ingredients, setIngredients] = useState([]);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);

    useEffect(() => {
        fetch(`${BackendUrl}/api/ingredients`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched ingredients:', JSON.stringify(data));
                setIngredients(data);
            })
            .catch(error => console.error('Error fetching ingredients:',error));
    },[]);

    const handleEditIngredient = (ingredient) => {
        setEditingIngredient(ingredient);
        setIsNameModalOpen(true);
    }

    const handleSaveEditedIngredient = (newName) => {
        if(!editingIngredient) return;

        const ingredient = {
            id: editingIngredient.id,
            name: newName.trim(),
            quantity: editingIngredient.quantity
        }

        fetch(`${BackendUrl}/api/ingredients/${editingIngredient.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ingredient)
        })
            .then(response => response.json())
            .then((editedIngredient) => {
                const updatedIngredients = ingredients.map(i =>
                    i.id === editedIngredient.id ? editedIngredient : i
                )
                setIngredients(updatedIngredients);
                setEditingIngredient(false);
            })
            .catch(error => console.error('Error editing ingredient:', error));
    };

    const handleAddIngredient = (newName) => {
        const ingredientData = { name: newName };

        fetch(`${BackendUrl}/api/ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ingredientData)
        })
            .then(response => response.json())
            .then((newIngredient) => {
                console.log('New ingredient added:', newIngredient);
                setIngredients(prevIngredients => [...prevIngredients, newIngredient].sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(error => console.error('Error adding ingredient:', error));
    };

    const handleDeleteIngredient = (ingredientId) => {
        fetch(`${BackendUrl}/api/ingredients/${ingredientId}`, { method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    const newIngredients = ingredients.filter(i => i.id !== ingredientId);
                    setIngredients(newIngredients);
                }
            })
            .catch(error => console.error(`Error deleting ingredient with id ${ingredientId}:`, error));
    };

    return {
        ingredients,
        setIngredients,
        isNameModalOpen,
        setIsNameModalOpen,
        editingIngredient,
        handleAddIngredient,
        handleEditIngredient,
        handleSaveEditedIngredient,
        handleDeleteIngredient
    }
}