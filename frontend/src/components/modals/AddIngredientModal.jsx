import React, { useState, useEffect } from 'react';
import paperBackground from '../../assets/images/paperbackground.png';
import '../../assets/css/components/modal.css'

const AddIngredientModal = ({
    isOpen,
    onClose,
    onSave,
    unitsOfMeasure,
    savedIngredients = []
}) => {
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [newIngredient, setNewIngredient] = useState('');
    const [amount, setAmount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedIngredient(null);
            setNewIngredient('');
            setSelectedUnit(null);
            setAmount(0);
            setIsDropdownOpen(false);
            setIsUnitDropdownOpen(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        if ((selectedIngredient || newIngredient.trim()) && amount && selectedUnit) {
            onSave(selectedIngredient, newIngredient.trim(), amount, selectedUnit.id);
            onClose();
        }
    };

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);
        setIsDropdownOpen(false);
    };

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
        setIsUnitDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const toggleUnitDropdown = () => {
        setIsUnitDropdownOpen(prev => !prev);
    }

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
                <div className="quantity">
                    <input
                        type="number"
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        placeholder="Add quantity"
                    />
                    <div className="custom-dropdown">
                        <button className="dropdown-button" onClick={toggleUnitDropdown}>
                            {selectedUnit?.name || "Select a unit"}
                            <span className="arrow-down">&#9662;</span>
                        </button>
                        {isUnitDropdownOpen && (
                            <div className="dropdown-menu">
                                {unitsOfMeasure.map(unit => (
                                    <div key={unit.id} className="dropdown-item" onClick={() => handleSelectUnit(unit)}>
                                        <span>{unit.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-buttons">
                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={!(selectedIngredient || newIngredient.trim()) || !amount || !selectedUnit}
                    >
                        Save
                    </button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddIngredientModal