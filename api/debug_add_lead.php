<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "crm_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Simulate POST data
$name = "Test Lead " . time();
$email = "test" . time() . "@example.com";
$phone = "1234567890";
$company = "Test Corp";
$status = "New";

$stmt = $conn->prepare("INSERT INTO leads (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $email, $phone, $company, $status);

if ($stmt->execute()) {
    echo "Lead added successfully. ID: " . $stmt->insert_id;
} else {
    echo "Error adding lead: " . $stmt->error;
}
$stmt->close();
$conn->close();
?>
