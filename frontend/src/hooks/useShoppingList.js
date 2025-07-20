import {BackendUrl} from "../utils/constants";
import {useEffect, useState} from "react";
import {useUnitOfMeasure} from "./useUnitOfMeasure";
import {useCurrency} from "./useCurrency";

export const useShoppingList = ({ingredients, setIngredients, homeIngredients, setPendingMerge, addHomeIngredient, setIsMergeModalOpen}) => {
    const [shoppingList, setShoppingList] = useState({items: [], total: 0.0});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingShoppingItem, setEditingShoppingItem] = useState(null);
    const [pendingShoppingItemMerge, setPendingShoppingItemMerge] = useState(null);
    const [isShoppingItemMergeModalOpen, setIsShoppingItemMergeModalOpen] = useState(false);

    const unitsOfMeasure = useUnitOfMeasure()
    const currencies = useCurrency()

    useEffect(() => {
        fetch(`${BackendUrl}/api/shopping-list`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched shopping list data:', JSON.stringify(data));
                setShoppingList(data);
            })
            .catch(error => console.error('Error fetching shopping list:', error))
    }, []);

    const handleAddShoppingItem = (ingredientId, amount, unitId, price, currencyId) => {
        fetch(`${BackendUrl}/api/shopping-list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredientId, amount, unitId, price, currencyId })
        })
            .then( async (response) => {
                if (!response.ok) {
                    const error = await response.json();
                    if (error.error?.includes("same unit type and currency")) {
                        const unit = unitsOfMeasure.find(u => u.id === unitId);
                        const currency = currencies.find(c => c.id === currencyId);
                        setPendingShoppingItemMerge( {ingredientId, amount, unit, price, currency });
                        setIsShoppingItemMergeModalOpen(true);
                    } else {
                        throw new Error(error.error || "Unknown error");
                    }
                } else {
                    return await response.json()
                }
            })
            .then(async (data) => {
                const shoppingList = data
                if (shoppingList) {
                    console.log('Fetched shopping list data:', data);
                    setShoppingList(await shoppingList);
                }
            })
            .catch(error => console.error('Error adding shopping item to list:', error));
    };

    const confirmMergeShoppingItem = () => {
        if (!pendingShoppingItemMerge) return;
        const newPendingMerge = {
            ingredientId: pendingShoppingItemMerge.ingredientId,
            amount: pendingShoppingItemMerge.amount,
            unit: pendingShoppingItemMerge.unit,
            price: pendingShoppingItemMerge.price,
            currency: pendingShoppingItemMerge.currency
        }

        const pendingMergeRequest = {
            ingredientId: newPendingMerge.ingredientId,
            amount: newPendingMerge.amount,
            unitId: newPendingMerge.unit.id,
            price: newPendingMerge.price,
            currencyId: newPendingMerge.currency.id
        }

        fetch(`${BackendUrl}/api/shopping-list/merge`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingMergeRequest)
        })
            .then(response => response.json())
            .then(merged => {
                console.log('Received shopping list from backend:', merged);
                setShoppingList(merged);
                setIsShoppingItemMergeModalOpen(false);
                setPendingShoppingItemMerge(null);
            })
            .catch(error => console.error('Error merging shopping items:', error));
    };

    const handleAddNewShoppingItem = async (newName, newAmount, unitId, price, currencyId) => {
        try {
            const ingredientResponse = await fetch(`${BackendUrl}/api/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });

            const newIngredient = await ingredientResponse.json();
            await fetch(`${BackendUrl}/api/ingredients`)
                .then(
                    response => response.json()
                )
                .then(newIngredients => {
                    setIngredients(newIngredients);
                });


            const shoppingListResponse = await fetch(`${BackendUrl}/api/shopping-list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredientId: newIngredient.id, amount: newAmount, unitId: unitId, price: price, currencyId: currencyId })
            });

            const newShoppingList = await shoppingListResponse.json();
            setShoppingList(newShoppingList);
        } catch (error) {
            console.error('Error creating new shopping item:', error);
        }
    };

    const handleEditShoppingItem = (shoppingItem) => {
        setEditingShoppingItem(shoppingItem);
        setIsEditModalOpen(true);
    };

    const handleSaveEditedShoppingItem = (id, newAmount, unitId, price, currencyId, checked = false) => {
        if (!editingShoppingItem) return;

        const shoppingItem = {
            ingredientId: editingShoppingItem.ingredient.id,
            amount: newAmount,
            unitId: unitId,
            price: price,
            currencyId: currencyId,
            checked: checked
        }

        fetch(`${BackendUrl}/api/shopping-list/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shoppingItem)
        })
            .then(response => response.json())
            .then((editedShoppingList) => {
                setShoppingList(editedShoppingList);
                setEditingShoppingItem(null);
            })
            .catch(error => console.error('Error editing shopping item:', error));
    };

    const handleDeleteShoppingItem = (shoppingItemId) => {
        fetch(`${BackendUrl}/api/shopping-list/${shoppingItemId}`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    setShoppingList(prev => ({
                        ...prev,
                        items: prev.items.filter(item => item.id !== shoppingItemId)
                    }));
                }
            })
            .catch(error => console.error(`Error deleting shopping item with id ${shoppingItemId}:`, error));
    };

    const resetShoppingList = () => {
        fetch(`${BackendUrl}/api/shopping-list/reset`, {method: 'POST'})
            .then(response => {
                if (response.ok) {
                    return fetch(`${BackendUrl}/api/shopping-list`);
                }
                throw new Error('Failed to reset shopping list');
            })
            .then(response => response.json())
            .then(data => {
                console.log('Reset shopping list successfully:', JSON.stringify(data));
                setShoppingList(data);
            })
            .catch(error => console.error('Error resetting shopping list:', error));
    };

    const handleCheckShoppingItem = (shoppingItem) => {
        const existingHomeIngredient = homeIngredients.find(h =>
            h.ingredient.id === shoppingItem.ingredient.id &&
            h.unit.type === shoppingItem.unit.type
        );

        if(existingHomeIngredient) {
            setPendingMerge({
                ingredientId: shoppingItem.ingredient.id,
                amount: shoppingItem.amount,
                unit: shoppingItem.unit
            });
            setIsMergeModalOpen(true);
        } else {
            addHomeIngredient(shoppingItem.ingredient.id, shoppingItem.amount, shoppingItem.unit.id);
        }
        handleDeleteShoppingItem(shoppingItem.id);
    }

    const getTotal = () => {
        fetch(`${BackendUrl}/api/shopping-list/total`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || "Error calculating total");
                    });
                }
                return response.json();
            })
            .then(data => {
                setShoppingList(prev => ({
                    ...prev,
                    total: data,
                    totalError: null
                }));
            })
            .catch(error => {
                console.error('Fetching total unsuccessful:', error);
                setShoppingList(prev => ({
                    ...prev,
                    total: null,
                    totalError: error.message
                }));
            });
    };


    return {
        shoppingList,
        setShoppingList,
        editingShoppingItem,
        isAddModalOpen,
        isShoppingItemMergeModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        setIsShoppingItemMergeModalOpen,
        setIsAddModalOpen,
        pendingShoppingItemMerge,
        setPendingShoppingItemMerge,
        confirmMergeShoppingItem,
        handleAddNewShoppingItem,
        handleAddShoppingItem,
        handleSaveEditedShoppingItem,
        handleEditShoppingItem,
        handleDeleteShoppingItem,
        handleCheckShoppingItem,
        resetShoppingList,
        getTotal
    };
};