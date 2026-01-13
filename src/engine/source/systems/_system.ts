
export abstract class System {
  // private pool: Array<System> = [];

  constructor(priority: boolean = false){
    // if(priority) System.pool.unshift(this);
    // else System.pool.push(this);
  }

  // public add(sys:System){
  //   this.pool.push(sys);
  // }

  // public refresh(){
  //   for(let i = 0; i < this.pool.length; i++){
  //     this.pool[i].refresh();
  //   }
  // }

  public abstract refresh() : void;

  // public static reset(){
}