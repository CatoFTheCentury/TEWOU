import { Bodies } from "./_bodies";

export namespace Time {

  export type TimerActions = {
    active?:(timeout:Timeout)=>void,
    triggered?:(timeout:Timeout)=>void
  }

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
    public deletion  : boolean = false;
    public paused    : boolean = false;
    public done      : boolean = false;
    public continuous: boolean = false;
    private repeat   : boolean = true;
    private pauseTime: number = 0;
    private actions  : TimerActions = {};
    // private static allPaused : boolean = false;
    
    // private static pausedAtPause : Set<Timeout> = new Set();
    // private static pool    : Set<Timeout> = new Set();
    
    private trigName : string;

    constructor(ms : Array<number>, triggerName : string, params : {[id:string]:boolean} = {continuous:false,repeat:true}, actions: TimerActions = {}){
      this.ms = ms;
      this.trigName = triggerName;
      if(params.continuous) this.continuous = params.continuous;
      else this.continuous = false;
      if(params.repeat) this.repeat = params.repeat;
      else this.repeat = true;
      this.start = Watch.currTick;
      if(ms[0] === Infinity) this.end = Infinity;
      else this.end = Watch.currTick + ms[0];
      this.actions = actions;
      // Timeout.pool.add(this);
      // if(Timeout.allPaused) this.pause();
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

    // public static pauseAll(){
    //   if(Timeout.allPaused) return;
    //   for(let t of Timeout.pool){
    //     if(t.paused) Timeout.pausedAtPause.add(t);
    //     else t.pause();
    //   }
    //   Timeout.allPaused = true;
    // }

    // public static resumeAll(){
    //   if(!Timeout.allPaused) return;
    //   let unpause = new Set<Timeout>(Timeout.pool);
    //   for(let t of Timeout.pausedAtPause){
    //     unpause.delete(t);
    //   }
    //   for(let t of unpause){
    //     t.resume();
    //   }
    //   Timeout.pausedAtPause.clear();
    //   Timeout.allPaused = false;
    // }

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
      if(this.done) return {name:this.trigName, state:"done"};
      if(!this.paused){
        if(this.end <= Watch.currTick){
          if(this.continuous)this.step++;
          else if(!this.repeat) this.done = true;
          if(this.step >= this.ms.length){
            this.step = 0;
            if(!this.repeat) this.done = true;
          }
          this.start = Watch.currTick;
          if(this.ms[this.step] !== Infinity) this.end = Watch.currTick + this.ms[this.step];
          else this.end = Infinity;

          if(this.actions.triggered) this.actions.triggered(this);
          return {name:this.trigName, state:"triggered"};
        }

        if(this.actions.active) this.actions.active(this);
        else return {name:this.trigName, state:"active"};
      }

      if(this.end === Infinity){}
      else this.end += Delta.delta;
      return {name:this.trigName, state:"paused"};


    }

    // public test2() {
    //   if(this.done) return;
    //   if(!this.paused){
    //     let finished : boolean = (this.end <= Watch.currTick);
    //     if(finished){
    //       if(this.continuous) {
    //         this.step++;
    //         if(this.step >= this.ms.length){
    //           if(!this.repeat) this.done = true;
    //           this.step = 0;
    //         }
    //       } else if(!this.repeat){
    //         this.done = true;
    //       }
    //       this.start = Watch.currTick;
    //       if(this.ms[this.step] !== Infinity) this.end = Watch.currTick + this.ms[this.step];
    //       else this.end = Infinity;
    //       if(this.actions.triggered) this.actions.triggered();
    //     } else {
    //       if(this.actions.active) this.actions.active(this);
    //     }
    //   }
    // }
  }
}