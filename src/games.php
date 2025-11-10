    <?php
    header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache"); ?>

<style>

  #gobutton {
    position: relative;
    border-radius:50%;
    background: red;
    z-index: 5;
    aspect-ratio: 1/1;
    width: 50%;
    font-size: 10vh;
    left: 50%;
    transform: translate(-50%,0);
    visibility: hidden;
  }

  #gobutton > p {
    position: relative;
    top: 50%;
    transform: translate(0,-50%);
    text-shadow: 2px 2px 10px black;
  }

</style>

<div class="container">
  <div id="ui">
    <div id="instructions" style="pointer-events: none;"></div>
    <div id="gobutton"><p>GO</p></div>

  </div>
</div>
<canvas id="canvas"></canvas>
    <div id="clickables">
      <!-- <div id="sword"><img src="./_assets/swordicon.png"/></div> -->
    </div>
     <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
    <script>//eruda.init();</script>
    <script src="./web.bundle.js"></script>
    
