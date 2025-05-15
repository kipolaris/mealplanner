import { BackendUrl} from "../utils/constants";
import { useEffect, useState} from "react";

export const useFoods = () => {
    const [foods, setFoods] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState(null);

    useEffect(() => {
        fetch(`${BackendUrl}/api/foods`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched foods:', JSON.stringify(data));
                setFoods(data);
            })
            .catch(error => console.error('Error fetching foods:',error));
    }, []);

    const handleAddFood = (newName) => {
        const foodData = { name: newName };
        fetch(`${BackendUrl}/api/foods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodData)
        })
            .then(response => response.json())
            .then((newFood) => {
                console.log('New food added:', newFood);
                setFoods(prevFoods => [...prevFoods,newFood].sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(error => console.error('Error adding food:', error));
    };

    const handleDeleteFood = (foodId) => {
        fetch(`${BackendUrl}/api/foods/${foodId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetch(`${BackendUrl}/api/foods`)
                        .then(response => response.json())
                        .then(data => {
                            console.log('Fetched foods:', JSON.stringify(data));
                            setFoods(data);
                        })
                        .catch(error => console.error('Error fetching foods:', error));
                }
            })
            .catch(error => console.error(`Error deleting food with id ${foodId}:`, error));
    };

    const handleEditFood = (food) => {
        setEditingFood(food);
        setIsModalOpen(true);
    }

    const handleSaveEditedFood = (newName) => {
        if(!editingFood) return;

        const food = {
            id: editingFood.id,
            name: newName.trim(),
            description: editingFood.description,
            ingredients: editingFood.ingredients
        }

        fetch(`${BackendUrl}/api/foods/${editingFood.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(food)
        })
            .then(response => response.json())
            .then((editedFood) => {
                const updatedFoods = foods.map(f =>
                    f.id === editedFood.id ? editedFood : f
                )
                setFoods(updatedFoods);
                setEditingFood(null);
            })
            .catch(error => console.error('Error editing food:', error));
    };

    return {
        foods,
        setFoods,
        isModalOpen,
        setIsModalOpen,
        editingFood,
        handleAddFood,
        handleDeleteFood,
        handleEditFood,
        handleSaveEditedFood
    }
}