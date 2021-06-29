"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("@cennznet/api");
var keyring_1 = require("@polkadot/keyring");
var util_crypto_1 = require("@polkadot/util-crypto");
var types_1 = require("./types");
var partSize = 30;
var provider = 'ws://localhost:9944';
var infoText = document.getElementById("infoText");
var startButton = document.getElementById("startButton");
startButton.addEventListener("click", function (e) { return StartEndGameHandler(); });
var snake = { body: [] };
var food;
var gameRunning = false;
var api;
var alice;
window.onload = function () {
    return __awaiter(this, void 0, void 0, function () {
        var keyring;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, api_1.Api.create({ provider: provider, types: types_1.snakeTypes })];
                case 2:
                    api = _a.sent();
                    return [4 /*yield*/, new keyring_1.Keyring({ type: 'sr25519' })];
                case 3:
                    keyring = _a.sent();
                    alice = keyring.addFromUri('//Alice');
                    eventHandler().catch(function (error) {
                        console.error(error);
                    });
                    return [2 /*return*/];
            }
        });
    });
};
//Direction to be passed in API
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
//Handle Key Press
document.onkeydown = checkKey;
function checkKey(e) {
    switch (e.keyCode) {
        case 38:
            ChangeDirection(Direction.Up);
            break;
        case 40:
            ChangeDirection(Direction.Down);
            break;
        case 37:
            ChangeDirection(Direction.Left);
            break;
        case 39:
            ChangeDirection(Direction.Right);
            break;
    }
}
// Subscribe to system events via storage and perform actions based on those events
function eventHandler() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (api) {
                api.query.system.events(function (events) {
                    // Loop through the Vec<EventRecord>
                    events.forEach(function (record) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        // Extract the phase and event
                        var event = record.event, phase = record.phase;
                        var fromAccount;
                        var windowSize;
                        var snakeObj;
                        var foodObj;
                        var direction;
                        var score;
                        var snake_body;
                        switch (event.method) {
                            case 'GameStarted':
                                _a = event.data, fromAccount = _a[0], windowSize = _a[1], snakeObj = _a[2], foodObj = _a[3];
                                if (!gameRunning) {
                                    gameRunning = true;
                                    startButton.innerText = "Stop Game";
                                }
                                food = JSON.parse(foodObj.toString());
                                snake_body = JSON.parse(snakeObj.toString()).body;
                                snake.body = [];
                                for (var _i = 0, snake_body_1 = snake_body; _i < snake_body_1.length; _i++) {
                                    var bod = snake_body_1[_i];
                                    snake.body.push(bod);
                                }
                                Render();
                                break;
                            case 'GameEnded':
                                _b = event.data, fromAccount = _b[0], windowSize = _b[1], score = _b[2];
                                console.log("Game Ended. Score: " + score);
                                if (gameRunning) {
                                    gameRunning = false;
                                    startButton.innerText = "Start Game";
                                }
                                break;
                            case 'DirectionChanged':
                                _c = event.data, fromAccount = _c[0], snakeObj = _c[1], direction = _c[2];
                                console.log("New direction: " + direction);
                                break;
                            case 'PositionUpdated':
                                _d = event.data, fromAccount = _d[0], snakeObj = _d[1], foodObj = _d[2];
                                if (!gameRunning) {
                                    gameRunning = true;
                                    startButton.innerText = "Stop Game";
                                }
                                food = JSON.parse(foodObj.toString());
                                snake_body = JSON.parse(snakeObj.toString()).body;
                                snake.body = [];
                                for (var _h = 0, snake_body_2 = snake_body; _h < snake_body_2.length; _h++) {
                                    var bod = snake_body_2[_h];
                                    snake.body.push(bod);
                                }
                                infoText.innerText = "Score: " + snake.body.length;
                                Render();
                                break;
                            case 'DirectionSameAsOldDirection':
                                _e = event.data, fromAccount = _e[0], snakeObj = _e[1], direction = _e[2];
                                console.log("New direction same as old direction: " + direction);
                                break;
                            case 'SnakeCantGoBackwards':
                                _f = event.data, fromAccount = _f[0], snakeObj = _f[1], direction = _f[2];
                                console.log("Snake can't go backwards");
                                break;
                            case 'FoodMoved':
                                _g = event.data, fromAccount = _g[0], snakeObj = _g[1], foodObj = _g[2];
                                console.log("Food Moved");
                                food = JSON.parse(foodObj.toString());
                                Render();
                                break;
                        }
                    });
                });
            }
            return [2 /*return*/];
        });
    });
}
function StartEndGameHandler() {
    //Chose which function to run depending on if the game is running
    if (api && gameRunning) {
        EndGame();
    }
    else {
        StartGame();
    }
}
//Call the start function in the API with set window size
function StartGame() {
    var extrinsic = api.tx.snake.start(30, 20);
    extrinsic.signAndSend(alice);
}
//Call the change_direction function in the API
function ChangeDirection(direction) {
    if (api) {
        var extrinsic = api.tx.snake.changeDirection(direction);
        extrinsic.signAndSend(alice);
    }
}
//Call the end_game function in the API
function EndGame() {
    var extrinsic = api.tx.snake.endGame();
    extrinsic.signAndSend(alice);
}
//Render items on the canvas
function Render() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //render snake
    for (var i = 0; i < snake.body.length; i++) {
        if (i === 0) {
            ctx.fillStyle = "#1260A1";
        }
        else {
            ctx.fillStyle = "#1883DB";
        }
        ctx.fillRect(snake.body[i][0] * partSize, snake.body[i][1] * partSize, partSize, partSize);
    }
    //render food
    ctx.fillStyle = "#18DB70";
    ctx.fillRect(food.x * partSize + 10, food.y * partSize + 10, 10, 10);
}
