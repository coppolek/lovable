<?php
$pageTitle = 'Create Content - ' . APP_NAME;
include 'views/layout/header.php';
?>

<div class="container">
    <div class="page-header">
        <h1><i class="fas fa-plus"></i> Create New Content</h1>
        <a href="?page=content" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Content
        </a>
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
                           value="<?php echo htmlspecialchars($_POST['title'] ?? ''); ?>"
                           placeholder="Enter content title...">
                </div>
                
                <div class="form-group">
                    <label for="excerpt">Excerpt</label>
                    <textarea id="excerpt" name="excerpt" rows="3" 
                              placeholder="Brief description of the content..."><?php echo htmlspecialchars($_POST['excerpt'] ?? ''); ?></textarea>
                </div>
                
                <div class="form-group">
                    <label for="content">Content</label>
                    <textarea id="content" name="content" rows="20" required 
                              placeholder="Write your content here..."><?php echo htmlspecialchars($_POST['content'] ?? ''); ?></textarea>
                </div>
            </div>
            
            <div class="editor-sidebar">
                <div class="sidebar-section">
                    <h3>Publish</h3>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status">
                            <option value="draft" <?php echo ($_POST['status'] ?? 'draft') === 'draft' ? 'selected' : ''; ?>>Draft</option>
                            <option value="preview" <?php echo ($_POST['status'] ?? '') === 'preview' ? 'selected' : ''; ?>>Preview</option>
                            <?php if (Auth::hasRole('editor')): ?>
                                <option value="published" <?php echo ($_POST['status'] ?? '') === 'published' ? 'selected' : ''; ?>>Published</option>
                            <?php endif; ?>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Save Content
                        </button>
                        <button type="button" class="btn btn-outline btn-block" id="previewBtn">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h3>Featured Image</h3>
                    <div class="form-group">
                        <input type="file" id="featured_image" name="featured_image" accept="image/*">
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h3>SEO</h3>
                    <div class="form-group">
                        <label for="meta_title">Meta Title</label>
                        <input type="text" id="meta_title" name="meta_title" 
                               value="<?php echo htmlspecialchars($_POST['meta_title'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="meta_description">Meta Description</label>
                        <textarea id="meta_description" name="meta_description" rows="3"><?php echo htmlspecialchars($_POST['meta_description'] ?? ''); ?></textarea>
                    </div>
                </div>
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
    
    previewBtn.addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const excerpt = document.getElementById('excerpt').value;
        
        // Send AJAX request for preview
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
});
</script>

<?php include 'views/layout/footer.php'; ?>