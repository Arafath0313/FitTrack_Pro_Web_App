import { Storage } from './js/storage.js';
import { Auth } from './js/auth.js';
import { Activity } from './js/activity.js';
import { Goals } from './js/goals.js';
import { UI } from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => 
{
    // --- Global Data Cache (Phase 3 Backend Optimization) ---
    let activitiesCache = [];
    let goalsCache = [];
    let profileCache = {};



    // --- State & Initialization ---
    const initApp = async () => 
    {
        // Check if already logged in (session persistence)
        if (Auth.isLoggedIn()) 
        {
            await showMainContent();
        } 
        
        else 
        {
            showAuthSection();
        }
        
        setupEventListeners();
        UI.initSlider();
        // UI.initInteractions(); // Optional hover tips
    };



    const showAuthSection = () => 
    {
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'none';
        UI.destroyChart('steps');
        UI.destroyChart('weekly');
        UI.destroyChart('monthly');
    };



    const showSetupSection = () => 
    {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('setupSection').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
    };



    const showMainContent = async () => 
    {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'flex';
        
        const username = Auth.getCurrentUsername();
        document.getElementById('profileUsername').textContent = username;
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Fetch all data from PHP Backend
        try 
        {
            const [acts, gs, prof] = await Promise.all
            ([
                Activity.getAll(),
                Goals.getAll(),
                Storage.getProfile()
            ]);
            
            activitiesCache = acts;
            goalsCache = gs;
            profileCache = prof;

            // Load per-user profile picture from DB (with fallback)
            document.getElementById('profileImg').src = profileCache.profile_photo || 'images/default.png';

            // Render UI with fetched data
            UI.updateSummary(activitiesCache);
            UI.updateCharts(activitiesCache);
            UI.renderActivities(activitiesCache);
            UI.renderGoals(goalsCache, activitiesCache);
            UI.renderProfile(profileCache, activitiesCache);
            await UI.renderCommunity(); // API call inside
        } 


        
        catch (err) 
        {
            UI.showToast('Error loading data from server.', 'danger');
            console.error(err);
        }
    };



    // --- Event Listeners ---
    const setupEventListeners = () => 
    {
        // Auth Listeners
        document.getElementById('authForm').addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            
            const result = await Auth.login(user, pass);
            if (result.success) 
            {
                if (result.has_profile) 
                {
                    await showMainContent();
                } 
                
                else 
                {
                    showSetupSection();
                }
                UI.showToast(`Welcome back, ${user}!`);
            } 
            else 
            {
                UI.showToast(result.message || 'Invalid credentials.', 'danger');
            }
        });



        document.getElementById('signupBtn').addEventListener('click', async () => 
        {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            // Note: Email field is missing in root index.php authForm, but required by API 
            // In minimalist approach, we'll try with dummy email or user if not present.
            const result = await Auth.signup(user, 'user@example.com', pass);
            if (result.success) 
            {
                UI.showToast('Account created! Logging you in...', 'success');
                showSetupSection();
            } 
            else 
            {
                UI.showToast(result.message, 'warning');
            }
        });



        document.getElementById('logoutBtn').addEventListener('click', async () => 
        {
            await Auth.logout();
            showAuthSection();
            UI.showToast('Logged out successfully.');
        });



        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => 
        {
            link.addEventListener('click', (e) => 
            {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                const content = document.getElementById('content');
                content.style.opacity = '0';
                setTimeout(async () => 
                {
                    UI.updateNav(target);
                    content.style.opacity = '1';
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    if (target === 'home') 
                        { UI.updateCharts(activitiesCache); UI.updateSummary(activitiesCache); }
                    if (target === 'activities') 
                        UI.renderActivities(activitiesCache, document.getElementById('filterExercise').value);
                    if (target === 'goals') 
                        UI.renderGoals(goalsCache, activitiesCache);
                    if (target === 'progress') 
                        UI.updateCharts(activitiesCache);
                    if (target === 'community') 
                        await UI.renderCommunity();
                    if (target === 'profile') 
                        UI.renderProfile(profileCache, activitiesCache);
                }, 200);
            });
        });



        // Activity Logging
        document.getElementById('activityForm').addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            if (!UI.validateForm('activityForm')) return;

            const data = 
            {
                date: document.getElementById('date').value,
                steps: document.getElementById('steps').value,
                calories: document.getElementById('calories').value,
                exercise: document.getElementById('exercise').value
            };

            try 
            {
                const newAct = await Activity.add(data);
                activitiesCache.push(newAct); // Update cache
                UI.showToast('Activity logged to database!');
                UI.updateSummary(activitiesCache);
                UI.updateCharts(activitiesCache);
                UI.renderProfile(profileCache, activitiesCache);
                document.getElementById('activityForm').reset();
            } 
            
            catch (err) 
            {
                UI.showToast(err.message, 'danger');
            }
        });



        // Auto-Calorie Calculation
        document.getElementById('steps').addEventListener('input', (e) => 
        {
            const steps = parseInt(e.target.value) || 0;
            const weight = (profileCache && profileCache.weight) ? parseFloat(profileCache.weight) : 70;
            const calories = Math.round(steps * weight * 0.000789);
            document.getElementById('calories').value = calories > 0 ? calories : '';
        });



        // Delete/Edit Activity
        document.getElementById('recentLogs').addEventListener('click', (e) => 
        {
            const target = e.target.closest('button');
            if (!target) return;
            const id = target.getAttribute('data-id');

            if (target.classList.contains('delete-activity')) 
            {
                UI.showConfirm('Delete Activity', 'Are you sure?', async () => 
                {
                    const success = await Activity.delete(id);
                    if (success) 
                    {
                        activitiesCache = activitiesCache.filter(a => a.id != id);
                        UI.renderActivities(activitiesCache, document.getElementById('filterExercise').value);
                        UI.updateSummary(activitiesCache);
                        UI.showToast('Activity deleted.');
                    }
                });
            } 



            else if (target.classList.contains('edit-activity')) 
            {
                const act = activitiesCache.find(a => a.id == id);
                if (act) 
                {
                    document.getElementById('date').value = act.date;
                    document.getElementById('steps').value = act.steps;
                    document.getElementById('calories').value = act.calories;
                    document.getElementById('exercise').value = act.exercise;
                    UI.updateNav('home');
                    // Delete old to "update" on resubmit
                    Activity.delete(id).then(() => 
                    {
                        activitiesCache = activitiesCache.filter(a => a.id != id);
                        UI.updateSummary(activitiesCache);
                    });
                    UI.showToast('Data loaded. Re-submit to update.', 'info');
                }
            }
        });



        // Goal Setting
        document.getElementById('goalForm').addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            if (!UI.validateForm('goalForm')) return;

            const data = 
            {
                desc: document.getElementById('goalDesc').value,
                target: document.getElementById('goalTarget').value,
                type: document.getElementById('goalType').value
            };

            try 
            {
                const newGoal = await Goals.add(data);
                goalsCache.push(newGoal);
                UI.renderGoals(goalsCache, activitiesCache);
                document.getElementById('goalForm').reset();
                UI.showToast('Goal saved!');
            } 
            
            catch (err) 
            {
                UI.showToast(err.message, 'danger');
            }
        });



        // Delete Goal
        document.getElementById('goalsList').addEventListener('click', async (e) => 
        {
            if (e.target.classList.contains('delete-goal')) 
            {
                const id = e.target.getAttribute('data-id');
                const success = await Goals.delete(id);
                if (success) 
                {
                    goalsCache = goalsCache.filter(g => g.id != id);
                    UI.renderGoals(goalsCache, activitiesCache);
                    UI.showToast('Goal removed.');
                }
            }
        });



        // Reset Data (Individual calls for simplicity in Phase 3)
        document.getElementById('resetData').addEventListener('click', () => 
        {
            UI.showConfirm('Reset All Data', 'Permanently delete all logs?', async () => 
            {
                await Promise.all
                ([
                    ...activitiesCache.map(a => Activity.delete(a.id)),
                    ...goalsCache.map(g => Goals.delete(g.id))
                ]);
                activitiesCache = [];
                goalsCache = [];
                await showMainContent();
                UI.showToast('Data reset.', 'danger');
            });
        });



        // Dark Mode
        document.getElementById('toggleDarkMode').addEventListener('click', () => 
        {
            document.body.classList.toggle('dark-mode');
            Storage.setTheme(document.body.classList.contains('dark-mode'));
            UI.updateCharts(activitiesCache);
        });
        if (Storage.getTheme()) document.body.classList.add('dark-mode');

        // Filter Activity
        document.getElementById('filterExercise').addEventListener('change', (e) => 
        {
            UI.renderActivities(activitiesCache, e.target.value);
        });



        // Export PDF
        document.getElementById('exportData').addEventListener('click', () => { UI.exportToPDF(); });

        // Profile Picture (Database Sync)
        document.getElementById('profilePic').addEventListener('change', async (e) => 
        {
            const file = e.target.files[0];
            if (file) 
            {
                // Show local preview immediately
                const reader = new FileReader();
                reader.onload = (event) => 
                {
                    document.getElementById('profileImg').src = event.target.result;
                };
                reader.readAsDataURL(file);

                // Sync to database
                try 
                {
                    UI.showToast('Uploading profile picture...', 'info');
                    const success = await Storage.saveProfile(profileCache, 'profilePic');
                    if (success) 
                    {
                        const newProfile = await Storage.getProfile();
                        profileCache = newProfile;
                        UI.showToast('Profile picture synced!', 'success');
                        await UI.renderCommunity(); // Refresh community feed
                    } 
                    
                    else 
                    {
                        UI.showToast('Database sync failed.', 'warning');
                    }
                } 
                
                catch (err) 
                {
                    console.error('Photo upload error:', err);
                    UI.showToast('Error uploading photo.', 'danger');
                }
            }
        });



        // Contact Form
        document.getElementById('contactForm').addEventListener('submit', async function (e) 
        {
            e.preventDefault();
            if (!UI.validateForm('contactForm')) return;
            const btn = this.querySelector('button[type="submit"]');
            const origText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Sending...';

            const res = await fetch('contact.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify
                ({
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    message: document.getElementById('contactMessage').value,
                })
            });
            const result = await res.json();
            btn.disabled = false;
            btn.innerHTML = origText;

            if (result.success) 
            {
                UI.showToast('Message sent and saved!', 'success');
                this.reset();
            } 
            
            else 
            {
                UI.showToast('Error sending message.', 'danger');
            }
        });



        // Community Post
        document.getElementById('postForm').addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            const content = document.getElementById('postContent').value.trim();
            if (!content) return;

            const res = await fetch('api/save_post.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const result = await res.json();
            if (result.success) 
            {
                document.getElementById('postForm').reset();
                await UI.renderCommunity();
                UI.showToast('Post shared!');
            }
        });
        


        // Delete Post
        document.getElementById('postsList').addEventListener('click', async (e) => 
        {
            const btn = e.target.closest('.delete-post');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            const res = await fetch('api/delete_post.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await res.json();
            if (result.success) 
            {
                await UI.renderCommunity();
                UI.showToast('Post deleted.', 'danger');
            }
        });



        // Setup Form
        document.getElementById('setupForm').addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const origText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Saving...';

            const profile = 
            {
                age: document.getElementById('setupAge').value,
                height: document.getElementById('setupHeight').value,
                weight: document.getElementById('setupWeight').value,
                targetWeight: document.getElementById('setupTargetWeight').value
            };

            try 
            {
                const success = await Storage.saveProfile(profile);
                if (success) 
                {
                    UI.showToast('Profile saved! Welcome to FitTrack!', 'success');
                    await showMainContent();
                } 
                
                else 
                {
                    UI.showToast('Could not save profile. Please check all fields and try again.', 'danger');
                    btn.disabled = false;
                    btn.innerHTML = origText;
                }
            } 
            
            catch (err) 
            {
                console.error('Setup error:', err);
                UI.showToast('Server error. Make sure you are logged in and try again.', 'danger');
                btn.disabled = false;
                btn.innerHTML = origText;
            }
        });

        document.getElementById('editProfileBtn').addEventListener('click', () => showSetupSection());
    };

    

    // --- Start ---
    initApp();
});