# PHP Content Management System

A modern, secure PHP web application with preview functionality, built following best practices and security standards.

## Features

### Core Functionality
- **Content Management**: Full CRUD operations for content with rich text editing
- **Preview System**: Real-time preview functionality before publishing
- **User Authentication**: Secure login system with role-based access control
- **Version Control**: Content revision history and rollback capabilities
- **File Upload**: Secure file upload with validation and preview

### Security Features
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based CSRF protection for all forms
- **SQL Injection Prevention**: Prepared statements for all database queries
- **Session Security**: Secure session management with timeout
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive server-side validation

### User Interface
- **Responsive Design**: Mobile-first responsive layout
- **Real-time Preview**: AJAX-powered live preview functionality
- **Intuitive Navigation**: Clean and user-friendly interface
- **Visual Feedback**: Loading states, notifications, and confirmations
- **Auto-save**: Automatic draft saving functionality

## Installation

1. **Clone or download** the project files to your web server
2. **Configure database** settings in `config/app.php`
3. **Create database** named `cms_db` (or update the name in config)
4. **Set permissions** for the `public/uploads/` directory (755)
5. **Access the application** in your web browser

## Default Credentials

- **Username**: admin
- **Password**: admin123

## Project Structure

```
├── config/
│   ├── app.php              # Application configuration
│   └── database.php         # Database connection and setup
├── controllers/
│   ├── AuthController.php   # Authentication handling
│   ├── ContentController.php # Content management
│   ├── DashboardController.php # Dashboard functionality
│   └── PreviewController.php # Preview system
├── models/
│   ├── Content.php          # Content model
│   └── User.php             # User model
├── views/
│   ├── layout/              # Layout templates
│   ├── auth/                # Authentication views
│   ├── dashboard/           # Dashboard views
│   ├── content/             # Content management views
│   ├── preview/             # Preview views
│   └── errors/              # Error pages
├── includes/
│   ├── auth.php             # Authentication functions
│   └── security.php         # Security utilities
├── public/
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── uploads/             # File uploads directory
└── index.php                # Main entry point
```

## Database Schema

The application automatically creates the following tables:

- **users**: User accounts with role-based access
- **content**: Main content storage with versioning
- **content_revisions**: Content revision history
- **activity_log**: User activity tracking

## Security Features

### Input Sanitization
All user inputs are sanitized using `htmlspecialchars()` and validated before processing.

### CSRF Protection
Every form includes a CSRF token that is validated on submission.

### SQL Injection Prevention
All database queries use prepared statements with parameter binding.

### Session Security
Sessions are configured with secure settings including:
- HTTP-only cookies
- Secure flag for HTTPS
- SameSite protection
- Session timeout

### File Upload Security
File uploads are validated for:
- File type restrictions
- Size limitations
- Secure file naming
- Directory traversal prevention

## User Roles

- **Admin**: Full system access, user management
- **Editor**: Content creation, editing, and publishing
- **Viewer**: Read-only access to content

## API Endpoints

### Preview System
- `POST /preview/ajax` - Generate real-time preview
- `POST /preview/save_draft` - Auto-save draft content

### Content Management
- `GET /content` - List all content
- `POST /content/create` - Create new content
- `POST /content/edit/{id}` - Update existing content
- `POST /content/delete/{id}` - Delete content
- `POST /content/publish/{id}` - Publish content

## Configuration

### Database Settings
Update `config/app.php` with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cms_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### File Upload Settings
Configure upload limits in `config/app.php`:

```php
define('UPLOAD_PATH', 'public/uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB
```

### Security Settings
Adjust security parameters:

```php
define('SESSION_TIMEOUT', 3600); // 1 hour
define('CSRF_TOKEN_NAME', 'csrf_token');
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- PDO MySQL extension

## License

This project is open source and available under the MIT License.