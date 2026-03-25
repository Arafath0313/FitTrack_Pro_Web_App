<?php
// api/save_profile.php

session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

requireMethod('POST');
$userId = requireAuth();

// Use POST (FormData)
$age          = (int)($_POST['age'] ?? 0);
$height       = (int)($_POST['height'] ?? 0);
$weight       = (float)($_POST['weight'] ?? 0);
$targetWeight = (float)($_POST['targetWeight'] ?? 0);

// Validation
if ($age <= 0 || $height <= 0 || $weight <= 0 || $targetWeight <= 0) 
{
    echo json_encode
    (
        [
            'success' => false, 
            'message' => 'Invalid data'
        ]
    );
    exit;
}

// Handle photo upload
$db = getDB();

// 1. Get existing photo first to avoid overwriting with default
$stmt = $db->prepare("SELECT profile_photo FROM profiles WHERE user_id = ? LIMIT 1");
$stmt->execute([$userId]);
$existingProfile = $stmt->fetch();
$photoPath = $existingProfile ? $existingProfile['profile_photo'] : 'images/default.png';

if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) 
{
    $uploadDir = __DIR__ . '/../images/';
    
    if (!is_dir($uploadDir)) 
    {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = time() . '_' . basename($_FILES['photo']['name']);
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) 
    {
        $photoPath = 'images/' . $fileName;
    }
}

// Insert or Update profile
$stmt = $db->prepare
("
    INSERT INTO profiles (user_id, age, height_cm, weight_kg, target_weight_kg, profile_photo)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        age = VALUES(age),
        height_cm = VALUES(height_cm),
        weight_kg = VALUES(weight_kg),
        target_weight_kg = VALUES(target_weight_kg),
        profile_photo = VALUES(profile_photo)
");

$success = $stmt->execute
(
    [
        $userId,
        $age,
        $height,
        $weight,
        $targetWeight,
        $photoPath
    ]
);

echo json_encode
(
    [
        'success' => $success
    ]
);