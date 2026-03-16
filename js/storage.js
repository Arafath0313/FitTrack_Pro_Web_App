const STORAGE_PREFIX = 'fit_track_';

export const Storage = 
{
    // Get data for a specific user
    getUserData(username, key, defaultValue = []) 
    {
        if (!username) return defaultValue;
        const data = localStorage.getItem(`${STORAGE_PREFIX}${username}_${key}`);
        try 
        {
            return data ? JSON.parse(data) : defaultValue;
        } 
        
        catch (e) 
        {
            console.error('Error parsing storage data', e);
            return defaultValue;
        }
    },

    
    // Set data for a specific user
    setUserData(username, key, value) 
    {
        if (!username) return;
        localStorage.setItem(`${STORAGE_PREFIX}${username}_${key}`, JSON.stringify(value));
    },


    // Get global data (users list, settings)
    getGlobalData(key, defaultValue = {}) 
    {
        const data = localStorage.getItem(`${STORAGE_PREFIX}global_${key}`);
        try 
        {
            return data ? JSON.parse(data) : defaultValue;
        } 
        
        catch (e) 
        {
            console.error('Error parsing global storage data', e);
            return defaultValue;
        }
    },

    
    // Set global data
     
    setGlobalData(key, value) 
    {
        localStorage.setItem(`${STORAGE_PREFIX}global_${key}`, JSON.stringify(value));
    },

   
    // Clear all data for current user 
    clearUserData(username) 
    {
        if (!username) return;
        const keys = ['activities', 'goals', 'posts', 'profile'];
        keys.forEach(key => localStorage.removeItem(`${STORAGE_PREFIX}${username}_${key}`));
    },

    
    // Get current logged in user
    getCurrentUser() {
        return localStorage.getItem(`${STORAGE_PREFIX}current_user`);
    },

    // Set current logged in user
    setCurrentUser(username) 
    {
        if (username) 
        {
            localStorage.setItem(`${STORAGE_PREFIX}current_user`, username);
        } 
        
        else 
        {
            localStorage.removeItem(`${STORAGE_PREFIX}current_user`);
        }
    }
};
