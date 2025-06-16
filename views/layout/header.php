<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? APP_NAME; ?></title>
    <link href="public/css/style.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <meta name="csrf-token" content="<?php echo Security::generateCSRFToken(); ?>">
</head>
<body>
    <?php if (Auth::isLoggedIn()): ?>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="?page=dashboard"><?php echo APP_NAME; ?></a>
            </div>
            <ul class="nav-menu">
                <li><a href="?page=dashboard" class="<?php echo ($_GET['page'] ?? '') === 'dashboard' ? 'active' : ''; ?>">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a></li>
                <li><a href="?page=content" class="<?php echo ($_GET['page'] ?? '') === 'content' ? 'active' : ''; ?>">
                    <i class="fas fa-file-alt"></i> Content
                </a></li>
                <?php if (Auth::hasRole('admin')): ?>
                <li><a href="?page=login&action=register">
                    <i class="fas fa-user-plus"></i> Add User
                </a></li>
                <?php endif; ?>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">
                        <i class="fas fa-user"></i> <?php echo htmlspecialchars(Auth::getCurrentUser()['username']); ?>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="?page=login&action=logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
    <?php endif; ?>
    
    <main class="main-content">