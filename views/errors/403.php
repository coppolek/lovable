<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Forbidden - <?php echo APP_NAME; ?></title>
    <link href="public/css/style.css" rel="stylesheet">
</head>
<body>
    <div class="error-container">
        <div class="error-content">
            <h1>403</h1>
            <h2>Access Forbidden</h2>
            <p>You don't have permission to access this resource.</p>
            <a href="?page=dashboard" class="btn btn-primary">
                <i class="fas fa-home"></i> Go to Dashboard
            </a>
        </div>
    </div>
    
    <style>
        .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .error-content {
            text-align: center;
            color: white;
        }
        
        .error-content h1 {
            font-size: 8rem;
            font-weight: bold;
            margin-bottom: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .error-content h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .error-content p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
    </style>
</body>
</html>