import { Storage } from './storage.js';

export const Auth = 
{
    // Check if user is logged in
    isLoggedIn() 
    {
        return !!Storage.getCurrentUser();
    },

    
    // Login user via PHP
    async login(username, password) 
    {
        const res = await fetch
        (
            'auth/login.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            }
        );
        const data = await res.json();
        
        if (data.success) 
        {
            Storage.setCurrentUser(data.username);
            return { success: true, has_profile: data.has_profile };
        }
        return { success: false, message: data.message };
    },

    
    // Sign up user via PHP
    async signup(username, email, password) 
    {
        const res = await fetch
        (
            'auth/register.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            }
        );
        const data = await res.json();

        if (data.success) 
        {
            Storage.setCurrentUser(data.username);
            return { success: true };
        }
        return { success: false, message: data.message };
    },

     
    // Logout user
    async logout() 
    {
        await fetch('auth/logout.php', { method: 'POST' });
        Storage.setCurrentUser(null);
    },

    
    // Get current username
    getCurrentUsername() 
    {
        return Storage.getCurrentUser();
    }
};
