<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>ITEZ AYE GAIM!</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet">
    <style>
      html{
            overscroll-behavior: none;
            overflow:hidden;
              touch-action: manipulation;

      }
        body{
            position:absolute;
            width: 100vw;
            height: 100vh;
            /* overflow:hidden; */
            margin: 0;
            background-color: darkslategray;

        }

        .container {
          position:absolute;
          aspect-ratio: 800 / 1500;
          /* width: 800px; */
          height: 75vh;
          top: 10%;
          left: 50%;
          transform: translate(-50%, 0);
          border: 5px solid white;
          z-index: -1;
        }
        
        canvas{
          width: 100%;
          height: 100%; 
          position: absolute;
          top:0;
          bottom: 0;
          image-rendering: pixelated;
        }

        #ui{
          pointer-events: none;
          width: 100%;
          height: 100%;
          z-index: 3;
          /* transform:  */
          /* background-color:white; */
          position:absolute;
          top:0;
          left:0;
        }

        #clickables{
          width:100%;
          height:10vh;
          z-index: 1;
          position: absolute;
          bottom:0px;
        }

        #sword {
      background: white;
          height: 100%;
          aspect-ratio: 1/1;
          border-radius:50%;
          position: absolute;
          top:-10vh;
          left: 50%;
          transform: translate(-50%, 0);
          border: 5px solid white;

        }

        #sword > img {
          position: absolute;
          top:40%;
          left:30%;
          transform: translate(-50%,-50%);
          pointer-events: none;
          
          /* clip-path: inset(14px 48px 24px 28px);; */
          width:25%;
          transform: scale(3);
          image-rendering: pixelated;

        }
    </style>
  </head>

  <body>
    <div style="display:none;">
      
      <div id="gametoload"><?php echo $_GET['j'] ?></div>

    </div>
    <!-- <script> -->
            <?php 
          include "game.html";
        ?>
        
  </body>
</html>