import Games from "../../engine/games"

import {Bodies} from "../../engine/alacrity/_bodies"
import Assets from "../../engine/render/assets"
import Window from "../../engine/systems/window"
import Character from "./character"
import Tree from "./tree"

import {Time} from "../../engine/alacrity/time"
import {Composite} from "../../engine/render/composite"
import {Render} from "../../engine/render/_render"

import Keyboard from "../../engine/systems/keyboard"
import Touch from "../../engine/systems/touch"
import IniParser from '../../engine/parsers/iniparser'
import TiledParser from '../../engine/parsers/tiledParser'
import * as T from '../../engine/_type'
import System from "../../engine/systems/_system"
import Camera from "../../engine/systems/camera"

import CollisionGrid from "../../engine/physics/gridCollision"
import Physics from '../../engine/systems/physics';

import * as C from "../../engine/physics/states"
import NPCCollision from '../../engine/physics/npcCollision';
import divUI from './divui';


export default class Game extends Games {
  public bodies : Array<Bodies.Embodiment> = [];
  public cellbuild : T.CellBuild;
  // public collisionpool : Array<
  // public render : Render.GL;

  public async start(){
    Time.Delta.refresh();
    new Keyboard();
    new Touch();


    let physics : Physics = new Physics();
    this.cellbuild = await IniParser.loadIni('_assets/grawl01.ini');
    let snaps: Array<Composite.Snap> = TiledParser.blit(this.cellbuild, "level-layer");
    
    await Assets.addText("_assets/levels/grawl01/tree.csv");
    Physics.collisionpool.push(new CollisionGrid(this.cellbuild.collisions, 16, C.CollideLayers.player, C.CollideTypes.block));
    await Promise.all(await Assets.loadAllExtInFolder("_assets/", ["png","gani","wav"]));
    let char: Character = new Character();
    new divUI(char)

    this.bodies.push(char);
    this.bodies.push(new Tree(this));
    Physics.collisionpool.push(new NPCCollision(this.bodies[0],C.CollideLayers.player, C.CollideLayers.grid | C.CollideLayers.npc, C.CollideTypes.block));
    
    Window.frm = new Composite.Frame([...snaps, ...this.bodies.map((a)=>a.myFrame)]);
    Window.frm.camera = new Camera(this.bodies[0], {w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height}, {x:0,y:0,w:1024,h:1024});
    char.myCamera = Window.frm.camera;
    Window.frm.rprops.srcrect = {x:0,y:0, w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height};
    Window.frm.rprops.shaderID = "reverser";
  }

  public run(){
    Time.Delta.refresh();
    System.refresh();
    Bodies.Alacrity.refresh();
    Keyboard.refresh();
    Touch.refresh();
    Window.refresh();
  }

}
