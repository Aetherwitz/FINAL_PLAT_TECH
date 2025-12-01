<?php
session_start();
require_once __DIR__ . '/../config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../pages/login.php');
    exit;
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
        $errors[] = 'All fields are required.';
    }

    if ($new_password !== $confirm_password) {
        $errors[] = 'New password and confirmation do not match.';
    }

    if (strlen($new_password) < 8) {
        $errors[] = 'New password must be at least 8 characters.';
    }

    if (empty($errors)) {
        // Fetch user's current password hash
        $stmt = $pdo->prepare('SELECT password FROM users WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($current_password, $user['password'])) {
            $errors[] = 'Current password is incorrect.';
        } else {
            // Update password
            $hash = password_hash($new_password, PASSWORD_DEFAULT);
            $update = $pdo->prepare('UPDATE users SET password = :p WHERE id = :id');
            $update->execute([':p' => $hash, ':id' => $_SESSION['user_id']]);
            $_SESSION['password_success'] = 'Password updated successfully.';
            header('Location: ../pages/profile.php');
            exit;
        }
    }
}

if (!empty($errors)) {
    $_SESSION['password_errors'] = $errors;
    header('Location: ../pages/profile.php');
    exit;
}
