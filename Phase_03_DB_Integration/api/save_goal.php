<?php
// api/save_goal.php  -  Create a New Goal
// FitTrack Pro | Phase 3
// POST  { desc, target, type }

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Only allow POST requests
requireMethod('POST');

// Check if user is logged in
$userId = requireAuth();

// Get JSON data from request
$data = getJsonBody();
$desc = sanitize($data['desc'] ?? '');
$target = isset($data['target']) ? (int)$data['target'] : 0;
$type = sanitize($data['type'] ?? 'steps');

// Validate input
if (!$desc || $target <= 0 || !in_array($type, ['steps', 'calories'], true)) 
{
    jsonResponse
    (
        false, 
        'Description, target value, and a valid type (steps/calories) are required', 
        [], 
        400
    );
}

// Connect to database
$db = getDB();

// Insert new goal
$sql = "INSERT INTO goals (user_id, description, target_value, goal_type) VALUES (?, ?, ?, ?)";
$stmt = $db->prepare($sql);
$stmt->execute([$userId, $desc, $target, $type]);

// Get the new goal ID
$newId = (int)$db->lastInsertId();

// Send response
jsonResponse
(
    true, 
    'Goal created successfully', 
    ['id' => $newId]
);