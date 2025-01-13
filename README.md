# Meal Planner
Meal Planner is a website which allows you to plan your meals ahead for each day of the week.

## Features
- You can add, remove and reorder meals, foods and ingredients.
- You can assign foods to each meal.
- You can sign up and log in to the site.
- You can reset the meal plan, the foods of the selected day or meal, and the shopping list.
- You can view a selected day and its foods for each meal.
- You can view a selected meal and its foods for each day.
- You can assign ingredients to each food with quantities.
- You can select a food and add its ingredients to your shopping list.

## Structure
- Login/Signup page: The first page of the website where you can either create an account or log in to an existing account.
  - Each account has a username, a display name, an e-mail address and a password. You can log in using either the username or the e-mail address.
- Main page: Table containing each day in the first row, and each meal in the first column.
  - You can add meals using the plus button in the last row of the table.
  - You can reorder meals using the arrow buttons next to their names.
  - You can add foods to each meal and day combination by clicking the cells in the table.
    - When you click a cell a modal pops up where you can select existing foods or add a new food.
      - You can delete food items by clicking the trash can icon next to the food's name in the existing food dropdown.
  - You can open the meal view or the day view by clicking on the meal/day.
  - You can reset the meal plan with the reset button in the first cell of the table.
  - The navbar has a dropdown menu which contains the Meal Plan page, the Shopping list page, the Foods page, the Account page and a sign out button.
- Meal page: A page where you can view the selected meal's foods for each day. You can delete the meal using the trash can icon next to the meal's name.
- Day page: A page where you can view the selected day's foods for each meal.
- Shopping list page: A page where you can view the shopping list and it's contents. You can add ingredients of existing foods here.
- Foods page: A list of the existing food items where you can edit their names, delete them and assign ingredients to them with quantities.
- Account page: A page where you can edit your display name, your username, your e-mail address and your profile picture.

## Technology
| Framework: | Spring Boot |
| ----------- | ----------- |
| Language: | Kotlin |
