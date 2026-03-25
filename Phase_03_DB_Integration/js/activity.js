import { Auth } from './auth.js';

export const Activity = 
{
    // Get all activities for current user via PHP
    async getAll() 
    {
        const res = await fetch('api/get_activities.php');
        const data = await res.json();
        return data.activities || [];
    },

    // Add new activity via PHP
    async add(activityData) 
    {
        const res = await fetch
        (
            'api/save_activity.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify
                ({
                    date: activityData.date,
                    steps: parseInt(activityData.steps) || 0,
                    calories: parseInt(activityData.calories) || 0,
                    exercise: activityData.exercise
                })
            }
        );
        const data = await res.json();
        
        if (data.success) 
        {
            return { id: data.id, ...activityData, steps: parseInt(activityData.steps), calories: parseInt(activityData.calories) };
        }
        throw new Error(data.message || 'Could not log activity.');
    },

    // Delete activity via PHP
    async delete(id) 
    {
        const res = await fetch
        (
            'api/delete_activity.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
        );
        const data = await res.json();
        return data.success;
    },

    
    // Calculate totals (Now takes activities list as arg, or fetches)
    getStats(activities) 
    {
        const totalSteps = activities.reduce((sum, act) => sum + act.steps, 0);
        const totalCalories = activities.reduce((sum, act) => sum + act.calories, 0);
        const avgCalories = activities.length > 0 ? Math.round(totalCalories / activities.length) : 0;

        const bestDay = activities.length > 0
            ? activities.reduce((max, act) => act.steps > max.steps ? act : max, activities[0])
            : null;

        return { totalSteps, totalCalories, avgCalories, bestDay, count: activities.length };
    },

    
    // Get monthly calorie distribution for Chart.js
    getMonthlyCalorieData(activities) 
    {
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
    getWeeklyStepData(activities) 
    {
        const sorted = [...activities]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7);

        return {
            labels: sorted.map(a => a.date),
            values: sorted.map(a => a.steps)
        };
    }
};
