import React, { useState } from 'react';

function AddFoodModal({ onSaveFood }) {
    const [food, setFood] = useState('');

    const handleSave = () => {
        if (food) {
            onSaveFood(food);
            setFood('');
        }
    };

    return (
        <div id="addFoodModal" className="modal-overlay" style={{ display: 'none' }}>
            <div className="modal-content">
                <h2>Select or Add Food</h2>
                <input
                    type="text"
                    value={food}
                    onChange={e => setFood(e.target.value)}
                    placeholder="Enter food name"
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => (document.getElementById('addFoodModal').style.display = 'none')}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default AddFoodModal;
