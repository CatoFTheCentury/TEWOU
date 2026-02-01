export enum CollideTypes {
  none      =  1 << 0,
  block     =  1 << 1,
  hurt      =  1 << 2,
  interact  =  1 << 3,
  climbable =  1 << 4,
  water     =  1 << 5,
  instakill =  1 << 6,
  get       =  1 << 7, // can get(?)
  custom0   =  1 << 8,
  custom1   =  1 << 9,
  custom2   =  1 << 10,
  custom3   =  1 << 11,
  custom4   =  1 << 12,
  custom5   =  1 << 13,
  custom6   =  1 << 14,
  custom7   =  1 << 15,
  custom8   =  1 << 16,
  custom9   =  1 << 17,
  all       = (1 << 18) - 1
}

export enum CollideLayers {
  none         =  1 << 0,
  player       =  1 << 1,
  npc          =  1 << 2,
  grid         =  1 << 3,
  interactable =  1 << 4,
  all          = (1 << 5) - 1
}

