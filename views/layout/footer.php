</main>
    
    <footer class="footer">
        <div class="footer-container">
            <p>&copy; <?php echo date('Y'); ?> <?php echo APP_NAME; ?>. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="public/js/app.js"></script>
    <script>
        // Set CSRF token for AJAX requests
        window.csrfToken = '<?php echo Security::generateCSRFToken(); ?>';
    </script>
</body>
</html>