<?php
// api/get_profile.php  -  Fetch Current User's Profile
// FitTrack Pro | Phase 3
// GET

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

requireMethod('GET');
$userId = requireAuth();

$db = getDB();

// Fetch profile
$stmt = $db->prepare
('
    SELECT 
        age, 
        height_cm AS height, 
        weight_kg AS weight, 
        target_weight_kg AS targetWeight,
        profile_photo AS profile_photo
    FROM profiles 
    WHERE user_id = ? 
    LIMIT 1
');
$stmt->execute([$userId]);
$profile = $stmt->fetch();

// Add full URL and default photo handling 
// Add default photo handling 
$defaultPhoto = 'images/default.png';

if ($profile) 
{
    $profile['profile_photo'] = !empty($profile['profile_photo']) 
                        ? ltrim($profile['profile_photo'], '/') 
                        : $defaultPhoto;
}

// Send response
jsonResponse
(
    true, 
    'Profile loaded successfully', 
    ['profile' => $profile]
);