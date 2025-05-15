import React, { useState, useEffect } from 'react';
import trashIcon from '../../assets/images/trashcan.png';
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const AddFoodModal = ({ isOpen, onClose, onSave, savedFoods = [], onDeleteFood }) => {
    const [selectedFood, setSelectedFood] = useState('');
    const [newFood, setNewFood] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFood('');
            setNewFood('');
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        const food = newFood || selectedFood;
        if (food) {
            onSave(food);
            onClose();
        }
    };

    const handleDelete = (food) => {
        if (!food || !food.id) {
            console.error("Food object does not have an ID:", food);
            return;
        }
        onDeleteFood(food.id);
        setSelectedFood(prev => (prev === food.name ? '' : prev));
    };


    const handleSelectFood = (food) => {
        setSelectedFood(food.name);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{
                    backgroundImage: `url(${paperBackground})`
                }}>
                <h2>Select or Add Food</h2>
                <div className="custom-dropdown">
                    <button
                        className="dropdown-button"
                        onClick={toggleDropdown}
                    >
                        {selectedFood || "Select a food"}
                        <span className="arrow-down">&#9662;</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {savedFoods.length === 0 && <div className="dropdown-item">No saved foods</div>}
                            {savedFoods.map(food => (
                                <div key={food.id} className="dropdown-item" onClick={() => handleSelectFood(food)}>
                                    <span>{food.name}</span>
                                    <img
                                        src={trashIcon}
                                        alt="Delete"
                                        className="trash-icon"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the parent onClick
                                            handleDelete(food);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    placeholder="Or add a new food"
                />
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddFoodModal;
