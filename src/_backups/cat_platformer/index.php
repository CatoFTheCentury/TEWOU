<!DOCTYPE html>
<html>
  <head>
    <?php
    header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache"); ?>

    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <style>
        @font-face {
          font-family: 'MyWebFont';
          src: url('SundayVibe.ttf')  format('truetype');
        }
        body{
            position:absolute;
            width: 100vw;
            height: 100vh;
            /* overflow:hidden; */
            margin: 0;
            background-color: darkslategray;
            font-family: 'MyWebFont';
        }
        a {
          color: antiquewhite;
          font-size: 100px;
          text-decoration: none;
        }
        #gamelist{
          width: fit-content;
          position:absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
        .gamechoice{
          /* border: 5px solid white; */
          padding-bottom: 100px;
          position: relative;
          width: fit-content;
          height: fit-content;
          top:0;
        }

        /* .gamechoice > a {
          position: relative;
          top:0px;
        } */
    </style>
  </head>
  <body>
    <div id="gamelist">
      <div class="gamechoice">
        <a href="game.php?j=arbre">
          <img src="_assets/icon_arbre.png" /></br>
        L'arbre</a>
      </div>
      <div class="gamechoice">
        <a href="game.php?j=plat">
          <img src="_assets/icon_arbre.png" /></br>
        Bientôt!</a>
      </div>
    </div>
  </body>
</html>