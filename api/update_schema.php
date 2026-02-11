<?php
require 'db.php';

$columns = [
    "phone VARCHAR(20)",
    "bio TEXT",
    "title VARCHAR(100)",
    "country VARCHAR(100)",
    "city VARCHAR(100)",
    "postal_code VARCHAR(20)",
    "tax_id VARCHAR(50)",
    "photo VARCHAR(255)",
    "social_facebook VARCHAR(255)",
    "social_twitter VARCHAR(255)",
    "social_linkedin VARCHAR(255)",
    "social_instagram VARCHAR(255)"
];

foreach ($columns as $col) {
    // Check if column exists to avoid errors on re-run (ignoring for simplicity in this quick script, just trying ADD)
    // Actually, let's use a cleaner approach: try ADD, ignore error if exists.
    $parts = explode(' ', $col);
    $colName = $parts[0];
    
    // Check if column exists
    $check = $conn->query("SHOW COLUMNS FROM users LIKE '$colName'");
    if($check->num_rows == 0) {
        $sql = "ALTER TABLE users ADD COLUMN $col";
        if ($conn->query($sql) === TRUE) {
            echo "Column $colName added successfully\n";
        } else {
            echo "Error adding column $colName: " . $conn->error . "\n";
        }
    } else {
        echo "Column $colName already exists\n";
    }
}

$conn->close();
?>
