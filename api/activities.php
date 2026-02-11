<?php
require 'db.php';

header('Content-Type: application/json');

// For now returning mock stats or aggregating data
// Later can be real activities table

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get counts
    $leads_count = $conn->query("SELECT count(*) as count FROM leads")->fetch_assoc()['count'];
    $events_count = $conn->query("SELECT count(*) as count FROM events")->fetch_assoc()['count'];
    $users_count = $conn->query("SELECT count(*) as count FROM users")->fetch_assoc()['count'];
    
    // Activities / Stats
    // Activities / Stats
    $books_submitted = $conn->query("SELECT count(*) as count FROM events WHERE source='voice_ai'")->fetch_assoc()['count'];
    $tasks_completed = $conn->query("SELECT count(*) as count FROM events WHERE source='voice_ai' AND (calendar='task' OR title LIKE '%Task%')")->fetch_assoc()['count'];
    
    // Voice Agent Stats
    $voice_stats = [
        "books_submitted" => $books_submitted ?? 0,
        "tasks_completed" => $tasks_completed ?? 0,
        "active_calls" => 0 // Placeholder
    ];

    echo json_encode([
        "leads" => $leads_count,
        "events" => $events_count,
        "users" => $users_count,
        "voice_agent" => $voice_stats
    ]);
}

$conn->close();
?>
