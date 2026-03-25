<?php
// auth/register.php  -  User Registration Endpoint (Username + Password)

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

requireMethod('POST');

// Accept JSON or form-data
$body     = getJsonBody();
$username = sanitize($body['username'] ?? ($_POST['username'] ?? ''));
$password = $body['password'] ?? ($_POST['password'] ?? '');

// --- Validation ---
if (!$username || !$password) 
{
    jsonResponse
    (
        false, 
        'Both username and password are required.', 
        [], 
        400
    );
}

if (strlen($username) < 3 || strlen($username) > 50) 
{
    jsonResponse
    (
        false, 
        'Username must be between 3 and 50 characters.', 
        [], 
        400
    );
}

if (strlen($password) < 6) 
{
    jsonResponse
    (
        false, 
        'Password must be at least 6 characters.', 
        [],
        400
    );
}

// Database Insert
$db = getDB();

// Check for existing username
$stmt = $db->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
if ($stmt->fetch()) 
{
    jsonResponse
    (
        false, 
        'Username already exists. Please try logging in.', 
        [], 
        409
    );
}

$hashed = hashPassword($password);

// Insert without email
$stmt = $db->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
$stmt->execute([$username, $hashed]);
$userId = (int) $db->lastInsertId();

// Start session for the new user
$_SESSION['user_id']  = $userId;
$_SESSION['username'] = $username;

jsonResponse
(
    true, 
    'Account created successfully! Please complete your profile.', 
    [
        'user_id'  => $userId,
        'username' => $username,
    ]
);
