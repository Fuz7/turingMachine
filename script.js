const inputContainers = document.querySelectorAll(".inputContainer");
const outputBinary = document.querySelector(".outputBinary");
const simulateButton = document.querySelector(".simulateButton");
const transitionButton = document.querySelector(".transitionButton");
const transitionTableBody = document.querySelector(".state-table tbody");
const x_button = document.querySelector(".x-button");
const tableContainer = document.querySelector(".transitionContainer");
const stateVisualization = document.querySelector(".state-visualization");
const operation = document.querySelector(".operation");

const symbols = (function () {
    const charsArray = [];
    for (let i = 97; i <= 122; i++) {
        // ASCII for 'a' (97) to 'z' (122)
        charsArray.push(String.fromCharCode(i));
    }
    for (let i = 65; i <= 90; i++) {
        // ASCII for 'A' (65) to 'Z' (90)
        charsArray.push(String.fromCharCode(i));
    }
    const symbols = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "-",
        "_",
        "=",
        "+",
        "[",
        "]",
        "{",
        "}",
        ";",
        ":",
        ",",
        ".",
        "<",
        ">",
        "/",
        "?",
        "|",
        "\\",
        "~",
        "`",
        '"',
        "'",
    ];
    charsArray.push(...symbols);
    return charsArray;
})();
operation.addEventListener("click", () => {
    const outputBinary = document.querySelector(".outputBinary");
    const binaryNumber = document.querySelector(".binaryNumber");
    if (operation.textContent == "+") {
        operation.textContent = "*";
        for (let i = 0; i < 7; i++) {
            const createBits = document.createElement("div");
            const span = document.createElement("span");
            span.textContent = "0";
            createBits.classList.add("binaryNumber");
            outputBinary.appendChild(createBits);
            createBits.appendChild(span);
        }
    } else {
        operation.textContent = "+";
        for (let i = 0; i < 7; i++) {
            const outputBinaryNumber =
                outputBinary.querySelector(".binaryNumber");
            outputBinary.removeChild(outputBinaryNumber);
        }
    }
    outputBinary.querySelectorAll(".binaryNumber").forEach((binary, index) => {
        const span = binary.querySelector("span");
        span.textContent = "0";
    });
    document
        .querySelector(".outputContainer")
        .querySelector(".inputField").value = "";
});

transitionButton.classList.add("hidden");
x_button.addEventListener("click", () => {
    tableContainer.classList.toggle("hidden");
});

transitionButton.addEventListener("click", () => {
    tableContainer.classList.toggle("hidden");
});

const binaryToDecimal = (binaryElements) => {
    const binaryString = Array.from(binaryElements)
        .map((binary) => binary.querySelector("span").textContent)
        .join("");
    return parseInt(binaryString, 2);
};

const decimalToBinary = (decimal, bits = 8) => {
    return decimal.toString(2).padStart(bits, "0");
};

const hasToggledBinary = (binaryNumbers) => {
    return Array.from(binaryNumbers).some(
        (binary) => binary.querySelector("span").textContent === "1"
    );
};

const animateBinary = async (element, duration, swapInterval, finalValue) => {
    let count = 0;
    const id = await setInterval(replaceContent, swapInterval);
    function replaceContent() {
        if (count < duration) {
            const randomSymbol =
                symbols[Math.floor(Math.random() * symbols.length)];
            element.textContent = randomSymbol;
            count += swapInterval;
        } else {
            element.textContent = finalValue;
            clearInterval(id);
        }
    }
};

const inputFieldAnimation = (input, duration, swapInterval, outputValue) => {
    let count = 0;
    const id = setInterval(replaceContent, swapInterval);

    function replaceContent() {
        if (count < duration) {
            const charArray = [];
            const charLength = input.value.length;
            while (charArray.length < charLength) {
                charArray.push(
                    symbols[Math.floor(Math.random() * symbols.length)]
                );
            }
            input.value = charArray.join("");
            count += swapInterval;
        } else {
            input.value = outputValue;
            clearInterval(id);
        }
    }
};

