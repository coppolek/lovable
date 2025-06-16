<?php
class ContentController {
    private $contentModel;
    
    public function __construct() {
        require_once 'models/Content.php';
        $this->contentModel = new Content();
    }
    
    public function index() {
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? '';
        
        if (!empty($search)) {
            $content = $this->contentModel->search($search, $status);
        } else {
            $content = $this->contentModel->getAll($status);
        }
        
        include 'views/content/index.php';
    }
    
    public function create() {
        $error = '';
        $success = '';
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
                $error = 'Invalid security token.';
            } else {
                $data = $this->sanitizeContentData($_POST);
                $data['author_id'] = Auth::getCurrentUser()['id'];
                $data['slug'] = $this->contentModel->generateUniqueSlug($data['title']);
                
                if (empty($data['title']) || empty($data['content'])) {
                    $error = 'Title and content are required.';
                } else {
                    // Handle file upload
                    if (!empty($_FILES['featured_image']['name'])) {
                        $upload = Security::uploadFile($_FILES['featured_image'], ['jpg', 'jpeg', 'png', 'gif']);
                        if ($upload['success']) {
                            $data['featured_image'] = $upload['filename'];
                        } else {
                            $error = $upload['message'];
                        }
                    }
                    
                    if (empty($error)) {
                        $contentId = $this->contentModel->create($data);
                        if ($contentId) {
                            Auth::logActivity(Auth::getCurrentUser()['id'], 'create', 'content', $contentId);
                            $success = 'Content created successfully.';
                            
                            // Redirect to edit page
                            header("Location: ?page=content&action=edit&id=$contentId");
                            exit;
                        } else {
                            $error = 'Failed to create content.';
                        }
                    }
                }
            }
        }
        
        include 'views/content/create.php';
    }
    
    public function edit() {
        $id = (int)($_GET['id'] ?? 0);
        $content = $this->contentModel->getById($id);
        
        if (!$content) {
            header('Location: ?page=content');
            exit;
        }
        
        $error = '';
        $success = '';
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
                $error = 'Invalid security token.';
            } else {
                $data = $this->sanitizeContentData($_POST);
                
                // Generate new slug if title changed
                if ($data['title'] !== $content['title']) {
                    $data['slug'] = $this->contentModel->generateUniqueSlug($data['title'], $id);
                } else {
                    $data['slug'] = $content['slug'];
                }
                
                if (empty($data['title']) || empty($data['content'])) {
                    $error = 'Title and content are required.';
                } else {
                    // Handle file upload
                    if (!empty($_FILES['featured_image']['name'])) {
                        $upload = Security::uploadFile($_FILES['featured_image'], ['jpg', 'jpeg', 'png', 'gif']);
                        if ($upload['success']) {
                            $data['featured_image'] = $upload['filename'];
                        } else {
                            $error = $upload['message'];
                        }
                    } else {
                        $data['featured_image'] = $content['featured_image'];
                    }
                    
                    if (empty($error)) {
                        if ($this->contentModel->update($id, $data)) {
                            Auth::logActivity(Auth::getCurrentUser()['id'], 'update', 'content', $id);
                            $success = 'Content updated successfully.';
                            $content = $this->contentModel->getById($id); // Refresh data
                        } else {
                            $error = 'Failed to update content.';
                        }
                    }
                }
            }
        }
        
        // Get revisions
        $revisions = $this->contentModel->getRevisions($id);
        
        include 'views/content/edit.php';
    }
    
    public function delete() {
        if (!Auth::hasRole('editor')) {
            header('Location: ?page=content');
            exit;
        }
        
        $id = (int)($_GET['id'] ?? 0);
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
            if ($this->contentModel->delete($id)) {
                Auth::logActivity(Auth::getCurrentUser()['id'], 'delete', 'content', $id);
            }
        }
        
        header('Location: ?page=content');
        exit;
    }
    
    public function publish() {
        if (!Auth::hasRole('editor')) {
            header('Location: ?page=content');
            exit;
        }
        
        $id = (int)($_GET['id'] ?? 0);
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
            if ($this->contentModel->publish($id)) {
                Auth::logActivity(Auth::getCurrentUser()['id'], 'publish', 'content', $id);
            }
        }
        
        header('Location: ?page=content&action=edit&id=' . $id);
        exit;
    }
    
    public function preview() {
        $id = (int)($_GET['id'] ?? 0);
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && Security::validateCSRFToken($_POST['csrf_token'] ?? '')) {
            if ($this->contentModel->setPreview($id)) {
                Auth::logActivity(Auth::getCurrentUser()['id'], 'preview', 'content', $id);
            }
        }
        
        header('Location: ?page=content&action=edit&id=' . $id);
        exit;
    }
    
    private function sanitizeContentData($data) {
        return [
            'title' => Security::sanitizeInput($data['title'] ?? ''),
            'content' => $data['content'] ?? '', // Don't sanitize content as it may contain HTML
            'excerpt' => Security::sanitizeInput($data['excerpt'] ?? ''),
            'status' => in_array($data['status'] ?? '', ['draft', 'preview', 'published']) ? $data['status'] : 'draft',
            'meta_title' => Security::sanitizeInput($data['meta_title'] ?? ''),
            'meta_description' => Security::sanitizeInput($data['meta_description'] ?? '')
        ];
    }
}
?>