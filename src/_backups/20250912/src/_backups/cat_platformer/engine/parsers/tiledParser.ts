/**
 * 
 * Send a 2char string and returns tile position in pics1_dyl.png array
 * 
 * TODO: Links, Signs, NPCs, Chests and Baddies
 * 
 *  */ 

import * as T from "../_type"
import {Render} from "../render/_render"
import {Composite} from "../render/composite"
import Textures from "../render/textures"
import Assets from "../render/assets"

export default class Tiled extends Render.Info {


  public static blit(cellbuild: T.CellBuild, prefix: string) : Array<Composite.Snap> {
    let i: number = -1;


    return  cellbuild.tiles.map(layer => {
        i++;

        const framebuffer : WebGLFramebuffer | null = Tiled.gl.createFramebuffer()

        Tiled.gl.bindFramebuffer(Tiled.gl.FRAMEBUFFER, Tiled.framebuffer)

        const cellWidth  =  cellbuild.square.w     * layer.tileYX[0].length;
        const cellHeight =  cellbuild.square.h     * layer.tileYX.length   ;
        const tilesetTW  = (cellbuild.tilesetwidth  / cellbuild.square.w    );
        // const tilesetTH  =  game.assetList.tileset.h  / game.assetList.square    ;

        let cellTex : WebGLTexture = Textures.createTexToBlitOn(cellWidth, cellHeight);

        Tiled.gl.framebufferTexture2D(Tiled.gl.FRAMEBUFFER, Tiled.gl.COLOR_ATTACHMENT0, Tiled.gl.TEXTURE_2D, cellbuild.tileset, 0);
        Tiled.gl.bindTexture(Tiled.gl.TEXTURE_2D, cellTex);
        
        for(let i = 0; i < layer.tileYX.length; i++){
          for(let x = 0; x < layer.tileYX[i].length; x++){
            Tiled.gl.copyTexSubImage2D(Tiled.gl.TEXTURE_2D, 0,
              x * cellbuild.square.w,
              i * cellbuild.square.h,
              // 0,
              layer.tileYX[i][x] % tilesetTW * cellbuild.square.w,
              Math.floor(layer.tileYX[i][x] / tilesetTW) * cellbuild.square.h, 
              cellbuild.square.w, cellbuild.square.h)
          }
        }
        // console.log(cellTex);
        // Tiled.gl.deleteFramebuffer(framebuffer)

        Assets.addTexture(prefix+i, cellTex, {w:cellWidth,h:cellHeight});
        let a = new Composite.Image(prefix+i, {x:0,y:0,w:cellWidth,h:cellHeight},{x:0,y:0,w:cellWidth,h:cellHeight});
        let b = new Composite.Snap([a]);
        b.rprops.layer = i - cellbuild.playLayer;
        return b;
      }
    );
  }
}
