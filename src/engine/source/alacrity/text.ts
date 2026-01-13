import {Bodies} from './_bodies'
import * as T from '../_type'

export namespace Text {
  export class Text extends Bodies.Alacrity{
    public pos : T.Point;

    constructor(content: string, pos: T.Point, size:number = 16){
      super();
      this.pos = pos;
    }
  }
}