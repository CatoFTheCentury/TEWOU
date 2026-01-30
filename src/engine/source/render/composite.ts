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
    public abstract compose() : boolean;
    public parent : Renderable = undefined;
    public glContext : Render.GLContext;
    public shadercontext : ShaderLoader;
    public offset           : T.Point = {x:0,y:0};

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader){
      super();
      this.glContext = glContext;
      this.shadercontext = shadercontext;
      this.rprops = {
        srcrect    : undefined,
        dstrect    : {x:0,y:0,w:0,h:0},
        rotcenter  : {x:0,y:0},
        scalecenter: {x:0,y:0},
        pos        : {x:0,y:0},
        flip       : {flipx:false,flipy:false},
        angle      : 0,
        scale      : {x:1,y:1},
        layer      : 0,
        hidden     : false,
        delete     : false
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
      if(!this.parent){
        return this.rprops.pos.x * this.getwidthratio();
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

  }

  export class Text extends Renderable {
    private text : string;
    private properties : T.TextProperties = {};
    public size : T.Box = {w:0,h:0};

    constructor(glContext : Render.GLContext, shadercontext: ShaderLoader, text:string, textproperties: T.TextProperties = {}){
      super(glContext,shadercontext)
      this.text = text;
      this.setProperties(textproperties);
      Text.textcontext.textAlign = "left";
      Text.textcontext.textBaseline = "top"
      Text.textcontext.font = this.properties.size + "px " + this.properties.font;

      this.size.w = Text.textcontext.measureText(this.text).width;
      // this.size.h = 
    }

    public compose(){
      if(!this.ready){
        // let textcanvas : HTMLCanvasElement = (document.getElementById('bob') as HTMLCanvasElement)
        let textcontext = Text.textcontext;
        textcontext.clearRect(0, 0, textcontext.canvas.width, textcontext.canvas.height)
        
        textcontext.fillStyle = "rgba("+ 
        this.properties.color.r +","+
        this.properties.color.g +","+
        this.properties.color.b +","+
        this.properties.color.a +")"

        textcontext.textAlign = "left";
        textcontext.textBaseline = "top"
        textcontext.font = this.properties.size + "px " + this.properties.font;

        this.rprops.dstrect.w = textcontext.measureText(this.text).width;
        this.rprops.dstrect.h = this.properties.size;
        this.size.w = this.rprops.dstrect.w;
        this.size.h = this.rprops.dstrect.h;

        textcontext.fillText(this.text,0,0);

        let gl = this.glContext.gl;

        let spr : WebGLTexture = Textures.createTexToBlitOn(this.glContext, Text.textcanvas.width, Text.textcanvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, spr);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size.w, this.size.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, Text.textcanvas);      
        this.texture = spr;
        this.ready = true;

      }
      if(this.rprops.delete) this.glContext.gl.deleteTexture(this.texture);
      return this.rprops.delete;
    }

    public setText(text:string){
      if(this.ready) this.glContext.gl.deleteTexture(this.texture);
      this.text = text;
      this.size.w = Text.textcontext.measureText(this.text).width;
      this.ready = false;
    }

    public setProperties(textproperties: T.TextProperties){
      if(this.ready) this.glContext.gl.deleteTexture(this.texture);
      this.ready = false;
      
      if(textproperties.size != undefined) {
        this.properties.size = textproperties.size;
      } else if(this.properties.size == undefined) {
        this.properties.size = 60;
      }
      this.size.h = this.properties.size;

      if(textproperties.color != undefined) {
        this.properties.color = textproperties.color;
      } else if (this.properties.color == undefined) {
        this.properties.color = {r:0,g:0,b:0,a:255};
      }

      if(textproperties.font != undefined) {
        this.properties.font = textproperties.font;
      } else if (this.properties.font == undefined){
        this.properties.font = "monospace"
      }

    }
    
    public setColor(color: T.Color){
      if(this.ready) this.glContext.gl.deleteTexture(this.texture);
      this.properties.color = color;
      this.ready = false;
    }
    
    public setSize(size: number){
      if(this.ready) this.glContext.gl.deleteTexture(this.texture);
      this.properties.size = size;
      this.size.h = this.properties.size;
      this.ready = false;
    }
  }

  export class Rectangle extends Renderable {

    constructor(glContext : Render.GLContext, shadercontext : ShaderLoader, bounds : T.Bounds, color : T.Color){
      super(glContext, shadercontext);
      this.rprops.dstrect = bounds;
      this.rprops.colorize = color;
    }

    public compose(){
      if(!this.ready){
        let gl = this.glContext.gl;

        let spr : WebGLTexture = Textures.createTexToBlitOn(this.glContext, 1, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, spr);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
          new Uint8Array([this.rprops.colorize.r,this.rprops.colorize.g,this.rprops.colorize.b,this.rprops.colorize.a]));
        
        this.texture = spr;
        this.ready = true;
      }

      if(this.rprops.delete) this.glContext.gl.deleteTexture(this.texture);
      return this.rprops.delete;
    }
  }

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
        this.ready = true;
      }

      if(this.rprops.delete && this.texture) this.glContext.gl.deleteTexture(this.texture);
      return this.rprops.delete;
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
      
      let bob = 
      {
            x: rd.reduce((acc,c)=>{return Math.min(acc,c.rprops.dstrect.x)},
            rd[0].rprops.dstrect.x 
            ),
            y: rd.reduce((acc,c)=>{return Math.min(acc,c.rprops.dstrect.y)},rd[0].rprops.dstrect.y),
            w: rd.reduce((acc,c)=>{return Math.max(acc,
              (c.rprops.dstrect.w * Math.abs(Math.cos(c.rprops.angle)) + 
                c.rprops.dstrect.h * Math.abs(Math.sin(c.rprops.angle)) +
                c.rprops.dstrect.x)
                * c.rprops.scale.x
              )},0),
            h: rd.reduce((acc,c)=>{return Math.max(acc,(c.rprops.dstrect.w * Math.abs(Math.sin(c.rprops.angle)) + c.rprops.dstrect.h * Math.abs(Math.cos(c.rprops.angle))+c.rprops.dstrect.y)*c.rprops.scale.y)},0)
          };

      return bob;
    }

    private static createBounds(rd : Array<Renderable>) : T.Bounds{
      let r = rd[0]
      let topleft = Composite.scaleThenRotatePreserveOriginalRotation(
        {x:r.rprops.dstrect.x,y:r.rprops.dstrect.y},
        {x:r.rprops.scalecenter.x,y:r.rprops.scalecenter.y},
        {x:r.rprops.scale.x,y:r.rprops.scale.y},
        {x:r.rprops.rotcenter.x,y:r.rprops.rotcenter.y},
        r.rprops.angle
      );
      topleft = (()=>{
        let tl = topleft;
        for(let i = 1; i < rd.length; i++){
          r = rd[i];
          let ctl = Composite.scaleThenRotatePreserveOriginalRotation(
            {x:r.rprops.dstrect.x,y:r.rprops.dstrect.y},
            {x:r.rprops.scalecenter.x,y:r.rprops.scalecenter.y},
            {x:r.rprops.scale.x,y:r.rprops.scale.y},
            {x:r.rprops.rotcenter.x,y:r.rprops.rotcenter.y},
            r.rprops.angle
          )
          if(ctl.x < tl.x) tl.x = ctl.x;
          if(ctl.y < tl.y) tl.y = ctl.y;
        }
        return tl;
      })()


      return {
        x:topleft.x,
        y:0,w:0,h:0
      }

    }

    protected generateComposite(rd : Array<Renderable>, focusRect: T.Bounds){
      let toDraw : Array<Renderable> = rd.filter((r)=>{return !r?.rprops.hidden});
        if(toDraw.length > 0){
          let newtest = Composite.createBounds(toDraw);
          toDraw.sort((a,b)=>a.rprops.layer - b.rprops.layer);
          for(let i = 0; i < toDraw.length; i++) toDraw[i].compose();

        this.offset.x = focusRect.x;
        this.offset.y = focusRect.y;

        this.rprops.dstrect = {
          x : this.rprops.pos.x,
          y : this.rprops.pos.y,
          w : focusRect.w,
          h : focusRect.h
        }

        let gl = this.glContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);

        this.texture = Textures.createTexToBlitOn(this.glContext, focusRect.w, focusRect.h);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.viewport(-this.viewport.x,-this.viewport.y,focusRect.w,focusRect.h);
        
        for(let i = 0; i < toDraw.length; i++){
          this.glContext.gl.bindTexture(gl.TEXTURE_2D, toDraw[i].texture);
          this.shadercontext.passShader(toDraw[i],
            { x:toDraw[i].rprops.dstrect.x,
              y:toDraw[i].rprops.dstrect.y,
              w:focusRect.w,
              h:focusRect.h
            });
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }        
        this.ready = true;
      } else this.ready = false;
    }

    // add "add" methods to Snap, animation, frame (or simply composite?) 
    //// so parent is updated at addition (instead of pushing directly)
    // need to refresh camera for viewport to have the camera modifications
    public getclientleft():number{
      if(!this.parent){
        return this.rprops.pos.x - this.viewport.x;
      }
      return this.rprops.pos.x + this.parent.getclientleft() - this.viewport.x;
    }

    public getclienttop():number{
      return this.rprops.pos.y + (this.parent==undefined?0:this.parent.getclienttop()) - this.viewport.y;
    }

    public addtocomposition(arr:Composite[]){}

    private static rotateAround(p: T.Point, center: T.Point, angleRad: number): T.Point {
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);

      const dx = p.x - center.x;
      const dy = p.y - center.y;

      return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
      };
    }

    private static scaleAround(p: T.Point, center: T.Point, scale: T.Point): T.Point {
      return {
        x: center.x + (p.x - center.x) * scale.x,
        y: center.y + (p.y - center.y) * scale.y,
      };
    }

    private static scaleThenRotatePreserveOriginalRotation(
      p: T.Point,
      scaleCenter: T.Point,
      scale: T.Point,
      rotationCenter: T.Point,
      angleRad: number
    ): T.Point {
      // 1) scale the point
      const scaledPoint = Composite.scaleAround(p, scaleCenter, scale);

      // 2) compensate the rotation center
      const compensatedRotationCenter: T.Point = {
        x: scaleCenter.x + (rotationCenter.x - scaleCenter.x) * scale.x,
        y: scaleCenter.y + (rotationCenter.y - scaleCenter.y) * scale.y,
      };

      // 3) rotate around the compensated center
      return Composite.rotateAround(scaledPoint, compensatedRotationCenter, angleRad);
    }

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
        for(let f of this.parts){
          f.rprops.delete = true;
          f.compose();
        }
        return this.rprops.delete;
      }

      if(this.dynamic){
        if(this.ready){
          this.glContext.gl.deleteTexture(this.texture);
        }
        this.ready = false;
      }
      if(!this.ready){
        this.parts = this.parts.filter((f)=>f!=undefined && !f.compose());

        let focusRect: T.Bounds = Snap.createFocus(this.parts);
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


  }

  export class Frame extends Composite {
    public frame : Array<Renderable>;
    public camera   : Camera = undefined;
    private picture  = {crop:{do:false,w:0,h:0},x:0,y:0,w:0,h:0,img:undefined,ready:false}

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader, frame: Array<Renderable>, size: T.Box = {w:0,h:0}){
      super(glContext, shadercontext);
      this.frame = frame;
      this.dynamic = true;
      this.rprops.dstrect.w = size.w;
      this.rprops.dstrect.h = size.h;
      for(let f of frame) f.parent = this;
    }

    public compose():boolean {
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
          this.viewport = {x: this.camera.viewport.x, y: this.camera.viewport.y, w: this.camera.viewport.w, h: this.camera.viewport.h};
        }
        if(parts.length>0) this.generateComposite(parts, focusRect);
        if(this.picture.crop.do)this.crop();
        this.ready = true;
      }
      return this.rprops.delete;
    }

    private crop(){
      if(this.picture.ready){
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


  }
}