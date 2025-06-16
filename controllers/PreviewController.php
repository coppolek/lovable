<?php
class PreviewController {
    private $contentModel;
    
    public function __construct() {
        require_once 'models/Content.php';
        $this->contentModel = new Content();
    }
    
    public function index() {
        $id = (int)($_GET['id'] ?? 0);
        $content = $this->contentModel->getById($id);
        
        if (!$content) {
            header('HTTP/1.0 404 Not Found');
            include 'views/errors/404.php';
            exit;
        }
        
        // Only allow preview for preview or published content
        if (!in_array($content['status'], ['preview', 'published'])) {
            header('HTTP/1.0 403 Forbidden');
            include 'views/errors/403.php';
            exit;
        }
        
        include 'views/preview/content.php';
    }
    
    public function ajax() {
        header('Content-Type: application/json');
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            exit;
        }
        
        if (!Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid CSRF token']);
            exit;
        }
        
        $action = $_POST['action'] ?? '';
        
        switch ($action) {
            case 'preview_content':
                $this->previewContent();
                break;
            case 'save_draft':
                $this->saveDraft();
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
        }
    }
    
    private function previewContent() {
        $title = Security::sanitizeInput($_POST['title'] ?? '');
        $content = $_POST['content'] ?? '';
        $excerpt = Security::sanitizeInput($_POST['excerpt'] ?? '');
        
        // Generate preview HTML
        $previewHtml = $this->generatePreviewHtml($title, $content, $excerpt);
        
        echo json_encode([
            'success' => true,
            'html' => $previewHtml
        ]);
    }
    
    private function saveDraft() {
        $id = (int)($_POST['id'] ?? 0);
        $data = [
            'title' => Security::sanitizeInput($_POST['title'] ?? ''),
            'content' => $_POST['content'] ?? '',
            'excerpt' => Security::sanitizeInput($_POST['excerpt'] ?? ''),
            'status' => 'draft',
            'meta_title' => Security::sanitizeInput($_POST['meta_title'] ?? ''),
            'meta_description' => Security::sanitizeInput($_POST['meta_description'] ?? '')
        ];
        
        if ($id > 0) {
            // Update existing content
            $content = $this->contentModel->getById($id);
            if ($content) {
                $data['slug'] = $content['slug'];
                $success = $this->contentModel->update($id, $data);
            } else {
                $success = false;
            }
        } else {
            // Create new content
            $data['author_id'] = Auth::getCurrentUser()['id'];
            $data['slug'] = $this->contentModel->generateUniqueSlug($data['title']);
            $id = $this->contentModel->create($data);
            $success = $id !== false;
        }
        
        if ($success) {
            Auth::logActivity(Auth::getCurrentUser()['id'], 'save_draft', 'content', $id);
            echo json_encode([
                'success' => true,
                'message' => 'Draft saved successfully',
                'id' => $id
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save draft'
            ]);
        }
    }
    
    private function generatePreviewHtml($title, $content, $excerpt) {
        ob_start();
        ?>
        <article class="preview-content">
            <header>
                <h1><?php echo htmlspecialchars($title); ?></h1>
                <?php if (!empty($excerpt)): ?>
                    <p class="excerpt"><?php echo htmlspecialchars($excerpt); ?></p>
                <?php endif; ?>
            </header>
            <div class="content">
                <?php echo $content; ?>
            </div>
        </article>
        <?php
        return ob_get_clean();
    }
}
?>