# Objects (main)
  - ActionGame (your game class should extend this)
    - constructor: `super(target : HTMLCanvasElement, canvaswidth : number, canvasheight : number)`
    - Methods:
      - `parseGani(file:string)` :
        - Loads a gani file and returns an array of `Animation` objects representing each one direction of the animation.
        - (ex.: `this.idle  = game.parseGani("assets/idle.gani")`)

      - `newTiledLevel(leveln:number)` : async - returns a `Level` object from the `levels` field.
        - Has 1 argument:
          - `leveln : number` = the index of the level object in the `levels` field.
        - (ex.: `game.currentLevel = game.newTiledLevel(0)`)

      - `displayLevel(level:Level)` - protected :
        - Creates the `Frame` (`game.gameframe`) object on which your level and its objects are to be displayed.
        - Creates a Camera at `game.gameframe.camera` for which you have to set the actor.
        - Has 1 argument:
          - `level : Level` a level object on which `newTiledLevel` has been run

      - `buildAni(anibuild:T.AniBuild)` - returns `Animation` object.

      - `buildSnap(snapbuild:T.SnapBuild)` - returns `Snap` object.

      - `addCapture()`

      - `addAsCollision()`

      - `addGrid()`

      - `frameGame()` - call to create `Window`'s frame which will use a the `gameframe` `Game` field. Therefore, `displayLevel` should be called prior.

      - `load()` async
        - Overload this function in your custom Game class. `super()` call required.

      - `run()`
        - Overload this function in your custom Game class. `super([])` call required


    - Fields:
      - `gamename` : IS TOO IMPORTANT

      - `levels` : populate with an array of classes extending the Level class (through new).
        - Level data is preserved.

      - `gameframe` : The level representation with everything in it. The game's `Frame` which is relative to camera position. It is created and populated with `Game.displayLevel`. As a frame, its `rprops` can be modified.

      - `window` :
        - Fields :

          - `frm` : Window's `Frame`. As a frame, its `rprops` can be modified. It uses a special shader to display everything upright therefore changing its shader is unadvised unless you want everything upside down.

# Object (gameobjects)

  - Level (a level class to extend for each level)

    - Methods:
      - `buildCell(file:string, glContext, shadercontext)` : async
        - Loads level's ini file. Then loads a graphical representation of the level.
        - Has 3 arguments:
          - `file : string` = the ini file with its relative path
          - `glContext` = the glContext field from the game object
          - `shadercontext` = the shadercontext field from the game object
        - (ex.: `await this.buildCell("assets/myinifile.ini",game.glContext,game.shadercontext)`)


  - Player (a special gameobject class to which you can bind key actions)
    - Methods:
      - `registerkey(key:string, actions : T.KeyboardAction)` :
        - Registers a key and its actions.
        - Has 2 arguments:
          - `key : string` = the key (' ' for space, 'ArrowUp" for the up arrow, 's' for S etc... as output if you look at your keypresses through console)
          - `actions : T.KeyboardAction` = a series of functions that should happen when a key action is detected:

        - ex.:
  ```this.registerkey('ArrowUp', {
    keyup: ()=>{
      this.myFrame.frame = [this.character.idle[this.dir]];
    },
    keypressed: ()=>{
      this.dir = 0;
      this.myFrame.frame = [this.character.walk[this.dir]];
      this.movementvector.y = -1
    }
  });
  ```

    - Fields:

      - `triggers : Array<T.Trigger>` : Triggers can be injected in this field to act upon it, iterating through it on update.
        - ex.:
  ```private handleTriggers(){
    while(this.triggers.length > 0){
      let t = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "attacked":
          this.health--;
          if(this.health <= 0) this.myFrame.rprops.hidden = true;
        break;
      }
    }
  }
  ```

  - Fauna (a gameobject class for npcs):
    - Methods:
      - `switchaction(action : string)` : Fauna objects have a special characteristic called "actions" which you can use to put life into them. More explanation in a later section.
    - Fields:
      - `triggers : Array<T.Trigger>` : Triggers can be injected in this field to act upon it, iterating through it on update.
        - ex.: 

# Objects (Composite)
  - `Composite` (common to each `Composite` object)
    - Methods:
      - `getclientbounds` : returns "client bounds". The composite position in screen coordinates relative to the canvas origin + its width and height; with scaling taken into account.
        - Returns Bounds = {x:number,y:number,w:number,h:number}.
        - Itself uses multiple functions: `getclientleft`, `getclienttop`, `getclientwidth`, `getclientheight`.
    - Fields:
      - `rprops` : `T.RenderProperties`

  - `Frame` (container for Animation)
  - `Animation` (container for Snap which can contain multiple frames)
  - `Snap` (Can contain multiple Snap that will be represented as one image)
  
# Types (T)
  - `T.KeyboardAction`
    ```
      = {
        keydown   ?: ()=>void,
        keyheld   ?: ()=>void,
        keypressed?: ()=>void, //keydown and key held
        keyup     ?: ()=>void,
      }
    ```
  - `T.Trigger`
    ```
      = {
        name  : string,
        state?: string
      }
    ```
  - `T.RenderProperties`
    ```
      = {
        shader?   : string,  // would require you to make and compile as shader that is compliant to this engine, don't use

        pos       : Point, // Point = {x:number,y:number}
        flip      : Flip

        rotcenter?: Point,
        angle     : number,

        scalecenter?: Point,
        scale       : Point,

        layer     : number,
        hidden    : boolean,

        colorize? : Array<number>, // not implemented
      }
    ```
# How to run the project