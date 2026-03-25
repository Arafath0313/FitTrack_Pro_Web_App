<?php
// contact.php  -  Contact Form Handler
// FitTrack Pro | Phase 3
// POST  { name, email, message }

session_start();

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/functions.php';

requireMethod('POST');

$body    = getJsonBody();
$name    = sanitize($body['name']    ?? ($_POST['name']    ?? ''));
$email   = sanitize($body['email']   ?? ($_POST['email']   ?? ''));
$message = sanitize($body['message'] ?? ($_POST['message'] ?? ''));

if (!$name || !$email || !$message) 
{
    jsonResponse
    (
        false, 
        'Name, email, and message are all required.', 
        [], 
        400
    );
}

if (!isValidEmail($email)) 
{
    jsonResponse
    (
        false, 
        'Please enter a valid email address.', 
        [], 
        400
    );
}

$db   = getDB();
$stmt = $db->prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
$stmt->execute([$name, $email, $message]);

jsonResponse
(
    true, 
    'Message sent! We will get back to you soon.'
);
