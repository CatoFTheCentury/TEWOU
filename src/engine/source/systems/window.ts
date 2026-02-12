import {Composite} from "../render/composite"
import {Render} from "../render/_render"

export class Window {
  public source : Render.GLContext;
  public target : HTMLCanvasElement | null;

  public frame : Composite.Frame;
  private static windows : Array<Window> = [];

  /**
   * source : Render.GLContext
   * target : HTMLCanvasElement (2D canvas or same as source)
   */
  constructor(source:Render.GLContext,target: HTMLCanvasElement = null){
    this.source = source;
    this.target = target;
    Window.windows.push(this);
  }

  public static refresh(){
    Window.windows.forEach((w)=>w.update());
  }
  
  public update(){
    this.frame.setDirty();
    this.frame.compose();
    
    
    if(this.target!=null){
      
    } else {
      let focus = Composite.Frame.createFocus(this.frame.frame)
      var gl = this.source.gl;

      gl.clearColor(1,1,1,1);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.bindTexture(gl.TEXTURE_2D, this.frame.texture)
      this.frame.shadercontext.passShader(this.frame, {x:focus.x,y:focus.y,w:gl.canvas.width,h:gl.canvas.height});
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}