import {Composite} from "../render/composite"
import {Render} from "../render/_render"
import Shader from "../render/_shaders"

export default class Window extends Render.Info {

  public static frm : Composite.Frame;
  
  public static refresh(){
    var gl = Shader.gl;

    Window.frm.compose();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // gl.viewport(windwx, windowy, windowwidht, windowheight);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // gl.clearColor(0, 0.5, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // console.log("C");

    gl.bindTexture(gl.TEXTURE_2D, Window.frm.texture)
    Shader.passShader(Window.frm, {w:gl.canvas.width,h:gl.canvas.height});
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}