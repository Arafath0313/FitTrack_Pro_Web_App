<?php
// dashboard.php  -  Protected Dashboard Redirect
// FitTrack Pro | Phase 3

session_start();

// If not logged in, redirect to the main page
if (empty($_SESSION['user_id'])) 
{
    header('Location: index.php');
    exit;
}

// Redirect authenticated users to the main app
header('Location: index.php');
exit;
