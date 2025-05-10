import { useEffect, useState } from "react";
import { BackendUrl } from "../utils/constants";

export const useHomeIngredients = () => {
    const [homeIngredients, setHomeIngredients] = useState([]);
    const [editingHomeIngredient, setEditingHomeIngredient] = useState(null);
    const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    useEffect(() => {
        fetch(`${BackendUrl}/api/home-ingredients`)
            .then(response => response.json())
            .then(setHomeIngredients)
            .catch(error => console.error("Failed to fetch home ingredients", error));
    }, []);

    const handleAddHomeIngredient = (ingredientId, quantity) => {
        fetch(`${BackendUrl}/api/home-ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredientId, quantity })
        })
            .then(response => response.json())
            .then((newHomeIngredient) => {
                setHomeIngredients(prev => [...prev, newHomeIngredient])
            })
            .catch(error => console.error('Error adding home ingredient:', error));
    };

    const handleAddNewHomeIngredient = async (newName, quantity) => {
        try {
            const ingredientResponse = await fetch(`${BackendUrl}/api/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });

            const newIngredient = await ingredientResponse.json();

            const homeIngredientResponse = await fetch(`${BackendUrl}/api/home-ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredientId: newIngredient.id, quantity })
            });

            const newHomeIngredient = await homeIngredientResponse.json();
            setHomeIngredients(prev => [...prev, newHomeIngredient]);

        } catch (error) {
            console.error("Error creating new home ingredient:", error);
        }
    };

    const handleEditHomeIngredient = (ingredient) => {
        setEditingHomeIngredient(ingredient);
        setIsQuantityModalOpen(true);
    };

    const handleSaveEditedHomeIngredient = (newQuantity) => {
        if(!editingHomeIngredient) return;

        const homeIngredient = {
            id: editingHomeIngredient.id,
            name: editingHomeIngredient.name,
            quantity: newQuantity
        }

        fetch(`${BackendUrl}/api/home-ingredients/${editingHomeIngredient.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(homeIngredient)
        })
            .then(response => response.json())
            .then((editedHomeIngredient) => {
                const updatedHomeIngredients = homeIngredients.map(hi =>
                    hi.id === editedHomeIngredient.id ? editedHomeIngredient : hi
                )
                setHomeIngredients(updatedHomeIngredients);
                setEditingHomeIngredient(false);
            })
            .catch(error => console.error('Error editing home ingredient:',error));
    };

    const handleDeleteHomeIngredient = (homeIngredientId) => {
        fetch(`${BackendUrl}/api/home-ingredients/${homeIngredientId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    const newHomeIngredients = homeIngredients.filter(hi => hi.id !== homeIngredientId);
                    setHomeIngredients(newHomeIngredients)
                }
            })
            .catch(error => console.error(`Error deleting home ingredient with id ${homeIngredientId}:`,error));
    }

    return {
        homeIngredients,
        setHomeIngredients,
        editingHomeIngredient,
        isAddIngredientModalOpen,
        setIsAddIngredientModalOpen,
        isQuantityModalOpen,
        setIsQuantityModalOpen,
        handleAddHomeIngredient,
        handleAddNewHomeIngredient,
        handleEditHomeIngredient,
        handleSaveEditedHomeIngredient,
        handleDeleteHomeIngredient
    };
};
