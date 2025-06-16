<?php
$pageTitle = 'Edit Content - ' . APP_NAME;
include 'views/layout/header.php';
?>

<div class="container">
    <div class="page-header">
        <h1><i class="fas fa-edit"></i> Edit Content</h1>
        <div class="header-actions">
            <?php if (in_array($content['status'], ['preview', 'published'])): ?>
                <a href="?page=preview&id=<?php echo $content['id']; ?>" class="btn btn-outline" target="_blank">
                    <i class="fas fa-eye"></i> View
                </a>
            <?php endif; ?>
            <a href="?page=content" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Content
            </a>
        </div>
    </div>
    
    <?php if (!empty($error)): ?>
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>
    
    <?php if (!empty($success)): ?>
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <?php echo htmlspecialchars($success); ?>
        </div>
    <?php endif; ?>
    
    <div class="content-editor">
        <form method="POST" enctype="multipart/form-data" class="content-form" id="contentForm">
            <input type="hidden" name="csrf_token" value="<?php echo Security::generateCSRFToken(); ?>">
            
            <div class="editor-main">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required 
                           value="<?php echo htmlspecialchars($content['title']); ?>"
                           placeholder="Enter content title...">
                </div>
                
                <div class="form-group">
                    <label for="excerpt">Excerpt</label>
                    <textarea id="excerpt" name="excerpt" rows="3" 
                              placeholder="Brief description of the content..."><?php echo htmlspecialchars($content['excerpt']); ?></textarea>
                </div>
                
                <div class="form-group">
                    <label for="content">Content</label>
                    <textarea id="content" name="content" rows="20" required 
                              placeholder="Write your content here..."><?php echo htmlspecialchars($content['content']); ?></textarea>
                </div>
            </div>
            
            <div class="editor-sidebar">
                <div class="sidebar-section">
                    <h3>Publish</h3>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status">
                            <option value="draft" <?php echo $content['status'] === 'draft' ? 'selected' : ''; ?>>Draft</option>
                            <option value="preview" <?php echo $content['status'] === 'preview' ? 'selected' : ''; ?>>Preview</option>
                            <?php if (Auth::hasRole('editor')): ?>
                                <option value="published" <?php echo $content['status'] === 'published' ? 'selected' : ''; ?>>Published</option>
                            <?php endif; ?>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Update Content
                        </button>
                        <button type="button" class="btn btn-outline btn-block" id="previewBtn">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        
                        <?php if (Auth::hasRole('editor') && $content['status'] !== 'published'): ?>
                            <form method="POST" action="?page=content&action=publish&id=<?php echo $content['id']; ?>" style="margin-top: 10px;">
                                <input type="hidden" name="csrf_token" value="<?php echo Security::generateCSRFToken(); ?>">
                                <button type="submit" class="btn btn-success btn-block" 
                                        onclick="return confirm('Are you sure you want to publish this content?');">
                                    <i class="fas fa-globe"></i> Publish Now
                                </button>
                            </form>
                        <?php endif; ?>
                        
                        <?php if ($content['status'] !== 'preview'): ?>
                            <form method="POST" action="?page=content&action=preview&id=<?php echo $content['id']; ?>" style="margin-top: 10px;">
                                <input type="hidden" name="csrf_token" value="<?php echo Security::generateCSRFToken(); ?>">
                                <button type="submit" class="btn btn-info btn-block">
                                    <i class="fas fa-eye"></i> Set to Preview
                                </button>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h3>Featured Image</h3>
                    <?php if (!empty($content['featured_image'])): ?>
                        <div class="current-image">
                            <img src="<?php echo UPLOAD_PATH . htmlspecialchars($content['featured_image']); ?>" 
                                 alt="Featured Image" style="max-width: 100%; height: auto;">
                        </div>
                    <?php endif; ?>
                    <div class="form-group">
                        <input type="file" id="featured_image" name="featured_image" accept="image/*">
                        <small>Leave empty to keep current image</small>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h3>SEO</h3>
                    <div class="form-group">
                        <label for="meta_title">Meta Title</label>
                        <input type="text" id="meta_title" name="meta_title" 
                               value="<?php echo htmlspecialchars($content['meta_title']); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="meta_description">Meta Description</label>
                        <textarea id="meta_description" name="meta_description" rows="3"><?php echo htmlspecialchars($content['meta_description']); ?></textarea>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h3>Content Info</h3>
                    <p><strong>Slug:</strong> <?php echo htmlspecialchars($content['slug']); ?></p>
                    <p><strong>Author:</strong> <?php echo htmlspecialchars($content['author_name']); ?></p>
                    <p><strong>Created:</strong> <?php echo date('M j, Y g:i A', strtotime($content['created_at'])); ?></p>
                    <p><strong>Updated:</strong> <?php echo date('M j, Y g:i A', strtotime($content['updated_at'])); ?></p>
                    <?php if ($content['published_at']): ?>
                        <p><strong>Published:</strong> <?php echo date('M j, Y g:i A', strtotime($content['published_at'])); ?></p>
                    <?php endif; ?>
                </div>
                
                <?php if (!empty($revisions)): ?>
                    <div class="sidebar-section">
                        <h3>Revisions (<?php echo count($revisions); ?>)</h3>
                        <div class="revisions-list">
                            <?php foreach (array_slice($revisions, 0, 5) as $revision): ?>
                                <div class="revision-item">
                                    <p><strong><?php echo htmlspecialchars($revision['title']); ?></strong></p>
                                    <small>
                                        by <?php echo htmlspecialchars($revision['author_name']); ?>
                                        on <?php echo date('M j, Y g:i A', strtotime($revision['created_at'])); ?>
                                    </small>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </form>
    </div>
</div>

<!-- Preview Modal -->
<div id="previewModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Content Preview</h2>
            <button type="button" class="modal-close" id="closePreview">&times;</button>
        </div>
        <div class="modal-body">
            <div id="previewContent"></div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    const previewContent = document.getElementById('previewContent');
    
    // Auto-save functionality
    let autoSaveTimeout;
    const form = document.getElementById('contentForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(autoSave, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
    
    function autoSave() {
        const formData = new FormData(form);
        formData.append('action', 'save_draft');
        formData.append('id', '<?php echo $content['id']; ?>');
        
        fetch('?page=preview&action=ajax', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Draft saved automatically', 'success');
            }
        })
        .catch(error => {
            console.error('Auto-save error:', error);
        });
    }
    
    previewBtn.addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const excerpt = document.getElementById('excerpt').value;
        
        fetch('?page=preview&action=ajax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'preview_content',
                title: title,
                content: content,
                excerpt: excerpt,
                csrf_token: window.csrfToken
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                previewContent.innerHTML = data.html;
                previewModal.style.display = 'block';
            } else {
                alert('Error generating preview');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error generating preview');
        });
    });
    
    closePreview.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
</script>

<?php include 'views/layout/footer.php'; ?>