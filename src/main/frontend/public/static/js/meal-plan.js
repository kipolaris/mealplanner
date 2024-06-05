let currentDay = '';
let currentMeal = '';

function showModal(day, meal) {
    currentDay = day;
    currentMeal = meal;
    document.getElementById('addFoodModal').style.display = 'block';
    // Fetch previously saved foods and populate the dropdown
    fetchSavedFoods();
}

function closeModal() {
    document.getElementById('addFoodModal').style.display = 'none';
}

function fetchSavedFoods() {
    // Replace with actual API call to fetch saved foods
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
        // Save the food to the meal plan
        const cell = document.querySelector(`td[onclick="showModal('${currentDay}', '${currentMeal}')"]`);
        cell.textContent = foodName;

        // Optionally, you can make an API call to save the meal plan update
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
    // Add logic to reset the meal plan
    // Optionally, make an API call to reset the meal plan
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
