import Textures from "./textures";
import * as T from '../_type';

export default class Assets {
  private static parser = new DOMParser();
  private static textures : { [id: string] : T.Texture   ;} = {};
  private static texts    : { [id: string] : string      ;} = {};
  private static sounds   : { [id: string] : AudioBuffer ;} = {};
  private static imgExts: Array<string> = ['png','jpg','gif', 'jpeg']
  private static txtExts: Array<string> = ['nw','txt', 'vert', 'frag', 'gani', 'csv']
  private static sndExts: Array<string> = ['wav','mp3']
  public static audioContext: AudioContext;
  private static placeholder : string   = "_assets/blocking.png";


  public static getTexture(fileName:string): WebGLTexture{ 
    if(!Assets.textures[fileName]) {
      console.log("Texture file not found or not loaded : "+ fileName);
      return Assets.textures[this.placeholder];
    }
    return Assets.textures[fileName].t;
  }
  public static getTextureWidth(fileName:string): number{ 
    if(!Assets.textures[fileName]) {
      console.log("Texture file not found or not loaded : "+ fileName);
      return -1;
    }
    return Assets.textures[fileName].w;
  }
  public static getTextureHeight(fileName:string): number{ 
    if(!Assets.textures[fileName]) {
      console.log("Texture file not found or not loaded : "+ fileName);
      return -1;
    }
    return Assets.textures[fileName].h;
  }
  public static getText(fileName:string): string{
    if(!Assets.texts[fileName]) {
      console.log("Text file not found or not loaded : " + fileName);
      return "";
    }
    return Assets.texts[fileName];
  }

  public static initAudio(){
    // window.addEventListener('load', function() {
      Assets.audioContext = new window.AudioContext();
    // });
  }

  public static addTexture(name: string, tex: WebGLTexture, size: T.Box) {
    Assets.textures[name] = {t:tex, ...size};
  }

  public static async addImage(file:string): Promise<string>{
    if(!Assets.textures[file]){
      let img = new Image();
      img.src = file;
      await img.decode().then(() => {
        Assets.textures[file] = {t:Textures.createTexture(img), w:img.width, h:img.height};
      })
    }
    return file;
  }

  public static async addText(file:string) : Promise<string>{
    if(!Assets.texts[file]){
      Assets.texts[file] = await fetch(file).then((x)=>x.text());
    }
    return file;
  }

  public static async addSound(file: string): Promise<string>{
    if(!Assets.sounds[file]){
      await fetch(file)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => Assets.audioContext.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
              Assets.sounds[file] = decodedAudio;
          })
          .catch(error => console.error('Error loading audio file:', error));
    }
    return file;
  }

  public static playSound(file: string) {
    if(!Assets.sounds[file]){
      Assets.addSound(file).then((file)=>Assets.play(Assets.sounds[file]))
    } else {
      Assets.play(Assets.sounds[file]);
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