inputContainers.forEach((container) => {
    const binaryNumbers = container.querySelectorAll(".binaryNumber");
    const inputField = container.querySelector(".inputField");

    binaryNumbers.forEach((binary) => {
        binary.addEventListener("click", () => {
            transitionButton.classList.add("hidden");
            if (binary.classList.contains("animating")) return;

            const span = binary.querySelector("span");
            const currentValue = span.textContent;
            const newValue = currentValue === "0" ? "1" : "0";

            // !! SPEED CONTROL !!
            const SWAP_DURATION = 0.1;
            const SWAP_ITERATIONS = 9;
            const TOTAL_ANIMATION_TIME = SWAP_DURATION * SWAP_ITERATIONS;
            inputField.disabled = true;
            binary.classList.add("animating");

            const symbolSwapper = document.createElement("div");
            symbolSwapper.classList.add("symbol-swapper");

            for (let i = 0; i < SWAP_ITERATIONS; i++) {
                const symbolElement = document.createElement("div");
                symbolElement.classList.add("symbol");

                if (i === SWAP_ITERATIONS - 1) {
                    symbolElement.textContent = newValue;
                } else {
                    symbolElement.textContent =
                        symbols[Math.floor(Math.random() * symbols.length)];
                }

                symbolElement.style.animationDuration = `${SWAP_DURATION}s`;
                symbolElement.style.animationDelay = `${i * SWAP_DURATION}s`;

                symbolSwapper.appendChild(symbolElement);
            }

            const existingSwapper = binary.querySelector(".symbol-swapper");
            if (existingSwapper) {
                existingSwapper.remove();
            }
            binary.appendChild(symbolSwapper);

            // Update value after animation
            setTimeout(() => {
                span.textContent = newValue;
                symbolSwapper.remove();
                binary.classList.remove("animating");

                const decimalValue = binaryToDecimal(binaryNumbers);
                inputField.value = decimalValue;
                inputFieldAnimation(inputField, 250, 30, decimalValue);
                inputField.disabled = false;
            }, TOTAL_ANIMATION_TIME * 1000 + 100);
        });
    });
    inputField.addEventListener("input", (event) => {
        transitionButton.classList.add("hidden");
        if (isNaN(inputField.value)) {
            inputField.value = inputField.value.replace(/\D/g, "");
            return;
        }

        const input = inputField.value.trim();

        const isBinaryString = /^[01]+$/.test(input);
        let binaryArray;

        if (isBinaryString) {
            binaryArray = input.padStart(8, "0").slice(0, 8).split("");
        } else {
            const decimal = parseInt(input, 10);

            if (isNaN(decimal) || decimal > 255) {
                inputField.value = input.slice(0, input.length - 1); // Reject invalid input
                return;
            }

            binaryArray = decimalToBinary(decimal, 8).split("");
        }

        const binaryNumbers = container.querySelectorAll(".binaryNumber");

        binaryNumbers.forEach((binary, index) => {
            const span = binary.querySelector("span");

            const newValue = binaryArray[index] || "0";

            // If the binary digit is different from the current span value, animate it

            animateBinary(span, 150 + index * 100, 50, newValue);
        });
    });

    const observeBinaryChanges = () => {
        const observer = new MutationObserver(() => {
            inputField.disabled = hasToggledBinary(binaryNumbers);
        });

        binaryNumbers.forEach((binary) => {
            const span = binary.querySelector("span");
            observer.observe(span, { characterData: true, subtree: true });
        });
    };

    observeBinaryChanges();
});

