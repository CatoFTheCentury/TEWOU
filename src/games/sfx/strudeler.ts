import System from "../../engine/systems/_system";
import { Bodies } from '../../engine/alacrity/_bodies';
import { Time } from '../../engine/alacrity/time'

export enum Zones {
  fences,flowers,home,market,paved,shadows,smalltrees,water
}

type SoundZone = {
  running: boolean,
  code: string
}

export namespace Strudeler {
  export class Entries extends Bodies.Alacrity{
    public static div : HTMLElement | null = document.getElementById('strudcode');
    public static loadModules;
    public static initAudio;
    public static zones : Array<SoundZone>= [
      {running:false,
      code:` note("c3 ~ e3 g3,g2 ~ ~ ~").add("<0 5 7 0>")`},
      {running:false,
      code:`note("[~ c2 b2 a2] [d2 d2 e2 e2]").s("sawtooth").add("0 0 0 <3 15>")
.gain(.5).lpf("4000")`},
      {running:false,
      code:`note("<c2> <b2# b2 c2>").s("sawtooth")`},
      {running:false,
      code:`note("<c2> <b2# b2 c2>").s("sawtooth")`},
      {running:false,
      code:`note("<c2> <b2# b2 c2>").s("sawtooth")`},
      {running:false,
      code:`n("<0 3 4 0>").scale("D:minor").s("square").lpf("<300 600>")`},
      {running:false,
      code:`note("<c2> <b2# b2 c2>").s("sawtooth")`},
      {running:false,
      code:`n("0 4 0 5 7 9").scale("A:minor").s("sine").fast(1).sometimes(ply("2|4")).gain(.6)`}
    ]

    constructor(){
      super();
      this.timeouts.push(new Time.Timeout([600,600,600,600,600,300,100],'update',true))
    }

    public override update(){
      super.update();
      this.handleTriggers();
      // console.log(Entries.zones)
      // console.log("/")
    }

    private handleTriggers(){
        // private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Time.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case 'update':
          switch(t.state){
            case 'triggered':
              // console.log("////)")
              if(Entries.div) Entries.div.innerHTML = "<!--"+this.getTune()+"-->";
            break;
            case 'active':
            break;
            case 'paused':
            break;
          }
        break;
      }
    }
  }

  private getTune() {
        return `stack(
s("bd ~ [<bd,bd> bd] sd")`+ (Entries.zones.filter((z)=>z.running).length>0?","+Entries.zones.filter((z)=>z.running).map((z)=>z.code).join(','):'')+`)`;}

  }
}