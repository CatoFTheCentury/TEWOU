import Textures from "./textures";
import {Render} from "./_render"
import * as T from '../_type';

export class Assets {
  private static pathprefix: string = '';
  private static parser = new DOMParser();
  private static textures : { [id: string] : HTMLImageElement   ;} = {};
  private static texts    : { [id: string] : string      ;} = {};
  private static sounds   : { [id: string] : AudioBuffer ;} = {};
  private static imgExts: Array<string> = ['png','jpg','gif', 'jpeg']
  private static txtExts: Array<string> = ['nw','txt', 'vert', 'frag', 'gani', 'csv']
  private static sndExts: Array<string> = ['wav','mp3']
  public static audioContext: AudioContext;
  private static placeholder : string   = "_assets/blocking.png";

  public static setprefix(prefix: string) {
    this.pathprefix = prefix;
  }


  public static getTexture(fileName:string): HTMLImageElement{ 
    if(!Assets.textures[this.pathprefix+fileName]) {
      console.log("Texture file not found or not loaded : "+ this.pathprefix+fileName);
      return Assets.textures[this.placeholder];
    }
    return Assets.textures[this.pathprefix+fileName];
  }
  public static getTextureWidth(fileName:string): number{ 
    if(!Assets.textures[this.pathprefix+fileName]) {
      console.log("Texture file not found or not loaded : "+ this.pathprefix+fileName);
      return -1;
    }
    return Assets.textures[this.pathprefix+fileName].width;
  }
  public static getTextureHeight(fileName:string): number{ 
    if(!Assets.textures[this.pathprefix+fileName]) {
      console.log("Texture file not found or not loaded : "+ this.pathprefix+fileName);
      return -1;
    }
    return Assets.textures[this.pathprefix+fileName].height;
  }
  public static getText(fileName:string): string{
    if(!Assets.texts[this.pathprefix+fileName]) {
      console.log("Text file not found or not loaded : " + this.pathprefix+fileName);
      return "";
    }
    return Assets.texts[this.pathprefix+fileName];
  }

  public static initAudio(){
    // window.addEventListener('load', function() {
      Assets.audioContext = new window.AudioContext();
    // });
  }

  // public static addTexture(name: string, tex: WebGLTexture, size: T.Box) {
  //   Assets.textures[name] = {t:tex, ...size};
  // }
  public static retrieveTex(fileName : string, glContext: Render.GLContext){
    if(!glContext.textures[fileName]){
      // Assumes the file always exists
      glContext.textures[fileName] = Textures.createTexture(glContext, Assets.getTexture(fileName))
    }
    return glContext.textures[fileName];
  }


  public static async addImage(fileName:string): Promise<string>{
    if(!Assets.textures[this.pathprefix+fileName]){
      let img = new Image();
      img.src = this.pathprefix+fileName;
      try {
        await img.decode().then(() => {
          // ne peut pas créer une texture immédiatement
          Assets.textures[this.pathprefix+fileName] = img;
        })
      } catch {
        console.log("Error");
      }
    }
    return this.pathprefix+fileName;
  }

  public static async addText(fileName:string) : Promise<string>{
    if(!Assets.texts[this.pathprefix+fileName]){
      Assets.texts[this.pathprefix+fileName] = await fetch(this.pathprefix+fileName).then((x)=>x.text());
    }
    return this.pathprefix+fileName;
  }

  public static async addSound(fileName: string): Promise<string>{
    if(!Assets.sounds[this.pathprefix+fileName]){
      await fetch(this.pathprefix+fileName)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => Assets.audioContext.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
              Assets.sounds[this.pathprefix+fileName] = decodedAudio;
          })
          .catch(error => console.error('Error loading audio file:', error));
    }
    return this.pathprefix+fileName;
  }

  public static playSound(fileName: string) {
    if(!Assets.sounds[this.pathprefix+fileName]){
      Assets.addSound(this.pathprefix+fileName).then((file)=>Assets.play(Assets.sounds[this.pathprefix+fileName]))
    } else {
      Assets.play(Assets.sounds[this.pathprefix+fileName]);
    }
  }

  private static play(decodedAudio: AudioBuffer) {
      let source = Assets.audioContext.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(Assets.audioContext.destination);
      source.start();
  }


  /**
   * 
   * @param folderPath Folder to load files from
   * @param ext File extension(s) to load
   * @returns Relative path of files found
   */
  public static async loadAllExtInFolder(folderPath : string, ext : Array<string>) : Promise<Array<Promise<string>>>{

    let xhr = new XMLHttpRequest();
    let jobs : Array<Promise<string>> = [];
    xhr.open('GET', folderPath, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let filesa = Assets.parser.parseFromString(xhr.responseText, "text/html").getElementsByTagName('a');
        // could use files = filesa.map((f)=>{return f.getAttributes("href")})
        let files : Array<string> = [];
        for(let i = 0; i < filesa.length; i++) files.push(filesa[i].getAttribute("href"));
        
        for (let file of files) {
          if (file.trim().length <= 0) continue;

          let fspl : Array<string> = file.split('.');
          let fileType = fspl[fspl.length-1];
          if(fileType.endsWith('/')) continue;
          if(fileType.startsWith('?')) continue;

          if(ext.includes(fileType)){
            if     (Assets.imgExts.includes(fileType)) jobs.push(Assets.addImage(folderPath + file));
            else if(Assets.txtExts.includes(fileType)) jobs.push(Assets.addText (folderPath + file));
            else if(Assets.sndExts.includes(fileType)) jobs.push(Assets.addSound(folderPath + file));
            else console.log('Incompatible file : ' + file);
          } else console.log('File is neither ' + ext.join(' or ') + ' : ' + file);
        }
      }
    }
    xhr.send();
    await Promise.all(jobs)
    return jobs;
  }

}