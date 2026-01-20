import * as T from "../_type"
import ShaderTemplate from "./shaders/template"
// import S


      
export namespace Render {

  export class Info {
    public static MAXLAYERS : number = 256;
    // public static contextPool : Array<T.glContext> = [];
    // protected static vbuffer: WebGLBuffer;
    // protected static Rframebuffer : WebGLFramebuffer;
    // protected static framebuffer : WebGLFramebuffer;
    // protected static renderbuffer : WebGLRenderbuffer;
    // static gl: WebGL2RenderingContext;
    static txt: CanvasRenderingContext2D;
    static textCanvas: HTMLCanvasElement;
    protected static contextCounter : number = -1;
    
  }

  export class GLContext extends Info {
    public vbuffer: WebGLBuffer;
    public Rframebuffer : WebGLFramebuffer;
    public framebuffer : WebGLFramebuffer;
    public renderbuffer : WebGLRenderbuffer;
    public gl: WebGL2RenderingContext;
    public id: string;
    public textures: {[id:string]:WebGLTexture};

    constructor(
      canvas:HTMLCanvasElement,width: string, height: string
    ) {
      super();
      // console.log(canvas)
      Info.contextCounter++;
      // super();
      // console.log(height,width);
      // if(!Info.txt && document.getElementById('text')!=undefined){
      //   Info.txt = (():CanvasRenderingContext2D => {
      //     // document.getElementsByTagName('body')[0].clientWidth
      //     document.getElementById('text').setAttribute('width', document.getElementsByTagName('body')[0].clientWidth+'');
      //     document.getElementById('text').setAttribute('height',document.getElementsByTagName('body')[0].clientHeight+'');
      //     return (document.querySelector('#text') as HTMLCanvasElement).
      //     getContext('2d');
      //   })()
      //   Info.textCanvas = (document.querySelector('#text') as HTMLCanvasElement)
      // }
      // if(!Info.gl){

        let gl = ((): WebGL2RenderingContext => {
          // let cnv = document.createElement('canvas');
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          canvas.style.width = width+"px";
          canvas.style.height = height+"px";
          // document.body.appendChild(cnv);
          // let ctx = (cnv as HTMLCanvasElement).getContext("webgl2",
          //   {premultipliedAlpha: false}
          // )
          // document.getElementById("canvas")!.setAttribute("width",  width)
          // document.getElementById("canvas")!.setAttribute("height", height)
          let ctx = canvas.
          getContext("webgl2",
          {premultipliedAlpha: false}
          )

          ctx.enable(ctx.BLEND);
          ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
          return ctx
        })()
        
        // Info.contextPool.push({
        // let context = {
          this.framebuffer  = gl.createFramebuffer();
          this.Rframebuffer = gl.createFramebuffer() ;
          this.renderbuffer = gl.createRenderbuffer();
          this.vbuffer      = gl.createBuffer()      ;
          this.gl           = gl;
          this.id           = String(Info.contextCounter);
          this.textures     = {};
          // contextID    : Info.contextCounter
        // }
      // )
        // Info.framebuffer  = Info.gl.createFramebuffer() ;
        // Info.Rframebuffer = Info.gl.createFramebuffer() ;
        // Info.renderbuffer = Info.gl.createRenderbuffer();
        // Info.vbuffer      = Info.gl.createBuffer()      ;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, 
          new Float32Array([
            1, 0, 0, 0, 0, 1, // Triangle 1
            1, 0, 0, 1, 1, 1  // Triangle 2
          ]),
        this.gl.STATIC_DRAW);
        this.gl.clearColor(0, 0.5, 0, 0);

        this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.Rframebuffer);
        this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, this.framebuffer);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer)
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.RGBA8, 2000,2000)
        this.gl.framebufferRenderbuffer(this.gl.DRAW_FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.RENDERBUFFER, this.renderbuffer)
        this.gl.readBuffer(this.gl.COLOR_ATTACHMENT0);
        this.gl.drawBuffers([this.gl.COLOR_ATTACHMENT0]);
        
        // Info.gl.drawingBufferColorSpace = "display-p3";
        // Info.gl.unpackColorSpace = "display-p3";

        // Info.contextPool.push(context);
        // return context;
      }

    
      public addTexture(name:string,tex:WebGLTexture){
        this.textures[name] = tex;
      }
  
      public getTexture(name:string): WebGLTexture{
        return this.textures[name];
      }
    // protected retrieveTexture(fileName : string){
    //   if(!this.textures[fileName]){
    //     // Assumes the file always exists
    //     this.textures[fileName] = Textures.createTexture(this, Assets.getTexture(fileName))
    //   }
    //   return this.textures[fileName];
    // }
        }

  // private static resizeCanvasToDisplaySize(canvas, multiplier) {
  //   multiplier = multiplier || 1;
  //   const width  = canvas.clientWidth  * multiplier | 0;
  //   const height = canvas.clientHeight * multiplier | 0;
  //   if (canvas.width !== width ||  canvas.height !== height) {
  //     canvas.width  = width;
  //     canvas.height = height;
  //     return true;
  //   }
  //   return false;
  // }
}

