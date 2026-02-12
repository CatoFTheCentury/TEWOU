precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D texture;

void main(void) {
    vec4 texcolor = texture2D(texture, v_texcoord); 

    if(texcolor.rgb == vec3(1.,1.,1.)){
      gl_FragColor = vec4(texcolor.rgb,0.);  
    } else {
      gl_FragColor = texcolor;
    }

}