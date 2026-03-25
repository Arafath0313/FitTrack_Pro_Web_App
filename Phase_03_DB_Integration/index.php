<?php
// index.php  -  Main Application Entry Point (Root)
// FitTrack Pro | Phase 3
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitTrack Pro | Advanced Fitness Tracker</title>
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <!-- EmailJS SDK -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script type="text/javascript">
        (function () 
        {
            emailjs.init({
                publicKey: "TOpmZ1ajSMAtcDsEg",
            });
        })();
    </script>
</head>

<body>
    <div id="authSection" class="auth-container">
        <div class="auth-card">
            <div class="text-center mb-4">
                <i class="bi bi-heart-pulse-fill"
                    style="font-size:2.5rem;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;"></i>
                <h2 class="mt-2 mb-1" style="font-size:1.5rem;">FitTrack Pro</h2>
                <p class="text-muted small mb-0">Your personal fitness companion</p>
            </div>
            <form id="authForm">
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" id="username" class="form-control" placeholder="Enter username" required>
                </div>
                <div class="mb-4">
                    <label class="form-label">Password</label>
                    <input type="password" id="password" class="form-control" placeholder="Enter password" required>
                </div>
                <div class="d-grid gap-2">
                    <button type="submit" id="loginBtn" class="btn btn-primary">Login</button>
                    <button type="button" id="signupBtn" class="btn btn-outline-secondary">Create Account</button>
                </div>
            </form>
        </div>
    </div>


    <!-- Setup Section -->
    <div id="setupSection" style="display:none;" class="auth-container">
        <div class="auth-card">
            <div class="text-center mb-4">
                <i class="bi bi-person-gear" style="font-size:2.5rem; color:var(--primary);"></i>
                <h2 class="mt-2 mb-1" style="font-size:1.5rem;">Complete Your Profile</h2>
                <p class="text-muted small mb-0">Help us personalize your fitness journey</p>
            </div>
            <form id="setupForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Age</label>
                        <input type="number" id="setupAge" class="form-control" placeholder="Years" required min="1">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Height (cm)</label>
                        <input type="number" id="setupHeight" class="form-control" placeholder="cm" required min="50">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Weight (kg)</label>
                        <input type="number" id="setupWeight" class="form-control" placeholder="kg" required min="10">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Target Weight (kg)</label>
                        <input type="number" id="setupTargetWeight" class="form-control" placeholder="kg" required
                            min="10">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Profile Picture (Optional)</label>
                    <input type="file" id="setupPhoto" class="form-control" accept="image/*">
                </div>
                <div class="d-grid gap-2 mt-2">
                    <button type="submit" class="btn btn-primary">Start My Journey</button>
                </div>
            </form>
        </div>
    </div>


    <!-- Main App Content -->
    <div id="mainContent" style="display:none;" class="wrapper">
        <!-- Sidebar -->
        <nav id="sidebar" class="sidebar shadow">
            <div class="sidebar-header">
                <h3><i class="bi bi-lightning-charge-fill"></i> FitTrack</h3>
            </div>
            <ul class="list-unstyled components">
                <li><a href="#home" class="nav-link js-scroll" data-target="home"><i class="bi bi-speedometer2"></i>
                        Dashboard</a>
                </li>
                <li><a href="#activities" class="nav-link js-scroll" data-target="activities"><i
                            class="bi bi-list-check"></i>
                        Activities</a></li>
                <li><a href="#goals" class="nav-link js-scroll" data-target="goals"><i class="bi bi-trophy"></i>
                        Goals</a></li>
                <li><a href="#progress" class="nav-link js-scroll" data-target="progress"><i
                            class="bi bi-graph-up-arrow"></i>
                        Progress</a></li>
                <li><a href="#community" class="nav-link js-scroll" data-target="community"><i class="bi bi-people"></i>
                        Community</a></li>
                <li><a href="#profile" class="nav-link js-scroll" data-target="profile"><i
                            class="bi bi-person-circle"></i>
                        Profile</a></li>
                <li><a href="#contact" class="nav-link js-scroll" data-target="contact"><i class="bi bi-envelope"></i>
                        Support</a>
                </li>
            </ul>
            <div class="sidebar-footer p-3 mt-auto">
                <button id="logoutBtn" class="btn btn-sm btn-danger w-100"><i class="bi bi-box-arrow-left"></i>
                    Logout</button>
            </div>
        </nav>


        <!-- Page Content -->
        <main id="content" class="content-area">
            <div class="container-fluid p-4">
                <!-- Dashboard -->
                <section id="home" class="page active">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Personal Dashboard</h2>
                        <span id="currentDate" class="text-muted small"></span>
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-12">
                            <div id="motivationSlider" class="slider-container shadow-sm rounded">
                                <div class="slider-wrapper">
                                    <div class="slider-slide active">
                                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                                            alt="Motivation 1">
                                        <div class="slider-caption">Push yourself, because no one else is going to
                                            do it
                                            for you.</div>
                                    </div>
                                    <div class="slider-slide">
                                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
                                            alt="Motivation 2">
                                        <div class="slider-caption">Success starts with self-discipline.</div>
                                    </div>
                                    <div class="slider-slide">
                                        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                                            alt="Motivation 3">
                                        <div class="slider-caption">Your health is an investment, not an expense.
                                        </div>
                                    </div>
                                </div>
                                <button class="slider-btn prev"><i class="bi bi-chevron-left"></i></button>
                                <button class="slider-btn next"><i class="bi bi-chevron-right"></i></button>
                                <div class="slider-dots"></div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-icon bg-primary-soft text-primary"><i class="bi bi-activity"></i>
                                </div>
                                <div><small class="text-muted">Total Steps</small>
                                    <h3 id="totalSteps">0</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-icon bg-success-soft text-success"><i class="bi bi-fire"></i></div>
                                <div><small class="text-muted">Calories Burned</small>
                                    <h3 id="totalCalories">0</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-icon bg-warning-soft text-warning"><i class="bi bi-calendar-check"></i>
                                </div>
                                <div><small class="text-muted">Daily Avg</small>
                                    <h3 id="avgCalories">0</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-lg-8">
                            <div class="card border-0 shadow-sm h-100">
                                <div
                                    class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-4 px-4">
                                    <h5 class="mb-0">Recent Trends</h5>
                                    <div><canvas id="stepsChart" style="display: none;"></canvas></div>
                                    <!-- Hidden but element exists for consistency -->
                                    <div class="chart-container" style="position: relative; height:300px; width:100%">
                                        <canvas id="weeklyStepsChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="card border-0 shadow-sm h-100">
                                <div class="card-header bg-transparent border-0 pt-4 px-4">
                                    <h5 class="mb-0">Quick Actions</h5>
                                </div>
                                <div class="card-body px-4">
                                    <form id="activityForm">
                                        <div class="mb-2"><label class="form-label small">Date</label><input type="date"
                                                id="date" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="mb-2"><label class="form-label small">Steps</label><input
                                                type="number" id="steps" class="form-control form-control-sm" min="0"
                                                required></div>
                                        <div class="mb-2"><label class="form-label small">Calories</label><input
                                                type="number" id="calories" class="form-control form-control-sm" min="0"
                                                required></div>
                                        <div class="mb-3"><label class="form-label small">Exercise</label><select
                                                id="exercise" class="form-select form-select-sm" required>
                                                <option value="">Select Type</option>
                                                <option value="Running">Running</option>
                                                <option value="Walking">Walking</option>
                                                <option value="Cycling">Cycling</option>
                                                <option value="Swimming">Swimming</option>
                                                <option value="Other">Other</option>
                                            </select></div>
                                        <button type="submit" class="btn btn-primary btn-sm w-100 mb-2">Log
                                            Activity</button>
                                        <button type="button" id="resetData"
                                            class="btn btn-outline-danger btn-sm w-100">Reset Data</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Activity Log Page -->
                <section id="activities" class="page">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Activity Logs</h2>
                        <select id="filterExercise" class="form-select form-select-sm w-auto">
                            <option value="all">All Exercises</option>
                            <option value="Running">Running</option>
                            <option value="Walking">Walking</option>
                            <option value="Cycling">Cycling</option>
                            <option value="Swimming">Swimming</option>
                        </select>
                    </div>
                    <div id="recentLogs" class="activity-list"></div>
                </section>

                <!-- Goals Page -->
                <section id="goals" class="page">
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-transparent pt-4 px-4">
                                    <h5>Set New Goal</h5>
                                </div>
                                <div class="card-body">
                                    <form id="goalForm">
                                        <div class="mb-3"><input type="text" id="goalDesc" class="form-control"
                                                placeholder="e.g., Target Weight Loss" required></div>
                                        <div class="mb-3"><input type="number" id="goalTarget" class="form-control"
                                                placeholder="Target Value" min="1" required></div>
                                        <div class="mb-3"><select id="goalType" class="form-select" required>
                                                <option value="steps">Steps</option>
                                                <option value="calories">Calories</option>
                                            </select></div>
                                        <button type="submit" class="btn btn-success w-100">Create Goal</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div id="goalsList" class="goals-container"></div>
                        </div>
                    </div>
                </section>

                <!-- Progress Page -->
                <section id="progress" class="page">
                    <h2>Insights & Trends</h2>
                    <div class="row g-4 mt-2">
                        <div class="col-lg-6">
                            <div class="card border-0 shadow-sm p-4">
                                <h5>Monthly Calorie Burn</h5>
                                <div class="chart-container" style="position: relative; height:300px; width:100%">
                                    <canvas id="monthlyCaloriesChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card border-0 shadow-sm p-4">
                                <h5>Performance Summary</h5>
                                <p id="statsSummary" class="mt-3"></p>
                                <hr>
                                <h6>Daily Tips</h6>
                                <p class="small text-muted italic">"Consistency is key. Small steps every day lead
                                    to
                                    big results."</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Community Page -->
                <section id="community" class="page">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="card border-0 shadow-sm p-4 mb-4">
                                <h5>Share Your Progress</h5>
                                <form id="postForm" class="mt-3">
                                    <textarea id="postContent" class="form-control mb-3"
                                        placeholder="How was your workout today?" rows="3" required></textarea>
                                    <button type="submit" class="btn btn-info text-white">Share Post</button>
                                </form>
                            </div>
                            <div id="postsList"></div>
                        </div>
                    </div>
                </section>

                <!-- Profile Page -->
                <section id="profile" class="page">
                    <div class="row g-4">
                        <div class="col-lg-4">
                            <div class="card border-0 shadow-sm p-4 text-center profile-main-card">
                                <div class="profile-img-container mb-3">
                                    <img id="profileImg" src="https://via.placeholder.com/150" alt="Profile"
                                        class="rounded-circle shadow-sm" width="120" height="120">
                                    <label for="profilePic" class="btn btn-sm btn-primary rounded-circle edit-pic-btn">
                                        <i class="bi bi-camera"></i>
                                    </label>
                                    <input type="file" id="profilePic" class="d-none" accept="image/*">
                                </div>
                                <h4 id="profileUsername" class="mb-1">User</h4>
                                <p class="text-muted small mb-4" id="memberSince">Member since 2024</p>

                                <div class="d-grid gap-2">
                                    <button id="toggleDarkMode" class="btn btn-outline-primary btn-sm">
                                        <i class="bi bi-moon-stars"></i> Dark Mode
                                    </button>
                                    <button id="exportData" class="btn btn-outline-secondary btn-sm">
                                        <i class="bi bi-file-earmark-pdf"></i> Export PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div class="card border-0 shadow-sm p-4 mb-4">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h5 class="mb-0">Health Bio-metrics</h5>
                                    <button class="btn btn-sm btn-light" id="editProfileBtn"><i
                                            class="bi bi-pencil-square"></i> Update</button>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-6 col-xl-3">
                                        <div class="metric-card">
                                            <div class="metric-icon bg-info-soft text-info"><i
                                                    class="bi bi-calendar-event"></i></div>
                                            <div class="metric-info">
                                                <small class="text-muted">Age</small>
                                                <h4 id="displayAge">--</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xl-3">
                                        <div class="metric-card">
                                            <div class="metric-icon bg-primary-soft text-primary"><i
                                                    class="bi bi-arrows-expand"></i></div>
                                            <div class="metric-info">
                                                <small class="text-muted">Height</small>
                                                <h4 id="displayHeight">-- <small>cm</small></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xl-3">
                                        <div class="metric-card">
                                            <div class="metric-icon bg-success-soft text-success"><i
                                                    class="bi bi-speedometer"></i></div>
                                            <div class="metric-info">
                                                <small class="text-muted">Weight</small>
                                                <h4 id="displayWeight">-- <small>kg</small></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xl-3">
                                        <div class="metric-card">
                                            <div class="metric-icon bg-danger-soft text-danger"><i
                                                    class="bi bi-bullseye"></i></div>
                                            <div class="metric-info">
                                                <small class="text-muted">Target</small>
                                                <h4 id="displayTarget">-- <small>kg</small></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card border-0 shadow-sm p-4">
                                <h5>Body Mass Index (BMI)</h5>
                                <div class="d-flex align-items-center gap-4 mt-3 bmi-gauge-container">
                                    <div class="bmi-gauge">
                                        <span id="displayBMI">--</span>
                                    </div>

                                    <div>
                                        <h6 id="bmiStatus" class="mb-1">Incomplete Profile</h6>
                                        <p class="text-muted small mb-0" id="bmiAdvice">Complete your profile to see
                                            your health status.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact Page -->
                <section id="contact" class="page">
                    <div class="card border-0 shadow-sm p-4 max-w-600 mx-auto">
                        <h2 class="mb-4">Get in Touch</h2>
                        <form id="contactForm">
                            <div class="mb-3"><input type="text" id="contactName" class="form-control"
                                    placeholder="Your Name" required></div>
                            <div class="mb-3"><input type="email" id="contactEmail" class="form-control"
                                    placeholder="Your Email" required></div>
                            <div class="mb-3"><textarea id="contactMessage" class="form-control" rows="4"
                                    placeholder="How can we help?" required></textarea></div>
                            <button type="submit" class="btn btn-success px-4">Send Message</button>
                        </form>
                    </div>
                </section>

            </div>

            <!-- Footer -->
            <footer class="footer-custom py-4 mt-auto">
            <div class="container">
                <div class="row align-items-center">

                <!-- Left Section -->
                <div class="col-md-6 mb-3 mb-md-0">
                    <h5><i class="bi bi-heart-pulse-fill"></i> FitTrack Pro</h5>
                    <p class="small mb-0">
                    Track your fitness activities and stay healthy.
                    </p>
                </div>

                <!-- Social Media -->
                <div class="col-md-6 text-md-end">
                    <h6>Follow Us</h6>
                    <a href=" https://www.facebook.com/share/1BL9L33zLY/" class="me-3 fs-4"><i class="bi bi-facebook"></i></a>
                    <a href="https://x.com/MHD_Arafath0313" class="me-3 fs-4"><i class="bi bi-x-circle-fill"></i></a>
                    <a href=" https://github.com/Arafath0313" class="fs-4"><i class="bi bi-github"></i></a>
                </div>


                <hr>

                <div class="text-center small">
                © 2024 FitTrack Pro. All rights reserved.
                </div>

            </div>
            </footer>
 
        </main>

       
    </div>

    <!-- Modals & Toasts -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer"></div>

    <div class="modal fade" id="confirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-0">
                    <h5 class="modal-title">Confirm Action</h5><button type="button" class="btn-close"
                        data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">Are you sure?</div>
                <div class="modal-footer border-0"><button type="button" class="btn btn-light btn-sm"
                        data-bs-dismiss="modal">Cancel</button><button type="button" id="confirmModalBtn"
                        class="btn btn-danger btn-sm">Confirm</button></div>
            </div>
        </div>
    </div>

    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script type="module" src="app.js"></script>
    
</body>

</html>
