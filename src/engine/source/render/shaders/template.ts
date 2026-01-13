import { Composite } from "../composite";
import * as T from "../../_type";

export default abstract class Template {

    public abstract name : string;
    public abstract program : WebGLProgram;
    public abstract first  : Array<(ctx: WebGL2RenderingContext)=>void>;
    public abstract second : Array<()=>void>;
    public abstract passes : Array<(ctx: WebGL2RenderingContext,cmp: Composite.Image, plane: T.Box)=>void>;

    constructor(){
        
    }
}