// Function to add rows to the transition table
const addTransitionRow = (state, readSymbol, writeSymbol, move, nextState) => {
    const row = document.createElement("tr");

    const stateCell = document.createElement("td");
    stateCell.textContent = state;

    const readCell = document.createElement("td");
    readCell.textContent = readSymbol;

    const writeCell = document.createElement("td");
    writeCell.textContent = writeSymbol;

    const moveCell = document.createElement("td");
    moveCell.textContent = move;

    const nextStateCell = document.createElement("td");
    nextStateCell.textContent = nextState;

    row.appendChild(stateCell);
    row.appendChild(readCell);
    row.appendChild(writeCell);
    row.appendChild(moveCell);
    row.appendChild(nextStateCell);

    transitionTableBody.appendChild(row);
};

// Update tape visualization
const updateTapeVisualization = (tapeArr, headPosition, currentState) => {
    // Create container elements for the state and tape visualization
    const stateContainer = document.createElement("div");
    stateContainer.classList.add("state-container");

    const tapeContainer = document.createElement("div");
    tapeContainer.classList.add("tape-container");

    // Update state display
    const stateText = document.createElement("h3");
    stateText.classList.add("state");
    stateText.textContent = `State: ${currentState}`;

    // Update initial tape and head visualization
    const tapeText = document.createElement("p");
    tapeText.classList.add("tape-text");
    tapeText.textContent = `Tape: [${tapeArr.join("")}]`;

    const headText = document.createElement("p");
    headText.classList.add("head-text");

    // Corrected head position calculation
    const headIndicator = "  ".repeat(Math.max(0, headPosition)) + "^";
    headText.textContent = `Head: ${headIndicator}`;

    // Append state and tape info to their respective containers
    tapeContainer.appendChild(tapeText);
    tapeContainer.appendChild(headText);
    stateContainer.appendChild(stateText);
    stateContainer.appendChild(tapeContainer);

    // Append the state and tape container to the visualization section
    document.querySelector(".state-visualization").appendChild(stateContainer);
};

const simulateTuringMachine = (input1, input2) => {
    const operationInput = operation.textContent;
    const tape = `_${input1}${operationInput}${input2}_`;
    const tapeArr = tape.split("");
    let headPosition = 1;
    let state = "q0";
    let carry = 0;
    const transitions = [];

    //   States:
    // - q0: Start state
    // - q1: Move right to the end of the first number
    // - q2: Move left to find the rightmost digit of the second number
    // - q3: Perform addition
    // - q4: Handle carry
    // - q5: Write the result and transition to halt state
    // - qH: Halt state
    // Transitions:
    // - From q0: Read the first digit (0 or 1), move right to q1.
    // - From q1: Keep moving right until you find the separator B, then move to q2.
    // - From q2: Move left to the rightmost digit of the second number.
    // - From q3: Add the digits of the first and second numbers, considering the carry.
    // - From q4: If there’s a carry, propagate it to the next left digit.
    // - From q5: Write the result on the tape and move to the halt state.

    // Initial tape visualization
    updateTapeVisualization(tapeArr, headPosition, state);

    while (state !== "qH") {
        const currentSymbol = tapeArr[headPosition];
        let writeSymbol = currentSymbol;
        let move = "R";
        let nextState = state;

        switch (state) {
            case "q0":
                // Move to the "+" or "*" symbol
                if (currentSymbol === "0" || currentSymbol === "1") {
                    move = "R";
                } else if (currentSymbol === operationInput) {
                    nextState = "q1";
                    move = "R";
                } else if (currentSymbol === "_") {
                    nextState = "qH"; // Halt if no valid input
                }
                break;

            case "q1":
                // Move to the last `_` on the tape
                if (currentSymbol === "_") {
                    nextState = "q2";
                    move = "L"; // Move left to locate the rightmost digit of the second number
                } else if (
                    currentSymbol !== "0" &&
                    currentSymbol !== "1" &&
                    currentSymbol !== "+"
                ) {
                    // Handle invalid symbols like `NaN`
                    console.error(
                        `Invalid symbol "${currentSymbol}" encountered at position ${headPosition}`
                    );
                    nextState = "qH"; // Halt on invalid input
                } else {
                    move = "R";
                }
                break;

            case "q2":
                if (currentSymbol === "0" || currentSymbol === "1") {
                    nextState = "q3";
                    move = "L";
                } else {
                    move = "L";
                }
                break;

            case "q3":
                if (currentSymbol === "0" || currentSymbol === "1") {
                    nextState = "q4"; // Move to handle carry
                    move = "L"; // Move left
                } else if (currentSymbol === operationInput) {
                    nextState = "q4";
                    move = "L";
                } else if (currentSymbol === "_") {
                    move = "L";
                    nextState = "q4";
                } else {
                    console.error(
                        `Invalid symbol "${currentSymbol}" encountered during addition`
                    );
                    nextState = "qH"; // Halt on invalid input
                }
                break;

            case "q4":
                // Handle carry and propagate
                if (currentSymbol === "0" || currentSymbol === "1") {
                    nextState = "q3"; // Continue addition process
                    move = "L";
                } else if (currentSymbol === operationInput) {
                    nextState = "q5";
                    move = "L";
                } else if (currentSymbol === "_") {
                    nextState = "qH"; // Halt at the start of the tape
                } else {
                    move = "L"; // Continue moving left
                }
                break;

            case "q5":
                // Write the result and halt
                if (currentSymbol === "_") {
                    nextState = "qH"; // Transition to halt state
                } else {
                    move = "L"; // Move left to finalize
                }
                break;
        }

        // Update the tape and transition state
        tapeArr[headPosition] = writeSymbol;
        transitions.push({
            state,
            readSymbol: currentSymbol,
            writeSymbol,
            move,
            nextState,
        });

        state = nextState;
        headPosition += move === "R" ? 1 : -1;

        // Update tape visualization
        updateTapeVisualization(tapeArr, headPosition, state);
    }

    return transitions;
};

