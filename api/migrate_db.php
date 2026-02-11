<?php
require 'db.php';

header('Content-Type: application/json');

$response = [];
$errors = [];

// Function to add column if it doesn't exist
function addColumnIfNotExists($conn, $table, $column, $definition) {
    try {
        $check = $conn->query("SHOW COLUMNS FROM $table LIKE '$column'");
        if ($check->num_rows == 0) {
            $sql = "ALTER TABLE $table ADD COLUMN $column $definition";
            if ($conn->query($sql) === TRUE) {
                return "$column added successfully";
            } else {
                return "Error adding $column: " . $conn->error;
            }
        } else {
            return "$column already exists";
        }
    } catch (Exception $e) {
        return "Exception adding $column: " . $e->getMessage();
    }
}

// Add 'calendar' column
$response[] = addColumnIfNotExists($conn, 'events', 'calendar', "VARCHAR(20) DEFAULT 'Primary'");

// Add 'source' column
$response[] = addColumnIfNotExists($conn, 'events', 'source', "VARCHAR(20) DEFAULT 'web'");

$conn->close();

echo json_encode(["status" => "completed", "results" => $response]);
?>
