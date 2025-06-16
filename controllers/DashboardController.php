<?php
class DashboardController {
    private $contentModel;
    private $userModel;
    
    public function __construct() {
        require_once 'models/Content.php';
        require_once 'models/User.php';
        $this->contentModel = new Content();
        $this->userModel = new User();
    }
    
    public function index() {
        $user = Auth::getCurrentUser();
        
        // Get recent content
        $recentContent = $this->contentModel->getAll(null, 10);
        
        // Get activity log
        $activityLog = $this->userModel->getActivityLog(null, 20);
        
        // Get statistics
        $stats = $this->getStatistics();
        
        include 'views/dashboard/index.php';
    }
    
    private function getStatistics() {
        $db = Database::getInstance();
        
        $stats = [];
        
        // Total content count
        $stmt = $db->prepare("SELECT COUNT(*) FROM content");
        $stmt->execute();
        $stats['total_content'] = $stmt->fetchColumn();
        
        // Published content count
        $stmt = $db->prepare("SELECT COUNT(*) FROM content WHERE status = 'published'");
        $stmt->execute();
        $stats['published_content'] = $stmt->fetchColumn();
        
        // Draft content count
        $stmt = $db->prepare("SELECT COUNT(*) FROM content WHERE status = 'draft'");
        $stmt->execute();
        $stats['draft_content'] = $stmt->fetchColumn();
        
        // Preview content count
        $stmt = $db->prepare("SELECT COUNT(*) FROM content WHERE status = 'preview'");
        $stmt->execute();
        $stats['preview_content'] = $stmt->fetchColumn();
        
        // Total users count
        $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE is_active = 1");
        $stmt->execute();
        $stats['total_users'] = $stmt->fetchColumn();
        
        return $stats;
    }
}
?>