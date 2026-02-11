<?php
require 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM events";
    $result = $conn->query($sql);
    
    $events = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
    }
    echo json_encode($events);


    } elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if it's an update
    if (isset($data['id'])) {
        $id = $data['id'];
        $title = $data['title'];
        $start = $data['start'];
        
        // Handle optional end date (default to start + 1 hour if not provided)
        if (!isset($data['end']) || empty($data['end'])) {
             $end = date('Y-m-d\TH:i:s', strtotime($start . ' +1 hour'));
        } else {
             $end = $data['end'];
        }

        $description = isset($data['description']) ? $data['description'] : '';
        $calendar = isset($data['calendar']) ? $data['calendar'] : 'Primary';
        $source = isset($data['source']) ? $data['source'] : 'web';

        $stmt = $conn->prepare("UPDATE events SET title=?, start_date=?, end_date=?, description=?, calendar=?, source=? WHERE id=?");
        $stmt->bind_param("ssssssi", $title, $start, $end, $description, $calendar, $source, $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Event updated successfully"]);
        } else {
             http_response_code(500);
            echo json_encode(["error" => "Error updating event: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        // Create new event
        $title = $data['title'];
        $start = $data['start']; // expects ISO date string
        
        // Handle optional end date for new events
        if (!isset($data['end']) || empty($data['end'])) {
             $end = date('Y-m-d\TH:i:s', strtotime($start . ' +1 hour'));
        } else {
             $end = $data['end'];
        }

        $description = isset($data['description']) ? $data['description'] : '';
        $calendar = isset($data['calendar']) ? $data['calendar'] : 'Primary';
        $source = isset($data['source']) ? $data['source'] : 'web';
    
        $stmt = $conn->prepare("INSERT INTO events (title, start_date, end_date, description, calendar, source) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $title, $start, $end, $description, $calendar, $source);
    
        if ($stmt->execute()) {
            echo json_encode(["message" => "Event added successfully", "id" => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error adding event: " . $stmt->error]);
        }
        $stmt->close();
    }
}


$conn->close();
?>
