<?php
$pageTitle = 'Content Management - ' . APP_NAME;
include 'views/layout/header.php';
?>

<div class="container">
    <div class="page-header">
        <h1><i class="fas fa-file-alt"></i> Content Management</h1>
        <a href="?page=content&action=create" class="btn btn-primary">
            <i class="fas fa-plus"></i> New Content
        </a>
    </div>
    
    <div class="content-filters">
        <div class="filter-group">
            <a href="?page=content" class="filter-btn <?php echo empty($_GET['status']) ? 'active' : ''; ?>">
                All Content
            </a>
            <a href="?page=content&status=draft" class="filter-btn <?php echo ($_GET['status'] ?? '') === 'draft' ? 'active' : ''; ?>">
                Drafts
            </a>
            <a href="?page=content&status=preview" class="filter-btn <?php echo ($_GET['status'] ?? '') === 'preview' ? 'active' : ''; ?>">
                Preview
            </a>
            <a href="?page=content&status=published" class="filter-btn <?php echo ($_GET['status'] ?? '') === 'published' ? 'active' : ''; ?>">
                Published
            </a>
        </div>
        
        <form method="GET" class="search-form">
            <input type="hidden" name="page" value="content">
            <?php if (!empty($_GET['status'])): ?>
                <input type="hidden" name="status" value="<?php echo htmlspecialchars($_GET['status']); ?>">
            <?php endif; ?>
            <input type="text" name="search" placeholder="Search content..." 
                   value="<?php echo htmlspecialchars($_GET['search'] ?? ''); ?>">
            <button type="submit" class="btn btn-outline">
                <i class="fas fa-search"></i>
            </button>
        </form>
    </div>
    
    <div class="content-table-container">
        <?php if (empty($content)): ?>
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No content found</h3>
                <p>Start by creating your first piece of content.</p>
                <a href="?page=content&action=create" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Create Content
                </a>
            </div>
        <?php else: ?>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Author</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($content as $item): ?>
                        <tr>
                            <td>
                                <div class="content-title">
                                    <a href="?page=content&action=edit&id=<?php echo $item['id']; ?>">
                                        <?php echo htmlspecialchars($item['title']); ?>
                                    </a>
                                    <?php if (!empty($item['excerpt'])): ?>
                                        <p class="content-excerpt"><?php echo htmlspecialchars(substr($item['excerpt'], 0, 100)); ?>...</p>
                                    <?php endif; ?>
                                </div>
                            </td>
                            <td>
                                <span class="status status-<?php echo $item['status']; ?>">
                                    <?php echo ucfirst($item['status']); ?>
                                </span>
                            </td>
                            <td><?php echo htmlspecialchars($item['author_name']); ?></td>
                            <td><?php echo date('M j, Y g:i A', strtotime($item['updated_at'])); ?></td>
                            <td>
                                <div class="action-buttons">
                                    <a href="?page=content&action=edit&id=<?php echo $item['id']; ?>" 
                                       class="btn btn-sm btn-outline" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    
                                    <?php if (in_array($item['status'], ['preview', 'published'])): ?>
                                        <a href="?page=preview&id=<?php echo $item['id']; ?>" 
                                           class="btn btn-sm btn-outline" title="View" target="_blank">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    <?php endif; ?>
                                    
                                    <?php if (Auth::hasRole('editor')): ?>
                                        <form method="POST" action="?page=content&action=delete&id=<?php echo $item['id']; ?>" 
                                              style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this content?');">
                                            <input type="hidden" name="csrf_token" value="<?php echo Security::generateCSRFToken(); ?>">
                                            <button type="submit" class="btn btn-sm btn-danger" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>

<?php include 'views/layout/footer.php'; ?>