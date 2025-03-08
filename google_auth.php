<?php
session_start();
$host = "localhost";
$username = "root";
$password = "";
$database = "login_db";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$google_id = $data['id'];
$email = $data['email'];
$name = $data['name'];

// Check if user exists
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $_SESSION['user_id'] = $row['id'];
    echo json_encode(["success" => true]);
} else {
    // Insert new user
    $sql = "INSERT INTO users (username, email, password) VALUES ('$name', '$email', '')";
    if ($conn->query($sql) === TRUE) {
        $_SESSION['user_id'] = $conn->insert_id;
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

$conn->close();
?>