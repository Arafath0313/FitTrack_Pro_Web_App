import { Storage } from './js/storage.js';
import { Auth } from './js/auth.js';
import { Activity } from './js/activity.js';
import { Goals } from './js/goals.js';
import { UI } from './js/ui.js';


document.addEventListener('DOMContentLoaded', () => 
{
    // --- State & Initialization ---
    const initApp = () => 
    {
        showAuthSection();
        setupEventListeners();
        UI.initSlider();
        UI.initInteractions();
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

    // --- Community Posts (Refactored for Global Visibility) ---
    const renderPosts = () => 
    {
        const currentUser = Auth.getCurrentUsername();
        const posts = Storage.getGlobalData('all_community_posts', []);
        const container = document.getElementById('postsList');
        if (!container) return;

        if (posts.length === 0) 
        {
            container.innerHTML = '<div class="text-center py-5 text-muted"><i class="bi bi-chat-square-text" style="font-size:2.5rem;opacity:0.3"></i><p class="mt-2">No posts yet. Share your first update!</p></div>';
            return;
        }

        container.innerHTML = posts.map(post => 
        {
            const author = post.author || 'Anonymous';
            const isOwner = author === currentUser;
            const profilePic = localStorage.getItem(`fit_track_profile_img_${author}`) || 'https://via.placeholder.com/150';

            return `
                <div class="card community-post mb-3 border-0 shadow-sm">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex align-items-center gap-3">
                                <img src="${profilePic}" alt="${author}" class="rounded-circle" width="42" height="42" style="object-fit:cover;border:2px solid var(--primary-soft);">
                                <div>
                                    <strong style="color:var(--text-heading)">${author}</strong>
                                    <div class="text-muted small">${new Date(post.date).toLocaleString()}</div>
                                </div>
                            </div>
                            ${isOwner ? `<button class="btn btn-sm btn-outline-danger delete-post" data-id="${post.id}" title="Delete post"><i class="bi bi-trash"></i></button>` : ''}
                        </div>
                        <p class="mb-0 mt-3" style="color:var(--text-main);line-height:1.6">${post.content}</p>
                    </div>
                </div>
            `;
        }).join('');
    };

    const showMainContent = () => 
    {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'flex';
        const username = Auth.getCurrentUsername();
        document.getElementById('profileUsername').textContent = username;
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Load per-user profile picture
        const savedImg = localStorage.getItem(`fit_track_profile_img_${username}`);
        document.getElementById('profileImg').src = savedImg || 'https://via.placeholder.com/150';

        UI.updateSummary();
        UI.updateCharts();
        UI.renderActivities();
        UI.renderGoals();
        UI.renderProfile();
        renderPosts();
    };

    // --- Event Listeners ---
    const setupEventListeners = () => 
    {
        // Auth Listeners
        document.getElementById('authForm').addEventListener('submit', (e) => 
        {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (Auth.login(user, pass)) 
            {
                const profile = Storage.getUserData(user, 'profile', null);
                if (profile) 
                {
                    showMainContent();
                } 
                
                else 
                {
                    showSetupSection();
                }
                UI.showToast(`Welcome back, ${user}!`);
            } 
            
            else 
            {
                UI.showToast('Invalid credentials. Please try again.', 'danger');
            }
        });

        document.getElementById('signupBtn').addEventListener('click', () => 
        {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            const result = Auth.signup(user, pass);
            if (result.success) 
            {
                UI.showToast('Account created! Please log in to complete your profile.', 'success');
            } 
            
            else 
            {
                UI.showToast(result.message, 'warning');
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', () => 
        {
            Auth.logout();
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

                // Smooth Transition (Scroll simulation)
                const content = document.getElementById('content');
                content.style.opacity = '0';
                setTimeout(() => 
                {
                    UI.updateNav(target);
                    content.style.opacity = '1';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 200);

                // Refresh data when switching to relevant pages
                if (target === 'home') { UI.updateCharts(); UI.updateSummary(); }
                if (target === 'activities') UI.renderActivities();
                if (target === 'goals') UI.renderGoals();
                if (target === 'progress') UI.updateCharts();
                if (target === 'community') renderPosts();
            });
        });

        // Activity Logging
        document.getElementById('activityForm').addEventListener('submit', (e) => 
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

            Activity.add(data);
            UI.showToast('Activity logged successfully!');
            UI.updateSummary();
            UI.updateCharts();
            UI.renderProfile();
            document.getElementById('activityForm').reset();
        });

        // Auto-Calorie Calculation (Refined Formula)
        document.getElementById('steps').addEventListener('input', (e) => 
        {
            const steps = parseInt(e.target.value) || 0;
            const username = Auth.getCurrentUsername();
            const profile = Storage.getUserData(username, 'profile', null);
            const weight = (profile && profile.weight) ? parseFloat(profile.weight) : 70; // Default to 70kg

            const calories = Math.round(steps * weight * 0.000789);
            document.getElementById('calories').value = calories > 0 ? calories : '';
        });

        // Delete/Edit Activity (Delegation)
        document.getElementById('recentLogs').addEventListener('click', (e) => 
        {
            const target = e.target.closest('button');
            if (!target) return;

            const id = target.getAttribute('data-id');
            if (target.classList.contains('delete-activity')) 
            {
                UI.showConfirm('Delete Activity', 'Are you sure you want to remove this log?', () => 
                {
                    Activity.delete(id);
                    UI.renderActivities(document.getElementById('filterExercise').value);
                    UI.updateSummary();
                    UI.showToast('Activity deleted.');
                });
            } 
            
            else if (target.classList.contains('edit-activity')) 
            {
                // Simplified edit: load into dashboard form and delete old
                const act = Activity.getAll().find(a => a.id === id);
                if (act) 
                {
                    document.getElementById('date').value = act.date;
                    document.getElementById('steps').value = act.steps;
                    document.getElementById('calories').value = act.calories;
                    document.getElementById('exercise').value = act.exercise;
                    UI.updateNav('home');
                    Activity.delete(id); // Remove old one, user will resubmit
                    UI.showToast('Loading activity data into form. Resubmit to save changes.', 'info');
                }
            }
        });

        // Goal Setting
        document.getElementById('goalForm').addEventListener('submit', (e) => 
        {
            e.preventDefault();

            if (!UI.validateForm('goalForm')) return;

            const data = 
            {
                desc: document.getElementById('goalDesc').value,
                target: document.getElementById('goalTarget').value,
                type: document.getElementById('goalType').value,
                date: new Date().toISOString().split('T')[0]
            };
            Goals.add(data);
            UI.renderGoals();
            document.getElementById('goalForm').reset();
            UI.showToast('New goal set!');
        });

        // Delete Goal
        document.getElementById('goalsList').addEventListener('click', (e) => 
        {
            if (e.target.classList.contains('delete-goal')) 
            {
                const id = e.target.getAttribute('data-id');
                Goals.delete(id);
                UI.renderGoals();
                UI.showToast('Goal removed.');
            }
        });

        // Reset Data
        document.getElementById('resetData').addEventListener('click', () => 
        {
            UI.showConfirm('Reset All Data', 'This will permanently delete ALL your fitness logs and goals. Continue?', () => 
            {
                const username = Auth.getCurrentUsername();
                Storage.clearUserData(username);
                showMainContent();
                UI.showToast('All your data has been reset.', 'danger');
            });
        });

        // Dark Mode
        document.getElementById('toggleDarkMode').addEventListener('click', () => 
        {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('fit_track_dark_mode', isDark);
            UI.updateCharts(); // Refresh charts to apply dark mode colors if needed
        });

        if (localStorage.getItem('fit_track_dark_mode') === 'true') 
        {
            document.body.classList.add('dark-mode');
        }

        // Filter Activity
        document.getElementById('filterExercise').addEventListener('change', (e) => 
        {
            UI.renderActivities(e.target.value);
        });

        // Export PDF
        document.getElementById('exportData').addEventListener('click', () => 
        {
            UI.exportToPDF();
        });

        // Profile Picture Upload
        document.getElementById('profilePic').addEventListener('change', (e) => 
        {
            const file = e.target.files[0];
            if (file) 
            {
                const reader = new FileReader();
                reader.onload = (event) => 
                {
                    document.getElementById('profileImg').src = event.target.result;
                    const user = Auth.getCurrentUsername();
                    localStorage.setItem(`fit_track_profile_img_${user}`, event.target.result);
                    UI.showToast('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Load saved profile pic
        const currentUser = Auth.getCurrentUsername();
        const savedImg = currentUser ? localStorage.getItem(`fit_track_profile_img_${currentUser}`) : null;
        if (savedImg) 
        {
            document.getElementById('profileImg').src = savedImg;
        }

        // Contact Form
        document.getElementById('contactForm').addEventListener('submit', function (e) 
        {
            e.preventDefault();
            if (UI.validateForm('contactForm')) 
            {
                const btn = this.querySelector('button[type="submit"]');
                const originalBtnText = btn.innerHTML;

                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

                const serviceID = 'service_eg3pz0r';
                const templateID = 'template_7phwqps';

                emailjs.send(serviceID, templateID, 
                {
                    from_name: document.getElementById('contactName').value,
                    name: document.getElementById('contactName').value,
                    user_name: document.getElementById('contactName').value,
                    reply_to: document.getElementById('contactEmail').value,
                    email: document.getElementById('contactEmail').value,
                    user_email: document.getElementById('contactEmail').value,
                    message: document.getElementById('contactMessage').value,
                })
                    .then(() => 
                    {
                        UI.showToast('Message sent! We will get back to you soon.', 'success');
                        document.getElementById('contactForm').reset();
                    }, 
                    
                    (err) => 
                    {
                        UI.showToast('Failed to send message. Please try again later.', 'danger');
                        console.error('EmailJS Error:', err);
                    })
                    .finally(() => 
                    {
                        btn.disabled = false;
                        btn.innerHTML = originalBtnText;
                    });
            }
        });

        // Community Post Form Submit
        document.getElementById('postForm').addEventListener('submit', (e) => 
        {
            e.preventDefault();
            const content = document.getElementById('postContent').value.trim();
            if (!content) 
            {
                UI.showToast('Please write something to share.', 'warning');
                return;
            }

            const username = Auth.getCurrentUsername();
            const posts = Storage.getGlobalData('all_community_posts', []);
            posts.unshift
            ({
                id: Date.now().toString(),
                author: username,
                content: content,
                date: new Date().toISOString()
            });
            Storage.setGlobalData('all_community_posts', posts);

            document.getElementById('postForm').reset();
            renderPosts();
            UI.showToast('Post shared with the community!', 'success');
        });

        // Setup Form Submit
        document.getElementById('setupForm').addEventListener('submit', (e) => 
        {
            e.preventDefault();
            const username = Auth.getCurrentUsername();
            const profile = {
                age: document.getElementById('setupAge').value,
                height: document.getElementById('setupHeight').value,
                weight: document.getElementById('setupWeight').value,
                targetWeight: document.getElementById('setupTargetWeight').value
            };

            Storage.setUserData(username, 'profile', profile);
            UI.showToast('Profile updated successfully!', 'success');
            showMainContent();
        });

        // Edit Profile Button
        document.getElementById('editProfileBtn').addEventListener('click', () => 
        {
            showSetupSection();
        });

        // Delete Post (Global)
        document.getElementById('postsList').addEventListener('click', (e) => 
        {
            const btn = e.target.closest('.delete-post');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            const username = Auth.getCurrentUsername();
            let posts = Storage.getGlobalData('all_community_posts', []);
            const post = posts.find(p => p.id === id);

            if (post && post.author === username) 
            {
                posts = posts.filter(p => p.id !== id);
                Storage.setGlobalData('all_community_posts', posts);
                renderPosts();
                UI.showToast('Post deleted.', 'danger');
            } 
            
            else 
            {
                UI.showToast('You can only delete your own posts.', 'warning');
            }
        });
    };

    // --- Start ---
    initApp();
});