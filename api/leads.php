<?php
require 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List all leads or one
    $sql = "SELECT * FROM leads ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $leads = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $leads[] = $row;
        }
    }
    echo json_encode($leads);

} elseif ($method === 'POST') {
    // Add new lead
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'];
    $email = isset($data['email']) ? $data['email'] : '';
    $phone = isset($data['phone']) ? $data['phone'] : '';
    $company = isset($data['company']) ? $data['company'] : '';
    $status = isset($data['status']) ? $data['status'] : 'New';

    $stmt = $conn->prepare("INSERT INTO leads (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $phone, $company, $status);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Lead added successfully", "id" => $stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error adding lead: " . $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'PUT') {
    // Update lead
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = $data['id'];
    $status = $data['status']; // For now just updating status, extend as needed

    $stmt = $conn->prepare("UPDATE leads SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Lead updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error updating lead: " . $stmt->error]);
    }
    $stmt->close();
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM leads WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Lead deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error deleting lead"]);
    }
    $stmt->close();
}

$conn->close();
?>
