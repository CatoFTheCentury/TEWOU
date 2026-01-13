// import System from "./_system"

export class Keyboard {

  // private static keyboardpool : Array<Keyboard> = [];
  private static init: boolean = false;
  public static keys : {[name:string]:number} = {};
  // protected abstract update();
  // protected controlled : NPC;
  
  constructor(){
    // Keyboard.keyboardpool.push(this)
    // this.mKeyboard = this;
    if(!Keyboard.init){
        document.addEventListener("keydown", (event) => {
          if(!event.repeat) Keyboard.keys[event.key] = 1;
        })

        document.addEventListener("keyup", (event) => {
          Keyboard.keys[event.key] = -1;
        })
    }
    Keyboard.init = true;
  }

  public static refresh(){
    for(let k in Keyboard.keys){
      Keyboard.keys[k] = Keyboard.keys[k] < 0 ? 
        0 : Keyboard.keys[k] > 0 ? 2 : 0;
    }
  }

}