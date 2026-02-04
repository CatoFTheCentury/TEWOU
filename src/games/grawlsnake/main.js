/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ "use strict";
/******/ var __webpack_modules__ = ({

/***/ "./grawlsnake/main.ts"
/*!****************************!*\
  !*** ./grawlsnake/main.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var TEWOU__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! TEWOU */ \"TEWOU\");\n/* harmony import */ var TEWOU__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(TEWOU__WEBPACK_IMPORTED_MODULE_0__);\n\r\nvar game;\r\nvar deadScreen;\r\nconst squaresize = 32;\r\nconst boardsize = 20;\r\nconst refreshrate = 150;\r\nclass GrawlSnakeGame extends TEWOU__WEBPACK_IMPORTED_MODULE_0__.ActionGame {\r\n    gamename = \"arbre\";\r\n    fileextensions = ['gani', 'png', 'ini'];\r\n    score = 0;\r\n    snakeHeadIdle = [];\r\n    snakeHeadWalk = [];\r\n    snakeBodyIdle = [];\r\n    snakeBodyWalk = [];\r\n    appleanim = [];\r\n    constructor(canvas) {\r\n        super(canvas, squaresize * boardsize, squaresize * boardsize);\r\n        canvas.style.border = \"3px solid #00ff00\";\r\n        canvas.style.position = \"absolute\";\r\n        canvas.style.left = \"50%\";\r\n        canvas.style.top = \"50%\";\r\n        canvas.style.transform = \"translate(-50%, -50%)\";\r\n        this.score = 0;\r\n    }\r\n    async load() {\r\n        await super.load();\r\n        this.snakeHeadIdle = this.parseGani(\"_assets/arbre/idle.gani\");\r\n        this.snakeHeadWalk = this.parseGani(\"_assets/arbre/walk.gani\");\r\n        this.snakeBodyIdle = this.parseGani(\"_assets/arbre/idle.gani\");\r\n        this.snakeBodyWalk = this.parseGani(\"_assets/arbre/walk.gani\");\r\n        this.appleanim = this.parseGani(\"_assets/arbre/idle.gani\");\r\n    }\r\n}\r\nclass Apple extends TEWOU__WEBPACK_IMPORTED_MODULE_0__.Fauna {\r\n    gridx;\r\n    gridy;\r\n    constructor() {\r\n        let newpos = {\r\n            x: Math.floor(Math.random() * boardsize),\r\n            y: Math.floor(Math.random() * boardsize)\r\n        };\r\n        let freespot = false;\r\n        while (!freespot) {\r\n            freespot = true;\r\n            for (let p of Snake.parts) {\r\n                if (newpos.x == p.gridx && newpos.y == p.gridy) {\r\n                    newpos = {\r\n                        x: Math.floor(Math.random() * boardsize),\r\n                        y: Math.floor(Math.random() * boardsize)\r\n                    };\r\n                    freespot = false;\r\n                }\r\n            }\r\n        }\r\n        super(new TEWOU__WEBPACK_IMPORTED_MODULE_0__.Frame(game.glContext, game.shadercontext, [game.appleanim[2]]));\r\n        this.gridx = newpos.x;\r\n        this.gridy = newpos.y;\r\n        this.pos.x = newpos.x * squaresize;\r\n        this.pos.y = newpos.y * squaresize;\r\n        this.hitbox = { x: 0, y: 0, w: squaresize, h: squaresize };\r\n        game.addAsCollision(this, TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideLayers.npc, TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideLayers.npc, TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideTypes.none);\r\n        game.registerEntity(this);\r\n    }\r\n    react(owner, str, arr) {\r\n        if (owner.ate) {\r\n            owner.ate();\r\n            new Apple();\r\n            this.destroy();\r\n        }\r\n        return true;\r\n    }\r\n}\r\nclass Snake extends TEWOU__WEBPACK_IMPORTED_MODULE_0__.Player {\r\n    static length = 4;\r\n    static startpos = Math.floor(boardsize / 2);\r\n    static parts = [];\r\n    static headpos;\r\n    nextdir = 3;\r\n    lastdir = 3;\r\n    constructor() {\r\n        super(game.newRectangle({ x: 0, y: 0, w: 1, h: 1 }, { r: 0, g: 0, b: 0, a: 0 }));\r\n        Snake.headpos = { x: Snake.startpos, y: Snake.startpos };\r\n        Snake.parts = [];\r\n        for (let i = 0; i < Snake.length; i++) {\r\n            const isHead = i === Snake.length - 1;\r\n            Snake.parts.push(new SnakePart(Snake.startpos - i, Snake.startpos, isHead ? 'head' : 'body', 3));\r\n        }\r\n        this.addTimeout([refreshrate], {\r\n            triggered: (timeout) => {\r\n                this.advance();\r\n            }\r\n        });\r\n        this.registerkey('w', { keydown: () => { if (this.lastdir != 2)\r\n                this.nextdir = 0; } });\r\n        this.registerkey('ArrowUp', { keydown: () => { if (this.lastdir != 2)\r\n                this.nextdir = 0; } });\r\n        this.registerkey('a', { keydown: () => { if (this.lastdir != 3)\r\n                this.nextdir = 1; } });\r\n        this.registerkey('ArrowLeft', { keydown: () => { if (this.lastdir != 3)\r\n                this.nextdir = 1; } });\r\n        this.registerkey('s', { keydown: () => { if (this.lastdir != 0)\r\n                this.nextdir = 2; } });\r\n        this.registerkey('ArrowDown', { keydown: () => { if (this.lastdir != 0)\r\n                this.nextdir = 2; } });\r\n        this.registerkey('d', { keydown: () => { if (this.lastdir != 1)\r\n                this.nextdir = 3; } });\r\n        this.registerkey('ArrowRight', { keydown: () => { if (this.lastdir != 1)\r\n                this.nextdir = 3; } });\r\n    }\r\n    advance() {\r\n        const newHead = { x: Snake.headpos.x, y: Snake.headpos.y };\r\n        if (this.nextdir == 0)\r\n            newHead.y -= 1;\r\n        if (this.nextdir == 1)\r\n            newHead.x -= 1;\r\n        if (this.nextdir == 2)\r\n            newHead.y += 1;\r\n        if (this.nextdir == 3)\r\n            newHead.x += 1;\r\n        this.lastdir = this.nextdir;\r\n        if (newHead.x >= boardsize || newHead.y >= boardsize || newHead.x < 0 || newHead.y < 0) {\r\n            deadScreen.dies();\r\n            this.destroy();\r\n            return;\r\n        }\r\n        const oldHead = Snake.parts[Snake.parts.length - 1];\r\n        const newHeadPart = new SnakePart(newHead.x, newHead.y, 'head', this.nextdir);\r\n        if (oldHead) {\r\n            newHeadPart.startX = oldHead.targetX;\r\n            newHeadPart.startY = oldHead.targetY;\r\n            newHeadPart.pos.x = oldHead.targetX;\r\n            newHeadPart.pos.y = oldHead.targetY;\r\n            newHeadPart.moveProgress = 0;\r\n        }\r\n        Snake.headpos = newHead;\r\n        Snake.parts.push(newHeadPart);\r\n        if (Snake.parts.length > 1) {\r\n            Snake.parts[Snake.parts.length - 2].updateType('body');\r\n        }\r\n        // Make all body parts follow the part in front of them\r\n        for (let i = Snake.parts.length - 2; i >= 0; i--) {\r\n            const currentPart = Snake.parts[i];\r\n            const nextPart = Snake.parts[i + 1];\r\n            currentPart.startX = currentPart.targetX;\r\n            currentPart.startY = currentPart.targetY;\r\n            currentPart.targetX = nextPart.startX;\r\n            currentPart.targetY = nextPart.startY;\r\n            currentPart.gridx = Math.round(currentPart.targetX / squaresize);\r\n            currentPart.gridy = Math.round(currentPart.targetY / squaresize);\r\n            currentPart.moveProgress = 0;\r\n        }\r\n        if (Snake.parts.length > Snake.length) {\r\n            const removed = Snake.parts.shift();\r\n            if (removed)\r\n                removed.destroy();\r\n        }\r\n    }\r\n}\r\nclass SnakePart extends TEWOU__WEBPACK_IMPORTED_MODULE_0__.Fauna {\r\n    gridx;\r\n    gridy;\r\n    partType;\r\n    direction;\r\n    idleAnim;\r\n    walkAnim;\r\n    targetX;\r\n    targetY;\r\n    startX;\r\n    startY;\r\n    moveProgress = 1;\r\n    moveSpeed = 0.15;\r\n    constructor(gridx, gridy, partType = 'body', direction = 3) {\r\n        let idleAnim, walkAnim;\r\n        if (partType === 'head') {\r\n            idleAnim = game.snakeHeadIdle;\r\n            walkAnim = game.snakeHeadWalk;\r\n        }\r\n        else {\r\n            idleAnim = game.snakeBodyIdle;\r\n            walkAnim = game.snakeBodyWalk;\r\n        }\r\n        super(new TEWOU__WEBPACK_IMPORTED_MODULE_0__.Frame(game.glContext, game.shadercontext, [walkAnim[direction]]));\r\n        this.partType = partType;\r\n        this.direction = direction;\r\n        this.idleAnim = idleAnim;\r\n        this.walkAnim = walkAnim;\r\n        this.gridx = gridx;\r\n        this.gridy = gridy;\r\n        this.targetX = gridx * squaresize;\r\n        this.targetY = gridy * squaresize;\r\n        this.startX = gridx * squaresize;\r\n        this.startY = gridy * squaresize;\r\n        this.pos.x = gridx * squaresize;\r\n        this.pos.y = gridy * squaresize;\r\n        this.hitbox = { x: 0, y: 0, w: squaresize, h: squaresize };\r\n        game.addAsCollision(this, TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideLayers.npc, TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideLayers.npc, TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideTypes.none);\r\n        if (partType === 'head') {\r\n            game.addCapture({\r\n                cwith: TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideLayers.npc,\r\n                type: TEWOU__WEBPACK_IMPORTED_MODULE_0__.CollideTypes.none,\r\n                hitbox: { x: 0, y: 0, w: squaresize, h: squaresize },\r\n                owner: this,\r\n                call: (owner, target) => {\r\n                    if (target.react) {\r\n                        target.react(owner, \"\", []);\r\n                    }\r\n                }\r\n            });\r\n        }\r\n        game.registerEntity(this);\r\n    }\r\n    updateType(newType) {\r\n        if (newType !== this.partType) {\r\n            if (newType === 'head') {\r\n                this.idleAnim = game.snakeHeadIdle;\r\n                this.walkAnim = game.snakeHeadWalk;\r\n            }\r\n            else {\r\n                this.idleAnim = game.snakeBodyIdle;\r\n                this.walkAnim = game.snakeBodyWalk;\r\n            }\r\n            this.partType = newType;\r\n        }\r\n        if (this.myFrame && this.walkAnim && this.walkAnim[this.direction]) {\r\n            this.myFrame.frame = [this.walkAnim[this.direction]];\r\n        }\r\n    }\r\n    update() {\r\n        super.update();\r\n        if (this.moveProgress < 1) {\r\n            this.moveProgress += this.moveSpeed;\r\n            if (this.moveProgress > 1)\r\n                this.moveProgress = 1;\r\n            const t = this.easeInOutQuad(this.moveProgress);\r\n            this.pos.x = this.startX + (this.targetX - this.startX) * t;\r\n            this.pos.y = this.startY + (this.targetY - this.startY) * t;\r\n        }\r\n    }\r\n    easeInOutQuad(t) {\r\n        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;\r\n    }\r\n    setDirection(dir) {\r\n        this.direction = dir;\r\n        if (this.myFrame && this.walkAnim && this.walkAnim[dir]) {\r\n            this.myFrame.frame = [this.walkAnim[dir]];\r\n        }\r\n    }\r\n    ate() {\r\n        Snake.length += 1;\r\n        game.score += 10;\r\n    }\r\n    react(owner, str, arr) {\r\n        if (this !== owner && this.partType !== 'head') {\r\n            deadScreen.dies();\r\n        }\r\n    }\r\n}\r\nclass DeadScreen extends TEWOU__WEBPACK_IMPORTED_MODULE_0__.Fauna {\r\n    constructor() {\r\n        super(game.newRectangle({ x: 0, y: 0, w: boardsize * squaresize, h: boardsize * squaresize }, { r: 100, g: 0, b: 0, a: 200 }));\r\n        this.myFrame.rprops.hidden = true;\r\n        game.registerEntity(this);\r\n    }\r\n    dies() {\r\n        this.myFrame.rprops.hidden = false;\r\n    }\r\n}\r\ngame = new GrawlSnakeGame(document.getElementById('canvas'));\r\nTEWOU__WEBPACK_IMPORTED_MODULE_0__.Engine.start(game).then(() => {\r\n    const player = new Snake();\r\n    game.registerEntity(player);\r\n    deadScreen = new DeadScreen();\r\n    new Apple();\r\n    TEWOU__WEBPACK_IMPORTED_MODULE_0__.Engine.games.push(game);\r\n    TEWOU__WEBPACK_IMPORTED_MODULE_0__.Engine.mainLoop();\r\n});\r\n\n\n//# sourceURL=webpack:///./grawlsnake/main.ts?\n}");

/***/ },

/***/ "TEWOU"
/*!************************!*\
  !*** external "TEWOU" ***!
  \************************/
(module) {

module.exports = TEWOU;

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Check if module exists (development only)
/******/ 	if (__webpack_modules__[moduleId] === undefined) {
/******/ 		var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./grawlsnake/main.ts");
/******/ 
