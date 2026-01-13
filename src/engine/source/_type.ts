export type Point = {
  x : number,
  y : number,
  // z?: number
}

export type Box = {
  w : number,
  h : number,
  // d?: number
}

export type Bounds = Point & Box;

export type Texture = Box & {
  t: WebGLTexture
};

export type Flip = {
  flipx: boolean,
  flipy: boolean
}

export type RenderProperties = {
  srcrect   : Bounds,
  dstrect   : Bounds,
  pos       : Point,

  colorize? : Array<number>,
  shader?   : string,
  flip      : Flip

  rotcenter?: Point,
  angle     : number,

  scalecenter?: Point,
  scale       : Point,

  layer     : number,
  hidden    : boolean,

  shaderID? : string,
  delete    : boolean,

  // contextID : number,
}

export type shaderPass = (
  rprops: RenderProperties,
) => void

export type CellBuild = {
  tiles       : Array<tilesLayer>,
  npcs        : string,
  collisions  : Array<Array<Array<boolean>>>,
  tileset     : string,
  texture    ?: WebGLTexture,
  tilesetwidth: number,
  square      : Box,
  playLayer   : number,
  grid        : Box
}

export type tilesLayer = {
  tileYX: Array<Array<number>>
}

export type React = {
  name: string,
  parameters : Array<any>
}

export enum RunSwitch {
  off,disabled,enabled,running,elapsed
}

// export type glContext = {
//   vbuffer: WebGLBuffer,
//   Rframebuffer : WebGLFramebuffer,
//   framebuffer : WebGLFramebuffer,
//   renderbuffer : WebGLRenderbuffer,
//   gl: WebGL2RenderingContext,
//   id: string,
//   textures: {[id:string]:WebGLTexture}
// }

export type SnapBuild = {
  file   : string,
  srcrect: Bounds,
  dstrect: Bounds
}

export type AniBuild = {
  frames: Array<Array<SnapBuild>>
}

export type SharedBlueprint = {
  pos        : Point,
  anisrc     : {[id:string]:string},
  currentani : string,
  hitbox     : Bounds,
  owner      : {
    id  :number,
    name:string
  },
  id: string,
  dir: number
  // action     : string
}