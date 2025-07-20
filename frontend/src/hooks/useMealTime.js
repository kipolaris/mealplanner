import { BackendUrl } from '../utils/constants';
import {useState} from "react";

export const useMealTime = (mealPlan, updateMealPlan) => {

    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [editingMealTime, setEditingMealTime] = useState(null);

    const editMealTime = (mealtime) => {
        setEditingMealTime(mealtime);
        setIsNameModalOpen(true);
    }
    const addMealTime = (newName) => {
        const mealTimeData = { name: newName };

        fetch(`${BackendUrl}/api/mealtimes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealTimeData)
        })
            .then(response => response.json())
            .then((newMealTime) => {
                const updatedMealPlan = {
                    ...mealPlan,
                    mealTimes: [...mealPlan.mealTimes, newMealTime],
                    days: mealPlan.days,
                };
                console.log('New meal time added:', newMealTime);
                updateMealPlan(updatedMealPlan);
            })
            .catch(error => console.error('Error adding meal time:', error));
    };

    const saveEditedMealTime = (newName) => {
        if (!editingMealTime) return;

        const updatedMealTime = { ...editingMealTime, name: newName.trim() };

        fetch(`${BackendUrl}/api/mealtimes/${editingMealTime.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMealTime)
        })
            .then(response => response.json())
            .then((editedMealTime) => {
                const updatedMealPlan = {
                    ...mealPlan,
                    mealTimes: mealPlan.mealTimes.map(mt =>
                        mt.id === editedMealTime.id ? editedMealTime : mt
                    ),
                    days: mealPlan.days
                };
                updateMealPlan(updatedMealPlan);
                setEditingMealTime(false);
            })
            .catch(error => console.error('Error editing meal time:', error));
    };

    const deleteMealTime = (mealTimeId) => {
        fetch(`${BackendUrl}/api/mealtimes/${mealTimeId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetch(`${BackendUrl}/api/meal-plan`)
                        .then(response => response.json())
                        .then(data => {
                            console.log('Fetched meal plan data:', JSON.stringify(data));
                            updateMealPlan(data);
                        })
                        .catch(error => console.error('Error fetching meal plan:', error));
                }
            })
            .catch(error => console.error(`Error deleting meal time with id ${mealTimeId}:`, error));
    };

    const handleReorder = (order1, order2) => {
        const sortedMealTimes = [...mealPlan.mealTimes].sort((a, b) => a.order - b.order);
        if (order1 < 0 || order2 < 0 || order1 >= sortedMealTimes.length || order2 >= sortedMealTimes.length) {
            return;
        }

        const mealTime1 = sortedMealTimes.find(o => o.order === order1);
        const mealTime2 = sortedMealTimes.find(o => o.order === order2);

        if (!mealTime1 || !mealTime2) {
            console.error("Invalid meal time(s) for reordering", { mealTime1, mealTime2 });
            return;
        }

        fetch(`${BackendUrl}/api/mealtimes/reorder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mealTimeId1: mealTime1.id, mealTimeId2: mealTime2.id })
        })
            .then(response => response.json())
            .then((updatedMealTimes) => {
                    console.log('Updated meal times:', JSON.stringify(updatedMealTimes));
                    const updatedMealPlan = { ...mealPlan, mealTimes: updatedMealTimes };
                    console.log('Meal plan after reordering mealtimes:',JSON.stringify(updatedMealPlan));
                    updateMealPlan(updatedMealPlan);
            })
            .catch(error => console.error("Error reordering meal times:", error));
    };

    return {
        mealTimes: mealPlan?.mealTimes || [],
        addMealTime,
        editMealTime,
        deleteMealTime,
        handleReorder,
        isNameModalOpen,
        setIsNameModalOpen,
        saveEditedMealTime,
        editingMealTime
    };
};
