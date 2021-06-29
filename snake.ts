import {Api} from '@cennznet/api';
import {Keyring} from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { snakeTypes } from './types'

const partSize: number = 30;
const provider = 'ws://localhost:9944';
const infoText = document.getElementById("infoText");
const startButton = <HTMLButtonElement>document.getElementById("startButton");
startButton.addEventListener("click", (e:Event) => StartEndGameHandler());

let snake: Snake = {body: []};
let food: Food;
let gameRunning: boolean = false;
let api;
let alice;

window.onload = async function() {
    await cryptoWaitReady();
    api = await Api.create({provider, types: snakeTypes});

    const keyring = await new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    eventHandler().catch((error) => {
        console.error(error);
    });
};

//Snake Object
interface Snake {
    body: Array<[number, number]>;
}

//Food Object
interface Food {
    x: number;
    y: number;
}

//Direction to be passed in API
enum Direction {
    Up,
    Left,
    Down,
    Right
}

//Handle Key Press
document.onkeydown = checkKey;
function checkKey(e: any) {
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
async function eventHandler() {
    if (api) {
        api.query.system.events((events) => {
            // Loop through the Vec<EventRecord>
            events.forEach((record) => {
                // Extract the phase and event
                const { event, phase } = record;
                let fromAccount;
                let windowSize;
                let snakeObj;
                let foodObj;
                let direction;
                let score;
                let snake_body;

                switch (event.method) {
                    case 'GameStarted':
                        [fromAccount, windowSize, snakeObj, foodObj] = event.data;
                        if (!gameRunning) {
                            gameRunning = true;
                            startButton.innerText = "Stop Game";
                        }
                        food = JSON.parse(foodObj.toString());
                        snake_body = JSON.parse(snakeObj.toString()).body;
                        snake.body = [];
                        for (let bod of snake_body) {
                            snake.body.push(bod);
                        }
                        Render();
                        break;

                    case 'GameEnded':
                        [fromAccount, windowSize, score] = event.data;
                        console.log("Game Ended. Score: " + score)
                        if (gameRunning) {
                            gameRunning = false;
                            startButton.innerText = "Start Game";
                        }
                        break;

                    case 'DirectionChanged':
                        [fromAccount, snakeObj, direction] = event.data;
                        console.log("New direction: " + direction);
                        break;

                    case 'PositionUpdated':
                        [fromAccount, snakeObj, foodObj] = event.data;
                        if (!gameRunning) {
                            gameRunning = true;
                            startButton.innerText = "Stop Game";
                        }
                        food = JSON.parse(foodObj.toString());
                        snake_body = JSON.parse(snakeObj.toString()).body;
                        snake.body = [];
                        for (let bod of snake_body) {
                            snake.body.push(bod);
                        }
                        infoText.innerText = "Score: " + snake.body.length;
                        Render();
                        break;

                    case 'DirectionSameAsOldDirection':
                        [fromAccount, snakeObj, direction] = event.data;
                        console.log("New direction same as old direction: " + direction);
                        break;

                    case 'SnakeCantGoBackwards':
                        [fromAccount, snakeObj, direction] = event.data;
                        console.log("Snake can't go backwards");
                        break;

                    case 'FoodMoved':
                        [fromAccount, snakeObj, foodObj] = event.data;
                        console.log("Food Moved");
                        food = JSON.parse(foodObj.toString());
                        Render();
                        break;
                }
            });
        });
    }
}

function StartEndGameHandler() {
    //Chose which function to run depending on if the game is running
    if (api && gameRunning) {
        EndGame();
    }else {
        StartGame();
    }
}

//Call the start function in the API with set window size
function StartGame() {
    let extrinsic = api.tx.snake.start(30,20);
    extrinsic.signAndSend(alice);
}

//Call the change_direction function in the API
function ChangeDirection(direction: Direction) {
    if (api) {
        let extrinsic = api.tx.snake.changeDirection(direction);
        extrinsic.signAndSend(alice);
    }
}

//Call the end_game function in the API
function EndGame() {
    let extrinsic = api.tx.snake.endGame();
    extrinsic.signAndSend(alice);
}

//Render items on the canvas
function Render() {
    let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //render snake
    for (let i = 0; i < snake.body.length; i++){
        if (i === 0) {
            ctx.fillStyle = "#1260A1";
        }else {
            ctx.fillStyle = "#1883DB";
        }
        ctx.fillRect(snake.body[i][0] * partSize, snake.body[i][1] * partSize, partSize, partSize);
    }
    //render food
    ctx.fillStyle = "#18DB70";
    ctx.fillRect(food.x * partSize + 10, food.y * partSize + 10, 10, 10);
}

