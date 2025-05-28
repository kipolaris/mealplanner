import React from "react";
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const MergeShoppingItemModal = ({
    isOpen,
    onClose,
    onSave,
    amount,
    unit,
    price,
    currency
}) => {
    const handleSave = () => {
        if (amount && price) {
            onSave(amount,price);
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={ {backgroundImage: `url(${paperBackground})`} }>
                <span>A shopping item like this already exists in the Shopping list, do you want to add {amount} {unit.name} and {price} {currency.symbol} to the original item?</span>
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Yes</button>
                    <button className="cancel-button" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    )
}

export default MergeShoppingItemModal