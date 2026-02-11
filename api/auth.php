<?php
require 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($action === 'register') {
        $name = $data['name'];
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        // Check if email exists
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();
        
        if ($check->num_rows > 0) {
            echo json_encode(["error" => "Email already exists"]);
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User registered successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $stmt->error]);
        }
        $stmt->close();
    } elseif ($action === 'login') {
        $email = $data['email'];
        $password = $data['password'];

        $stmt = $conn->prepare("SELECT id, name, password, role, phone, bio, title, country, city, postal_code, tax_id, photo, social_facebook, social_twitter, social_linkedin, social_instagram FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                // Return user info (In production, use JWT or Session)
                unset($user['password']);
                echo json_encode(["message" => "Login successful", "user" => $user]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Invalid password"]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
        }
        $stmt->close();
    }
}
$conn->close();
?>
