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
  scalex    : number,
  scaley    : number,

  layer     : number,
  hidden    : boolean,

  shaderID? : string,
  delete    : boolean
}

export type shaderPass = (
  rprops: RenderProperties,
) => void

export type CellBuild = {
  tiles       : Array<tilesLayer>,
  npcs        : string,
  collisions  : Array<Array<boolean>>,
  tileset     : WebGLTexture,
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