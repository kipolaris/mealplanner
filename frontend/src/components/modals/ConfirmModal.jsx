import React from "react";
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/components/modal.css'

const ConfirmModal = ({
    isOpen,
    onClose,
    onSave,
    text
}) => {

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={
                {backgroundImage: `url(${paperBackground})`}
            }>
                <span className="patrick">{text}</span>
                <div className="modal-buttons">
                    <button className="save-button" onClick={onSave}>Yes</button>
                    <button className="cancel-button" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal