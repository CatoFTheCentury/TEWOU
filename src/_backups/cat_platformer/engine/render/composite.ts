import * as T from "../_type"
import {Render} from "./_render"
import Shader from "./_shaders"
import Textures from "./textures"
import Assets from "./assets"
import Camera from '../systems/camera'

export namespace Composite {
  export abstract class Renderable extends Render.Info {
    public rprops   : T.RenderProperties;
    public texture  : WebGLTexture;
    protected file  : string;
    public ready    : boolean;
    public abstract compose() : void;

    constructor(){
      super();
      this.rprops = {
        srcrect : undefined,
        dstrect : {x:0,y:0,w:0,h:0},
        pos     : {x:0,y:0},
        flip    : {flipx:false,flipy:false},
        angle   : 0,
        scalex  : 1,
        scaley  : 1,
        layer   : 0,
        hidden  : false,
        delete  : false
      }
    }
  }

  export class Image extends Renderable {

    constructor(file : string, srcrect : T.Bounds, dstrect : T.Bounds, plane : T.Bounds = undefined){
      super();
      this.file = file;
      this.rprops.srcrect = srcrect;
      this.rprops.dstrect = dstrect;
    }
    
    public compose(){
      // console.log(this.file);
      if(this.ready){
        Image.gl.deleteTexture(this.texture);
        this.ready = false;
      }

      if(!this.ready/*  && Assets.getTexture(this.file) */){
        let spr : WebGLTexture = Textures.createTexToBlitOn(this.rprops.srcrect.w, this.rprops.srcrect.h);
        Textures.gl.bindFramebuffer(Textures.gl.FRAMEBUFFER, Render.Info.framebuffer);

        Textures.gl.framebufferTexture2D(Textures.gl.FRAMEBUFFER, Textures.gl.COLOR_ATTACHMENT0, Textures.gl.TEXTURE_2D, Assets.getTexture(this.file), 0);
        Textures.gl.bindTexture(Textures.gl.TEXTURE_2D, spr);
        Textures.gl.copyTexSubImage2D(Textures.gl.TEXTURE_2D, 
          0, 0, 0, this.rprops.srcrect.x, this.rprops.srcrect.y, this.rprops.srcrect.w, this.rprops.srcrect.h);
        Textures.gl.bindFramebuffer(Textures.gl.FRAMEBUFFER, null);
    
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

    constructor(){
      super();
      this.viewport = {x:0,y:0,w:Composite.gl.canvas.width,h:Composite.gl.canvas.height};
    }

    protected static createFocus(rd: Array<Renderable>): T.Bounds{
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
          w : focusRect.w <= this.rprops.dstrect.w ? this.rprops.dstrect.w : focusRect.w,
          h : focusRect.h <= this.rprops.dstrect.h ? this.rprops.dstrect.h : focusRect.h
        }

        this.rprops.dstrect = {
          x : this.rprops.pos.x/* + (this.rprops.scalex == 1 ? 0 : (this.rprops.srcrect!.w - (this.rprops.srcrect!.w * this.rprops.scalex)) / 2) */,
          y : this.rprops.pos.y/* + (this.rprops.scaley == 1 ? 0 : (this.rprops.srcrect!.h - (this.rprops.srcrect!.h * this.rprops.scaley)) / 2) */,
          w : this.rprops.srcrect.w/* +focusRect.x */,
          h : this.rprops.srcrect.h/* +focusRect.y */
        }


        let gl = Snap.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, Composite.framebuffer);
        this.texture = Textures.createTexToBlitOn(this.rprops.dstrect.w, this.rprops.dstrect.h);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.viewport(this.viewport.x,this.viewport.y,this.rprops.dstrect.w,this.rprops.dstrect.h);
        // gl.clearColor(0, 1, 0, .5);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        
        for(let i = 0; i < toDraw.length; i++){
          // toDraw[i].compose();
          Shader.gl.bindTexture(gl.TEXTURE_2D, toDraw[i].texture);
          Shader.passShader(toDraw[i], this.rprops.dstrect);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }        
        this.ready = true;
      } else this.ready = false;
    }
  }

  export class Snap extends Composite {
    public parts : Array<Renderable>;

    constructor(parts : Array<Renderable>){
      super();
      this.parts = parts;
    }

    public compose():boolean{
      if(this.rprops.delete) return this.rprops.delete;
      if(this.dynamic){
        if(this.ready){
          Composite.gl.deleteTexture(this.texture);
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
  }

  export class Animation extends Composite {
    public frames : Array<Snap>;
    public currentFrame : number = 0;

    constructor(parts : Array<Snap>){
      super();
      this.dynamic = true;
      this.frames = parts;
    }

    public compose():boolean{
      if(this.rprops.delete) return this.rprops.delete;
      if(this.frames[this.currentFrame].dynamic || !this.frames[this.currentFrame].ready){
        this.frames[this.currentFrame].compose();
      }
      this.texture = this.frames[this.currentFrame].texture;
      this.rprops = this.frames[this.currentFrame].rprops;
      this.ready = this.frames[this.currentFrame].ready;
      return this.rprops.delete;
    }
  }

  export class Frame extends Composite {
    public frame : Array<Composite>;
    // public worldpos : T.Point = {x:0,y:0};
    public camera   : Camera = undefined;
    // private size : T.Box;

    constructor(frame: Array<Composite>, size: T.Box = {w:0,h:0}){
      super();
      this.frame = frame;
      this.dynamic = true;
      // this.size = size;
      this.rprops.dstrect.w = size.w;
      this.rprops.dstrect.h = size.h;
    }

    public compose():boolean {
      // if(this.rprops.delete) return this.rprops.delete;
      // There has to be an underlying bug for this next line to be required:
      if(this.frame[0] === undefined) {
        console.log("Skipping empty frame...")
        return true;
      }

      if(this.dynamic || this.rprops.delete){
        if(this.ready || this.rprops.delete){
          Composite.gl.deleteTexture(this.texture);
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
          this.viewport = {x: -this.camera.viewport.x, y: -this.camera.viewport.y, w: this.camera.viewport.w, h: this.camera.viewport.h};
        }

        if(parts.length>0) this.generateComposite(parts, focusRect);
      }
      return this.rprops.delete;
    }
  }
}