// ============================= SETUP
let GAMESIZE = 10;
let game = document.getElementById("game");
let scores = document.getElementById("score");
let target_x = 0;
let target_y = 1;
let started = false;
let running = false;

// ============================= GAME TRACKING
let game_timer = 0;
let timestamps = [];
let seek_times = [0];
let total_clicked = 0;

// ============================= UTIL
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const average = array => array.reduce((a, b) => a + b) / array.length;

// ============================= BOARD MANIP
function create_game(){
    game.innerHTML = ``;
    for (let x = 0; x < GAMESIZE; x++){
        for (let y = 0; y < GAMESIZE; y++){
            game.innerHTML += `<input type="radio" class="y${y} x${x}" name="group" onclick='next()' disabled>`;
        }
        game.innerHTML += `<br>`;
    }
    shuffle();
}
function next(){
    if (started == false){
        start();
        started = true;
    }
    total_clicked += 1;
    if (timestamps.length > 0){
        seek_times.push(game_timer - timestamps[timestamps.length - 1])
    }
    timestamps.push(game_timer);

    if ($("#finish").val() == total_clicked -1){ // end game
        stop();
    }else{ // game continues
        shuffle();
    }
    
}
function shuffle(){
    let current_elem = $( `.y${target_y}.x${target_x}` )[0];
    let prev_x = target_x;
    let prev_y = target_y;
    target_x = getRandomInt(GAMESIZE);
    target_y = getRandomInt(GAMESIZE);
    if (prev_x == target_x && prev_y == target_y){
        target_x = target_x + 3 % GAMESIZE;
    }
    let next_elem = $( `.y${target_y}.x${target_x}` )[0];
    current_elem.disabled = true;
    next_elem.disabled = false;
}



// ============================= SCORING AND TIMING
function start(){
    startTime = Date.now();
    interval = setInterval(function(){
        updateDisplay(Date.now() - startTime);
    });
    
}
function stop(){
    clearInterval(interval);
    game.innerHTML = `
    <h3>Game Complete!</h3>
    <button onclick='reset()'>Play Again!</button>
    `
}
function reset(){
    target_x = 0;
    target_y = 1;
    started = false;
    running = false;
    game_timer = 0;
    timestamps = [];
    seek_times = [0];
    total_clicked = 0;
    create_game();
}

function updateDisplay(currentTime){
    game_timer = currentTime;

    let time_sec = game_timer / 1000;
    let time_since_last = (game_timer - timestamps[timestamps.length - 1]) / 1000;
    let seek_avg = average(seek_times) / 1000;
    let worst_seek = Math.max.apply(Math, seek_times) / 1000;
    let best_seek = Math.min.apply(Math, seek_times.slice(1)) / 1000;
    if (!(Number.isInteger(Math.min.apply(Math, seek_times.slice(1))))){best_seek = 0}
    scores.innerHTML = `
        <h3>Total Time: ${time_sec.toFixed(2)}s, Time since last: ${time_since_last.toFixed(2)}s</h3>
        <h3>Best Seek: ${best_seek.toFixed(2)}s, Worst Seek: ${worst_seek.toFixed(2)}s</h3>
        <h3>Avg seek time: ${seek_avg.toFixed(2)}s</h3>
        <h3>Total Clicked: ${total_clicked}</h3>
    `;
}

//  ============================= STARTUP
window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    create_game(GAMESIZE);
  });
