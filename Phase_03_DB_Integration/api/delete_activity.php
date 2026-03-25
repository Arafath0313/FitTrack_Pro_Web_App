<?php
// api/delete_activity.php  - Delete an activity
// FitTrack Pro | Phase 3
// Method: POST  |  Input: { "id": activity_id }

// Start session to use user info
session_start();

// Connect to database
require_once __DIR__ . '/../includes/db.php'; 

// Include helper functions
require_once __DIR__ . '/../includes/functions.php'; 

// Only allow POST requests
requireMethod('POST'); 

// Make sure user is logged in
$userId = requireAuth(); 

// Get JSON data sent by client
$body = getJsonBody(); 

// Get activity ID, default 0 if not set
$id   = (int) ($body['id'] ?? 0); 

if (!$id) 
{
    
    jsonResponse
    (
        false, 
        'Please provide activity ID.',  // Error if no ID
        [], 
        400
    ); 
}

// Get database connection
$db = getDB(); 

// Delete activity for this user
$stmt = $db->prepare('DELETE FROM activities WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $userId]);

if ($stmt->rowCount() === 0) 
{
    
    jsonResponse
    (
        false, 
        'Activity not found or you cannot delete it.',  // Error if not found
        [], 
        404
    ); 
}

jsonResponse
(
    true, 
    'Activity deleted successfully.'   // Success message
); 