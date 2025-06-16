<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($content['meta_title'] ?: $content['title']); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($content['meta_description'] ?: $content['excerpt']); ?>">
    <link href="public/css/preview.css" rel="stylesheet">
</head>
<body>
    <div class="preview-container">
        <header class="preview-header">
            <div class="preview-notice">
                <i class="fas fa-eye"></i>
                <span>Preview Mode</span>
                <?php if (Auth::isLoggedIn()): ?>
                    <a href="?page=content&action=edit&id=<?php echo $content['id']; ?>" class="edit-link">
                        <i class="fas fa-edit"></i> Edit
                    </a>
                <?php endif; ?>
            </div>
        </header>
        
        <main class="preview-content">
            <article>
                <header class="article-header">
                    <h1><?php echo htmlspecialchars($content['title']); ?></h1>
                    
                    <?php if (!empty($content['excerpt'])): ?>
                        <p class="article-excerpt"><?php echo htmlspecialchars($content['excerpt']); ?></p>
                    <?php endif; ?>
                    
                    <div class="article-meta">
                        <span class="author">By <?php echo htmlspecialchars($content['author_name']); ?></span>
                        <span class="date"><?php echo date('F j, Y', strtotime($content['created_at'])); ?></span>
                        <span class="status status-<?php echo $content['status']; ?>">
                            <?php echo ucfirst($content['status']); ?>
                        </span>
                    </div>
                </header>
                
                <?php if (!empty($content['featured_image'])): ?>
                    <div class="featured-image">
                        <img src="<?php echo UPLOAD_PATH . htmlspecialchars($content['featured_image']); ?>" 
                             alt="<?php echo htmlspecialchars($content['title']); ?>">
                    </div>
                <?php endif; ?>
                
                <div class="article-content">
                    <?php echo $content['content']; ?>
                </div>
            </article>
        </main>
    </div>
</body>
</html>