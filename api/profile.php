<?php
require 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// Get User ID from Query Param (In production, use Session/Token)
$user_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($user_id === 0) {
    http_response_code(400);
    echo json_encode(["error" => "User ID required"]);
    exit;
}

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT id, name, email, role, phone, bio, title, country, city, postal_code, tax_id, photo, social_facebook, social_twitter, social_linkedin, social_instagram FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
    }
    $stmt->close();
} elseif ($method === 'POST') {
    // Check if it's a file upload
    if (isset($_FILES['photo'])) {
        $target_dir = "../uploads/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        
        $file_extension = pathinfo($_FILES["photo"]["name"], PATHINFO_EXTENSION);
        $new_filename = "user_" . $user_id . "_" . time() . "." . $file_extension;
        $target_file = $target_dir . $new_filename;
        
        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
            $photo_url = "/uploads/" . $new_filename; // Relative path for frontend
            
            $stmt = $conn->prepare("UPDATE users SET photo = ? WHERE id = ?");
            $stmt->bind_param("si", $photo_url, $user_id);
            
            if ($stmt->execute()) {
                echo json_encode(["message" => "Photo uploaded successfully", "photo" => $photo_url]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database update failed"]);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(["error" => "File upload failed"]);
        }
    } else {
        // Regular profile update
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
             http_response_code(400);
             echo json_encode(["error" => "Invalid JSON input"]);
             exit;
        }

        // Prepare UPDATE statement dynamically based on provided fields
        $fields = [];
        $params = [];
        $types = "";
        
        $allowed_fields = ['name', 'phone', 'bio', 'title', 'country', 'city', 'postal_code', 'tax_id', 'social_facebook', 'social_twitter', 'social_linkedin', 'social_instagram'];
        
        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
                $types .= "s";
            }
        }
        
        if (empty($fields)) {
            echo json_encode(["message" => "No changes provided"]);
            exit;
        }
        
        $params[] = $user_id;
        $types .= "i";
        
        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
             // Fetch updated user to return
            $stmt_fetch = $conn->prepare("SELECT id, name, email, role, phone, bio, title, country, city, postal_code, tax_id, photo, social_facebook, social_twitter, social_linkedin, social_instagram FROM users WHERE id = ?");
            $stmt_fetch->bind_param("i", $user_id);
            $stmt_fetch->execute();
            $updated_user = $stmt_fetch->get_result()->fetch_assoc();
            
            echo json_encode(["message" => "Profile updated", "user" => $updated_user]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Update failed: " . $conn->error]);
        }
    }
}

$conn->close();
?>
