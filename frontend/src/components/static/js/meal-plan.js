let currentDay;
let currentMeal;

/**
 * Show the modal for adding or selecting food.
 * @param {Object} day - The selected day.
 * @param {Object} meal - The selected meal.
 */
function showModal(day, meal) {
    currentDay = day;
    currentMeal = meal;

    const modal = document.getElementById('addFoodModal');
    modal.style.display = 'block';

    fetchSavedFoods();
}

/**
 * Close the modal.
 */
function closeModal() {
    const modal = document.getElementById('addFoodModal');
    modal.style.display = 'none';
}

/**
 * Fetch saved food options from the server and populate the dropdown.
 */
function fetchSavedFoods() {
    const savedFoodsSelect = document.getElementById('savedFoodsSelect');
    savedFoodsSelect.innerHTML = '<option>Loading...</option>';

    fetch('/api/saved-foods')
        .then(response => response.json())
        .then(data => {
            savedFoodsSelect.innerHTML = '<option value="">Select a food</option>';
            data.forEach(food => {
                const option = document.createElement('option');
                option.value = food.id;
                option.textContent = food.name;
                savedFoodsSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching saved foods:', error);
            savedFoodsSelect.innerHTML = '<option>Error loading foods</option>';
        });
}

/**
 * Save the selected or new food to the meal plan.
 */
function saveFood() {
    const savedFoodsSelect = document.getElementById('savedFoodsSelect');
    const selectedFoodId = savedFoodsSelect.value;
    const newFood = document.getElementById('newFoodInput').value.trim();

    let foodName = '';

    if (selectedFoodId) {
        foodName = savedFoodsSelect.selectedOptions[0].textContent;
    } else if (newFood) {
        foodName = newFood;
    }

    if (!foodName) {
        alert('Please select or enter a food.');
        return;
    }

    const cell = getCell(currentDay.name, currentMeal.name);
    if (cell) {
        cell.textContent = foodName;
        cell.classList.add('food-item');

        fetch('/api/meal-plan/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ day: currentDay, meal: currentMeal, food: foodName }),
        }).catch(error => console.error('Error saving food:', error));
    }

    closeModal();
}

/**
 * Reset the meal plan, clearing all cells and notifying the server.
 */
function resetMealPlan() {
    if (!confirm('Are you sure you want to reset the entire meal plan?')) {
        return;
    }

    fetch('/api/meal-plan/reset', { method: 'POST' })
        .then(() => {
            document.querySelectorAll('.meal-plan-table td').forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('food-item');
            });
        })
        .catch(error => console.error('Error resetting meal plan:', error));
}

/**
 * Redirect to the meal view page for a specific meal.
 * @param {Object} meal - The meal type to view (e.g., breakfast, lunch, dinner).
 */
function viewMeal(meal) {
    window.location.href = `/meal-view/${meal.name}`;
}

/**
 * Helper function to get the table cell for a specific day and meal.
 * @param {Object} day - The MealDay object.
 * @param {Object} meal - The Meal object.
 * @returns {HTMLElement|null} The corresponding table cell, or null if not found.
 */
function getCell(day, meal) {
    return document.querySelector(`td[data-day-id="${day.id}"][data-meal-id="${meal.id}"]`);
}


// Event listener for keyboard accessibility (Escape key closes the modal)
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.getElementById('addFoodModal').style.display === 'block') {
        closeModal();
    }
});
