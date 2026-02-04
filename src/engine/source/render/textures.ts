import {Render} from "./_render";
import * as T from "../_type"


export default class Textures extends Render.Info {

  public static createTexture(glContext: Render.GLContext, img: HTMLImageElement) : WebGLTexture {
    let gl = glContext.gl;
    let tex : WebGLTexture = Textures.createTexToBlitOn(glContext, img.width,img.height)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

    return tex;
  }


  public static createSprite(glContext: Render.GLContext, file: string, from: WebGLTexture, bounds: T.Bounds) : WebGLTexture {
    let gl = glContext.gl;
    const framebuffer : WebGLFramebuffer = gl.createFramebuffer()
    let spr : WebGLTexture = Textures.createTexToBlitOn(glContext, bounds.w, bounds.h);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, from, 0);
    gl.bindTexture(gl.TEXTURE_2D, spr)
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,
      0, 0, bounds.x, bounds.y, bounds.w, bounds.h)

    gl.deleteFramebuffer(framebuffer)

    return spr;
  }

  public static createTexToBlitOn(glContext: Render.GLContext, width: number, height: number): WebGLTexture {
    let gl = glContext.gl;
    const targetTexture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
      width,height,
                0, gl.RGBA, gl.UNSIGNED_BYTE,
                null)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return targetTexture;
  }

  // public static nextPowerOfTwo(n) {
  //     if (n==2||n==4||n==8||n==16||n==32||n==64||n==128||n==256||n==512||n==1024 ||n==2048/*||n==4096 */)return n;
  //     if (n>2048) return 2048;
  //     if (n <= 0) return 1; // Handle edge case for non-positive numbers
  //     n--;
  //     n |= n >> 1;
  //     n |= n >> 2;
  //     n |= n >> 4;
  //     n |= n >> 8;
  //     n |= n >> 16;
  //     return n + 1;
  // }

}