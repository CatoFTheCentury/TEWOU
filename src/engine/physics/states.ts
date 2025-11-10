export enum CollideTypes {
  none      =  1 << 0,
  block     =  1 << 1,
  hurt      =  1 << 2,
  interact  =  1 << 3,
  climbable =  1 << 4,
  water     =  1 << 5,
  instakill =  1 << 6,
  get       =  1 << 7, // can get(?)
  all       = (1 << 8) - 1
}

export enum CollideLayers {
  none         =  1 << 0,
  player       =  1 << 1,
  npc          =  1 << 2,
  grid         =  1 << 3,
  interactable =  1 << 4,
  all          = (1 << 5) - 1
}
