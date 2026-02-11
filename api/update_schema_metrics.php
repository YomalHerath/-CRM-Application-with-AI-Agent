<?php
require 'db.php';

// Add 'source' column to events table to track Voice Agent bookings
$sql = "ALTER TABLE events ADD COLUMN source VARCHAR(50) DEFAULT 'web'";

if ($conn->query($sql) === TRUE) {
    echo "Table 'events' altered successfully. Added 'source' column.";
} else {
    echo "Error altering table: " . $conn->error;
}

$conn->close();
?>
