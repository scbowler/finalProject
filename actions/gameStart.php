<?php
session_start();

if(isset($_POST['level']) && isset($_POST['gMode'])){
    $_SESSION['level'] = $_POST['level'];
    $_SESSION['gMode'] = $_POST['gMode'];
    $_SESSION['allowed'][] = $_POST['level'].'.php';
    $output['success'] = true;
}else{
    $output['success'] = false;
    $output['errors'] = 'No POST data recieved';
}

echo json_encode($output);