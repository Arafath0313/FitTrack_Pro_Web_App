<?php
// api/get_posts.php  -  Fetch All Community Posts
// FitTrack Pro | Phase 3
// GET

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

requireMethod('GET');
requireAuth();

// Connect to DB
$db = getDB();

// Fetch posts with author info and profile photo
$sql = "
    SELECT 
        p.id, 
        p.content, 
        DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i') AS date,
        u.username AS author,
        pr.profile_photo AS profile_photo
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN profiles pr ON pr.user_id = u.id
    ORDER BY p.id DESC
    LIMIT 100
";

$stmt = $db->query($sql);
$posts = $stmt->fetchAll();

$defaultPhoto = 'images/default.png';

foreach ($posts as &$post) 
{
    $post['profile_photo'] = !empty($post['profile_photo']) 
                     ? ltrim($post['profile_photo'], '/') 
                     : $defaultPhoto;
}

// Send JSON response
jsonResponse
(
    true, 
    'Posts loaded successfully', 
    ['posts' => $posts]
);