type Game = {
  mydiv   : HTMLElement,
  gamesave: HTMLElement,
  tree    : HTMLElement[],

}

export class Manager {
  private static debugmode : boolean = true;
  // public static gamesaves : string[] = [];
  private static savecount : number = 0;
  public static games : Game[] = [];
  public static currentGame : number;
  public static currentTarget : HTMLCanvasElement;

  public static addGameSave(gamesave: HTMLElement, gamenumber : number = -1){
    if(gamenumber<0){
      gamenumber = Manager.savecount;
      Manager.savecount++;
    }// this.gamesaves.push(gamesave);
    if(gamenumber>=Manager.games.length){
      gamenumber = Manager.games.length - 1;
    }

    let thisgame : Game = Manager.games[gamenumber]
    thisgame.gamesave = gamesave;

    const config = {
    childList: true,       // Watch for added/removed child elements
    subtree: true,         // Include all descendants
    characterData: true    // Watch for text changes
    };

      // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          console.log('Child nodes changed:', mutation);
          Manager.games[gamenumber].tree.push(...mutation.addedNodes);
        } else if (mutation.type === 'characterData') {
          console.log(mutation);
        }
      }
    };

    // Create an observer instance
    const observer = new MutationObserver(callback);
    // Start observing the target node
    observer.observe(gamesave, config)

    // Manager.savecount++;
  }

  public static createGame(gameName: string): HTMLElement {
    let win = document.createElement('div');
    win.className = "window";



    let grabDiv = document.createElement('div');
    grabDiv.className = "grabbar syne-mono-regular";
    let inspan = document.createElement('span');
    inspan.innerHTML = gameName;
    grabDiv.appendChild(inspan);
    // innerHTML = gameName;
    grabDiv.addEventListener('mousedown', (e)=>{
      let offsetX = e.clientX - win.getBoundingClientRect().left;
      let offsetY = e.clientY - win.getBoundingClientRect().top;
      grabDiv.onmousemove = (ev)=>{
       win.style.left = (ev.clientX - offsetX) + 'px';
       win.style.top  = (ev.clientY - offsetY) + 'px';
      }
    })
    grabDiv.addEventListener('mouseup', (e)=>{
      grabDiv.onmousemove = null;
    })

    // let iframe =document.createElement('iframe');
    // iframe.className = "gameframe";
    // iframe.src = "gameframe.php?j=" + gameName;
    // div.appendChild(iframe);
    let cnv = document.createElement("canvas");
    cnv.id = "canvas";
    Manager.currentTarget = cnv;
    console.log(Manager.currentTarget)
    // let script = document.createElement('script');
    let script2 = document.createElement('script');
    // script.src = "engine/dist/engine.js";
    script2.src = "games/dist/"+gameName+".js"+(Manager.debugmode?"?"+Date.now():"");

    let content = document.createElement('div');
    content.className = "gamecontent"
    
    win.appendChild(grabDiv);
    content.appendChild(cnv);
    win.appendChild(content);
    // window.appendChild(script);
    document.body.appendChild(win);
    win.appendChild(script2);

    let game : Game = {
      mydiv: win,
      gamesave: null!,
      tree: []
    }
    Manager.games.push(game);

    return win;
  }
}