import React, { useState, useEffect } from "react";
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const AddFiToShoppingListModal = ({
    isOpen,
    onClose,
    onSave,
    foodIngredient,
    currencies
}) => {
    const [price, setPrice] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedCurrency(null);
            setPrice(0);
            setIsCurrencyDropdownOpen(false);
        }
    }, [isOpen])

    const handleSave = () => {
        if (price && selectedCurrency) {
            onSave(foodIngredient, price, selectedCurrency);
            onClose();
        }
    };

    const handleSelectCurrency = (currency) => {
        setSelectedCurrency(currency);
        setIsCurrencyDropdownOpen(false);
    };

    const toggleCurrencyDropdown = () => {
        setIsCurrencyDropdownOpen(prev => !prev);
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{ backgroundImage: `url(${paperBackground})`}}>
                <div className="price">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />
                    <div className="custom-dropdown">
                        <button className="dropdown-button" onClick={toggleCurrencyDropdown}>
                            { selectedCurrency?.name || 'Select a currency' }
                            <span className="arrow-down">&#9662;</span>
                        </button>
                        {isCurrencyDropdownOpen && (
                            <div className="dropdown-menu">
                                {currencies.map(currency => (
                                    <div key={currency.id} className="dropdown-item" onClick={() => handleSelectCurrency(currency)}>
                                        <span>{currency.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default AddFiToShoppingListModal