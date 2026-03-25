<?php
// api/delete_post.php  -  Delete a Community Post
// FitTrack Pro | Phase 3
// POST  { id }

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Allow only POST request
requireMethod('POST');

// Check user authentication
$userId = requireAuth();

// Get request data
$data = getJsonBody();
$postId = isset($data['id']) ? (int)$data['id'] : 0;

// Validate post ID
if ($postId <= 0) 
{
    jsonResponse
    (
        false, 
        'Please provide a valid Post ID', 
        [], 
        400
    );
}

// Get database connection
$db = getDB();

// Delete only if the post belongs to the logged-in user
$sql = "DELETE FROM posts WHERE id = ? AND user_id = ?";
$stmt = $db->prepare($sql);
$stmt->execute([$postId, $userId]);

// Check if deletion was successful
if ($stmt->rowCount() == 0) 
{
    jsonResponse
    (
        false, 
        'Post not found or you cannot delete this post', 
        [], 
        403
    );
}

jsonResponse
(
    true, 
    'Post deleted successfully'  // Success response
);
