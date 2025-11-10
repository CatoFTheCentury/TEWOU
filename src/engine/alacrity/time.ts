import { Bodies } from "./_bodies";

export namespace Time {

  export type Trigger = {
    name  : string,
    state?: string,
    // from? : Embodiment
  }

  class Watch {
    public static lastTick : number = 0;
    public static currTick : number = 0;
  }
  
  export class Delta {
    public static firstTick: number = 0;
    public static delta = 16;
    public static refresh(){
      Watch.currTick = Date.now();
      Delta.delta = Math.min(Watch.currTick - Watch.lastTick,100);
      Watch.lastTick = Watch.currTick;
    }

    public static getTick(){
      return Watch.currTick;
    }
  }

  export class Timeout {
    public ms        : Array<number>;
    public step      : number = 0;
    public end       : number;
    public start     : number;
    public cyclic    : boolean = false;
    public deletion  : boolean = false;
    public paused    : boolean = false;
    private pauseTime: number = 0;
    private static allPaused : boolean = false;
    
    private static pausedAtPause : Set<Timeout> = new Set();
    private static pool    : Set<Timeout> = new Set();
    
    private trigName : string;

    constructor(ms : Array<number>, triggerName : string, cyclic : boolean = false){
      this.ms = ms;
      this.trigName = triggerName;
      this.cyclic = cyclic;
      this.start = Watch.currTick;
      if(ms[0] === Infinity) this.end = Infinity;
      else this.end = Watch.currTick + ms[0];
      Timeout.pool.add(this);
      if(Timeout.allPaused) this.pause();
    }

    public reset(){
      this.start = Watch.currTick;
      if(this.ms[this.step] === Infinity) this.end = Infinity;
      else this.end = Watch.currTick + this.ms[this.step];
    }

    public restart(){
      this.paused = false;
      this.step = 0;
      this.reset();
    }

    public static pauseAll(){
      if(Timeout.allPaused) return;
      for(let t of Timeout.pool){
        if(t.paused) Timeout.pausedAtPause.add(t);
        else t.pause();
      }
      Timeout.allPaused = true;
    }

    public static resumeAll(){
      if(!Timeout.allPaused) return;
      let unpause = new Set<Timeout>(Timeout.pool);
      for(let t of Timeout.pausedAtPause){
        unpause.delete(t);
      }
      for(let t of unpause){
        t.resume();
      }
      Timeout.pausedAtPause.clear();
      Timeout.allPaused = false;
    }

    public pause(){
      this.pauseTime = Watch.currTick;
      this.paused = true;
    }

    public resume(){
      this.start += Watch.currTick - this.pauseTime;
      if(this.end === Infinity) {}
      else this.end += Watch.currTick - this.pauseTime;
      this.pauseTime = 0;
      this.paused = false;
    }

    public getTimeoutTicks(): number{
      return (this.paused ? this.pauseTime : Watch.currTick) - this.start;
    }

    public test() : Trigger{
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