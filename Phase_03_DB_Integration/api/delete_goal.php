<?php
// api/delete_goal.php  -  Delete a Goal
// FitTrack Pro | Phase 3
// POST  { id }

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Only allow POST request
requireMethod('POST');

// Check if user is logged in
$userId = requireAuth();

// Get JSON data from request
$data = getJsonBody();
$goalId = isset($data['id']) ? (int)$data['id'] : 0;

// Check if goal ID is provided
if ($goalId <= 0) 
{
    jsonResponse
    (
        false, 
        'Please provide a valid Goal ID', 
        [], 
        400
    );
}

// Connect to database
$db = getDB();

// Prepare delete query
$sql = "DELETE FROM goals WHERE id = ? AND user_id = ?";
$stmt = $db->prepare($sql);

// Execute query
$stmt->execute([$goalId, $userId]);

// Check if any row was deleted
if ($stmt->rowCount() == 0) 
{
    jsonResponse
    (
        false, 
        'Goal not found or you do not have permission', 
        [], 
        404
    );
}

jsonResponse
(
    true, 
    'Goal deleted successfully' // Success message
);