import React, { useState, useEffect } from 'react';

const AddFoodModal = ({ isOpen, onClose, onSave, savedFoods = [] }) => {
    const [selectedFood, setSelectedFood] = useState('');
    const [newFood, setNewFood] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSelectedFood('');
            setNewFood('');
        }
    }, [isOpen]);

    const handleSave = () => {
        const food = newFood || selectedFood;
        if (food) {
            onSave(food);
            if (newFood) {
                savedFoods.push(newFood); // Update saved foods
            }
            onClose(); // Close the modal
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2>Select or Add Food</h2>
                <select
                    value={selectedFood}
                    onChange={(e) => setSelectedFood(e.target.value)}
                >
                    <option value="">Select a food</option>
                    {savedFoods.map(food => (
                        <option key={food} value={food}>{food}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    placeholder="Or add a new food"
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddFoodModal;
