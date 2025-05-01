import {useEffect, useState} from 'react';
import { BackendUrl } from '../utils/constants';

export const useMealTime = (mealPlan, updateMealPlan) => {
    const [mealTimes, setMealTimes] = useState();

    useEffect(() => {
        if(mealPlan) {
            setMealTimes(mealPlan.mealTimes);
        }
    }, [mealPlan])

    const handleAddMealTime = () => {
        const newName = prompt('Enter the name of the new meal:');
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
                setMealTimes(updatedMealPlan.mealTimes);
                updateMealPlan(updatedMealPlan);
            })
            .catch(error => console.error('Error adding meal time:', error));
    };

    const handleEditMealTime = (mealTime) => {
        fetch(`${BackendUrl}/api/mealtimes/${mealTime.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealTime)
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
                setMealTimes(updatedMealPlan.mealTimes);
                updateMealPlan(updatedMealPlan);
            })
            .catch(error => console.error('Error editing meal time:', error));
    };


    const handleDeleteMealTime = (mealTimeId) => {
        fetch(`${BackendUrl}/api/mealtimes/${mealTimeId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    const newMealTimes = mealPlan.mealTimes.filter(mt => mt.id !== mealTimeId);
                    setMealTimes(newMealTimes);
                    const updatedMealPlan = {
                        ...mealPlan,
                        mealTimes: newMealTimes,
                        days: mealPlan.days
                    };
                    updateMealPlan(updatedMealPlan);
                } else {
                    console.error(`Failed to delete meal time with id ${mealTimeId}`);
                }
            })
            .catch(error => console.error(`Error deleting meal time with id ${mealTimeId}:`, error));
    };

    const handleReorder = (order1, order2) => {
        if (order1 < 0 || order2 < 0 || order1 >= mealTimes.length || order2 >= mealTimes.length) {
            return;
        }

        const mealTime1 = mealTimes.find(o => o.order === order1);
        const mealTime2 = mealTimes.find(o => o.order === order2);

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
                    setMealTimes(updatedMealTimes);
                    updateMealPlan(updatedMealPlan);
            })
            .catch(error => console.error("Error reordering meal times:", error));
    };

    return {
        mealTimes,
        handleAddMealTime,
        handleEditMealTime,
        handleDeleteMealTime,
        handleReorder,
    };
};
