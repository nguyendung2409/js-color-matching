import { getColorBackground, getPlayAgainButton, getTimerElement } from './selectors.js';

function shuffle(arr) {
    if (!Array.isArray(arr) || arr.length <= 2) return arr;
    for (let i = arr.length - 1; i > 1; i--) {
        const j = Math.trunc(Math.random() * i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export const getRandomColorPairs = (count) => {
    // receive count --> return count * 2 random colors
    // using lib: https://github.com/davidmerfield/randomColor

    const colorList = [];
    const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];
    // random "count" color
    for (let i = 0; i < count; i++) {
        // randomColor function is provided by https://github.com/davidmerfield/randomColor
        const color = randomColor({
            luminosity: 'dark',
            hue: hueList[i % hueList.length],
        });
        colorList.push(color);
    }
    // double current colorList
    const fullColorList = [...colorList, ...colorList];
    // shuffle it
    shuffle(fullColorList);
    return fullColorList;
};

export function showPlayAgainButton() {
    const playAgainButton = getPlayAgainButton();
    if (playAgainButton) playAgainButton.classList.add('show');
}

export function hidePlayAgainButton() {
    const playAgainButton = getPlayAgainButton();
    if (playAgainButton) playAgainButton.classList.remove('show');
}
export function setTimerText(text) {
    const timerElement = getTimerElement();
    if (timerElement) timerElement.textContent = text;
}
export function createTimer({ seconds, onChange, onFinish }) {
    let intervalId = null;

    function start() {
        clear();
        let currentSeconds = seconds;

        intervalId = setInterval(() => {
            if (onChange) onChange(currentSeconds);
            currentSeconds--;
            if (currentSeconds < 0) {
                clear();
                if (onFinish) onFinish();
            }
        }, 1000);
    }

    function clear() {
        clearInterval(intervalId);
    }
    return { start, clear };
}
export function setBackgroundColor(color) {
    const backgroundElement = getColorBackground();
    if (backgroundElement) {
        backgroundElement.style.backgroundColor = color;
    }
}