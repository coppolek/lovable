<?php
class Content {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO content (title, slug, content, excerpt, status, author_id, meta_title, meta_description, featured_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['content'],
            $data['excerpt'] ?? '',
            $data['status'] ?? 'draft',
            $data['author_id'],
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $data['featured_image'] ?? ''
        ]);
        
        if ($result) {
            $contentId = $this->db->lastInsertId();
            $this->createRevision($contentId, $data);
            return $contentId;
        }
        
        return false;
    }
    
    public function update($id, $data) {
        // Create revision before updating
        $current = $this->getById($id);
        if ($current) {
            $this->createRevision($id, $current);
        }
        
        $stmt = $this->db->prepare("
            UPDATE content 
            SET title = ?, slug = ?, content = ?, excerpt = ?, status = ?, 
                meta_title = ?, meta_description = ?, featured_image = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        return $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['content'],
            $data['excerpt'] ?? '',
            $data['status'] ?? 'draft',
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $data['featured_image'] ?? '',
            $id
        ]);
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM content WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT c.*, u.username as author_name 
            FROM content c 
            LEFT JOIN users u ON c.author_id = u.id 
            WHERE c.id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function getBySlug($slug) {
        $stmt = $this->db->prepare("
            SELECT c.*, u.username as author_name 
            FROM content c 
            LEFT JOIN users u ON c.author_id = u.id 
            WHERE c.slug = ?
        ");
        $stmt->execute([$slug]);
        return $stmt->fetch();
    }
    
    public function getAll($status = null, $limit = 50, $offset = 0) {
        $sql = "
            SELECT c.*, u.username as author_name 
            FROM content c 
            LEFT JOIN users u ON c.author_id = u.id
        ";
        
        $params = [];
        if ($status) {
            $sql .= " WHERE c.status = ?";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY c.updated_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function publish($id) {
        $stmt = $this->db->prepare("
            UPDATE content 
            SET status = 'published', published_at = NOW(), updated_at = NOW() 
            WHERE id = ?
        ");
        return $stmt->execute([$id]);
    }
    
    public function setPreview($id) {
        $stmt = $this->db->prepare("
            UPDATE content 
            SET status = 'preview', updated_at = NOW() 
            WHERE id = ?
        ");
        return $stmt->execute([$id]);
    }
    
    public function createRevision($contentId, $data) {
        $stmt = $this->db->prepare("
            INSERT INTO content_revisions (content_id, title, content, excerpt, author_id) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        return $stmt->execute([
            $contentId,
            $data['title'],
            $data['content'],
            $data['excerpt'] ?? '',
            $data['author_id']
        ]);
    }
    
    public function getRevisions($contentId) {
        $stmt = $this->db->prepare("
            SELECT cr.*, u.username as author_name 
            FROM content_revisions cr 
            LEFT JOIN users u ON cr.author_id = u.id 
            WHERE cr.content_id = ? 
            ORDER BY cr.created_at DESC
        ");
        $stmt->execute([$contentId]);
        return $stmt->fetchAll();
    }
    
    public function search($query, $status = null) {
        $sql = "
            SELECT c.*, u.username as author_name 
            FROM content c 
            LEFT JOIN users u ON c.author_id = u.id 
            WHERE (c.title LIKE ? OR c.content LIKE ? OR c.excerpt LIKE ?)
        ";
        
        $params = ["%$query%", "%$query%", "%$query%"];
        
        if ($status) {
            $sql .= " AND c.status = ?";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY c.updated_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function generateUniqueSlug($title, $id = null) {
        $baseSlug = Security::generateSlug($title);
        $slug = $baseSlug;
        $counter = 1;
        
        while ($this->slugExists($slug, $id)) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }
    
    private function slugExists($slug, $excludeId = null) {
        $sql = "SELECT COUNT(*) FROM content WHERE slug = ?";
        $params = [$slug];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn() > 0;
    }
}
?>