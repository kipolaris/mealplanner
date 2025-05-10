import React, { useState, useEffect } from 'react';
import paperBackground from '../../assets/images/paperbackground.png'
import '../../assets/css/modal.css'

const NewNameModal = ({
    isOpen,
    onClose,
    onSave,
    itemName = '',
    defaultName = ''
}) => {
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setNewName(defaultName || '');
        }
    }, [isOpen, defaultName]);

    const handleSave = () => {
        const name = newName;
        if (name) {
            onSave(name);
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{
                backgroundImage: `url(${paperBackground})`
            }}>
                <h2>{defaultName ? `Edit ${itemName}` : `Add ${itemName}`}</h2>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default NewNameModal;