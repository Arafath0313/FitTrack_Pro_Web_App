<?php
// auth/login.php  -  User Login Endpoint


session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

requireMethod('POST');

$body     = getJsonBody();
$username = sanitize($body['username'] ?? ($_POST['username'] ?? ''));
$password = $body['password'] ?? ($_POST['password'] ?? '');

if (!$username || !$password) 
{
    jsonResponse
    (
        false, 
        'Username and password are required.', 
        [],
        400
    );
}

$db   = getDB();
$stmt = $db->prepare('SELECT id, username, password FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !verifyPassword($password, $user['password'])) 
{
    jsonResponse
    (
        false, 
        'Invalid username or password. Please try again.', 
        [], 
        401
    );
}

// --- Session Start ---
$_SESSION['user_id']  = (int) $user['id'];
$_SESSION['username'] = $user['username'];

// Check if the user already has a profile
$stmt = $db->prepare('SELECT id FROM profiles WHERE user_id = ? LIMIT 1');
$stmt->execute([$user['id']]);
$hasProfile = $stmt->fetch() ? true : false;

jsonResponse
(
    true, 
    'Login successful.', 
    [
        'user_id'     => (int) $user['id'],
        'username'    => $user['username'],
        'has_profile' => $hasProfile,
    ]
);
