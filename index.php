<?php 
session_start();
if(!isset($_SESSION['allowed'])){
    $_SESSION['allowed'][] = 'mainMenu.php';
}
?>
<!DOCUMENT html>
<html>
    <head>
        <meta charset="utf-8">
        <title>The Tower</title>
        <link rel="stylesheet" href="stylesheets/main.css">
        <script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/main.js"></script>
    </head>
    <body>
        
        <section id="main-area">
           <?php 
                $allowed = ['mainMenu.php', 'lvl1.php']; //$_SESSION['allowed'];
                if(!isset($_GET['page'])){$_GET['page'] = "mainMenu.php";}
                $i = count($allowed);

                while(!isset($page)){
                    if($allowed[$i-1] === $_GET['page']){
                        $page = $_GET['page'];
                    }elseif($i <= 1){
                        $page = "404.php";
                    }
                    $i--;
                }
                
                require_once($page); 
           ?>
        </section>
        
        <section id="side-menu">
            <div id="sm-title">Game Over</div><br>
            <div id="score-text">Score:</div>
            <div id="sm-score"></div><br>
            <div id="bonus-text">Bonus:</div>
            <div id="sm-bonus">X <span id="bonus"></span></div><br>
            <div id="total-text">Total:</div>
            <div id="sm-totalScore"></div>
            <div class="sm-btn btn menu-text" id="play-again">Play Again</div>
            <div class="sm-btn btn menu-text" id="next-level">Next Level</div>
            <div class="sm-btn btn menu-text" id="quit">Quit</div>
        </section>
        

    </body>
</html>