import { Auth } from './auth.js';

export const Goals = 
{
    // Get all goals for current user via PHP
    async getAll() 
    {
        const res = await fetch('api/get_goals.php');
        const data = await res.json();
        return data.goals || [];
    },

    
    // Add new goal via PHP
    async add(goalData) 
    {
        const res = await fetch
        (
            'api/save_goal.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify
                ({
                    desc: goalData.desc,
                    target: parseInt(goalData.target) || 0,
                    type: goalData.type
                })
            }
        );
        const data = await res.json();

        if (data.success) 
        {
            const today = new Date().toISOString().split('T')[0];
            return { id: data.id, date: today, ...goalData, target: parseInt(goalData.target) };
        }
        throw new Error(data.message || 'Could not save goal.');
    },

    
    // Delete goal via PHP
    async delete(id) 
    {
        const res = await fetch
        (
            'api/delete_goal.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
        );
        const data = await res.json();
        return data.success;
    },

    
    // Calculate progress for a specific goal (Sync, takes activity list)
    calculateProgress(goal, activities) 
    {
        if (!activities) return 0;
        
        let filtered = activities;
        // Filter by date if goal is date-specific (Project Phase 2 logic)
        if (goal.date) 
        {
            filtered = activities.filter(act => act.date === goal.date);
        }

        const total = filtered.reduce((sum, act) => sum + (goal.type === 'steps' ? act.steps : act.calories), 0);
        return goal.target > 0 ? Math.min(Math.round((total / goal.target) * 100), 100) : 0;
    }
};
