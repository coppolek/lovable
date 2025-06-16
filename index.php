<?php
// Main entry point
require_once 'config/app.php';
require_once 'config/database.php';
require_once 'includes/auth.php';
require_once 'includes/security.php';

// Start session with secure settings
session_start([
    'cookie_lifetime' => 3600,
    'cookie_secure' => true,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

// Initialize CSRF protection
Security::generateCSRFToken();

// Simple routing
$page = $_GET['page'] ?? 'dashboard';
$action = $_GET['action'] ?? 'index';

// Authentication check for protected pages
$protectedPages = ['dashboard', 'content', 'preview'];
if (in_array($page, $protectedPages) && !Auth::isLoggedIn()) {
    header('Location: ?page=login');
    exit;
}

// Route to appropriate controller
switch ($page) {
    case 'login':
        require_once 'controllers/AuthController.php';
        $controller = new AuthController();
        break;
    case 'dashboard':
        require_once 'controllers/DashboardController.php';
        $controller = new DashboardController();
        break;
    case 'content':
        require_once 'controllers/ContentController.php';
        $controller = new ContentController();
        break;
    case 'preview':
        require_once 'controllers/PreviewController.php';
        $controller = new PreviewController();
        break;
    default:
        require_once 'controllers/DashboardController.php';
        $controller = new DashboardController();
}

// Execute controller action
if (method_exists($controller, $action)) {
    $controller->$action();
} else {
    $controller->index();
}
?>