import * as T from "../_type"
import { Render } from './_render';
import Shader from "./_shaders"
import Textures from "./textures"
import {Assets} from "./assets"
import Camera from '../systems/camera'
import { Time } from "../alacrity/time"
import { ShaderLoader } from "./shaderloader"

export namespace Composite {
  export abstract class Renderable extends Render.Info {
    public rprops   : T.RenderProperties;
    public texture  : WebGLTexture;
    protected file  : string;
    public ready    : boolean;
    public abstract compose() : void;
    public parent : Renderable = undefined;
    public glContext : Render.GLContext;
    public shadercontext : ShaderLoader;

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader){
      super();
      this.glContext = glContext;
      this.shadercontext = shadercontext;
      this.rprops = {
        srcrect : undefined,
        dstrect : {x:0,y:0,w:0,h:0},
        pos     : {x:0,y:0},
        flip    : {flipx:false,flipy:false},
        angle   : 0,
        scale   : {x:1,y:1},
        layer   : 0,
        hidden  : false,
        delete  : false
      }
    }

    public getclientbounds():T.Bounds{
      return {
        x: this.getclientleft(),
        y: this.getclienttop(),
        w: this.getclientwidth(),
        h: this.getclientheight()
      }
    }
    
    // add "add" methods to Snap, animation, frame (or simply composite?) 
    //// so parent is updated at addition (instead of pushing directly)

    public getclientleft():number{
      // console.log(this.rprops.pos.x)
      if(!this.parent){
        return this.rprops.pos.x * this.getwidthratio();// + (this.parent==undefined?0:this.parent.getclientleft());
      }
      return (this.rprops.pos.x + this.parent.getclientleft()) * this.getwidthratio();
    }
  
    public getclienttop():number{
      return (this.rprops.pos.y + (this.parent==undefined?0:this.parent.getclienttop())) * this.getwidthratio();
    }

    public getclientwidth(dstrect: T.Bounds = this.rprops.dstrect):number{
      return dstrect.w * this.getwidthratio();
    }

    public getclientheight(dstrect: T.Bounds = this.rprops.dstrect):number{
      return dstrect.h * this.getheightratio();;
    }

    private getwidthratio():number{
      if(this.parent!=undefined){
        return (this.rprops.dstrect.w / this.rprops.srcrect.w) * this.parent.getwidthratio();
      }
      return this.rprops.dstrect.w / this.rprops.srcrect.w;
    }

    private getheightratio():number{
      if(this.parent!=undefined){
        return (this.rprops.dstrect.h / this.rprops.srcrect.h) * this.parent.getheightratio();
      }
      return this.rprops.dstrect.h / this.rprops.srcrect.h;
    }

    protected retrieveTexture(fileName : string){
      if(!this.glContext.textures[fileName]){
        // Assumes the file always exists
        this.glContext.textures[fileName] = Textures.createTexture(this.glContext, Assets.getTexture(fileName))
      }
      return this.glContext.textures[fileName];
    }

    // protected static retrieveTex(fileName : string, glContext: Render.GLContext){
    //   if(!glContext.textures[fileName]){
    //     // Assumes the file always exists
    //     glContext.textures[fileName] = Textures.createTexture(glContext, Assets.getTexture(fileName))
    //   }
    //   return glContext.textures[fileName];
    // }

    // protected addTexture(name:string,tex:WebGLTexture){
    //   this.glContext.textures[name] = tex;
    // }

