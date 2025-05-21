import React from "react";
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const MergeAmountModal = ({
    isOpen,
    onClose,
    onSave,
    listName,
    amount,
    unit
}) => {
    const handleSave = () => {
        if (amount) {
            onSave(amount);
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={
                {backgroundImage: `url(${paperBackground})`}
            }>
                <span>An ingredient like this already exists in {listName}, do you want to add {amount} {unit?.abbreviation} to the original amount?</span>
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Yes</button>
                    <button className="cancel-button" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    )
}

export default MergeAmountModal