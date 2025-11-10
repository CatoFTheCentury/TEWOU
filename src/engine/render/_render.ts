import * as T from "../_type"
// import S
      
export namespace Render {

  export class Info {
    public static MAXLAYERS : number = 256;
    protected static vbuffer: WebGLBuffer;
    protected static Rframebuffer : WebGLFramebuffer;
    protected static framebuffer : WebGLFramebuffer;
    protected static renderbuffer : WebGLRenderbuffer;
    static gl: WebGL2RenderingContext;
    static txt: CanvasRenderingContext2D;
    static textCanvas: HTMLCanvasElement;
    
  }

  export class GL extends Info {

    constructor(width: string, height: string) {
      super();
      if(!Info.txt && document.getElementById('text')!=undefined){
        Info.txt = (():CanvasRenderingContext2D => {
          // document.getElementsByTagName('body')[0].clientWidth
          document.getElementById('text').setAttribute('width', document.getElementsByTagName('body')[0].clientWidth+'');
          document.getElementById('text').setAttribute('height',document.getElementsByTagName('body')[0].clientHeight+'');
          return (document.querySelector('#text') as HTMLCanvasElement).
          getContext('2d');
        })()
        Info.textCanvas = (document.querySelector('#text') as HTMLCanvasElement)
      }
      if(!Info.gl){

        Info.gl = ((): WebGL2RenderingContext => {
          
          document.getElementById("canvas")!.setAttribute("width",  width)
          document.getElementById("canvas")!.setAttribute("height", height)
          let ctx = (document.querySelector("#canvas") as HTMLCanvasElement).
          getContext("webgl2",
          {premultipliedAlpha: false}
          )

          ctx!.enable(ctx!.BLEND);
          ctx!.blendFunc(ctx!.SRC_ALPHA, ctx!.ONE_MINUS_SRC_ALPHA);
          return ctx!
        })()
        
        Info.framebuffer  = Info.gl.createFramebuffer() ;
        Info.Rframebuffer = Info.gl.createFramebuffer() ;
        Info.renderbuffer = Info.gl.createRenderbuffer();
        Info.vbuffer      = Info.gl.createBuffer()      ;

        Info.gl.bindBuffer(Info.gl.ARRAY_BUFFER, Info.vbuffer);
        Info.gl.bufferData(Info.gl.ARRAY_BUFFER, 
          new Float32Array([
            1, 0, 0, 0, 0, 1, // Triangle 1
            1, 0, 0, 1, 1, 1  // Triangle 2
          ]),
        Info.gl.STATIC_DRAW);
        Info.gl.clearColor(0, 0.5, 0, 0);

        Info.gl.bindFramebuffer(Info.gl.READ_FRAMEBUFFER, Info.Rframebuffer);
        Info.gl.bindFramebuffer(Info.gl.DRAW_FRAMEBUFFER, Info.framebuffer);
        Info.gl.bindRenderbuffer(Info.gl.RENDERBUFFER, Info.renderbuffer)
        Info.gl.renderbufferStorage(Info.gl.RENDERBUFFER, Info.gl.RGBA8, 2000,2000)
        Info.gl.framebufferRenderbuffer(Info.gl.DRAW_FRAMEBUFFER, Info.gl.COLOR_ATTACHMENT0, Info.gl.RENDERBUFFER, Info.renderbuffer)
        Info.gl.readBuffer(Info.gl.COLOR_ATTACHMENT0);
        Info.gl.drawBuffers([Info.gl.COLOR_ATTACHMENT0]);
        
        // Info.gl.drawingBufferColorSpace = "display-p3";
        // Info.gl.unpackColorSpace = "display-p3";
      }
    }


    
  private static resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
  }
}

