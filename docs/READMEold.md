# Objects (main)
  - Engine : Used to bootstrap the game
    - usage:
    ```
      let game = new ActionGame(HTMLCanvasElement);
      Engine.start(game).then(()=>{
        Engine.games.push(game);
        Engine.mainLoop()
      })
    ```
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

      - `buildAni(T.AniBuild)` - returns `Animation` object.

      - `buildSnap(T.SnapBuild)` - returns `Snap` object.

      - `addCapture(CaptureProperties)` Add a `Capture` collision object. Will do a callback on collision.

      - `addAsCollision(incarnation:Entity, from: CollideLayers, cwith: CollideLayers, type: CollideTypes)` : Adds `Entity` to the physics layer. The Entity's hitbox must be initiliazed.

      - `addGrid()`

      - `frameGame(Array<Composite>)` - composes what is to be displayed on screen as what is to be displayed as the `window`'s `Frame`.

      - `load()` async
        - Overload this function in your custom Game class. `super()` call required.

      - `run()`
        - Overload this function in your custom Game class. `super([])` call required

      - `registerEntity(Entity)`
        - Register `Entity` to the game; displaying and updating it.

      - `newRectangle(T.Bounds,T.Color)` : creates a rectangle `Composite` with one solid color. You can add it to `Snap` or `Frame` or use it as you initialize an `Entity`, like any `Composite`.
        - ex.: `game.newRectangle({x:0,y:0,w:32,h:32},{r:255,g:255,b:255,a:255})`


    - Fields:
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
        - (ex.: `await this.buildCell("_assets/myinifile.ini",game.glContext,game.shadercontext)`)
  
  - Timeout



# Objects (Entities)
  - Each `Entity` is also an `Alacrity`. Common to each `Alacrity`:
    - Fields:
      - `triggers : Array<T.Trigger>` : Triggers can be injected in this field to act upon it, iterating through it on update.
        - ex.:
            ```
            private handleTriggers(){
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
    - Methods:
      - `addTimeout(durations:Array<number>, actions:TimerActions, repeat : boolean = true, continuous : boolean=true)` returns `Timeout`
      - `destroy()` destroy the Alacrity, removes from screen and update loop.
      - `react(name: string, params: Array<any>):boolean` Meant to be overloaded in an `Entity` so it can answer to `Capture` callbacks. The return value is whether the `Capture` calling the reaction should be deleted. It's like a more powerful version of `triggers`.
        - use example:
          ```
            ...
            call : (owner, target) => {
              target.react(owner, "collect",["bananas", 5])
            }
          ```
        - overload example:
          ```
            react(owner,name,params){
              switch(name){
                case "collect":
                  switch(params[0]){
                    case "bananas":
                      this.bananas += params[1];
                      owner.destroy();
                      return true;
                    break;
                    default:
                      this.coins += 1;
                      owner.destroy();
                      return true;
                    break;
                  }
                case "hurt":
                  this.hp -= params[0]
                break;
              }
              return false;
            }
          ```
  - Common to each entity
    - constructor : `super(Composite)`
      - the composite entered in super will be the image displayed. You can change the image by modifying `myFrame.frame`, which is is an `Array<Composite>`.
    - Fields:
      - `myFrame` : The entity's Frame composite.
      - `movementvector` : A Point {x:number,y:number}, modifying this variable will tell the Entity to move that direction for that frame. Will take blocking terrain into account.
        - ex.: `this.movementvector.x = -1` // makes the entity go left for the current frame at normal speed.

  - Player (a special gameobject class to which you can bind key actions)
    - Methods:
      - `registerkey(key:string, actions : T.KeyboardAction)` :
        - Registers a key and its actions.
        - Has 2 arguments:
          - `key : string` = the key (' ' for space, 'ArrowUp" for the up arrow, 's' for S etc... as output if you look at your keypresses through console)
          - `actions : T.KeyboardAction` = a series of functions that should happen when a key action is detected:

        - ex.:
          ```
          this.registerkey('ArrowUp', {
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



  - Fauna (a gameobject class for npcs):
    - Methods:
      - `switchaction(action : string)` : Fauna objects have a special characteristic called "actions" which you can use to put life into them. More explanation in a later section.
    - Fields:
      - `triggers : Array<T.Trigger>` : Triggers can be injected in this field to act upon it, iterating through it on update.
        - ex.: (same as `Player`)

# Objects (Composite)
  - `Composite` (common to each `Composite` object)
    - Methods:
      - `getclientbounds` : returns "client bounds". The composite position in screen coordinates relative to the canvas origin + its width and height; with scaling taken into account.
        - Returns Bounds = {x:number,y:number,w:number,h:number}.
        - Itself uses multiple functions: `getclientleft`, `getclienttop`, `getclientwidth`, `getclientheight`.
    - Fields:
      - `rprops` : `T.RenderProperties`

  - `Frame` (container for Animation)
    - constructor : `new Frame(game.glContext, game.shadercontext, Array<Composite>)`
    - Fields:
      - `public frame : Array<Composite>`

  - `Animation` (container for Snap which can contain multiple frames)
    - build with `ActionGame.buildAni`

  - `Snap` (Can contain multiple Snap that will be represented as one image)
    - build with `ActionGame.buildSnap`
  
# Types (T)
  - `Point`
    ```
      = {
        x: number,
        y: number
      }
    ```
  - `Bounds`
    ```
      = {
        x : number,
        y : number,
        w : number,
        h : number
      }
    ```
  - `Flip`
    ```
      = {
        flipx : boolean,
        flipy : boolean
      }
    ```
  - `T.SnapBuild`
    ```
      = {
        file   : string,
        srcrect: Bounds,
        dstrect: Bounds
      }
    ```
  - `T.AniBuild`
    ```
      = {
        frames: Array<Array<SnapBuild>>
      }
    ```
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

        pos       : Point,
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
  - `CaptureProperties`
    ```
      = {
        cwith : CollideLayers, // What the capture will collide with / communicate to.
        type  : CollideTypes // The type of collision. Can be set to none if you use a callback.
        hitbox : Bounds  // The hitbox relative to the owner
        owner : Alacrity // The owner Entity, treated like an Alacrity
        call  : the function to be called on collision.  // call : (owner,target)=>{}
      }
    ```
  - `TimerActions`
    ```
      = {
      active?:(timeout:Timeout)=>void,
      triggered?:(timeout:Timeout)=>void
      }
    ```

# Enums
  - `CollideLayers`
    ```
      none         ,
      player       ,
      npc          ,
      grid         ,
      interactable ,
      all          
    ```
  - `CollideTypes`
    ```
      none     ,
      block    ,
      hurt     ,
      interact ,
      climbable,
      water    ,
      instakill,
      get      ,
      custom0  ,
      custom1  ,
      custom2  ,
      custom3  ,
      custom4  ,
      custom5  ,
      custom6  ,
      custom7  ,
      custom8  ,
      custom9  ,
      all      
    ```
# How to run the project