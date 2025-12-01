<?php
session_start();
require_once __DIR__ . '/../config.php'; // Database connection

// Redirect to login if not logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: ../pages/login.php');
    exit;
}

// Fetch user info from the database
$stmt = $pdo->prepare('SELECT id, username, email FROM users WHERE id = :id LIMIT 1');
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    // If user not found, destroy session and redirect
    session_destroy();
    header('Location: ../pages/login.php');
    exit;
}

// Handle password update messages (set in change_password.php)
$passwordErrors = $_SESSION['password_errors'] ?? [];
$passwordSuccess = $_SESSION['password_success'] ?? '';
unset($_SESSION['password_errors'], $_SESSION['password_success']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CINERATE - UI MODE</title>

  <link rel="stylesheet" href="../assets/style/style.css" />
  <link rel="stylesheet" href="../assets/style/star-rating.css" />
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="logo">
    <a href="ui.html">
      <img src="../assets/image/logo.png" alt="CINERATE Logo">
    </a>
  </div>

  <div class="search-container">
    <input type="text" placeholder="Search" class="search-bar" />
    <i class="fa fa-search search-icon"></i>
  </div>

    <button class="menu-btn">☰</button>
    <ul class="menu-dropdown">
      <li><a href="ui.html">Home</a></li>
      <li><a href="profile.php">Profile</a></li>
      <li><a href="watchlist.html">Watchlist</a></li>
      <li><a href="../index.html">Logout</a></li>
    </ul>
  </div>
</nav>
<!-- PROFILE SECTION -->
<section class="profile-section">
  <h1>My Profile</h1>

  <?php if (!empty($passwordErrors)): ?>
    <div class="alert error">
      <ul>
        <?php foreach ($passwordErrors as $err): ?>
          <li><?=htmlspecialchars($err)?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <?php if ($passwordSuccess): ?>
    <div class="alert success"><?=htmlspecialchars($passwordSuccess)?></div>
  <?php endif; ?>

  <div class="profile-info">
    <div class="info-box">
      <label>Username:</label>
      <span><?=htmlspecialchars($user['username'])?></span>
    </div>
    <div class="info-box">
      <label>Email:</label>
      <span><?=htmlspecialchars($user['email'])?></span>
    </div>
  </div>

  <!-- Change Password Form -->
  <div class="change-password">
    <h2>Change Password</h2>
    <form method="post" action="/Platform_filmrating/scripts/change_password.php">
      <label for="current-password">Current Password</label>
      <input type="password" id="current-password" name="current_password" required>

      <label for="new-password">New Password</label>
      <input type="password" id="new-password" name="new_password" required>

      <label for="confirm-password">Confirm New Password</label>
      <input type="password" id="confirm-password" name="confirm_password" required>

      <button type="submit">Update Password</button>
    </form>
  </div>

  <!-- Other Profile Options -->
  <div class="profile-options">
    <div class="info-box">
      <label>Update Profile Info</label>
      <a href="edit_profile.php" class="btn">Edit</a>
    </div>
    <div class="info-box">
      <label>Delete Account</label>
      <a href="delete_account.php" class="btn">Delete</a>
    </div>
    <div class="info-box">
      <label>Log Out</label>
      <a href="../index.html" class="btn">Log Out</a>
    </div>
  </div>
</section>

<!-- Link external JS for navbar burger -->
<script src="../js/navbar.js"></script>

</body>
</html>