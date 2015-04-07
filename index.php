<?php 
session_start();
if(!isset($_SESSION['allowed'])){
    $_SESSION['allowed'] = ['mainMenu.php', 'lvl1.php'];
}
?>
<!DOCUMENT html>
<html>
    <head>
        <meta charset="utf-8">
        <title>The Tower</title>
        <script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/main.js"></script>
        <link rel="stylesheet" href="stylesheets/main.css">
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
        
    </body>
</html>