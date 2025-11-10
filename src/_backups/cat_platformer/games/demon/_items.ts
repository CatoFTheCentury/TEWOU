import { Bodies } from "../../engine/alacrity/_bodies"
import { Composite } from "../../engine/render/composite";
import * as T from '../../engine/_type';



export default class Items extends Bodies.Embodiment {
    public static index = 0;
    public static foods = {
      fruit: {
        apple: {
          shiny: {x:26,y:15},
          red  : {x:26,y:16},
          gold : {x:26,y:17},
          green: {x:26,y:18},
        },
        pear: {
          brown : {x:27,y:15},
          green : {x:27,y:16},
          yellow: {x:27,y:17},
          orange: {x:27,y:18},
        },
        citrus: {
          grapefruit: {
            brown : {x:28,y:15},
            yellow: {x:28,y:16},
            orange: {x:28,y:17},
          },
          lemon:{x:29,y:15},
          lime :{x:29,y:16},
        },
        cherries: {
          red : {x:30,y:15},
          dark: {x:30,y:16},
        },
        melon: {
          pink  :{x:34,y:15},
          yellow:{x:34,y:16},
          green :{x:34,y:16}
        },
        banana : {x:41,y:15}
      },
      veggie: {
        carrot: {
          orange: {x:31,y:15},
          gray  : {x:31,y:16},
          yellow: {x:31,y:17},
        },
        radish: {x:32,y:15},
        turnip: {
          beet:{x:33,y:15},
          bad :{x:33,y:16},
          good:{x:33,y:17},
        },
        pepper: {
          red   : {x:35,y:15},
          yellow: {x:35,y:16},
          green : {x:35,y:17},
          dark  : {x:35,y:18},
        },
        brocolli: {
          green: {x:36,y:15},
          brown: {x:37,y:16},
        },
        cauliflower: {x:37,y:15},
        bellpepper: {
          red   : {x:38,y:15},
          yellow: {x:38,y:16},
          green : {x:38,y:17},
        },
        cucumber: {
          green : {x:39,y:15},
          yellow: {x:39,y:16},
          white : {x:39,y:17},
        },
        mushroom: {
          white: {x:40,y:15},
          brown: {x:40,y:16},
        }
      },
      sandwich:{
        bread: {
          tomato: {x:26,y:19},
          cheese: {x:26,y:20}
        },
        burger: {
          tomato: {x:27,y:19},
          cheese: {x:27,y:20},
          chicken:{x:27,y:21}
        },
        hotdog: {
          ketchup:{x:28,y:19},
          meat   :{x:28,y:20},
          mustard:{x:28,y:21}
        }
      },
      meat: {
        chicken:{x:29,y:19},
        beef   :{x:29,y:19},
        pork   :{x:29,y:19},
      },
      prepared: {
        can    :{x:30,y:19},
        catfood:{x:30,y:20},
        dogfood:{x:30,y:21},
        ramen: {
          green :{x:31,y:19},
          red   :{x:31,y:20},
          yellow:{x:31,y:21},
        }
      },
      cheese: {
        swiss:{x:32,y:19},
        brie :{x:32,y:20},
      },
      sweets: {
        icecream:{
          vanilla   : {x:26,y:22},
          strawberry: {x:26,y:23},
          chocolate : {x:26,y:24}
        },
        lollipop:{
          strawberry:{x:27,y:22},
          lemon     :{x:27,y:23},
          greenapple:{x:27,y:24}
        },
        candy: {
          blueberry:{x:28,y:22},
          gray     :{x:28,y:23},
          toffee   :{x:28,y:24}
        },
        chocolate:{
          milk :{x:29,y:22},
          white:{x:29,y:23},
          dark :{x:29,y:24}
        },
        rizzle:{
          black: {x:30,y:22},
          red  : {x:30,y:23},
          blue : {x:30,y:24}
        }
      },
      drinks: {
        soda:{
          red   :{x:26,y:25},
          blue  :{x:26,y:26},
          yellow:{x:26,y:27},
          green :{x:26,y:28},
        },
        tea:{
          white:{x:27,y:25},
          brown:{x:27,y:26},
          blue :{x:27,y:27},
          green:{x:27,y:28},
        },
        coffee:{
          white:{x:28,y:25},
          brown:{x:28,y:26},
          red  :{x:28,y:27},
          blue :{x:28,y:28},
        },
        wine:{
          white:{x:29,y:25},
          rose :{x:29,y:26},
          red  :{x:29,y:27},
          dark :{x:29,y:28},
        },
        champagne:{
          white :{x:30,y:25},
          yellow:{x:30,y:26},
          rose  :{x:30,y:27},
          red   :{x:30,y:28},
        },
        martini: {x:31,y:25},
        absynthe:{x:31,y:26},
        orangedrink:{x:31,y:27},
        umbrellabrink:{x:31,y:28},
        beer:{
          white:{x:32,y:25},
          brown:{x:32,y:26},
          red  :{x:32,y:27},
          dark :{x:32,y:28},
        },
        cup:{
          white:{x:33,y:25},
          brown:{x:33,y:26},
          red  :{x:33,y:27},
        }
      }
    }
    public static heals = {
      palegray : {
        potions: {
          small : {x:26,y:33},
          medium: {x:26,y:34},
          big   : {x:26,y:35},
          huge  : {x:26,y:36},
        },
        orbs: {
          small : {x:26,y:37},
          medium: {x:26,y:38},
          big   : {x:26,y:39},
          huge  : {x:26,y:40},
        }
      },
      darkgray : {
        potions: {
          small : {x:27,y:33},
          medium: {x:27,y:34},
          big   : {x:27,y:35},
          huge  : {x:27,y:36},
        },
        orbs: {
          small : {x:27,y:37},
          medium: {x:27,y:38},
          big   : {x:27,y:39},
          huge  : {x:27,y:40},
        }
      },
      black : {
        potions: {
          small : {x:28,y:33},
          medium: {x:28,y:34},
          big   : {x:28,y:35},
          huge  : {x:28,y:36},
        },
        orbs: {
          small : {x:28,y:37},
          medium: {x:28,y:38},
          big   : {x:28,y:39},
          huge  : {x:28,y:40},
        }
      },
      pink : {
        potions: {
          small : {x:29,y:33},
          medium: {x:29,y:34},
          big   : {x:29,y:35},
          huge  : {x:29,y:36},
        },
        orbs: {
          small : {x:29,y:37},
          medium: {x:29,y:38},
          big   : {x:29,y:39},
          huge  : {x:29,y:40},
        }
      },
      red : {
        potions: {
          small : {x:30,y:33},
          medium: {x:30,y:34},
          big   : {x:30,y:35},
          huge  : {x:30,y:36},
        },
        orbs: {
          small : {x:30,y:37},
          medium: {x:30,y:38},
          big   : {x:30,y:39},
          huge  : {x:30,y:40},
        }
      },
      blood : {
        potions: {
          small : {x:31,y:33},
          medium: {x:31,y:34},
          big   : {x:31,y:35},
          huge  : {x:31,y:36},
        },
        orbs: {
          small : {x:31,y:37},
          medium: {x:31,y:38},
          big   : {x:31,y:39},
          huge  : {x:31,y:40},
        }
      },
      orange : {
        potions: {
          small : {x:32,y:33},
          medium: {x:32,y:34},
          big   : {x:32,y:35},
          huge  : {x:32,y:36},
        },
        orbs: {
          small : {x:32,y:37},
          medium: {x:32,y:38},
          big   : {x:32,y:39},
          huge  : {x:32,y:40},
        }
      },
      ocre : {
        potions: {
          small : {x:33,y:33},
          medium: {x:33,y:34},
          big   : {x:33,y:35},
          huge  : {x:33,y:36},
        },
        orbs: {
          small : {x:33,y:37},
          medium: {x:33,y:38},
          big   : {x:33,y:39},
          huge  : {x:33,y:40},
        }
      },
      brown : {
        potions: {
          small : {x:34,y:33},
          medium: {x:34,y:34},
          big   : {x:34,y:35},
          huge  : {x:34,y:36},
        },
        orbs: {
          small : {x:34,y:37},
          medium: {x:34,y:38},
          big   : {x:34,y:39},
          huge  : {x:34,y:40},
        }
      },
      chartreuse : {
        potions: {
          small : {x:35,y:33},
          medium: {x:35,y:34},
          big   : {x:35,y:35},
          huge  : {x:35,y:36},
        },
        orbs: {
          small : {x:35,y:37},
          medium: {x:35,y:38},
          big   : {x:35,y:39},
          huge  : {x:35,y:40},
        }
      },
      green : {
        potions: {
          small : {x:36,y:33},
          medium: {x:36,y:34},
          big   : {x:36,y:35},
          huge  : {x:36,y:36},
        },
        orbs: {
          small : {x:36,y:37},
          medium: {x:36,y:38},
          big   : {x:36,y:39},
          huge  : {x:36,y:40},
        }
      },
      forest : {
        potions: {
          small : {x:37,y:33},
          medium: {x:37,y:34},
          big   : {x:37,y:35},
          huge  : {x:37,y:36},
        },
        orbs: {
          small : {x:37,y:37},
          medium: {x:37,y:38},
          big   : {x:37,y:39},
          huge  : {x:37,y:40},
        }
      },
      babyblue : {
        potions: {
          small : {x:38,y:33},
          medium: {x:38,y:34},
          big   : {x:38,y:35},
          huge  : {x:38,y:36},
        },
        orbs: {
          small : {x:38,y:37},
          medium: {x:38,y:38},
          big   : {x:38,y:39},
          huge  : {x:38,y:40},
        }
      },
      blue : {
        potions: {
          small : {x:39,y:33},
          medium: {x:39,y:34},
          big   : {x:39,y:35},
          huge  : {x:39,y:36},
        },
        orbs: {
          small : {x:39,y:37},
          medium: {x:39,y:38},
          big   : {x:39,y:39},
          huge  : {x:39,y:40},
        }
      },
      navy : {
        potions: {
          small : {x:40,y:33},
          medium: {x:40,y:34},
          big   : {x:40,y:35},
          huge  : {x:40,y:36},
        },
        orbs: {
          small : {x:40,y:37},
          medium: {x:40,y:38},
          big   : {x:40,y:39},
          huge  : {x:40,y:40},
        }
      },
      white : {
        potions: {
          small : {x:41,y:33},
          medium: {x:41,y:34},
          big   : {x:41,y:35},
          huge  : {x:41,y:36},
        },
        orbs: {
          small : {x:41,y:37},
          medium: {x:41,y:38},
          big   : {x:41,y:39},
          huge  : {x:41,y:40},
        }
      },
      antiquewhite : {
        potions: {
          small : {x:42,y:33},
          medium: {x:42,y:34},
          big   : {x:42,y:35},
          huge  : {x:42,y:36},
        },
        orbs: {
          small : {x:42,y:37},
          medium: {x:42,y:38},
          big   : {x:42,y:39},
          huge  : {x:42,y:40},
        }
      },
      skull : {
        orbs: {
          small : {x:43,y:33},
          medium: {x:43,y:34},
          big   : {x:43,y:35},
          huge  : {x:43,y:36},
        }
      },
    }
    public static explosizes = {
      bomb :{ 1:{x:26,y:41}, 2:{x:27,y:41}, 3:{x:28,y:41}},
      tnt  :{ 1:{x:29,y:41}, 2:{x:30,y:41}, 3:{x:31,y:41}}
    }
    public static light  = {
      candle    : {x:26,y:42},
      match     : {x:27,y:42},
      lamp      : {x:28,y:42},
      flashlight: {x:29,y:42},
    }
    public static chests = {
      firstaid : {
        closed: {
          white : {x:29,y:43},
          blue  : {x:30,y:43},
          orange: {x:31,y:43}
        },
        open: {
          white : {x:29,y:44},
          blue  : {x:30,y:44},
          orange: {x:31,y:44}
        }
      },
      treasure : {
        closed: {
          wood : {x:26,y:43},
          iron : {x:27,y:43},
          gold : {x:28,y:43}
        },
        open: {
          wood : {x:26,y:44},
          iron : {x:27,y:44},
          gold : {x:28,y:44}
        }
      }
    }
    public static locks  = {
      keyhole :{
        gold: {x:26,y:46},
        iron: {x:27,y:46},
        rust: {x:28,y:46}
      },
      key :{
        gold: {x:26,y:45},
        iron: {x:27,y:45},
        rust: {x:28,y:45}
      }
    }
    public static relics = {
      coin : {
        iron     : {x:26,y:47},
        bronze   : {x:27,y:47},
        silver   : {x:28,y:47},
        gold     : {x:29,y:47},
        platinum : {x:30,y:47}
      },
      coins : {
        iron     : {x:26,y:48},
        bronze   : {x:27,y:48},
        silver   : {x:28,y:48},
        gold     : {x:29,y:48},
        platinum : {x:30,y:48}
      },
      bullion : {
        iron     : {x:26,y:50},
        bronze   : {x:27,y:50},
        silver   : {x:28,y:50},
        gold     : {x:29,y:50},
        platinum : {x:30,y:50}
      },
      cross : {
        iron     : {x:26,y:51},
        bronze   : {x:27,y:51},
        silver   : {x:28,y:51},
        gold     : {x:29,y:51},
        platinum : {x:30,y:51}
      },
      orb  : {
        obsidian : {x:31,y:48},
        emerald  : {x:32,y:48},
        sapphire : {x:33,y:48},
        ruby     : {x:34,y:48},
        quartz   : {x:35,y:48},
      },
      square : {
        obsidian : {x:31,y:49},
        emerald  : {x:32,y:49},
        sapphire : {x:33,y:49},
        ruby     : {x:34,y:49},
        quartz   : {x:35,y:49},
      },
      rupee : {
        obsidian : {x:31,y:50},
        emerald  : {x:32,y:50},
        sapphire : {x:33,y:50},
        ruby     : {x:34,y:50},
        quartz   : {x:35,y:50},
      },
      diamond : {
        obsidian : {x:31,y:51},
        emerald  : {x:32,y:51},
        sapphire : {x:33,y:51},
        ruby     : {x:34,y:51},
        quartz   : {x:35,y:51},
      },
      ore : {
        iron     : {x:26,y:49},
        bronze   : {x:27,y:49},
        silver   : {x:28,y:49},
        gold     : {x:29,y:49},
        platinum : {x:30,y:49},
        obsidian : {x:31,y:47},
        emerald  : {x:32,y:47},
        sapphire : {x:33,y:47},
        ruby     : {x:34,y:47},
        quartz   : {x:35,y:47},
      },
      idol : {
        iron     : {x:26,y:52},
        bronze   : {x:27,y:52},
        silver   : {x:28,y:52},
        gold     : {x:29,y:52},
        platinum : {x:30,y:52},
        obsidian : {x:31,y:52},
        emerald  : {x:32,y:52},
        sapphire : {x:33,y:52},
        ruby     : {x:34,y:52},
        quartz   : {x:35,y:52},
      },
      skull : {
        iron     : {x:26,y:53},
        bronze   : {x:27,y:53},
        silver   : {x:28,y:53},
        gold     : {x:29,y:53},
        platinum : {x:30,y:53},
        obsidian : {x:31,y:53},
        emerald  : {x:32,y:53},
        sapphire : {x:33,y:53},
        ruby     : {x:34,y:53},
        quartz   : {x:35,y:53},
        skull    : {x:36,y:53},
      }
    }
  constructor(item: T.Point, position: T.Point){
    let img = new Composite.Snap([new Composite.Image(
      "_assets/demon/tileset_16x16_5A5268.png", 
      {x:item.x*16, y:item.y*16,w:16,h:16},
      {x:0,y:0,w:16,h:16})]);

    super(new Composite.Frame([img]));
    this.pos.x = position.x;
    this.pos.y = position.y;

  }
}

