<?php
// api/get_goals.php  -  Fetch All Goals for Current User
// FitTrack Pro | Phase 3
// GET

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Allow only GET request
requireMethod('GET');

// Check user authentication
$userId = requireAuth();

// Connect to database
$db = getDB();

// SQL query to get user goals (latest first)
$sql = "SELECT 
            id, 
            description AS `desc`, 
            target_value AS target, 
            goal_type AS type, 
            DATE_FORMAT(created_at, '%Y-%m-%d') AS date 
        FROM goals 
        WHERE user_id = ? 
        ORDER BY id DESC";

$stmt = $db->prepare($sql);
$stmt->execute([$userId]);

$goals = $stmt->fetchAll();

// Convert numeric values (for proper use in JavaScript)
foreach ($goals as &$goal) 
{
    $goal['id'] = (int) $goal['id'];
    $goal['target'] = (int) $goal['target'];
}

// Send response
jsonResponse
(
    true, 
    'Goals loaded successfully', 
    ['goals' => $goals]
);