import { Storage } from './storage.js';
import { Auth } from './auth.js';
import { Activity } from './activity.js';
import { Goals } from './goals.js';



export const UI = 
{
    charts: {}, // Store chart instances

    
    // Show a toast message
    showToast(message, type = 'success') 
    {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0 show mb-2`;
        toastEl.role = 'alert';
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toastEl);

        // Auto remove after 3 seconds
        setTimeout(() => 
        {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 500);
        }, 3000);
    },

    
    // Show confirmation modal
    showConfirm(title, message, onConfirm) 
    {
        const modalEl = document.getElementById('confirmModal');
        if (!modalEl) return;

        const modalTitle = modalEl.querySelector('.modal-title');
        const modalBody = modalEl.querySelector('.modal-body');
        const confirmBtn = modalEl.querySelector('#confirmModalBtn');

        modalTitle.textContent = title;
        modalBody.textContent = message;

        // Clone and replace to remove old event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        const modal = new bootstrap.Modal(modalEl);
        newConfirmBtn.addEventListener('click', () => 
        {
            onConfirm();
            modal.hide();
        });

        modal.show();
    },

   
    // Destroy existing chart instance to prevent leaks
    destroyChart(id) 
    {
        if (this.charts[id]) 
        {
            this.charts[id].destroy();
            delete this.charts[id];
        }
    },

    
    // Initialize/Update Charts
    updateCharts() 
    {
        // Steps Bar Chart
        const activities = Activity.getAll();
        const stepsCtx = document.getElementById('stepsChart');
        if (stepsCtx) 
        {
            this.destroyChart('steps');
            this.charts['steps'] = new Chart(stepsCtx, 
            {
                type: 'bar',
                data: 
                {
                    labels: activities.slice(-7).map(a => a.date),
                    datasets: 
                    [{
                        label: 'Recent Steps',
                        data: activities.slice(-7).map(a => a.steps),
                        backgroundColor: '#4e73df',
                        borderRadius: 5
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // Weekly Steps Line Chart
        const weeklyData = Activity.getWeeklyStepData();
        const weeklyCtx = document.getElementById('weeklyStepsChart');
        if (weeklyCtx) 
        {
            this.destroyChart('weekly');
            this.charts['weekly'] = new Chart(weeklyCtx, 
            {
                type: 'line',
                data: 
                {
                    labels: weeklyData.labels,
                    datasets: 
                    [{
                        label: 'Steps Trend',
                        data: weeklyData.values,
                        borderColor: '#1cc88a',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(28, 200, 138, 0.1)'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // Monthly Calories Chart
        const monthlyData = Activity.getMonthlyCalorieData();
        const monthlyCtx = document.getElementById('monthlyCaloriesChart');
        if (monthlyCtx) 
        {
            this.destroyChart('monthly');
            this.charts['monthly'] = new Chart(monthlyCtx, 
            {
                type: 'bar',
                data: 
                {
                    labels: monthlyData.labels,
                    datasets: 
                    [{
                        label: 'Monthly Calories',
                        data: monthlyData.values,
                        backgroundColor: '#f6c23e'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    },

    
    // Initialize Interactive Image Slider 
    initSlider() 
    {
        const slider = document.getElementById('motivationSlider');
        if (!slider) return;

        const wrapper = slider.querySelector('.slider-wrapper');
        const slides = slider.querySelectorAll('.slider-slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        const dotsContainer = slider.querySelector('.slider-dots');

        let currentIndex = 0;
        let slideInterval;

        // Create dots
        slides.forEach((_, i) => 
        {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = slider.querySelectorAll('.dot');

        function updateSlider() 
        {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function nextSlide() 
        {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() 
        {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function goToSlide(index) 
        {
            currentIndex = index;
            updateSlider();
            resetInterval();
        }

        function resetInterval() 
        {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        resetInterval();
    },

    
    // Initialize Tooltips and Hover Effects  
    initInteractions() 
    {
        // Add tooltips to stat-cards
        document.querySelectorAll('.stat-card').forEach(card => 
        {
            card.addEventListener('mouseenter', (e) => 
            {
                const title = card.querySelector('.text-muted').textContent;
                const value = card.querySelector('h3').textContent;
                this.showTooltip(e, `${title}: ${value}`);
            });
            card.addEventListener('mouseleave', () => this.hideTooltip());
        });
    },

    showTooltip(e, text) 
    {
        let tooltip = document.getElementById('customTooltip');
        if (!tooltip) 
        {
            tooltip = document.createElement('div');
            tooltip.id = 'customTooltip';
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        tooltip.textContent = text;
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.classList.add('show');
    },

    hideTooltip() 
    {
        const tooltip = document.getElementById('customTooltip');
        if (tooltip) tooltip.classList.remove('show');
    },

    
    //  Custom Form Validation
    validateForm(formId) 
    {
        const form = document.getElementById(formId);
        if (!form) return true;

        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => 
        {
            if (!input.value.trim()) 
            {
                input.classList.add('is-invalid');
                isValid = false;
            } 
            
            else 
            {
                input.classList.remove('is-invalid');
            }

            // Email validation
            if (input.type === 'email' && input.value) 
            {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(input.value)) 
                {
                    input.classList.add('is-invalid');
                    isValid = false;
                }
            }

            // Number validation (positive)
            if (input.type === 'number' && input.value < 0) 
            {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) 
        {
            this.showToast('Please correct the highlighted errors.', 'warning');
        }

        return isValid;
    },

    
    // Update navigation state
    updateNav(target) 
    {
        document.querySelectorAll('.nav-link').forEach(link => 
        {
            link.classList.toggle('active', link.getAttribute('data-target') === target);
        });
        document.querySelectorAll('.page').forEach(page => 
        {
            page.classList.toggle('active', page.id === target);
        });
    },

    
    // Render Activity Logs
    renderActivities(filter = 'all') 
    {
        const container = document.getElementById('recentLogs');
        if (!container) return;

        let activities = Activity.getAll();
        if (filter !== 'all') 
        {
            activities = activities.filter(a => a.exercise === filter);
        }

        activities = activities.reverse(); // Newest first

        if (activities.length === 0) 
        {
            container.innerHTML = '<div class="text-center py-4 text-muted"><p>No activities logged yet.</p></div>';
            return;
        }

        container.innerHTML = activities.map(act => `
            <div class="card mb-2 activity-card">
                <div class="card-body d-flex justify-content-between align-items-center py-2">
                    <div>
                        <span class="badge bg-primary me-2">${act.exercise}</span>
                        <strong>${act.date}</strong>: ${act.steps} steps | ${act.calories} cal
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-info edit-activity" data-id="${act.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger delete-activity" data-id="${act.id}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    },


    // Render Goals
    renderGoals() 
    {
        const container = document.getElementById('goalsList');
        if (!container) return;

        const goals = Goals.getAll();

        if (goals.length === 0) 
        {
            container.innerHTML = '<div class="text-center py-4 text-muted"><p>No goals set yet.</p></div>';
            return;
        }

        container.innerHTML = goals.map(goal => 
        {
            const progress = Goals.calculateProgress(goal);
            const color = progress >= 100 ? 'success' : 'primary';
            return `
                <div class="card mb-3 goal-card shadow-sm border-0">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="mb-0">${goal.desc}</h6>
                            <button class="btn-close btn-sm delete-goal" data-id="${goal.id}" style="font-size: 0.7rem;"></button>
                        </div>
                        <div class="d-flex justify-content-between small text-muted mb-1">
                            <span>Target: ${goal.target.toLocaleString()} ${goal.type} ${goal.date ? `<span class="badge bg-light text-dark ms-1">${goal.date}</span>` : ''}</span>
                            <span>${progress}%</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-${color}" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    
    // Update Dashboard Summary
    
    updateSummary() 
    {
        const stats = Activity.getStats();
        document.getElementById('totalSteps').textContent = stats.totalSteps.toLocaleString();
        document.getElementById('totalCalories').textContent = stats.totalCalories.toLocaleString();
        document.getElementById('avgCalories').textContent = stats.avgCalories.toLocaleString();

        const summaryText = stats.count > 0
            ? `You have logged <strong>${stats.count}</strong> activities. Best performance: <strong>${stats.bestDay.steps} steps</strong> on ${stats.bestDay.date}.`
            : "Start logging your activities to see your progress summary here.";

        document.getElementById('statsSummary').innerHTML = summaryText;
    },

    
    // Render Profile Section
    renderProfile() 
    {
        const username = Auth.getCurrentUsername();
        if (!username) return;

        const profile = Storage.getUserData(username, 'profile', null);
        if (!profile) return;

        const stats = Activity.getStats();
        const caloriesPerKg = 7700;
        const startingWeight = parseFloat(profile.weight) || 0;
        const weightLoss = stats.totalCalories / caloriesPerKg;
        const currentWeight = (startingWeight - weightLoss).toFixed(1);

        // Update Health Metrics
        document.getElementById('displayAge').textContent = profile.age || '--';
        document.getElementById('displayHeight').innerHTML = `${profile.height || '--'} <small>cm</small>`;
        document.getElementById('displayWeight').innerHTML = `${currentWeight} <small>kg</small>`;
        document.getElementById('displayTarget').innerHTML = `${profile.targetWeight || '--'} <small>kg</small>`;

        // Update the label to 'Current' and add info
        const weightLabel = document.querySelector('#displayWeight').previousElementSibling;
        if (weightLabel) 
        {
            weightLabel.textContent = 'Current Weight';
            weightLabel.title = `Starting weight: ${startingWeight}kg`;
        }

        // Calculate and Update BMI based on CURRENT weight
        if (profile.height && currentWeight > 0) 
        {
            const heightInMeters = profile.height / 100;
            const bmi = (currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
            document.getElementById('displayBMI').textContent = bmi;

            let status = '';
            let advice = '';
            let color = '';

            if (bmi < 18.5) 
            {
                status = 'Underweight';
                advice = 'Consider increasing your calorie intake with nutrient-dense foods.';
                color = 'var(--info)';
            } 
            
            else if (bmi < 25) 
            {
                status = 'Healthy Weight';
                advice = 'Great job! Maintain your current lifestyle and stay active.';
                color = 'var(--success)';
            } 
            
            else if (bmi < 30) 
            {
                status = 'Overweight';
                advice = 'Focus on a balanced diet and regular aerobic exercise.';
                color = 'var(--warning)';
            } 
            
            else
            {
                status = 'Obese';
                advice = 'Consult with a healthcare provider for a personalized plan.';
                color = 'var(--danger)';
            }

            document.getElementById('bmiStatus').textContent = status;
            document.getElementById('bmiStatus').style.color = color;
            document.getElementById('bmiAdvice').textContent = advice;
            document.querySelector('.bmi-gauge').style.background = color;
        }

        // Set edit form values
        const ageInput = document.getElementById('setupAge');
        const hInput = document.getElementById('setupHeight');
        const wInput = document.getElementById('setupWeight');
        const tInput = document.getElementById('setupTargetWeight');

        if (ageInput) ageInput.value = profile.age || '';
        if (hInput) hInput.value = profile.height || '';
        if (wInput) wInput.value = profile.weight || '';
        if (tInput) tInput.value = profile.targetWeight || '';
    },

    
    // Export User Data to PDF
    exportToPDF() 
    {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const username = Auth.getCurrentUsername();
        const profile = Storage.getUserData(username, 'profile', {});
        const stats = Activity.getStats();
        const activities = Activity.getAll().reverse().slice(0, 10);

        // Styling & Colors
        const primaryColor = [99, 102, 241];
        const secondaryColor = [100, 116, 139];

        // Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('FitTrack Pro Health Report', 20, 25);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

        // User Info Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('User Information', 20, 55);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 57, 190, 57);

        doc.setFontSize(11);
        doc.setTextColor(...secondaryColor);
        doc.text(`Username: ${username}`, 20, 65);
        doc.text(`Member Since: ${document.getElementById('memberSince')?.textContent || '2024'}`, 120, 65);

        // Health Bio-metrics
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('Health Bio-metrics', 20, 80);
        doc.line(20, 82, 190, 82);

        doc.setFontSize(11);
        doc.setTextColor(...secondaryColor);
        doc.text(`Age: ${profile.age || '--'}`, 25, 90);
        doc.text(`Height: ${profile.height || '--'} cm`, 75, 90);
        doc.text(`Weight: ${profile.weight || '--'} kg`, 125, 90);
        doc.text(`Target: ${profile.targetWeight || '--'} kg`, 165, 90);

        // BMI Section
        const bmi = document.getElementById('displayBMI')?.textContent || '--';
        const status = document.getElementById('bmiStatus')?.textContent || 'Incomplete';
        doc.setFillColor(248, 250, 252);
        doc.rect(20, 98, 170, 20, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text(`Body Mass Index (BMI): ${bmi}`, 25, 110);
        doc.text(`Status: ${status}`, 120, 110);

        // Activity Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('Activity Summary', 20, 135);
        doc.line(20, 137, 190, 137);

        doc.setFontSize(11);
        doc.text(`Total Steps: ${stats.totalSteps.toLocaleString()}`, 25, 145);
        doc.text(`Total Calories: ${stats.totalCalories.toLocaleString()}`, 75, 145);
        doc.text(`Avg. Calories: ${stats.avgCalories.toLocaleString()}`, 125, 145);

        // Recent Logs Table
        doc.setFontSize(12);
        doc.text('Recent Logs (Last 10)', 20, 160);
        doc.setFontSize(10);
        doc.setFillColor(241, 245, 249);
        doc.rect(20, 165, 170, 8, 'F');
        doc.text('Date', 25, 171);
        doc.text('Type', 70, 171);
        doc.text('Steps', 110, 171);
        doc.text('Calories', 150, 171);

        let y = 179;
        activities.forEach((act, i) => 
        {
            if (i % 2 === 0) 
            {
                doc.setFillColor(252, 252, 252);
                doc.rect(20, y - 5, 170, 8, 'F');
            }
            doc.text(act.date, 25, y);
            doc.text(act.exercise, 70, y);
            doc.text(act.steps.toString(), 110, y);
            doc.text(act.calories.toString(), 150, y);
            y += 8;
        });

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) 
        {
            doc.setPage(i);
            doc.text('FitTrack Pro — Your Personal Health & Fitness Companion', 105, 285, { align: 'center' });
        }

        doc.save(`fittrack-report-${username}.pdf`);
    }
};
