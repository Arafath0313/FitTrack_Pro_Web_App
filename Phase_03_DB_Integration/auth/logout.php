<?php
// auth/logout.php  -  Session Destruction

session_start();

require_once __DIR__ . '/../includes/functions.php';

session_unset();
session_destroy();

jsonResponse
(
    true, 
    'Logged out successfully.'
);
