<?php
require 'db.php';

$check = $conn->query("SHOW COLUMNS FROM events LIKE 'calendar'");
if($check->num_rows == 0) {
    $sql = "ALTER TABLE events ADD COLUMN calendar VARCHAR(20) DEFAULT 'Primary'";
    if ($conn->query($sql) === TRUE) {
        echo "Column calendar added successfully\n";
    } else {
        echo "Error adding column: " . $conn->error . "\n";
    }
} else {
    echo "Column calendar already exists\n";
}
$conn->close();
?>
