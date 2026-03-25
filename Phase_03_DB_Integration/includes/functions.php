<?php
// includes/functions.php  -  Helper / Utility Functions


// Sanitise a string value from user input.
function sanitize(string $value): string
{
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}


// Send a JSON response and exit.
function jsonResponse(bool $success, string $message = '', array $data = [], int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json');

    $response = ['success' => $success, 'message' => $message];
    if (!empty($data)) 
    {
        $response = array_merge($response, $data);
    }

    echo json_encode($response);
    exit;
}

// Ensure the request comes from a logged-in user.
// Returns the current user_id from the session.
function requireAuth(): int
{
    if (session_status() === PHP_SESSION_NONE) 
    {
        session_start();
    }

    if (empty($_SESSION['user_id'])) 
    {
        jsonResponse
        (
            false, 
            'Unauthorized. Please log in.', 
            [], 
            401
        );
    }

    return (int) $_SESSION['user_id'];
}


// Require a specific HTTP method. Exits with 405 if method doesn't match.
function requireMethod(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) 
    {
        jsonResponse
        (
            false, 
            'Method not allowed.', 
            [], 
            405
        );
    }
}


// Read the raw JSON request body and decode it.
function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}


// Hash a password securely.
function hashPassword(string $plain): string
{
    return password_hash($plain, PASSWORD_BCRYPT);
}


// Verify a plain password against a hash.
function verifyPassword(string $plain, string $hash): bool
{
    return password_verify($plain, $hash);
}


// Validate that an email address is valid.
function isValidEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
