import React, { useState, useEffect } from 'react';
import paperBackground from '../../assets/images/paperbackground.png';
import '../../assets/css/modal.css'

const AddIngredientModal = ({
    isOpen,
    onClose,
    onSave,
    savedIngredients = [],
    savedHomeIngredients = []
}) => {
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [newIngredient, setNewIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSelectedIngredient('');
            setNewIngredient('');
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => {
                setErrorMessage('');
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [errorMessage]);

    const handleSave = () => {
        const ingredient = selectedIngredient || { name: newIngredient.trim() };
        const alreadyExists = savedHomeIngredients.some(
            hi => hi.ingredient?.name?.toLowerCase() === ingredient.name.toLowerCase()
        );

        if (alreadyExists) {
            setErrorMessage("You already added this ingredient");
            return;
        }

        if ((selectedIngredient || newIngredient.trim()) && quantity) {
            onSave(selectedIngredient, newIngredient.trim(), quantity);
            onClose();
        }
    };

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    if (!isOpen) return null;

    const sortedSavedIngredients = [...savedIngredients].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{ backgroundImage: `url(${paperBackground})`}}>
                <h2>Select or Add Ingredient</h2>
                <div className="custom-dropdown">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        {selectedIngredient?.name || "Select an ingredient"}
                        <span className="arrow-down">&#9662;</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {sortedSavedIngredients.length === 0 && <div className="dropdown-item">No saved ingredients</div>}
                            {sortedSavedIngredients.map(ingredient => (
                                <div key={ingredient.id} className="dropdown-item" onClick={() => handleSelectIngredient(ingredient)}>
                                    <span>{ingredient.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Or add a new ingredient"
                />
                <input
                    type="text"
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Add quantity"
                />
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default AddIngredientModal