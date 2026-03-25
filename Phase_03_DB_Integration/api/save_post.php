<?php
// api/save_post.php  -  Create a Community Post
// FitTrack Pro | Phase 3
// POST  { content }

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Only allow POST requests
requireMethod('POST');

// Check if user is logged in
$userId = requireAuth();

// Get JSON data from request
$data = getJsonBody();
$content = sanitize($data['content'] ?? '');

// Validate input
if (!$content) 
{
    jsonResponse
    (
        false, 
        'Post content cannot be empty', 
        [], 
        400
    );
}

// Connect to database
$db = getDB();

// Insert new post
$sql = "INSERT INTO posts (user_id, content) VALUES (?, ?)";
$stmt = $db->prepare($sql);
$stmt->execute([$userId, $content]);

// Get the new post ID
$newId = (int)$db->lastInsertId();

// Send response
jsonResponse
(
    true, 
    'Post shared with the community successfully', 
    ['id' => $newId]
);