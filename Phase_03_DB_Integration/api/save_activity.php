<?php
// api/save_activity.php  -  Log a New Activity
// FitTrack Pro | Phase 3
// POST  { date, steps, calories, exercise }

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Only allow POST request
requireMethod('POST');

// Check if user is logged in
$userId = requireAuth();

// Get JSON data from request
$data = getJsonBody();
$date = sanitize($data['date'] ?? '');
$steps = isset($data['steps']) ? (int)$data['steps'] : 0;
$calories = isset($data['calories']) ? (int)$data['calories'] : 0;
$exercise = sanitize($data['exercise'] ?? 'Other');

// Validate required fields
if (!$date || $steps < 0 || $calories < 0) 
{
    jsonResponse
    (
        false, 
        'Date, steps, and calories are required', 
        [], 
        400
    );
}

// Connect to database
$db = getDB();

// Insert new activity
$sql = "INSERT INTO activities (user_id, date, steps, calories, exercise_type) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $db->prepare($sql);
$stmt->execute([$userId, $date, $steps, $calories, $exercise]);

// Get the new activity ID
$newId = (int)$db->lastInsertId();

// Send response
jsonResponse
(
    true, 
    'Activity logged successfully', 
    ['id' => $newId]
);