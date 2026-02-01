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
      <div id="sword"><img src="./_assets/swordicon.png"/></div>
    </div>
    <pre id="strudcode" style="display:block;color:white;z-index:4;"><!--stack(
s("bd ~ [<bd,bd> bd] sd").bank('RolandTR909'))-->
    </pre>
    <!-- <script src="https://cdn.jsdelivr.net/npm/eruda"></script> -->
    <script>//eruda.init();</script>
    <script type="module">
      import { controls, repl, evalScope } from 'https://cdn.skypack.dev/@strudel/core@0.11.0';
      import { mini } from 'https://cdn.skypack.dev/@strudel/mini@0.11.0';
      import { transpiler } from 'https://cdn.skypack.dev/@strudel/transpiler@0.11.0';
      import {
        getAudioContext,
        webaudioOutput,
        initAudioOnFirstClick,
        registerSynthSounds,
        // audioWorklet,
      } from 'https://cdn.skypack.dev/@strudel/webaudio@0.11.0';
      const ctx = getAudioContext();
      
      const loadModules = evalScope(
          controls,
          import('https://cdn.skypack.dev/@strudel/core@0.11.0'),
          import('https://cdn.skypack.dev/@strudel/mini@0.11.0'),
          import('https://cdn.skypack.dev/@strudel/tonal@0.11.0'),
          import('https://cdn.skypack.dev/@strudel/webaudio@0.11.0'),
        );
      const initAudio = Promise.all([initAudioOnFirstClick(), registerSynthSounds()]);

      const { evaluate } = repl({
        defaultOutput: webaudioOutput,
        getTime: () => ctx.currentTime,
        transpiler,
      });

//       let tttmusic = false;
      
      document.getElementById('sword').addEventListener('click',async ()=>{
        await loadModules;
        // console.log(document.getElementById('strudcode').innerHTML.slice(4,document.getElementById('strudcode').innerHTML.length-8));
        await initAudio;
        // evaluate(document.getElementById('strudcode').innerHTML.slice(4,document.getElementById('strudcode').innerHTML.length-8));)
        // console.log("FDS")
        // tttmusic = true;
      })

      // async function thinkitthrough(){
      //   // if(tttmusic){
      //   await loadModules;
      //   await initAudio;
      //     evaluate(document.getElementById('strudcode').innerHTML)
      //   // }
      //   console.log("////")
      //   // setTimeout(thinkitthrough, 2000);
      // }

      // await thinkitthrough();


    </script>
    <!-- <script src="./web.bundle.js"></script> -->
    
