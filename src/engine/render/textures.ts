import {Render} from "./_render";
import * as T from "../_type"


export default class Textures extends Render.Info {

  public static createTexture(img: HTMLImageElement) : WebGLTexture {
    // console.log(Render.Info.gl);
    let tex : WebGLTexture = this.createTexToBlitOn(img.width,img.height)
    Render.Info.gl.bindTexture(Render.Info.gl.TEXTURE_2D, tex)
    Render.Info.gl.texImage2D(Render.Info.gl.TEXTURE_2D, 0, Render.Info.gl.RGBA, Render.Info.gl.RGBA, Render.Info.gl.UNSIGNED_BYTE, img)

    return tex;
  }


  public static createSprite(file: string, from: WebGLTexture, bounds: T.Bounds) : WebGLTexture { 
    const framebuffer : WebGLFramebuffer = Render.Info.gl.createFramebuffer()
    let spr : WebGLTexture = Textures.createTexToBlitOn(bounds.w, bounds.h);

    Render.Info.gl.bindFramebuffer(Render.Info.gl.FRAMEBUFFER, framebuffer)

    Render.Info.gl.framebufferTexture2D(Render.Info.gl.FRAMEBUFFER, Render.Info.gl.COLOR_ATTACHMENT0, Render.Info.gl.TEXTURE_2D, from, 0);
    Render.Info.gl.bindTexture(Render.Info.gl.TEXTURE_2D, spr)
    Render.Info.gl.copyTexSubImage2D(Render.Info.gl.TEXTURE_2D, 0,
      0, 0, bounds.x, bounds.y, bounds.w, bounds.h)

    Render.Info.gl.deleteFramebuffer(framebuffer)

    return spr;
  }

  public static createTexToBlitOn(width: number, height: number): WebGLTexture {
    const targetTexture = Render.Info.gl.createTexture() as WebGLTexture;
    // let arr = new Uint8Array(width*height*4).fill(0);
    Render.Info.gl.bindTexture(Render.Info.gl.TEXTURE_2D, targetTexture);
    Render.Info.gl.texImage2D(Render.Info.gl.TEXTURE_2D, 0, Render.Info.gl.RGBA, 
      width,height,
                // Textures.nextPowerOfTwo(width), Textures.nextPowerOfTwo(height),
                // 1024,1024,
                0, Render.Info.gl.RGBA, Render.Info.gl.UNSIGNED_BYTE,
                null)
                // arr)

    Render.Info.gl.texParameteri(Render.Info.gl.TEXTURE_2D, Render.Info.gl.TEXTURE_MIN_FILTER, Render.Info.gl.NEAREST)
    Render.Info.gl.texParameteri(Render.Info.gl.TEXTURE_2D, Render.Info.gl.TEXTURE_MAG_FILTER, Render.Info.gl.NEAREST)
    Render.Info.gl.texParameteri(Render.Info.gl.TEXTURE_2D, Render.Info.gl.TEXTURE_WRAP_S, Render.Info.gl.CLAMP_TO_EDGE)
    Render.Info.gl.texParameteri(Render.Info.gl.TEXTURE_2D, Render.Info.gl.TEXTURE_WRAP_T, Render.Info.gl.CLAMP_TO_EDGE)
    return targetTexture;
  }

  public static nextPowerOfTwo(n) {
      if (n==2||n==4||n==8||n==16||n==32||n==64||n==128||n==256||n==512||n==1024 ||n==2048/*||n==4096 */)return n;
      if (n>2048) return 2048;
      if (n <= 0) return 1; // Handle edge case for non-positive numbers
      n--;
      n |= n >> 1;
      n |= n >> 2;
      n |= n >> 4;
      n |= n >> 8;
      n |= n >> 16;
      return n + 1;
  }

}