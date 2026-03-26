# FitTrack Pro – Fitness Tracker Web Application

**ICT 2204 – Web Design and Technologies**
**Mini Project – Phase 03 (PHP & MySQL Integration)**


## Project Overview

FitTrack Pro is a full-stack fitness tracker web application developed using HTML, CSS, JavaScript, PHP, and MySQL. The main objective of this project is to develop an interactive web application with proper frontend and backend integration. The system allows users to register, log in, manage their profile, track workouts, create community posts, and send messages through a contact form. The application uses session management for authentication and stores all data in a MySQL database. This project demonstrates PHP and MySQL integration, user authentication, CRUD operations, database connectivity, form handling, and responsive web design.


---

## Features

* **User Registration:** Users can create an account securely with encrypted passwords using password hashing.
* **User Login & Logout:** Users can log in and log out securely using session management.
* **User Dashboard:** Logged-in users can access a personal dashboard to manage their activities.
* **Profile Management:** Users can add and update personal details such as age, height, weight, and target weight.
* **Workout Tracking:** Users can record workouts including activity, duration, and calories burned.
* **Community Post System:** Users can create and view community posts to share fitness information.
* **Contact Form:** Users can send messages through the contact form and data is stored in the database.
* **Responsive Web Design:** The website is compatible with desktop and mobile devices.
* **Form Validation:** JavaScript and PHP validation are used to prevent invalid data submission.
* **MySQL Database Integration:** All user data is stored and managed using a MySQL database.

---

## Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** PHP
* **Database:** MySQL
* **Server Environment:** XAMPP
* **Database Management:** phpMyAdmin
* **Version Control:** GitHub

### Tools & Components

* JavaScript ES6 Modules
* Fetch API (for API requests)
* PHP Sessions (for authentication)
* MySQL Database Connectivity

---

## Folder Structure

FitTrack Pro/ 
    │── Phase_02_Front-end/
    └── Phase_03_DB_Integration/
        │── css/                  # Stylesheets for the website
        │   └── styles.css        # Main CSS file for layout and design
        │── js/                   # JavaScript files for frontend functionality
        │── images/               # Images and profile photos used in the project
        │── includes/             # Core backend utilities
        │   ├── db.php            # Database connection setup
        │   └── functions.php     # Helper functions (e.g., input validation)
        │── api/                        # Backend API endpoints for CRUD operations
        │   ├── delete_activity.php  # Delete a specific workout/activity from the database
        │   ├── delete_goal.php      # Delete a specific fitness goal from the database
        │   ├── delete_post.php      # Delete a specific community post from the database
        │   ├── get_activities.php   # Fetch all workouts/activities of a user from the database
        │   ├── get_goals.php        # Fetch all fitness goals of a user from the database
        │   ├── get_post.php         # Fetch a specific post from the database
        │   ├── get_profile.php      # Fetch user profile data from the database
        │   ├── save_activity.php    # Save a new workout/activity to the database
        │   ├── save_goal.php        # Save or update a fitness goal in the database
        │   ├── save_post.php        # Save a new community post to the database
        │   └── save_profile.php     # Save or update user profile information in the database
        │── auth/                 # Authentication logic
        │   ├── register.php      # User registration
        │   ├── login.php         # User login
        │   └── logout.php        # User logout
        │── contact.php           # Contact form page to submit messages
        │── index.php             # Main landing page of the website
        │── dashboard.php         # User dashboard (only accessible after login)
        │── README.md             # Project documentation and instructions
        └── database.sql          # MySQL database schema and initial setup

---

## Database Setup Instructions

1. Open **phpMyAdmin**
2. Create a new database named: `fitness_tracker`
3. Click **Import**
4. Select the file `database.sql`
5. Click **Go**
6. The database tables will be created automatically.

---

## How to Run the Project (Using XAMPP)

1. Install **XAMPP**
2. Start **Apache** and **MySQL**
3. Copy the project folder into: `C:\xampp\htdocs\`
4. Open your web browser and go to: `http://localhost/2204_Phase_03/2204-phase3-sample/`
5. Register a new user account and login to the system.

---

## Database Schema

The project uses the following tables:
* `users`: Stores user credentials and account creation dates.
* `profiles`: Stores biometric data, target weights, and profile photo paths.
* `activities`: Logs daily fitness activities (steps, calories, exercise type).
* `goals`: Stores user-defined fitness targets.
* `posts`: Stores community feed content.
* `messages`: Stores technical support messages.

---

## User Authentication

* Passwords are securely stored using `password_hash()`
* Login verification using `password_verify()`
* Sessions are used to manage user login
* Unauthorized users cannot access the dashboard page

---

## Contact Form

Users can send messages through the contact form. Messages are stored in the **messages** table in the database.

---

## Submission Includes

* All project files (HTML, CSS, JavaScript, PHP)
* `database.sql` file
* `README.md` file
* Proper folder structure

---

## Author

**Students:** Mohamed Arafath (ICT/2023/142) · Inun Nooriyya (ICT/2023/112) · Musthak (ICT/2023/074)  
**University:** Rajarata University of Sri Lanka

---

## GitHub Repository Link

`https://github.com/Arafath0313/FitTrack_Pro_Web_App.git`










