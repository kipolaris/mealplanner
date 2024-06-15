let currentDay = '';
let currentMeal = '';

function showModal(day, meal) {
    currentDay = day;
    currentMeal = meal;
    document.getElementById('addFoodModal').style.display = 'block';
    fetchSavedFoods();
}

function closeModal() {
    document.getElementById('addFoodModal').style.display = 'none';
}

function fetchSavedFoods() {
    fetch('/api/saved-foods')
        .then(response => response.json())
        .then(data => {
            const savedFoodsSelect = document.getElementById('savedFoodsSelect');
            savedFoodsSelect.innerHTML = '<option value="">Select a food</option>';
            data.forEach(food => {
                const option = document.createElement('option');
                option.value = food.id;
                option.textContent = food.name;
                savedFoodsSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching saved foods:', error));
}

function saveFood() {
    const selectedFoodId = document.getElementById('savedFoodsSelect').value;
    const newFood = document.getElementById('newFoodInput').value;

    let foodName = '';

    if (selectedFoodId) {
        const selectedOption = document.getElementById('savedFoodsSelect').selectedOptions[0];
        foodName = selectedOption.textContent;
    } else if (newFood) {
        foodName = newFood;
    }

    if (foodName) {
        const cell = document.querySelector(`td[onclick="showModal('${currentDay}', '${currentMeal}')"]`);
        cell.textContent = foodName;
        cell.classList.add('food-item'); // Add this line to apply the CSS class

        fetch('/api/meal-plan/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ day: currentDay, meal: currentMeal, food: foodName })
        }).catch(error => console.error('Error saving food:', error));

        closeModal();
    }
}


function resetMealPlan() {
    fetch('/api/meal-plan/reset', { method: 'POST' })
        .then(() => {
            document.querySelectorAll('.meal-plan-table td').forEach(cell => {
                cell.textContent = '';
            });
        })
        .catch(error => console.error('Error resetting meal plan:', error));
}

function viewMeal(meal) {
    window.location.href = `/meal-view/${meal}`;
}
