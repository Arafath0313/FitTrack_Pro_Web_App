import { Storage } from './storage.js';


export const Auth = 
{
    login(username, password) 
    {
        const users = Storage.getGlobalData('users', {});
        if (users[username] && users[username] === password) 
        {
            Storage.setCurrentUser(username);
            return true;
        }
        return false;
    },

    
    signup(username, password) 
    {
        if (!username || !password) 
        {
            return { success: false, message: 'Username and password are required.' };
        }

        const users = Storage.getGlobalData('users', {});
        if (users[username]) 
        {
            return { success: false, message: 'User already exists. Try logging in.' };
        }

        users[username] = password;
        Storage.setGlobalData('users', users);
        return { success: true, message: 'Sign up successful! Now log in.' };
    },


    // Logout current user
    logout() 
    {
        Storage.setCurrentUser(null);
    },

    
    isLoggedIn() 
    {
        return !!Storage.getCurrentUser();
    },

    
    getCurrentUsername() 
    {
        return Storage.getCurrentUser();
    }
};