    // protected getTexture(name:string): WebGLTexture{
    //   return this.glContext.textures[name];
    // }

  }

  // export class Text extends Renderable {
  //   constructor(content: string, size: number, font: string, color: string){
  //     super();

  //     // Create a 2D canvas
  //     // const textCanvas = Render.Info.txt;

  //     // Draw text on the 2D canvas
  //     Render.Info.txt.fillStyle = color;//'white';
  //     Render.Info.txt.font = size + 'px' + ' ' + font; //'30px Arial' ;
  //     Render.Info.txt.fillText(content, 0, 0);

  //     let textsize = Render.Info.txt.measureText(content);
  //     this.rprops.srcrect = {
  //       x:0,
  //       y:0,
  //       w: textsize.width,
  //       h: size
  //     }
  //     this.rprops.dstrect = this.rprops.srcrect;

  //     // Use the 2D canvas as a texture in WebGL
  //     // const gl = document.getElementById('webglCanvas').getContext('webgl');
  //     const texture = Render.Info.gl.createTexture();
  //     Render.Info.gl.bindTexture(Render.Info.gl.TEXTURE_2D, texture);
  //     Render.Info.gl.texImage2D(Render.Info.gl.TEXTURE_2D, 0, Render.Info.gl.RGBA, Render.Info.gl.RGBA, Render.Info.gl.UNSIGNED_BYTE, Render.Info.textCanvas);
  //     Render.Info.gl.generateMipmap(Render.Info.gl.TEXTURE_2D);
  //   }
  // }

  export class Image extends Renderable {

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader, file : string, srcrect : T.Bounds, dstrect : T.Bounds, plane : T.Bounds = undefined){
      super(glContext, shadercontext);
      this.file = file;
      this.rprops.srcrect = srcrect;
      this.rprops.dstrect = dstrect;
    }
    
    public compose(){
      // console.log(this.file);
      // if(this.ready){
      //   Image.gl.deleteTexture(this.texture);
      //   this.ready = false;
      // }

      if(!this.ready/*  && Assets.getTexture(this.file) */){
        let gl = this.glContext.gl;
        let spr : WebGLTexture = Textures.createTexToBlitOn(this.glContext, this.rprops.srcrect.w, this.rprops.srcrect.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.retrieveTexture(this.file), 0);
        gl.bindTexture(gl.TEXTURE_2D, spr);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 
          0, 0, 0, this.rprops.srcrect.x, this.rprops.srcrect.y, this.rprops.srcrect.w, this.rprops.srcrect.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
        this.texture = spr;
      }
    }


  }

  class Composite extends Renderable {
    public remove           : boolean;
    public dynamic          : boolean = false;
    public bg               : WebGLTexture;
    public mask             : WebGLTexture;
    protected viewport      : T.Bounds;


    private applyBg(){}
    private applyMask(){}
    public compose():boolean{return this.rprops.delete;}

    constructor(glContext: Render.GLContext, shadercontext:ShaderLoader){
      super(glContext,shadercontext);
      this.viewport = {x:0,y:0,w:glContext.gl.canvas.width,h:glContext.gl.canvas.height};
    }

    protected static createFocus(rd: Array<Renderable>): T.Bounds{
      // console.log(rd);
      return {
            x: rd.reduce((acc,c)=>{return Math.min(acc,c.rprops.dstrect.x)},rd[0].rprops.dstrect.x),
            y: rd.reduce((acc,c)=>{return Math.min(acc,c.rprops.dstrect.y)},rd[0].rprops.dstrect.y),
            w: rd.reduce((acc,c)=>{return Math.max(acc,c.rprops.dstrect.w+c.rprops.dstrect.x)},0),
            h: rd.reduce((acc,c)=>{return Math.max(acc,c.rprops.dstrect.h+c.rprops.dstrect.y)},0)
          };
    }

    protected generateComposite(rd : Array<Renderable>, focusRect: T.Bounds){
      let toDraw : Array<Renderable> = rd.filter((r)=>{return !r?.rprops.hidden});
        if(toDraw.length > 0){
          toDraw.sort((a,b)=>a.rprops.layer - b.rprops.layer);
          for(let i = 0; i < toDraw.length; i++) toDraw[i].compose();
          // let focusRect : T.Bounds = ;
          // console.log(focusRect)
        this.rprops.srcrect = {
          x : focusRect.x,
          y : focusRect.y,
          w : focusRect.w/*  <= this.rprops.dstrect.w ? this.rprops.dstrect.w : focusRect.w */,
          h : focusRect.h/*  <= this.rprops.dstrect.h ? this.rprops.dstrect.h : focusRect.h */
        }

        this.rprops.dstrect = {
          x : this.rprops.pos.x/* + (this.rprops.scalex == 1 ? 0 : (this.rprops.srcrect!.w - (this.rprops.srcrect!.w * this.rprops.scalex)) / 2) */,
          y : this.rprops.pos.y/* + (this.rprops.scaley == 1 ? 0 : (this.rprops.srcrect!.h - (this.rprops.srcrect!.h * this.rprops.scaley)) / 2) */,
          w : this.rprops.srcrect.w/* +focusRect.x */,
          h : this.rprops.srcrect.h/* +focusRect.y */
        }


        let gl = this.glContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);
        this.texture = Textures.createTexToBlitOn(this.glContext, this.rprops.dstrect.w, this.rprops.dstrect.h);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.viewport(-this.viewport.x,-this.viewport.y,this.rprops.dstrect.w,this.rprops.dstrect.h);
        // gl.clearColor(0, 1, 0, .5);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        
        for(let i = 0; i < toDraw.length; i++){
          // toDraw[i].compose();
          this.glContext.gl.bindTexture(gl.TEXTURE_2D, toDraw[i].texture);
          this.shadercontext.passShader(toDraw[i], this.rprops.dstrect);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }        
        this.ready = true;
      } else this.ready = false;
    }

    // add "add" methods to Snap, animation, frame (or simply composite?) 
    //// so parent is updated at addition (instead of pushing directly)
    // need to refresh camera for viewport to have the camera modifications
    public getclientleft():number{
      // console.log(this.rprops.pos.x - this.viewport.x);
      if(!this.parent){
        return this.rprops.pos.x - this.viewport.x;// + (this.parent==undefined?0:this.parent.getclientleft());
      }
      return this.rprops.pos.x + this.parent.getclientleft() - this.viewport.x;
    }

    public getclienttop():number{
      return this.rprops.pos.y + (this.parent==undefined?0:this.parent.getclienttop()) - this.viewport.y;
    }

    public addtocomposition(arr:Composite[]){}

  }

  export class Snap extends Composite {
    public parts : Array<Renderable>;

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader, parts : Array<Renderable>){
      super(glContext, shadercontext);
      for(let p of parts) p.parent = this;
      this.parts = parts;
    }

    public compose():boolean{
      if(this.rprops.delete) {
        if(this.ready) this.glContext.gl.deleteTexture(this.texture);
        return this.rprops.delete;
      }
      if(this.dynamic){
        if(this.ready){
          this.glContext.gl.deleteTexture(this.texture);
        }
        this.ready = false;
      }
      if(!this.ready){
        let focusRect: T.Bounds = Snap.createFocus(this.parts);
        // focusRect.x = 0;
        // focusRect.y = 0;
        // this.rprops.pos.x = focusRect.x;
        // this.viewport.x   = -focusRect.x;
        this.generateComposite(this.parts, focusRect);
      }
      return this.rprops.delete;
    }

    public addtocomposition(arr: Composite[]): void {
      for(let a of arr){
        a.parent = this;
      }
      this.parts.push(...arr)
    }
  }

  export class Animation extends Composite {
    public frames : Array<Composite>;
    public currentFrame : number = 0;
    // private timings     : number[];
    private timer       : Time.Timeout;
    

    constructor(glContext: Render.GLContext, shadercontext:ShaderLoader, frames : Array<Snap>, timings: number[] = [200]){
      super(glContext, shadercontext);
      this.dynamic = true;
      this.timer = new Time.Timeout(timings, "framechange");
      this.frames = frames;
      for(let f of frames) f.parent = this;
    }

    public compose():boolean{
      if(this.rprops.delete) {
        for(let f of this.frames){
          f.rprops.delete = true;
          f.compose();
        }
        return this.rprops.delete;
      }
      this.handleframechange();
      if(this.frames[this.currentFrame].dynamic || !this.frames[this.currentFrame].ready){
        this.frames[this.currentFrame].compose();
      }
      this.texture = this.frames[this.currentFrame].texture;
      this.rprops = this.frames[this.currentFrame].rprops;
      // this.rprops.srcrect = this.frames[this.currentFrame].rprops.srcrect;
      // this.rprops.dstrect = this.frames[this.currentFrame].rprops.dstrect;
      // this.rprops.pos     = this.frames[this.currentFrame].rprops.pos    ;
      // this.rprops.flip    = this.frames[this.currentFrame].rprops.flip   ;
      // this.rprops.angle   = this.frames[this.currentFrame].rprops.angle  ;
      // this.rprops.scalex  = this.frames[this.currentFrame].rprops.scalex ;
      // this.rprops.scaley  = this.frames[this.currentFrame].rprops.scaley ;
      // this.rprops.layer   = this.frames[this.currentFrame].rprops.layer  ;
      // this.rprops.hidden  = this.frames[this.currentFrame].rprops.hidden ;
      // this.rprops.delete  = this.frames[this.currentFrame].rprops.delete ;

      // console.log(this.rprops.pos.y);
      this.ready = this.frames[this.currentFrame].ready;
      return this.rprops.delete;
    }

    private handleframechange(){
      let trig : Time.Trigger = this.timer.test();
      if(trig.state == 'triggered'){
        this.currentFrame += 1;
        if(this.currentFrame >= this.frames.length) this.currentFrame = 0;
      }
      
    }

    public pause(){
      this.timer.pause();
    }

    public resume(){
      this.timer.resume();
    }

    public restart(){
      this.timer.restart();
      this.currentFrame = 0;
    }

    // these are present because of a bug linking animation position, 
    // currently, i need to link every of its frames to the animation's parent position
    // it works but is incorrect and may lead to future malfunctioning
    //
    public getclientleft():number{
      return this.parent.getclientleft();    }
  
    public getclienttop():number{
      return this.parent.getclienttop();    }

    // returns and diminishes once too many?
    public getclientwidth():number{
      return super.getclientwidth(this.frames[this.currentFrame].rprops.dstrect)
      // return this.frames[this.currentFrame].rprops.dstrect.w * this.getwidthratio();
    }

    public getclientheight():number{
      return super.getclientheight(this.frames[this.currentFrame].rprops.dstrect)
    }

    public addtocomposition(arr: Composite[]): void {
      for(let a of arr){
        a.parent = this;
      }
      this.frames.push(...arr)
    }


    // private getwidthratio():number{
    //   if(this.parent!=undefined){
    //     return (this.rprops.dstrect.w / this.rprops.srcrect.w) * this.parent.getwidthratio();
    //   }
    //   return this.rprops.dstrect.w / this.rprops.srcrect.w;
    // }

    // private getheightratio():number{
    //   if(this.parent!=undefined){
    //     return (this.rprops.dstrect.h / this.rprops.srcrect.h) * this.parent.getheightratio();
    //   }
    //   return this.rprops.dstrect.h / this.rprops.srcrect.h;
    // }

  }

  export class Frame extends Composite {
    public frame : Array<Composite>;
    // public worldpos : T.Point = {x:0,y:0};
    public camera   : Camera = undefined;
    private picture  = {crop:{do:false,w:0,h:0},x:0,y:0,w:0,h:0,img:undefined,ready:false}
    // private size : T.Box;

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader, frame: Array<Composite>, size: T.Box = {w:0,h:0}){
      super(glContext, shadercontext);
      this.frame = frame;
      this.dynamic = true;
      // this.size = size;
      this.rprops.dstrect.w = size.w;
      this.rprops.dstrect.h = size.h;
      for(let f of frame) f.parent = this;
    }

    public compose():boolean {
      // if(this.rprops.delete) return this.rprops.delete;
      // There has to be an underlying bug for this next line to be required:
      if(this.frame[0] === undefined) {
        console.log("Skipping empty frame...")
        return true;
      }

      if(this.dynamic || this.rprops.delete){
        if((this.rprops.delete && this.ready) || this.ready){
          this.glContext.gl.deleteTexture(this.texture);
        }
        this.ready = false;
      }
      if(!this.ready){
        this.frame = this.frame.filter((f)=>f!=undefined && !f.compose());

        let parts : Array<Renderable> = this.frame.filter((f)=>{return f.ready});
        let focusRect: T.Bounds = Snap.createFocus(parts);

        this.rprops.dstrect.x = this.rprops.pos.x;
        this.rprops.dstrect.y = this.rprops.pos.y;
        
        if(this.camera !== undefined){
          this.rprops.dstrect.w = this.camera.viewport.w;
          this.rprops.dstrect.h = this.camera.viewport.h;
          // console.log(this.camera.viewport.x)
          this.viewport = {x: this.camera.viewport.x, y: this.camera.viewport.y, w: this.camera.viewport.w, h: this.camera.viewport.h};
        }
        // console.log("BOB")
        if(parts.length>0) this.generateComposite(parts, focusRect);
        if(this.picture.crop.do)this.crop();
        this.ready = true;
      }
      return this.rprops.delete;
    }

    private crop(){
      if(this.picture.ready){
        // Composite.gl.deleteTexture(this.picture.img.texture);
        this.glContext.gl.deleteTexture(this.glContext.getTexture('croptex'));
        this.picture.ready = false;
      }
      if(!this.picture.ready){
        this.glContext.addTexture('croptex',this.texture)
        let img = new Image(this.glContext, this.shadercontext, 'croptex',
          {x:0,y:0,w:this.picture.crop.w,h:this.picture.crop.h},
          {x:0,y:0,w:this.picture.w,h:this.picture.h})
        img.compose();
        this.texture = img.texture
        this.rprops.pos.x = this.picture.x;
        this.rprops.pos.y = this.picture.y;
        this.rprops.dstrect.w = this.picture.w;
        this.rprops.dstrect.h = this.picture.h;
        this.picture.ready = true;
      }
    }

    public setCrop(crop:T.Box,dest:T.Bounds){
      this.picture =
        {crop:{do:true,...crop},...dest,img:undefined,ready:false}
    }

    public addtocomposition(arr: Composite[]): void {
      for(let a of arr){
        a.parent = this;
      }
      this.frame.push(...arr)
    }

    // public test():number{
    //   return this.camera.viewport.x
    // }


  }
}