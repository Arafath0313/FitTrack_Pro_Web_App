const STORAGE_PREFIX = 'fit_track_';

export const Storage = 
{
    // Profile biometrics are now in PHP/MySQL
    async getProfile() 
    {
        const res = await fetch('api/get_profile.php');
        const data = await res.json();
        return data.profile || {};
    },

    async saveProfile(profileData, photoInputId = 'profilePic') 
    {
        const formData = new FormData();

        formData.append('age', profileData.age);
        formData.append('height', profileData.height);
        formData.append('weight', profileData.weight);
        formData.append('targetWeight', profileData.targetWeight);



        // Check for photo in the specified input
        const fileInput = document.getElementById(photoInputId) || document.getElementById('setupPhoto');
        if (fileInput && fileInput.files.length > 0) 
        {
            formData.append('photo', fileInput.files[0]);
        }

        const res = await fetch
        (
            'api/save_profile.php', 
            {
                method: 'POST',
                body: formData
            }
        );

        if (!res.ok) 
        {
            const text = await res.text();
            throw new Error(`Server error ${res.status}: ${text}`);
        }

        const data = await res.json();
        return data.success;
    },



    // UI Preferences still use localStorage for instant application
    getTheme() 
    {
        return localStorage.getItem(`${STORAGE_PREFIX}dark_mode`) === 'true';
    },



    setTheme(isDark) 
    {
        localStorage.setItem(`${STORAGE_PREFIX}dark_mode`, isDark);
    },



    // Session-like logic for the frontend
    getCurrentUser() 
    {
        return localStorage.getItem(`${STORAGE_PREFIX}current_user`);
    },



    setCurrentUser(username) 
    {
        if (username) localStorage.setItem(`${STORAGE_PREFIX}current_user`, username);
        else localStorage.removeItem(`${STORAGE_PREFIX}current_user`);
    },



    // Legacy / Other
    clearUserData(username) 
    {
        if (!username) return;
        // Data is in DB now, but we can clear local cache if any
        localStorage.removeItem(`${STORAGE_PREFIX}profile_img_${username}`);
    }

    
};
