document.addEventListener("DOMContentLoaded", () => {
  const inputContainers = document.querySelectorAll(".inputContainer");
  const outputBinary = document.querySelector(".outputBinary");
  const simulateButton = document.querySelector(".simulateButton");
  const transitionButton = document.querySelector(".transitionButton");
  const transitionTableBody = document.querySelector(".state-table tbody");
  const x_button = document.querySelector(".x-button");
  const tableContainer = document.querySelector(".transitionContainer");
  const stateVisualization = document.querySelector(".state-visualization");

  const symbols = [
    "@",
    "#",
    "$",
    "&",
    "*",
    "^",
    "(",
    ")",
    "~",
    "`",
    "+",
    "-",
    "=",
    "[",
    "]",
    "{",
    "}",
    "|",
    "/",
    "?",
    "<",
    ">",
    "!",
    "%",
  ];

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

  inputContainers.forEach((container) => {
    const binaryNumbers = container.querySelectorAll(".binaryNumber");
    const inputField = container.querySelector(".inputField");

    binaryNumbers.forEach((binary) => {
      binary.addEventListener("click", () => {
        if (binary.classList.contains("animating")) return;

        const span = binary.querySelector("span");
        const currentValue = span.textContent;
        const newValue = currentValue === "0" ? "1" : "0";

        // !! SPEED CONTROL !!
        const SWAP_DURATION = 0.15;
        const SWAP_ITERATIONS = 9;
        const TOTAL_ANIMATION_TIME = SWAP_DURATION * SWAP_ITERATIONS;

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

          inputField.disabled = hasToggledBinary(binaryNumbers);
        }, TOTAL_ANIMATION_TIME * 1000 + 100);
      });
    });
    inputField.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {
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

          binaryArray = decimalToBinary(decimal, 8);
        }

        const binaryNumbers = container.querySelectorAll(".binaryNumber");

        binaryNumbers.forEach((binary, index) => {
          const span = binary.querySelector("span");

          const newValue = binaryArray[index] || "0";

          // If the binary digit is different from the current span value, animate it
          if (span.textContent !== newValue) {
            const SWAP_DURATION = 0.15;
            const SWAP_ITERATIONS = 9;

            // Add animating class to trigger animation
            binary.classList.add("animating");

            // Add class to trigger animation
            const symbolSwapper = document.createElement("div");
            symbolSwapper.classList.add("symbol-swapper");

            // Create animated symbols
            for (let i = 0; i < SWAP_ITERATIONS; i++) {
              const symbolElement = document.createElement("div");
              symbolElement.classList.add("symbol");

              // Random symbols for animation, except for the last one
              if (i === SWAP_ITERATIONS - 1) {
                symbolElement.textContent = newValue; // Set the correct binary digit at the end
              } else {
                symbolElement.textContent =
                  symbols[Math.floor(Math.random() * symbols.length)];
              }

              // Set the duration and delay for the animation
              symbolElement.style.animationDuration = `${SWAP_DURATION}s`;
              symbolElement.style.animationDelay = `${i * SWAP_DURATION}s`;

              symbolSwapper.appendChild(symbolElement);
            }

            // Remove animating class
            const existingSwapper = binary.querySelector(".symbol-swapper");
            if (existingSwapper) {
              existingSwapper.remove();
            }

            // Append the new symbol swapper
            binary.appendChild(symbolSwapper);

            // After animation, update the span text to the correct value and remove animation class
            setTimeout(() => {
              span.textContent = newValue;
              symbolSwapper.remove();
              binary.classList.remove("animating");
            }, SWAP_DURATION * SWAP_ITERATIONS * 1000 + index * 150);
          }
        });
      }
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
  const addTransitionRow = (
    state,
    readSymbol,
    writeSymbol,
    move,
    nextState
  ) => {
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
    if (currentState === "q2") {
      headText.textContent = `Head: ${"  ".repeat(tapeArr.length - 1, 1)}^`;
    } else {
      headText.textContent = `Head: ${"  ".repeat(headPosition, 1)}^`;
    }
    // Append state and tape info to their respective containers
    tapeContainer.appendChild(tapeText);
    tapeContainer.appendChild(headText);
    stateContainer.appendChild(stateText);
    stateContainer.appendChild(tapeContainer);

    // Append the state and tape container to the visualization section
    document.querySelector(".state-visualization").appendChild(stateContainer);
  };

  // Turing Machine simulation logic
  const simulateTuringMachine = (input1, input2) => {
    const tape = `_${input1}+${input2}_`;
    const tapeArr = tape.split("");
    let headPosition = 1;
    let state = "q0";
    const transitions = [];

    // Initial tape visualization
    updateTapeVisualization(tapeArr, headPosition, state);

    while (state !== "q2") {
      const currentSymbol = tapeArr[headPosition];
      let writeSymbol = currentSymbol;
      let move = "R";
      let nextState = state;

      if (state === "q0") {
        if (currentSymbol === "+") {
          nextState = "q1";
        }
      } else if (state === "q1") {
        if (currentSymbol === "_") {
          nextState = "q2";
          move = "L";
        }
      }

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

      // Update tape visualization for each step
      updateTapeVisualization(tapeArr, headPosition, state);
    }

    return transitions;
  };

  simulateButton.addEventListener("click", () => {
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

    const resultDecimal = input1Decimal + input2Decimal;

    const resultBinaryArray = decimalToBinary(resultDecimal, 9);

    outputBinary.querySelectorAll(".binaryNumber").forEach((binary, index) => {
      const span = binary.querySelector("span");

      if (span.textContent !== resultBinaryArray[index]) {
        const originalValue = span.textContent;
        const newValue = resultBinaryArray[index] || "0";

        const SWAP_DURATION = 0.15;
        const SWAP_ITERATIONS = 9;

        binary.classList.add("animating");

        const symbolSwapper = document.createElement("div");
        symbolSwapper.classList.add("symbol-swapper");

        for (let i = 0; i < SWAP_ITERATIONS; i++) {
          const symbolElement = document.createElement("div");
          symbolElement.classList.add("symbol");

          // For the last iteration, show the target value
          if (i === SWAP_ITERATIONS - 1) {
            symbolElement.textContent = newValue;
          } else {
            // Random symbol for other iterations
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

        setTimeout(() => {
          span.textContent = newValue;
          symbolSwapper.remove();
          binary.classList.remove("animating");
        }, SWAP_DURATION * SWAP_ITERATIONS * 1000);
      }
    });

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
});
