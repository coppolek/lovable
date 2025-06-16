<?php
class AuthController {
    public function index() {
        if (Auth::isLoggedIn()) {
            header('Location: ?page=dashboard');
            exit;
        }
        
        $error = '';
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!Security::rateLimitCheck('login', 5, 300)) {
                $error = 'Too many login attempts. Please try again later.';
            } elseif (!Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
                $error = 'Invalid security token. Please try again.';
            } else {
                $username = Security::sanitizeInput($_POST['username'] ?? '');
                $password = $_POST['password'] ?? '';
                
                if (empty($username) || empty($password)) {
                    $error = 'Please fill in all fields.';
                } elseif (Auth::login($username, $password)) {
                    header('Location: ?page=dashboard');
                    exit;
                } else {
                    $error = 'Invalid username or password.';
                }
            }
        }
        
        include 'views/auth/login.php';
    }
    
    public function logout() {
        Auth::logout();
        header('Location: ?page=login');
        exit;
    }
    
    public function register() {
        if (!Auth::hasRole('admin')) {
            header('Location: ?page=dashboard');
            exit;
        }
        
        $error = '';
        $success = '';
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
                $error = 'Invalid security token.';
            } else {
                $username = Security::sanitizeInput($_POST['username'] ?? '');
                $email = Security::sanitizeInput($_POST['email'] ?? '');
                $password = $_POST['password'] ?? '';
                $role = Security::sanitizeInput($_POST['role'] ?? 'editor');
                
                if (empty($username) || empty($email) || empty($password)) {
                    $error = 'Please fill in all fields.';
                } elseif (!Security::validateEmail($email)) {
                    $error = 'Invalid email address.';
                } elseif (!Security::validatePassword($password)) {
                    $error = 'Password must be at least 8 characters with uppercase, lowercase, and number.';
                } else {
                    $userId = Auth::register($username, $email, $password, $role);
                    if ($userId) {
                        $success = 'User created successfully.';
                    } else {
                        $error = 'Username or email already exists.';
                    }
                }
            }
        }
        
        include 'views/auth/register.php';
    }
}
?>