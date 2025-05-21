import {BackendUrl} from "../utils/constants";
import {useEffect, useState} from "react";
import {useUnitOfMeasure} from "./useUnitOfMeasure";
import {useCurrency} from "./useCurrency";

export const useShoppingList = () => {
    const [shoppingList, setShoppingList] = useState({items: []});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingShoppingItem, setEditingShoppingItem] = useState(null);
    const [pendingMerge, setPendingMerge] = useState(null);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

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
                    if (error.error?.includes("same unit type")) {
                        const unit = unitsOfMeasure.find(u => u.id === unitId);
                        const currency = currencies.find(c => c.id === currencyId);
                        setPendingMerge( {ingredientId, amount, unit, price, currency });
                    } else {
                        throw new Error(error.error || "Unknown error");
                    }
                } else {
                    return await response.json()
                }
            })
            .then(async (data) => {
                const shoppingList = data.json()
                if (shoppingList) {
                    console.log('Fetched shopping list data:', data);
                    setShoppingList(await shoppingList);
                }
            })
            .catch(error => console.error('Error adding shopping item to list:', error));
    };

    const confirmMergeShoppingItem = () => {
        if (!pendingMerge) return;
        const newPendingMerge = {
            ingredientId: pendingMerge.ingredientId,
            amount: pendingMerge.amount,
            unitId: pendingMerge.unitId,
            price: pendingMerge.price,
            currencyId: pendingMerge.currencyId
        }

        fetch(`${BackendUrl}/api/shopping-list/merge`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPendingMerge)
        })
            .then(response => response.json())
            .then(merged => {
                console.log('Received shopping list from backend:', merged);
                setShoppingList(merged);
                setIsMergeModalOpen(false);
                setPendingMerge(null);
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

    const handleSaveEditedShoppingItem = (id, newAmount, unitId, price, currencyId, checked) => {
        if (!editingShoppingItem) return;

        const shoppingItem = {
            ingredientId: editingShoppingItem.ingredientId,
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
                    shoppingList.items = shoppingList.items.filter(si => si.id !== shoppingItemId);
                    setShoppingList(shoppingList);
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

    return {
        shoppingList,
        setShoppingList,
        editingShoppingItem,
        isAddModalOpen,
        isMergeModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        setIsMergeModalOpen,
        setIsAddModalOpen,
        pendingMerge,
        confirmMergeShoppingItem,
        handleAddNewShoppingItem,
        handleAddShoppingItem,
        handleSaveEditedShoppingItem,
        handleEditShoppingItem,
        handleDeleteShoppingItem,
        resetShoppingList
    };
};