import { Storage } from './storage.js';
import { Auth } from './auth.js';
import { Activity } from './activity.js';


export const Goals = 
{
    // Get all goals for current user
    getAll() 
    {
        const username = Auth.getCurrentUsername();
        return Storage.getUserData(username, 'goals', []);
    },

    
    // Add new goal
    add(goalData) 
    {
        const username = Auth.getCurrentUsername();
        const goals = this.getAll();
        const newGoal = 
        {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0], // Default to today
            ...goalData,
            target: parseInt(goalData.target) || 0,
            progress: 0
        };
        goals.push(newGoal);
        Storage.setUserData(username, 'goals', goals);
        return newGoal;
    },

    
    // Delete goal
    delete(id) 
    {
        const username = Auth.getCurrentUsername();
        let goals = this.getAll();
        goals = goals.filter(goal => goal.id !== id);
        Storage.setUserData(username, 'goals', goals);
    },

    
    // Calculate progress for a specific goal
    calculateProgress(goal) 
    {
        let activities = Activity.getAll();

        // Filter by date if goal is date-specific
        if (goal.date) 
        {
            activities = activities.filter(act => act.date === goal.date);
        }

        const total = activities.reduce((sum, act) => sum + (goal.type === 'steps' ? act.steps : act.calories), 0);
        return goal.target > 0 ? Math.min(Math.round((total / goal.target) * 100), 100) : 0;
    }
};
