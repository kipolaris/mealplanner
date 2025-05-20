import { useEffect, useState } from "react";
import { BackendUrl } from "../utils/constants";
import {useUnitOfMeasure} from "./useUnitOfMeasure";

export const useHomeIngredients = () => {
    const [homeIngredients, setHomeIngredients] = useState([]);
    const [editingHomeIngredient, setEditingHomeIngredient] = useState(null);
    const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [pendingMerge, setPendingMerge] = useState(null);

    const unitsOfMeasure = useUnitOfMeasure()

    useEffect(() => {
        fetch(`${BackendUrl}/api/home-ingredients`)
            .then(response => response.json())
            .then(setHomeIngredients)
            .catch(error => console.error("Failed to fetch home ingredients", error));
    }, []);

    const handleAddHomeIngredient = (ingredientId, amount, unitId) => {
        fetch(`${BackendUrl}/api/home-ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredientId, amount, unitId })
        })
            .then(async (response) => {
                if (!response.ok) {
                    const error = await response.json();
                    if (error.error?.includes("same unit type")) {
                        const unit = unitsOfMeasure.find(u => u.id === unitId);
                        setPendingMerge({ ingredientId, amount, unit });
                        setIsMergeModalOpen(true);
                    } else {
                        throw new Error(error.error || "Unknown error");
                    }
                } else {
                    return response.json()
                }
            })
            .then((newHomeIngredient) => {
                if (newHomeIngredient) {
                    setHomeIngredients(prev => [...prev, newHomeIngredient]);
                }
            })
            .catch(error => console.error('Error adding home ingredient:', error));
    };

    const confirmMergeHomeIngredient = () => {
        if (!pendingMerge) return;
        const newPendingMerge = {
            ingredientId: pendingMerge.ingredientId,
            amount: pendingMerge.amount,
            unitId: pendingMerge.unit.id
        }

        fetch(`${BackendUrl}/api/home-ingredients/merge`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(newPendingMerge)
        })
            .then(response => response.json())
            .then(merged => {
                setHomeIngredients(prev =>
                    prev.map(h => h.id === merged.id ? merged : h)
                );
                setIsMergeModalOpen(false);
                setPendingMerge(null);
            })
    }

    const handleAddNewHomeIngredient = async (newName, newAmount, unitId) => {
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
                body: JSON.stringify({ ingredientId: newIngredient.id, amount: newAmount, unitId: unitId })
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

    const handleSaveEditedHomeIngredient = (newAmount, unitId) => {
        if(!editingHomeIngredient) return;

        const homeIngredient = {
            id: editingHomeIngredient.id,
            name: editingHomeIngredient.name,
            amount: newAmount,
            unitId: unitId
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
                );
                setHomeIngredients(updatedHomeIngredients);
                setEditingHomeIngredient(null);
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
                    setHomeIngredients(newHomeIngredients);
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
        isMergeModalOpen,
        setIsMergeModalOpen,
        pendingMerge,
        confirmMergeHomeIngredient,
        handleAddHomeIngredient,
        handleAddNewHomeIngredient,
        handleEditHomeIngredient,
        handleSaveEditedHomeIngredient,
        handleDeleteHomeIngredient
    };
};
