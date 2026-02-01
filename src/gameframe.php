<!DOCTYPE html>
<html>
  <style>
    body,html {
      margin:0;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
        canvas{
          width: 100%;
          height: 100%; 
          position: absolute;
          top:0;
          bottom: 0;
          image-rendering: pixelated;
        }
  </style>
  <body>
    <div style="display:none;" id="gamesaves"></div>
    <canvas id="canvas"></canvas>

    <script src="./engine/dist/engine.js"></script>
    <?php echo
     "<script src='./games/dist/" . $_GET['j'] . ".js'></script>"
    ?>


    
  </body>
</html>