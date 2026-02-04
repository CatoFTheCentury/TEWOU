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

export type Color = {
  r: number,
  g: number,
  b: number,
  a: number
}

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

  colorize? : Color,
  shader?   : string,
  flip      : Flip

  rotcenter : Point,
  angle     : number,

  scalecenter : Point,
  scale       : Point,

  layer     : number,
  hidden    : boolean,

  shaderID? : string,
  delete    : boolean,

}

export type ShaderPass = (
  rprops: RenderProperties,
) => void

export type CellBuild = {
  tiles       : Array<TilesLayer>,
  npcs        : string,
  collisions  : Array<Array<Array<boolean>>>,
  tileset     : string,
  texture    ?: WebGLTexture,
  tilesetwidth: number,
  square      : Box,
  playLayer   : number,
  grid        : Box
}

export type TilesLayer = {
  tileYX: Array<Array<number>>
}

export enum RunSwitch {
  off,disabled,enabled,running,elapsed
}

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
}

export type KeyboardAction = {
  keydown   ?: ()=>void,
  keyheld   ?: ()=>void,
  keypressed?: ()=>void, //keydown and key held
  keyup     ?: ()=>void,
}

export type TextProperties = {
  size ?: number,
  color?: Color,
  font ?: string,
  align?: string,
}

export type ExtraShaderArguments = {
  uvs ?: Bounds
}
