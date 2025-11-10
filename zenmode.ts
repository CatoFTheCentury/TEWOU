/**
 * drawTypeOrder : Array<string> = ["level", "ui"]

    // Init a top renderable
    let topRenderable : Renderable = {
        texture: {
          image: this.createTextToBlitOn(MAXWIDTH, MAXHEIGHT);
        }
    };

    // For each great layer (drawType)
    // blit on topRenderable
    for(let i = 0; i < drawTypeOrder.length; i++){
      let gameRenderable : Renderable = {
        texture: {
          image: this.createTextToBlitOn(MAXWIDTH, MAXHEIGHT);
        }
      };

      // Blit pictures recursively
      drawPictures(
        canvas.all[gameIni][drawTypeOrder[i]], // to blit
        gameRenderable,                        // to be blitted on
        depth);

      // blit this ->
      Render.gl.framebufferTexture2D(
        Render.gl.FRAMEBUFFER, Render.gl.COLOR_ATTACHMENT0, 
        Render.gl.TEXTURE_2D, gameRenderable.tex.image, 0);

      // blit on this ->
      Render.gl.bindTexture(Render.gl.TEXTURE_2D, topRenderable.tex.image);

      // blit ->
      Render.gl.copyTexSubImage2D(Render.gl.TEXTURE_2D, 0,
          0, // Where on bound x
          0, // where on bound y
          0, // where from framebuffer x
          0, // where from framebuffer y
        gameRenderable.texture.w, gameRenderable.texture.h)

    }

    Render.gl.drawArrays(Render.gl.TRIANGLES, 0, 6);

 */



/**
 * 
 * let previousShader : string;
 * class member: private currShader : ShaderTYPE | undefined = undefined;
    
    
  private drawPictures(
    picture : Picture : picture, // to blit
    renderable : Renderable,     // to be blitted on
    depth : number){

    if(picture.hidden) return;
      
    // -> draw renderable background
      
    // combine all in r to picture renderable (blit)
    if(picture.redrawDepth || depth != 0){
      for(let i in picture.r){ // sort
        drawPicture(picture.r[i], 
          picture.renderable, picture.redrawDepth ? picture.redrawDepth : depth-1);
      }
    }

    //
    // Pass shaders
    //

    const shaderID : string = curr.shaderID || batch.shaderID || lyr.shaderID || "undefined"

    if(previousShader!==shaderID) {
      this.currShader = this.shaders[shaderID] || this.shaders[fallbackShader] || undefined
      if(this.currShader != undefined) Render.gl.useProgram(this.shader.program)
    }
    if(this.currShader != undefined){
      Render.gl.bindTexture(Render.gl.TEXTURE_2D, curr.texture!.image)

      for(const a in this.currShader.passes){
        this.currShader.passes[a](picture.renderable,this.currShader)          
      }
    }

  
    // blit picture renderable to (parent's [passed as parameter])
    // blit this ->
    Render.gl.framebufferTexture2D(
      Render.gl.FRAMEBUFFER, Render.gl.COLOR_ATTACHMENT0, 
      Render.gl.TEXTURE_2D, picture.renderable.texture.image, 0);

    // blit on this ->
    Render.gl.bindTexture(Render.gl.TEXTURE_2D, renderable.texture.image);

    // blit ->
    Render.gl.copyTexSubImage2D(Render.gl.TEXTURE_2D, 0,
        picture.x, // Where on bound x
        picture.y, // where on bound y
        0, // where from framebuffer x
        0, // where from framebuffer y
      picture.renderable.texture.w, picture.renderable.texture.h)

    // 
  }



