import { Serve } from 'Serve';
import { Manager } from './manager';
export {Manager} from "./manager"

//create entry input element
// on enter, parse input and execute commands
// log output to console area
// help command
// play game command that loads gameframe.php with given game
  // it has to register to server, server observes span id="gamesaves" for changes
  // server aggregates game information
  // server updates span id="serversaves" of each client with relevant information

  // client receives updates and displays them

  // var 

  let inputElement = document.createElement('input');
  inputElement.id = "myForm";
  inputElement.type = "text";
  inputElement.name = "query";
  inputElement.placeholder = "Type ? for help";
  inputElement.className = "syne-mono-regular";
  document.body.appendChild(inputElement);

  inputElement.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Optional: prevent default if needed
      consoleElement.innerHTML += `

> ` + this.value;
      parseCommand(this.value);
      this.value = "";
    }
  });

  let consoleContainer = document.createElement('div');
  consoleContainer.id = "consoleArea";
  let consoleElement = document.createElement('pre');
  consoleContainer.className = "syne-mono-regular";
  consoleElement.innerHTML = `
        (^\\-==-/^)
        >\\\\ == //<
       :== q''p ==:
        .__ qp __.    .' )
         / ^--^ \\    /\\.'
        /_\`    / )  '\\/
        (  )  \\  |-'-/
        \\^^,   |-|--'
       ( \`'    |_| )
        \\-     |-|/
       (( )^---( ))
  =========================      
  Welcome to TEWOU Console!
     Type "?" for help`
  consoleContainer.appendChild(consoleElement);
  document.body.appendChild(consoleContainer);

  function parseCommand(command: string) {
    let args = command.trim().split(" ");
    switch(args[0].toLowerCase()) {
      case "?":
      case "help":
        if(args.length > 1) {
          switch(args[1].toLowerCase()) {
            case "play":
              consoleElement.innerHTML += `
Type "play [gamename]" to start a game.
     ex.: play arbre
The following switches are available:
  -list        list running games
  -focus [n]   focus game window number n
     ex.: play -list`
            break;
            case "color":
              consoleElement.innerHTML += `
Type "color [color]" to change console color.
     ex.: color blue
  The following colors are available:
     red, green, blue, purple, orange, white, pink`
            break;
            default:
              consoleElement.innerHTML += `
Unknown command: ` + args[1];
            break;
          }
        } else {
          consoleElement.innerHTML += `
Type "help [command]" to get help on a specific command.
  Available commands:
     play, settings, color
Type "hint" to get a hint.`;
        }
      break;
      case "play":
        if(args.length > 1) {
          switch(args[1].toLowerCase()) {
            case "arbre":
              Manager.createGame("arbre");
              // let frame = game.querySelector("iframe");
              // // let gamesave = frame.contentWindow.document.getElementById('gamesaves');
              // frame.contentWindow.onload = () => {
              //   Manager.addGameSave(frame.contentWindow.document.getElementById('gamesaves'));
              //   Manager.games[0].gamesave.appendChild(document.createElement('div'));
              //   // console.log(frame.contentWindow.document.getElementById('gamesaves'));
              // }
              // console.log(game,frame,gamesave,frame.contentWindow,frame.contentWindow.document);
            break;
            case "demon":
              Manager.createGame("demon");
            break;
            default:
              consoleElement.innerHTML += `
Unknown game: ` + args[1];
            break;
          }
        }
    } 
  }
