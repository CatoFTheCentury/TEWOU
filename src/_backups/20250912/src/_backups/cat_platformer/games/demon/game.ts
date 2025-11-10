import { Bodies } from '../../engine/alacrity/_bodies';
import Assets from "../../engine/render/assets"
import Window from "../../engine/systems/window"
import Character from "./character"
// import Tree from "../content/Grawl/tree"

import {Time} from "../../engine/alacrity/time"
import {Composite} from "../../engine/render/composite"
import {Render} from "../../engine/render/_render"

import Keyboard from "../../engine/systems/keyboard"
import IniParser from '../../engine/parsers/iniparser'
import TiledParser from '../../engine/parsers/tiledParser'
import * as T from '../../engine/_type'
import System from "../../engine/systems/_system"
import Camera from "../../engine/systems/camera"

import CollisionGrid from "../../engine/physics/gridCollision"
import Physics from '../../engine/systems/physics';

import * as C from "../../engine/physics/states"
import NPCCollision from '../../engine/physics/npcCollision';
import { Debug } from "../../engine/debug/dbggrid"
import {GameAnimations} from "./animations"

import * as Objects from './items'
import Scorpion from './scorpion'
import Touch from "../../engine/systems/touch"


import Items from './_items';
import Games from "../../engine/games"
import { Incarnations } from "../../engine/alacrity/_incarnations"

import Cameraman from '../../engine/systems/cameraman'
// import Banana from "./banana"


export default class Game extends Games {
  public bodies    : Array<Bodies.Embodiment> = [];
  public cellbuild : T.CellBuild;
  public player    : Incarnations.Player;
  public ui        : Array<Bodies.Alacrity> = [];
  public paused    : boolean = false;
  private uielt    : HTMLElement;

  public async start(): Promise<Games>{
    Render.Info.gl.clearColor(0, 0, 0, 1);
    Time.Delta.refresh();
    
    new Keyboard();
    new Touch();
    new Physics();
    new GameAnimations.CharacterAnimations();
    await Promise.all(await Assets.loadAllExtInFolder("_assets/demon/", ["png"]));

    this.paused = true;
    // INTRO
    let cameraman   = new Cameraman();
    let cam: Camera = new Camera(cameraman.actor, {w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height}, {x:0,y:0,w:150*16,h:20*16});
    this.ui.push(cameraman.actor);

    this.uielt = document.getElementById('instructions');
    this.uielt.innerHTML = "Attrapez la statuette"
    this.uielt.style.top = '50px'
    this.uielt.style.fontSize = '50px'

    // GAME

    this.cellbuild = await IniParser.loadIni('_assets/demon/lvl01.ini');
    let snaps: Array<Composite.Snap> = TiledParser.blit(this.cellbuild, "level-layer");
    
    let collisiongrid = new CollisionGrid(this.cellbuild.collisions, 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.block);
    Physics.collisionpool.push(collisiongrid);
    this.putNPCs(this.cellbuild.npcs);
    
    let char = new Character();
    this.player = char;
    char.uielt  = this.uielt;
    this.bodies.push(char);

    // Start
    cameraman.panCamera({x:680,y:200},{x:680,y:200}, 1000, ()=>{
      Assets.playSound('_assets/demon/roar.wav')
      cameraman.panCamera({x:680,y:200},{x:680,y:200}, 2000, ()=>{
        cameraman.panCamera({x:680,y:200},{x:176,y:200}, 8000, ()=>{
          cameraman.panCamera({x:176,y:200},{x:176,y:200}, 1000, ()=>{
            this.uielt.innerHTML = '';
            cam.actor = char;
            this.paused = false;
          })
        })
      })
    })

    Window.frm = new Composite.Frame(
      [...snaps,...this.bodies.map((a)=>a.myFrame), 
        // Debug.Grid.see(collisiongrid, {x:0,y:0,w:150*16,h:20*16})
      ]);
    Window.frm.camera = cam;

    // cam.actor = char;
    char.myCamera = Window.frm.camera;
    Window.frm.rprops.srcrect = {x:0,y:0, w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height};
    Window.frm.rprops.shaderID = "reverser";

    return new Game();
    // Games.pool.push(this)
  }
 
  public run(){
    Time.Delta.refresh();
    System.refresh();

    if(!this.paused) Bodies.Alacrity.refresh();
    else Bodies.Alacrity.refreshsome(this.ui);

    Window.frm.camera.refresh();
    // Keyboard.refresh();
    // Touch.refresh();
    // Window.refresh();
    Bodies.Alacrity.resetallmovements();
  }

  private putNPCs(file: string){
    let lines = file.split('\n');
    // let countperline = lines[0].split(',').length;
    let list  = lines.map((l)=>{return l.split(',');});
    for(let y = 0; y < list.length; y++){
      for(let x = 0; x < list[y].length; x++){
        switch (Number(list[y][x])){
          case Objects.Death.index:
            this.bodies.push(new Objects.Death({x:x*16,y:y*16}));
          break;
          case Objects.Door.index:
            this.bodies.push(new Objects.Door({x:x*16,y:y*16}));
          break;
          case Objects.Key.index:
            this.bodies.push(new Objects.Key({x:x*16,y:y*16}));
          break;
          case Objects.Idol.index:
            this.bodies.push(new Objects.Idol({x:x*16,y:y*16}));
          break;
          case Objects.Banana.index:
            this.bodies.push(new Objects.Banana({x:x*16,y:y*16}));
          break;
          case Scorpion.index:
            this.bodies.push(new Scorpion({x:x*16,y:y*16}));
          break;
        }
      }
    }
  }
}

  // public putnpcsfromcsv(npcsarr: string, squaresize: number): Array<Bodies.Embodiment>{
  //   let bodies: Array<Bodies.Embodiment> = [];
  //   let lines : Array<string> = npcsarr.split('\n');
  //   let putpos: T.Point       = {x:0,y:0}
  //   for(let i = 0; i < lines.length; i++){
  //     putpos.y = i * squaresize
  //   }

  // }
// }
