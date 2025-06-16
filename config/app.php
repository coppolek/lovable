<?php
// Application configuration
define('APP_NAME', 'Content Management System');
define('APP_VERSION', '1.0.0');
define('BASE_URL', 'http://localhost');
define('UPLOAD_PATH', 'public/uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB

// Security settings
define('CSRF_TOKEN_NAME', 'csrf_token');
define('SESSION_TIMEOUT', 3600); // 1 hour

// Database settings
define('DB_HOST', 'localhost');
define('DB_NAME', 'cms_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('UTC');
?>