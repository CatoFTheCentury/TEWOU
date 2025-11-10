import { Bodies } from "./_bodies";

export namespace Time {

  class Watch {
    public static lastTick : number = 0;
    public static currTick : number = 0;
  }
  
  export class Delta {
    public static firstTick: number = 0;
    public static delta = 16;
    public static refresh(){
      Watch.currTick = Date.now();
      Delta.delta = Math.min(Watch.currTick - Watch.lastTick,160);
      Watch.lastTick = Watch.currTick;
    }

    public static getTick(){
      return Watch.currTick;
    }
  }

  export class Timeout {
    public ms       : Array<number>;
    public step     : number = 0;
    public end      : number;
    public start    : number;
    public cyclic   : boolean = false;
    public deletion : boolean = false;
    public paused   : boolean = false;
    
    private trigName : string;

    constructor(ms : Array<number>, triggerName : string, cyclic : boolean = false){
      this.ms = ms;
      this.trigName = triggerName;
      this.cyclic = cyclic;
      this.start = Watch.currTick;
      if(ms[0] === Infinity) this.end = Infinity;
      else this.end = Watch.currTick + ms[0];
    }

    public reset(){
      this.start = Watch.currTick;
      if(this.end === Infinity) {}
      else this.end = Watch.currTick + this.ms[this.step];
    }

    public restart(){
      this.paused = false;
      this.reset();
    }

    public pause(){
      this.paused = true;
    }

    public getTimeoutTicks(): number{
      return Watch.currTick - this.start;
    }

    public test() : Bodies.Trigger{
      if(!this.paused){
        if(this.end <= Watch.currTick){
          if(this.cyclic)this.step++;
          if(this.step >= this.ms.length){
            this.step = 0;
          }
          this.start = Watch.currTick;
          if(this.end !== Infinity) this.end = Watch.currTick + this.ms[this.step];
          return {name:this.trigName, state:"triggered"};
        }
        else return {name:this.trigName, state:"active"};
      } else {
        if(this.end === Infinity){}
        else this.end += Delta.delta;
        return {name:this.trigName, state:"paused"};
      }

    }
  }
}