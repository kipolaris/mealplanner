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

    const handleReorder = (index1, index2) => {
        if (index1 < 0 || index2 < 0 || index1 >= mealTimes.length || index2 >= mealTimes.length) {
            return;
        }

        const mealTime1 = mealTimes[index1];
        const mealTime2 = mealTimes[index2];

        fetch(`${BackendUrl}/api/mealtimes/reorder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mealTimeId1: mealTime1.id, mealTimeId2: mealTime2.id })
        })
            .then(response => {
                if (response.ok) {
                    const updatedMealTimes = [...mealTimes];
                    [updatedMealTimes[index1], updatedMealTimes[index2]] = [updatedMealTimes[index2], updatedMealTimes[index1]];
                    console.log('Updated meal times:', JSON.stringify(updatedMealTimes));
                    const updatedMealPlan = { ...mealPlan, mealTimes: updatedMealTimes };
                    console.log('Meal plan after reordering mealtimes:',JSON.stringify(updatedMealPlan));
                    setMealTimes(updatedMealTimes);
                    updateMealPlan(updatedMealPlan);
                }
            })
            .catch(error => console.error("Error reordering meal times:", error));
    };

    return {
        mealTimes,
        handleAddMealTime,
        handleReorder,
    };
};
