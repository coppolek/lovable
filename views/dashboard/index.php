<?php
$pageTitle = 'Dashboard - ' . APP_NAME;
include 'views/layout/header.php';
?>

<div class="container">
    <div class="page-header">
        <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p>Welcome back, <?php echo htmlspecialchars($user['username']); ?>!</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo $stats['total_content']; ?></h3>
                <p>Total Content</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon published">
                <i class="fas fa-globe"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo $stats['published_content']; ?></h3>
                <p>Published</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon draft">
                <i class="fas fa-edit"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo $stats['draft_content']; ?></h3>
                <p>Drafts</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon preview">
                <i class="fas fa-eye"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo $stats['preview_content']; ?></h3>
                <p>Preview</p>
            </div>
        </div>
    </div>
    
    <div class="dashboard-grid">
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-clock"></i> Recent Content</h2>
                <a href="?page=content&action=create" class="btn btn-primary btn-sm">
                    <i class="fas fa-plus"></i> New Content
                </a>
            </div>
            
            <div class="content-list">
                <?php if (empty($recentContent)): ?>
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <p>No content yet. <a href="?page=content&action=create">Create your first content</a></p>
                    </div>
                <?php else: ?>
                    <?php foreach ($recentContent as $content): ?>
                        <div class="content-item">
                            <div class="content-info">
                                <h4><a href="?page=content&action=edit&id=<?php echo $content['id']; ?>">
                                    <?php echo htmlspecialchars($content['title']); ?>
                                </a></h4>
                                <p class="content-meta">
                                    <span class="status status-<?php echo $content['status']; ?>">
                                        <?php echo ucfirst($content['status']); ?>
                                    </span>
                                    by <?php echo htmlspecialchars($content['author_name']); ?>
                                    on <?php echo date('M j, Y', strtotime($content['updated_at'])); ?>
                                </p>
                            </div>
                            <div class="content-actions">
                                <a href="?page=content&action=edit&id=<?php echo $content['id']; ?>" class="btn btn-sm btn-outline">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <?php if (in_array($content['status'], ['preview', 'published'])): ?>
                                    <a href="?page=preview&id=<?php echo $content['id']; ?>" class="btn btn-sm btn-outline" target="_blank">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-history"></i> Recent Activity</h2>
            </div>
            
            <div class="activity-list">
                <?php if (empty($activityLog)): ?>
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <p>No recent activity</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($activityLog as $activity): ?>
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-<?php echo $this->getActivityIcon($activity['action']); ?>"></i>
                            </div>
                            <div class="activity-content">
                                <p>
                                    <strong><?php echo htmlspecialchars($activity['username'] ?? 'Unknown'); ?></strong>
                                    <?php echo $this->getActivityDescription($activity); ?>
                                </p>
                                <small><?php echo date('M j, Y g:i A', strtotime($activity['created_at'])); ?></small>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php
// Helper functions for activity display
function getActivityIcon($action) {
    $icons = [
        'login' => 'sign-in-alt',
        'logout' => 'sign-out-alt',
        'create' => 'plus',
        'update' => 'edit',
        'delete' => 'trash',
        'publish' => 'globe',
        'preview' => 'eye'
    ];
    return $icons[$action] ?? 'circle';
}

function getActivityDescription($activity) {
    $descriptions = [
        'login' => 'logged in',
        'logout' => 'logged out',
        'create' => 'created ' . ($activity['entity_type'] ?? 'item'),
        'update' => 'updated ' . ($activity['entity_type'] ?? 'item'),
        'delete' => 'deleted ' . ($activity['entity_type'] ?? 'item'),
        'publish' => 'published ' . ($activity['entity_type'] ?? 'item'),
        'preview' => 'set ' . ($activity['entity_type'] ?? 'item') . ' to preview'
    ];
    return $descriptions[$activity['action']] ?? $activity['action'];
}

include 'views/layout/footer.php';
?>