import React, { useState, useEffect} from "react";
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const EditShoppingItemModal = ({
   isOpen,
   onClose,
   onSave,
   shoppingItem,
   unitsOfMeasure,
   currencies
}) => {
    const [amount, setAmount] = useState(null);
    const [price, setPrice] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAmount(shoppingItem.amount);
            setSelectedUnit(shoppingItem.unit);
            setPrice(shoppingItem.price);

        } else {
            setIsUnitDropdownOpen(false);
            setIsCurrencyDropdownOpen(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (amount && selectedUnit && price && selectedCurrency) {
            onSave(shoppingItem.id, amount, selectedUnit.id, price, selectedCurrency.id);
            onClose();
        }
    };

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
        setIsUnitDropdownOpen(false);
    };

    const handleSelectCurrency = (currency) => {
        setSelectedCurrency(currency);
        setIsCurrencyDropdownOpen(false);
    };

    const toggleUnitDropdown = () => {
        setIsUnitDropdownOpen(prev => !prev);
    };

    const toggleCurrencyDropdown = () => {
        setIsCurrencyDropdownOpen(prev => !prev);
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{ backgroundImage: `url(${paperBackground})`}}>
                <div className="quantity">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                    <div className="custom-dropdown">
                        <button className="dropdown-button" onClick={toggleUnitDropdown}>
                            {selectedUnit?.name || "Select a unit" }
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
                <div className="price">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />
                    <div className="custom-dropdown">
                        <button className="dropdown-button" onClick={toggleCurrencyDropdown}>
                            {selectedCurrency?.name}
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

export default EditShoppingItemModal