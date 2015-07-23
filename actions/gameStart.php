<?php
session_start();
require_once('connect.php');

if(isset($_POST['level']) && isset($_POST['gMode'])){
    $level =  $_POST['level'];
    $gMode =  $_POST['gMode'];


    $_SESSION['level'] = $level;
    $_SESSION['gMode'] = $gMode;
    $_SESSION['allowed'][] = $_POST['level'].'.php';

    $query = "SELECT score FROM high_scores WHERE level='$level' && gameMode='$gMode' ORDER BY `high_scores`.`score` DESC";
    $results = mysqli_query($CONN, $query);

    if(mysqli_num_rows($results) > 0){
    	while($row = mysqli_fetch_assoc($results)){
    		$scores[] = $row['score'];
    	}
    }else{
    	$scores[] = 0;
    }

    $output['success'] = true;
    $output['session'] = $_SESSION;
    $output['highScores'] = $scores;
    
}else{
    $output['success'] = false;
    $output['errors'] = 'No POST data recieved';
}

echo json_encode($output);