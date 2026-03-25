<?php
// includes/db.php  -  Database Connection

define('DB_HOST', 'localhost');
define('DB_NAME', 'fitness_tracker');
define('DB_USER', 'root');      // Change if your XAMPP MySQL user is different
define('DB_PASS', '');          // Change if you set a MySQL password in XAMPP
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO
{
    static $pdo = null;

    if ($pdo === null) 
    {
        $dsn = 'mysql:host=' . DB_HOST
              . ';dbname=' . DB_NAME
              . ';charset=' . DB_CHARSET;

        $options = 
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try 
        {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } 
        
        catch (PDOException $e) 
        {
            // Return a JSON error so AJAX callers see it cleanly
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }

    return $pdo;
}
