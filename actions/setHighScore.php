<?php
session_start();
require_once('connect.php');

$output['success'] = false;

if(isset($_POST['score'])  isset($_SESSION['level']) && isset($_SESSION['gMode'])){
    $level = $_SESSION['level'];
    $gMode = $_SESSION['gMode'];
    
    $query = "SELECT * FROM high_scores WHERE level='$level' && gameMode='$gMode' ORDER BY `high_scores`.`score` DESC";
    
    $results = mysqli_query($CONN, $query);
    
    if(mysqli_num_rows($results) > 0){
        $position = 1;
        while($row = mysqli_fetch_assoc($results)){
            $html[] = "<tr><td>$position</td><td>$row[name]</td><td>$row[score]</td><td>$row[level]</td><td>$row[gameMode]</td></tr>";
            $rawData[] == $row;
            $position++;
        }
        $output['success'] = true;
        $output['html'] = $html;
        $output['rawData'] = $rawData;
    }else{
        $output['msgs'][] = 'No scores for this level yet';
        $output['msgs'][] = $query;
    }
}else{
    $output['errors'][] = 'No POST data recieved';
}

echo json_encode($output);