simulateButton.addEventListener("click", () => {
    const outputContainer = document.querySelector(".outputContainer");
    const inputTF = outputContainer.querySelector(".inputField");

    const input1BinaryNumbers = document
        .querySelector("#input-1")
        .querySelectorAll(".binaryNumber");
    const input2BinaryNumbers = document
        .querySelector("#input-2")
        .querySelectorAll(".binaryNumber");

    // for transition table
    const input1 = Array.from(input1BinaryNumbers)
        .map((binary) => binary.querySelector("span").textContent)
        .join("");
    const input2 = Array.from(input2BinaryNumbers)
        .map((binary) => binary.querySelector("span").textContent)
        .join("");

    // for output binary
    const input1Decimal = binaryToDecimal(input1BinaryNumbers);
    const input2Decimal = binaryToDecimal(input2BinaryNumbers);
    let resultDecimal = 0;

    let resultBinaryArray;
    if (operation.textContent == "+") {
        resultDecimal = input1Decimal + input2Decimal;
        inputTF.value = resultDecimal;
        resultBinaryArray = decimalToBinary(resultDecimal, 9);
    } else {
        resultDecimal = input1Decimal * input2Decimal;
        inputTF.value = resultDecimal;
        resultBinaryArray = decimalToBinary(resultDecimal, 16);
    }

    outputBinary.querySelectorAll(".binaryNumber").forEach((binary, index) => {
        const span = binary.querySelector("span");

        const originalValue = span.textContent;
        const newValue = resultBinaryArray[index] || "0";
        animateBinary(span, index * 150, 40, newValue);
    });
    const spanLength = outputBinary.querySelectorAll(".binaryNumber").length;
    inputFieldAnimation(inputTF, spanLength * 150, 40, inputTF.value);
    setTimeout(() => {
        transitionButton.classList.remove("hidden");
    }, 2300);
    // Clear existing transition and state
    transitionTableBody.textContent = "";
    stateVisualization.textContent = "";

    // Add transitions to simulate the Turing Machine
    const transitions = simulateTuringMachine(input1, input2);

    transitions.forEach((t) =>
        addTransitionRow(
            t.state,
            t.readSymbol,
            t.writeSymbol,
            t.move,
            t.nextState
        )
    );
});
