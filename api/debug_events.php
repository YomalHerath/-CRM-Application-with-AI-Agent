<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "crm_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM events";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $events = [];
        while($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
        echo json_encode($events, JSON_PRETTY_PRINT);
    } else {
        echo "No events found in table.";
    }
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
?>
