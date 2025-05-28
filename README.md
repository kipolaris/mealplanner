# Forkcast
Forkcast is a website which gives you the ability to plan your meals ahead for each day of the week.

## Features
- You can add, remove, edit and reorder meal times
- You can add, remove and edit foods and ingredients.
- You can assign foods to each meal (combination of a day and a meal time).
- You can reset the meal plan, the foods of the selected day or meal time, and the shopping list.
- You can view a selected day and its foods for each meal.
- You can view a selected meal time and its foods for each day.
- You can assign ingredients to each food with quantities.
- You can add ingredients to your shopping list with quantities and prices.
- You can save ingredients you have at home with quantities.

## Structure
- Landing page: The greeting page of the website.
- Menu page: A table which contains buttons to the following pages:
  - Meal Plan page
  - Meal times page
  - Foods page
  - Ingredients page
  - Ingredients at home page
  - Shopping list page
- Meal plan page: Table containing each day in the first row, and each meal time in the first column.
  - You can add meal times using the plus button in the last row of the table.
  - You can reorder meal times using the arrow buttons next to their names.
  - You can add foods to each meal time and day combination by clicking the cells in the table.
    - When you click a cell a modal pops up where you can select existing foods or add a new food.
      - You can delete food items by clicking the trash can icon next to the food's name in the existing food dropdown.
  - You can open the meal time page or the day page by clicking on their name.
  - You can reset the meal plan with the reset button in the first cell of the table.
- Meal time page: A page where you can view the selected meal time's foods for each day.
- Day page: A page where you can view the selected day's foods for each meal time.
- Meal times page: A page where you can view, edit, delete and reorder all the meal times, as well as add new ones.
- Foods page: A list of the existing food items where you can edit their names, delete them, or open their respective pages by clicking on their names.
- Food page: A page for a specific food, where you can do the following:
  - Add a description/recipe
  - Add ingredients with quantities to the food
    - If you click on the shopping cart icon next to the ingredient's name it adds it to the shopping list.
- Ingredients page: A list of all the existing ingredients. You can add, edit and delete ingredients here.
- Ingredients at home page: A list of all the ingredients you have at home.
- Shopping list page: A page where you can view the shopping list and edit/delete its content. You can add ingredients here with quantities and prices.
  - If you click on the checkbox next to the shopping item's name it gets added to the home ingredients, and deleted from the shopping list.

## Technology

### Backend

| Component         | Technology |
|------------------|------------|
| Framework        | Spring Boot |
| Language         | Kotlin |
| Database        | H2 (in-memory) |
| Build Tool       | Gradle |
| Reactive Programming | Spring WebFlux, Reactor |

### Frontend

| Component        | Technology |
|-----------------|------------|
| Library         | React |
| Language        | JavaScript |
| Styling        | CSS |

