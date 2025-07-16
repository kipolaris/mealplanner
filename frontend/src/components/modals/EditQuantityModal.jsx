import React, { useState, useEffect} from "react";
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const EditQuantityModal = ({
    isOpen,
    onClose,
    onSave,
    ingredient,
    unitsOfMeasure,
    showExpirationInput = false
}) => {
    const [amount, setAmount] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expirationDate, setExpirationDate] = useState(null);


    useEffect(() => {
        if (isOpen) {
            setAmount(ingredient.amount);
            setSelectedUnit(ingredient.unit);
            setExpirationDate(ingredient.expirationDate ?? null);
        } else {
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (amount && selectedUnit) {
            onSave(amount, selectedUnit.id, expirationDate);
            onClose();
        }
    };

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{ backgroundImage: `url(${paperBackground})`}}>
                <div className="quantity">
                    <input
                        type="number"
                        value={amount ?? ""}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                    <div className="custom-dropdown">
                        <button className="dropdown-button" onClick={toggleDropdown}>
                            {selectedUnit?.name || "Select a unit" }
                            <span className="arrow-down">&#9662;</span>
                        </button>
                        {isDropdownOpen && (
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
                {showExpirationInput && (
                    <div className="date-picker">
                        <label className="lobster">Expiration date (optional):</label>
                        <input
                            type="date"
                            value={expirationDate ?? ""}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />
                    </div>
                )}
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default EditQuantityModal