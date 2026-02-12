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
    public texture  : WebGLTexture = undefined;
    protected file  : string;
    public ready    : boolean;
    public abstract compose() : boolean;
    public parent : Composite = undefined;
    public glContext : Render.GLContext;
    public shadercontext : ShaderLoader;
    public offset           : T.Point = {x:0,y:0};
    public dirty : boolean = true;
    public usecount : number = 0;
    public localcorners : Array<T.Point> = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader){
      super();
      this.glContext = glContext;
      this.shadercontext = shadercontext;
      this.rprops = {
        srcrect    : undefined,
        dstrect    : {x:0,y:0,w:0,h:0}, // overwritten for snap and frame; use for text,image,rectangle inside those
        rotcenter  : {x:0,y:0},
        scalecenter: {x:0,y:0},
        pos        : {x:0,y:0}, // affects only frame and snap
        flip       : {flipx:false,flipy:false},
        angle      : 0,
        scale      : {x:1,y:1},
        layer      : 0,
        hidden     : false,
        delete     : false
      }
    }

    public getClientBounds():T.Bounds{
      return {
        x: this.getClientLeft(),
        y: this.getClientTop(),
        w: this.getClientWidth(),
        h: this.getClientHeight()
      }
    }

    public translate(offset:T.Point){
      this.rprops.dstrect.x += offset.x;
      this.rprops.dstrect.y += offset.y;
      this.setDirty();
    }
    public translateX(offset:number){
      this.rprops.dstrect.x += offset;
      this.setDirty();
    }
    public translateY(offset:number){
      this.rprops.dstrect.y += offset;
      this.setDirty();
    }

    public setPosition(position:T.Point){
      this.rprops.dstrect.x = position.x;
      this.rprops.dstrect.y = position.y;
      this.setDirty();
    }
    public setPositionX(position:number){
      this.rprops.dstrect.x = position;
      this.setDirty();
    }
    public setPositionY(position:number){
      this.rprops.dstrect.y = position;
      this.setDirty();
    }

    public setFlipX(flip:boolean){
      this.rprops.flip.flipx = flip;
      this.setDirty();
    }

    public setFlipY(flip:boolean){
      this.rprops.flip.flipy = flip;
      this.setDirty();
    }

    public setScaleX(scale:number){
      this.rprops.scale.x = scale;
      this.setDirty();
    }

    public setScaleY(scale:number){
      this.rprops.scale.y = scale;
      this.setDirty();
    }

    public setAngle(angle:number){
      this.rprops.angle = angle;
      this.setDirty();
    }

    public rotateBy(angle:number){
      this.rprops.angle += angle;
      this.setDirty();
    }

    public setLayer(layer:number){
      this.rprops.layer = layer;
      if(this.parent) this.parent.setDirty();
    }
    
    public setDirty(){
      this.dirty = true;
      if(this.parent) this.parent.setDirty();
    }
    // add "add" methods to Snap, animation, frame (or simply composite?) 
    //// so parent is updated at addition (instead of pushing directly)

    public getClientLeft():number{
      if(!this.parent){
        return this.rprops.pos.x * this.getWidthRatio();
      }
      return (this.rprops.pos.x + this.parent.getClientLeft()) * this.getWidthRatio();
    }
  
    public getClientTop():number{
      return (this.rprops.pos.y + (this.parent==undefined?0:this.parent.getClientTop())) * this.getWidthRatio();
    }

    public getClientWidth(dstrect: T.Bounds = this.rprops.dstrect):number{
      return dstrect.w * this.getWidthRatio();
    }

    public getClientHeight(dstrect: T.Bounds = this.rprops.dstrect):number{
      return dstrect.h * this.getHeightRatio();;
    }

    private getWidthRatio():number{
      if(this.parent!=undefined){
        return (this.rprops.dstrect.w / this.rprops.srcrect.w) * this.parent.getWidthRatio();
      }
      return this.rprops.dstrect.w / this.rprops.srcrect.w;
    }

    private getHeightRatio():number{
      if(this.parent!=undefined){
        return (this.rprops.dstrect.h / this.rprops.srcrect.h) * this.parent.getHeightRatio();
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
    private size : T.Box = {w:0,h:0};
    private supersample : number = 2;

    constructor(glContext : Render.GLContext, shadercontext: ShaderLoader, text:string, textproperties: T.TextProperties = {}){
      super(glContext,shadercontext)
      this.text = text;
      this.setProperties(textproperties);
      Text.textcontext.textAlign = "left";
      Text.textcontext.textBaseline = "top"
      Text.textcontext.font = this.properties.size + "px " + this.properties.font;

      this.rprops.dstrect.w = Text.textcontext.measureText(this.text).width;
      // this.size.h = 
    }

    public compose(){
      if(this.rprops.delete) {
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        return true;
      }

      if(this.dirty){
        // console.log("HALP")
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);

        // Measure text first
        let textcontext = Text.textcontext;
        textcontext.font = this.properties.size + "px " + this.properties.font;
        this.rprops.dstrect.w = Math.ceil(textcontext.measureText(this.text).width);
        this.rprops.dstrect.h = this.properties.size;
        this.size.w = this.rprops.dstrect.w * this.supersample;
        this.size.h = this.rprops.dstrect.h * this.supersample;

        // Clear region on shared canvas
        textcontext.clearRect(0, 0, this.size.w, this.size.h);

        // Set font properties
        textcontext.textAlign = "left";
        textcontext.textBaseline = "top";
        textcontext.font = this.properties.size * this.supersample + "px " + this.properties.font;
        textcontext.fillStyle = "rgba("+
          this.properties.color.r +","+
          this.properties.color.g +","+
          this.properties.color.b +","+
          this.properties.color.a +")";

        // Render text
        textcontext.fillText(this.text, 0, 0);

        // Upload to WebGL
        let gl = this.glContext.gl;
        let spr : WebGLTexture = Textures.createTexToBlitOn(this.glContext, this.size.w, this.size.h);
        gl.bindTexture(gl.TEXTURE_2D, spr);
        // Use LINEAR filtering for smooth text antialiasing
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size.w, this.size.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, Text.textcanvas);

        this.texture = spr;
        this.dirty = false;

      }
      return false;
    }

    public setText(text:string){
      // if(this.ready) this.glContext.gl.deleteTexture(this.texture);
      this.text = text;
      this.rprops.dstrect.w = Text.textcontext.measureText(this.text).width;
      this.setDirty();
    }

    public getWidth(){
      return this.rprops.dstrect.w;
    }

    public setProperties(textproperties: T.TextProperties){
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

      this.setDirty()
    }
    
    public setColor(color: T.Color){
      this.properties.color = color;
      this.setDirty();
    }
    
    public setSize(size: number){
      this.properties.size = size;
      this.size.h = this.properties.size;
      this.setDirty();
    }
  }

  export class Rectangle extends Renderable {

    constructor(glContext : Render.GLContext, shadercontext : ShaderLoader, bounds : T.Bounds, color : T.Color){
      super(glContext, shadercontext);
      this.rprops.dstrect = bounds;
      this.rprops.colorize = color;
    }

    public compose(){
      if(this.rprops.delete) {
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        return true;
      }

      if(this.dirty){
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        let gl = this.glContext.gl;

        let spr : WebGLTexture = Textures.createTexToBlitOn(this.glContext, 1, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, spr);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
          new Uint8Array([this.rprops.colorize.r,this.rprops.colorize.g,this.rprops.colorize.b,this.rprops.colorize.a]));
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        this.texture = spr;
        this.dirty = false;
      }

      return false;
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
      if(this.rprops.delete && this.texture){
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        return true;
      }
      
      if(this.dirty){
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        let gl = this.glContext.gl;
        let spr : WebGLTexture = Textures.createTexToBlitOn(this.glContext, this.rprops.srcrect.w, this.rprops.srcrect.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.retrieveTexture(this.file), 0);
        gl.bindTexture(gl.TEXTURE_2D, spr);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 
          0, 0, 0, this.rprops.srcrect.x, this.rprops.srcrect.y, this.rprops.srcrect.w, this.rprops.srcrect.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
        this.texture = spr;
        this.dirty = false;
      }

      return false;
    }


  }

  class Composite extends Renderable {
    // public remove           : boolean;
    // public dynamic          : boolean = false;
    public bg               : WebGLTexture;
    public mask             : WebGLTexture;
    protected viewport      : T.Bounds;
    protected focus         : T.Bounds;


    private applyBg(){}
    private applyMask(){}
    public compose():boolean{return this.rprops.delete;}

    constructor(glContext: Render.GLContext, shadercontext:ShaderLoader){
      super(glContext,shadercontext);
      this.viewport = {x:0,y:0,w:glContext.gl.canvas.width,h:glContext.gl.canvas.height};
    }

    public translate(offset:T.Point){
      this.rprops.pos.x += offset.x;
      this.rprops.pos.y += offset.y;
      this.setDirty();
    }
    public translateX(offset:number){
      this.rprops.pos.x += offset;
      this.setDirty();
    }
    public translateY(offset:number){
      this.rprops.pos.y += offset;
      this.setDirty();
    }

    public setPosition(position:T.Point){
      this.rprops.pos.x = position.x;
      this.rprops.pos.y = position.y;
      this.setDirty();
    }
    public setPositionX(position:number){
      this.rprops.pos.x = position;
      this.setDirty();
    }
    public setPositionY(position:number){
      this.rprops.pos.y = position;
      this.setDirty();
    }

    public static createFocus(rd: Array<Renderable>): T.Bounds{
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const r of rd) {
        const originX = r.rprops.dstrect.x;
        const originY = r.rprops.dstrect.y;
        let localcorners : Array<T.Point>;
        // if(r.dirty){
          localcorners = [
            { x: 0, y: 0 },
            { x: r.rprops.dstrect.w, y: 0 },
            { x: 0, y: r.rprops.dstrect.h },
            { x: r.rprops.dstrect.w, y: r.rprops.dstrect.h },
          ];
        // } else {
        //   localcorners = r.localcorners;
        // }

        for (let i = 0; i < localcorners.length; i++) {
          let transformed;
          // if(r.dirty){
            transformed = Composite.scaleThenRotatePreserveOriginalRotation(
              localcorners[i],
              r.rprops.scalecenter || { x: 0, y: 0 },
              r.rprops.scale || { x: 1, y: 1 },
              r.rprops.rotcenter || { x: 0, y: 0 },
              -r.rprops.angle || 0
            );
            r.localcorners[i] = transformed;
          // } else {
          //   transformed = localcorners[i];
          // }

          const absoluteX = originX + transformed.x;
          const absoluteY = originY + transformed.y;

          minX = Math.min(minX, absoluteX);
          minY = Math.min(minY, absoluteY);
          maxX = Math.max(maxX, absoluteX);
          maxY = Math.max(maxY, absoluteY);
        }
      }

      return {
        x: Math.floor(minX),
        y: Math.floor(minY),
        w: Math.ceil(maxX - Math.floor(minX)),
        h: Math.ceil(maxY - Math.floor(minY))
      };
    }

    public setDirty(){
      this.dirty = true;
      if(this.parent) this.parent.setDirty();
    }

    protected generateComposite(rd : Array<Renderable>, focusRect: T.Bounds){
      let toDraw : Array<Renderable> = rd.filter((r)=>{return !r?.rprops.hidden});
        if(toDraw.length > 0){
          toDraw.sort((a,b)=>a.rprops.layer - b.rprops.layer);
          // for(let i = 0; i < toDraw.length; i++) toDraw[i].compose();

        this.offset.x = focusRect.x;
        this.offset.y = focusRect.y;

        this.rprops.dstrect = {
          x : this.rprops.pos.x + focusRect.x,
          y : this.rprops.pos.y + focusRect.y,
          w : focusRect.w,
          h : focusRect.h
        }

        let gl = this.glContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glContext.framebuffer);

        this.texture = Textures.createTexToBlitOn(this.glContext, focusRect.w, focusRect.h);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.viewport(0,0, focusRect.w, focusRect.h);

              gl.clearColor(1,0,0,.1);

      gl.clear(gl.COLOR_BUFFER_BIT);


        for(let i = 0; i < toDraw.length; i++){
          this.glContext.gl.bindTexture(gl.TEXTURE_2D, toDraw[i].texture);

          const childPlane = {
            x: toDraw[i].rprops.dstrect.x - focusRect.x,
            y: toDraw[i].rprops.dstrect.y - focusRect.y,
            w: focusRect.w,
            h: focusRect.h
          };

          this.shadercontext.passShader(toDraw[i], childPlane);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        this.ready = true;
      } else this.ready = false;
    }

    // add "add" methods to Snap, animation, frame (or simply composite?) 
    //// so parent is updated at addition (instead of pushing directly)
    // need to refresh camera for viewport to have the camera modifications
    public getClientLeft():number{
      if(!this.parent){
        return this.rprops.pos.x - this.viewport.x;
      }
      return this.rprops.pos.x + this.parent.getClientLeft() - this.viewport.x;
    }

    public getClientTop():number{
      return this.rprops.pos.y + (this.parent==undefined?0:this.parent.getClientTop()) - this.viewport.y;
    }

    public addToComposition(arr:Composite[]){}

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
      let scaledpoint = p;
      let compensatedRotationCenter = rotationCenter;

      if(scale.x != 1 || scale.y != 1){

        scaledpoint = Composite.scaleAround(p, scaleCenter, scale);
        
        // 2) compensate the rotation center
        compensatedRotationCenter = {
          x: scaleCenter.x + (rotationCenter.x - scaleCenter.x) * scale.x,
          y: scaleCenter.y + (rotationCenter.y - scaleCenter.y) * scale.y,
        };
      }

      // 3) rotate around the compensated center
      if(angleRad!=0){
        return Composite.rotateAround(scaledpoint, compensatedRotationCenter, angleRad);
      }

      return scaledpoint;
    }

  }

  export class Snap extends Composite {
    public parts : Array<Renderable>;

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader, parts : Array<Renderable>){
      super(glContext, shadercontext);
      for(let p of parts) {
        p.parent = this;
        p.usecount += 1;
      }
      this.parts = parts;
    }

    public compose():boolean{
      if(this.rprops.delete) {
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        for(let f of this.parts){
          f.usecount -= 1;
          if(f.usecount <= 0){
            f.rprops.delete = true;
            f.compose();
          }
        }
        return true;
      }

      if(this.dirty){
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);

        this.parts = this.parts.filter((f)=>f!=undefined && !f.compose());
        this.focus = Snap.createFocus(this.parts);

        this.generateComposite(this.parts, this.focus);

        this.dirty = false;
      }
      return false;
    }

    public addToComposition(arr: Renderable[]): void {
      for(let a of arr){
        a.usecount += 1;
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
      // this.dynamic = true;
      this.timer = new Time.Timeout(timings, "framechange");
      this.frames = frames;
      for(let f of frames) {
        f.usecount += 1;
        f.parent = this;
      }
    }

    public compose():boolean{
      if(this.rprops.delete) {
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        for(let f of this.frames){
          f.usecount -= 1;
          if(f.usecount <= 0){
            f.rprops.delete = true;
            f.compose();
          }
        }
        return true;
      }
      this.handleFrameChange();
      if(this.frames[this.currentFrame].dirty){
        this.frames[this.currentFrame].compose();
      }
      this.texture = this.frames[this.currentFrame].texture;
      this.rprops = this.frames[this.currentFrame].rprops;

      this.dirty = this.frames[this.currentFrame].dirty;
      return false;
    }

    private handleFrameChange(){
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
    public getClientLeft():number{
      return this.parent.getClientLeft();    }
  
    public getClientTop():number{
      return this.parent.getClientTop();    }

    // returns and diminishes once too many?
    public getClientWidth():number{
      return super.getClientWidth(this.frames[this.currentFrame].rprops.dstrect)
    }

    public getClientHeight():number{
      return super.getClientHeight(this.frames[this.currentFrame].rprops.dstrect)
    }

    public addToComposition(arr: Composite[]): void {
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
      // this.dynamic = true;
      this.rprops.dstrect.w = size.w;
      this.rprops.dstrect.h = size.h;
      for(let f of frame) {
        f.usecount += 1;
        f.parent = this;
      }
    }

    public compose():boolean {
      // There has to be an underlying bug for this next line to be required:
      if(this.frame[0] === undefined) {
        console.log("Skipping empty frame...")
        return true;
      }

      if(this.rprops.delete) {
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        for(let f of this.frame){
          f.usecount -= 1;
          if(f.usecount <= 0){
            f.rprops.delete = true;
            f.compose();
          }
        }
        return true;
      }

      if(this.dirty){
        if(this.texture !== undefined) this.glContext.gl.deleteTexture(this.texture);
        
        this.frame = this.frame.filter((f)=>f!=undefined && !f.compose());
        let focusRect: T.Bounds = Snap.createFocus(this.frame.filter((f)=>f!=undefined && !f.rprops.delete && !f.rprops.hidden));

        let parts : Array<Renderable> = this.frame;

        this.rprops.dstrect.x = this.rprops.pos.x;
        this.rprops.dstrect.y = this.rprops.pos.y;
        
        if(this.camera !== undefined){
          this.rprops.dstrect.w = this.camera.viewport.w;
          this.rprops.dstrect.h = this.camera.viewport.h;
          this.viewport = {x: this.camera.viewport.x, y: this.camera.viewport.y, w: this.camera.viewport.w, h: this.camera.viewport.h};
        }
        if(parts.length>0) this.generateComposite(parts, focusRect);
        if(this.picture.crop.do)this.crop();
        this.dirty = false;
      }
      return false;
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

    public addToComposition(arr: Composite[]): void {
      for(let a of arr){
        a.parent = this;
      }
      this.frame.push(...arr)
      this.setDirty();
    }


  }
}