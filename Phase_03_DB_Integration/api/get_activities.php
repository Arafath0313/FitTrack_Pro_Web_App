<?php
// api/get_activities.php  -  Fetch All Activities for User
// FitTrack Pro | Phase 3
// GET

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Allow only GET request
requireMethod('GET');

// Check if user is logged in
$userId = requireAuth();

// Connect to database
$db = getDB();

// Get all activities for the user (latest first)
$sql = "SELECT id, date, steps, calories, exercise_type AS exercise 
        FROM activities 
        WHERE user_id = ? 
        ORDER BY date DESC, id DESC";

$stmt = $db->prepare($sql);
$stmt->execute([$userId]);

$activities = $stmt->fetchAll();

// Convert numeric values (important for JavaScript)
foreach ($activities as &$activity) 
{
    $activity['id'] = (int) $activity['id'];
    $activity['steps'] = (int) $activity['steps'];
    $activity['calories'] = (int) $activity['calories'];
}

// Send response
jsonResponse
(
    true, 
    'Activities loaded successfully', 
    ['activities' => $activities]
);