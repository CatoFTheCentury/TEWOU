import {Bob} from "./test1";
export class Alice extends Bob {
  

  constructor(){
    super();
    this.funtimes = 1;
  }

  public showResult(){
    console.log(this.funtimes);
  }
}