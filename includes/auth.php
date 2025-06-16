<?php
class Auth {
    public static function login($username, $password) {
        $db = Database::getInstance();
        
        $stmt = $db->prepare("SELECT id, username, email, password, role, is_active FROM users WHERE (username = ? OR email = ?) AND is_active = 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['login_time'] = time();
            
            // Log activity
            self::logActivity($user['id'], 'login', 'user', $user['id']);
            
            return true;
        }
        
        return false;
    }
    
    public static function logout() {
        if (self::isLoggedIn()) {
            self::logActivity($_SESSION['user_id'], 'logout', 'user', $_SESSION['user_id']);
        }
        
        session_destroy();
        session_start();
        Security::generateCSRFToken();
    }
    
    public static function isLoggedIn() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['login_time'])) {
            return false;
        }
        
        // Check session timeout
        if (time() - $_SESSION['login_time'] > SESSION_TIMEOUT) {
            self::logout();
            return false;
        }
        
        return true;
    }
    
    public static function getCurrentUser() {
        if (!self::isLoggedIn()) {
            return null;
        }
        
        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'email' => $_SESSION['email'],
            'role' => $_SESSION['role']
        ];
    }
    
    public static function hasRole($role) {
        $user = self::getCurrentUser();
        if (!$user) return false;
        
        $roles = ['viewer' => 1, 'editor' => 2, 'admin' => 3];
        $userLevel = $roles[$user['role']] ?? 0;
        $requiredLevel = $roles[$role] ?? 0;
        
        return $userLevel >= $requiredLevel;
    }
    
    public static function register($username, $email, $password, $role = 'editor') {
        $db = Database::getInstance();
        
        // Check if user exists
        $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetchColumn() > 0) {
            return false;
        }
        
        // Create user
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([$username, $email, $hashedPassword, $role]);
        
        if ($result) {
            $userId = $db->lastInsertId();
            self::logActivity($userId, 'register', 'user', $userId);
            return $userId;
        }
        
        return false;
    }
    
    public static function logActivity($userId, $action, $entityType = null, $entityId = null, $details = null) {
        $db = Database::getInstance();
        
        $stmt = $db->prepare("INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $userId,
            $action,
            $entityType,
            $entityId,
            $details,
            $_SERVER['REMOTE_ADDR'] ?? null,
            $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
    }
}
?>