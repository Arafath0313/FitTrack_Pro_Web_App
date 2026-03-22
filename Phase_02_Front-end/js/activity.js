import { Storage } from './storage.js';
import { Auth } from './auth.js';



export const Activity = 
{
    // Get all activities for current user
    getAll() 
    {
        const username = Auth.getCurrentUsername();
        return Storage.getUserData(username, 'activities', []);
    },

    // Add new activity
    add(activityData) 
    {
        const username = Auth.getCurrentUsername();
        const activities = this.getAll();
        const newActivity = 
        {
            id: Date.now().toString(),
            ...activityData,
            steps: parseInt(activityData.steps) || 0,
            calories: parseInt(activityData.calories) || 0,
            timestamp: new Date(activityData.date).getTime()
        };
        activities.push(newActivity);
        Storage.setUserData(username, 'activities', activities);
        return newActivity;
    },

    // Update existing activity
    update(id, updatedData) 
    {
        const username = Auth.getCurrentUsername();
        let activities = this.getAll();
        activities = activities.map(act => act.id === id ? { ...act, ...updatedData } : act);
        Storage.setUserData(username, 'activities', activities);
    },


    // Delete activity
    delete(id) 
    {
        const username = Auth.getCurrentUsername();
        let activities = this.getAll();
        activities = activities.filter(act => act.id !== id);
        Storage.setUserData(username, 'activities', activities);
    },

    
    // Calculate totals
    
    getStats() 
    {
        const activities = this.getAll();
        const totalSteps = activities.reduce((sum, act) => sum + act.steps, 0);
        const totalCalories = activities.reduce((sum, act) => sum + act.calories, 0);
        const avgCalories = activities.length > 0 ? Math.round(totalCalories / activities.length) : 0;

        const bestDay = activities.length > 0
            ? activities.reduce((max, act) => act.steps > max.steps ? act : max, activities[0])
            : null;

        return { totalSteps, totalCalories, avgCalories, bestDay, count: activities.length };
    },

    
    // Get monthly calorie distribution for Chart.js
    getMonthlyCalorieData() 
    {
        const activities = this.getAll();
        const monthlyData = {};

        activities.forEach(act => 
        {
            const date = new Date(act.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + act.calories;
        });

        return {
            labels: Object.keys(monthlyData),
            values: Object.values(monthlyData)
        };
    },

    // Get weekly steps for Chart.js
    getWeeklyStepData() 
    {
        const activities = [...this.getAll()]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7);

        return {
            labels: activities.map(a => a.date),
            values: activities.map(a => a.steps)
        };
    }
};
