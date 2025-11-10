import { Bodies } from '../../engine/alacrity/_bodies';
import {Time} from '../../engine/alacrity/time';

export default class Timer extends Bodies.Alacrity{
  public elapsed : Time.Timeout;
  public timerbar: HTMLElement;

  constructor(){
    super();
    this.elapsed = new Time.Timeout([Infinity], 'elapsed')
    this.timerbar = document.getElementById('timer')!;
  }

  public update(){
    super.update();
    this.timerbar.innerHTML = (Math.round(this.elapsed.getTimeoutTicks()  / 100)/ 100)+'';
  }

  // public stop()
}