<?php
session_start();
require_once('connect.php');

$output['success'] = false;

if(isset($_POST['score']) && isset($_POST['name'])){

	$score = $_POST['score'];
	$name = $_POST['name'];
	$level = $_SESSION['level'];
	$gMode = $_SESSION['gMode'];

	if($name != NULL){

		$query = "INSERT INTO `ninjatower`.`high_scores` (`id`, `score`, `name`, `level`, `gameMode`) VALUES (NULL, '$score', '$name', '$level', '$gMode')";

		mysqli_query($CONN, $query);

		if(mysqli_affected_rows($CONN)){
			$output['success'] = true;
			$output['scoreData'] = getHighScores();
		}
	}else{
		$output['success'] = true;
		$output['scoreData'] = getHighScores();
	}
}

echo json_encode($output);


function getHighScores(){

	global $level;
	global $gMode;
	global $CONN;

	$query = "SELECT * FROM high_scores WHERE level='$level' && gameMode='$gMode' ORDER BY `high_scores`.`score` DESC";
    
    $results = mysqli_query($CONN, $query);
    
    if(mysqli_num_rows($results) > 0){
        $position = 1;
        while($row = mysqli_fetch_assoc($results)){
            $html[] = "<tr><td>$position</td><td>$row[name]</td><td>$row[score]</td><td>$row[level]</td><td>$row[gameMode]</td></tr>";
            $rawData[] = $row;
            $position++;
        }
        $output['success'] = true;
        $output['html'] = $html;
        $output['rawData'] = $rawData;
    }else{
    	$output['success'] = false;
        $output['msgs'][] = 'No scores for this level yet';
        $output['msgs'][] = $query;
    }

    return $output;
}
?>