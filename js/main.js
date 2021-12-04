import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js';
import {
    getColorElementList,
    getColorListElement,
    getInActiveColorList,
    getPlayAgainButton,
} from './selectors.js';
import {
    createTimer,
    getRandomColorPairs,
    hidePlayAgainButton,
    setBackgroundColor,
    setTimerText,
    showPlayAgainButton,
} from './utils.js';

// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTimerFinish,
});
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function handleTimerChange(seconds) {
    // show timer text
    const fullSeconds = `0${seconds}`.slice(-2);
    setTimerText(fullSeconds);
}

function handleTimerFinish() {
    setTimerText('Game Over');
    gameStatus = GAME_STATUS.FINISHED;
    showPlayAgainButton();
}

function handleColorClick(liElement) {
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
    const isClicked = liElement.classList.contains('active');
    if (!liElement || isClicked || shouldBlockClick) return;
    liElement.classList.add('active');
    // save clicked cell to selections
    selections.push(liElement);
    if (selections.length < 2) return;
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor === secondColor;
    if (isMatch) {
        // set background color
        setBackgroundColor(firstColor);
        // check win
        const isWin = getInActiveColorList().length === 0;
        if (isWin) {
            // show replay button
            showPlayAgainButton();
            // show message YOU WIN
            setTimerText('YOU WIN');
            timer.clear();
            // update game status
            gameStatus = GAME_STATUS.FINISHED;
        }

        selections = [];
        return;
    }
    gameStatus = GAME_STATUS.BLOCKING;
    // in case not match
    // remove active for 2 liElement
    setTimeout(() => {
        selections[0].classList.remove('active');
        selections[1].classList.remove('active');
        selections = [];
        // race-condition check with handleTimerFinish
        if (gameStatus !== GAME_STATUS.FINISHED) {
            gameStatus = GAME_STATUS.PLAYING;
        }
    }, 500);

    // reset selection for the next turn
}

function initColors() {
    // random 8 pairs colors
    const colorList = getRandomColorPairs(PAIRS_COUNT);
    // bind to li > div.overlay
    const liList = getColorElementList();
    liList.forEach((liElement, index) => {
        liElement.dataset.color = colorList[index];
        const overlayElement = liElement.querySelector('.overlay');
        if (overlayElement) {
            overlayElement.style.backgroundColor = colorList[index];
        }
    });
}

function attachEventForColorList() {
    const ulElement = getColorListElement();
    if (!ulElement) return;
    ulElement.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') return;
        handleColorClick(event.target);
    });
}

function resetGame() {
    // reset global vars
    selections = [];
    gameStatus = GAME_STATUS.PLAYING;
    // reset DOM element
    // - remove active class , data-color attribute for li element
    const colorElementList = getColorElementList();
    if (!colorList) return;
    for (const colorElement of colorElementList) {
        colorElement.classList.remove('active');
        delete colorElement.dataset.color;
    }
    // - hide replay button
    hidePlayAgainButton();
    // - clear YOU WIN / timeout /text
    setTimerText('');
    // re-generate color
    initColors();
    // start new game
    startTimer();
    // reset background color
    setBackgroundColor('goldenrod');
}

function attachEventForPlayAgainButton() {
    const playAgainButton = getPlayAgainButton();
    if (!playAgainButton) return;
    playAgainButton.addEventListener('click', resetGame);
}

function startTimer() {
    timer.start();
}
(() => {
    initColors();
    attachEventForColorList();
    attachEventForPlayAgainButton();
    startTimer();
})();