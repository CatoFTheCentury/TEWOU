
export default abstract class System {
  private static pool: Array<System> = [];

  constructor(priority: boolean = false){
    if(priority) System.pool.unshift(this);
    else System.pool.push(this);
  }

  public static refresh(){
    for(let i = 0; i < this.pool.length; i++){
      System.pool[i].refresh();
    }
  }

  protected abstract refresh() : void;

}