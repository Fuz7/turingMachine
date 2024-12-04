document.addEventListener("DOMContentLoaded", () => {
  const inputContainers = document.querySelectorAll(".inputContainer");
  const outputBinary = document.querySelector(".outputBinary");
  const simulateButton = document.querySelector(".simulateButton");
  const transitionButton = document.querySelector(".transitionButton");
  const transitionTableBody = document.querySelector(".state-table tbody");
  const x_button = document.querySelector(".x-button");
  const tableContainer = document.querySelector(".transitionContainer");
  const stateVisualization = document.querySelector(".state-visualization");
  const operation = document.querySelector(".operation");

  const symbols = (function(){
    const charsArray=[]
    for (let i = 97; i <= 122; i++) { // ASCII for 'a' (97) to 'z' (122)
      charsArray.push(String.fromCharCode(i));
    }
    for (let i = 65; i <= 90; i++) { // ASCII for 'A' (65) to 'Z' (90)
      charsArray.push(String.fromCharCode(i));
    }
    const symbols = [
      '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+',
      '[', ']', '{', '}', ';', ':', ',', '.', '<', '>', '/', '?', '|', '\\',
      '~', '`', '"', '\'', 
    ];
    charsArray.push(...symbols);
    return charsArray;

  })()
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
        const outputBinaryNumber = outputBinary.querySelector(".binaryNumber");
        outputBinary.removeChild(outputBinaryNumber);
      }
    }
    outputBinary.querySelectorAll(".binaryNumber").forEach((binary, index) => {
      const span = binary.querySelector("span");
      span.textContent = '0'
    });
    (document.querySelector(".outputContainer")).querySelector('.inputField').value = ''
  });

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

  const animateBinary = async(element,duration,swapInterval,finalValue) => {

      let count = 0;
      const id = await setInterval(replaceContent,swapInterval);
      function replaceContent(){
        if(count < duration){
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
          element.textContent = randomSymbol
          count += swapInterval
        }else{
          element.textContent = finalValue
          clearInterval(id)
        }
      }
  }

  const inputFieldAnimation = (input,duration,swapInterval,outputValue) =>{
    let count = 0
    const id = setInterval(replaceContent,swapInterval);

    function replaceContent(){
      if(count < duration){
        const charArray = []
        const charLength = input.value.length
        while(charArray.length < charLength){
          charArray.push(symbols[Math.floor(Math.random() * symbols.length)])
        }
        input.value = charArray.join('')
        count += swapInterval
      }else{
        input.value = outputValue
        clearInterval(id)
      }
    }
  }

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
        const SWAP_DURATION = 0.10;
        const SWAP_ITERATIONS = 9;
        const TOTAL_ANIMATION_TIME = SWAP_DURATION * SWAP_ITERATIONS;
        inputField.disabled = true
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
          inputFieldAnimation(inputField,300,30,decimalValue)
          inputField.disabled = false;
        }, TOTAL_ANIMATION_TIME * 1000 + 100);
      });
    });
    inputField.addEventListener("input", (event) => {

        if(isNaN(inputField.value)){
          inputField.value = inputField.value.replace(/\D/g, "");
          return
        }

        const input = inputField.value.trim();

        const isBinaryString = /^[01]+$/.test(input);
        let binaryArray;

        if (isBinaryString) {
          binaryArray = input.padStart(8, "0").slice(0, 8).split("");
        } 
        else {
          const decimal = parseInt(input, 10);

          if (isNaN(decimal) || decimal > 255) {
            inputField.value = input.slice(0, input.length - 1); // Reject invalid input
            return;
          }

          binaryArray = decimalToBinary(decimal, 8).split('');
        }

        const binaryNumbers = container.querySelectorAll(".binaryNumber");

        binaryNumbers.forEach((binary, index) => {
          const span = binary.querySelector("span");

          const newValue = binaryArray[index] || "0";

          // If the binary digit is different from the current span value, animate it
       
            animateBinary(span,200 + (index * 150),50,newValue)
          
        });
      }
    );

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
    if (operation.textContent == "+") {
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
    } else if (operation.textContent == "*") {
      const tape = `_${input1}*${input2}_`;
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
          if (currentSymbol === "*") {
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
    }
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
    if (operation.textContent == "+") {
      resultDecimal = input1Decimal + input2Decimal;
      inputTF.value = resultDecimal;
    } else {
      resultDecimal = input1Decimal * input2Decimal;
      inputTF.value = resultDecimal;
    }

    const resultBinaryArray = decimalToBinary(resultDecimal, 9);

    outputBinary.querySelectorAll(".binaryNumber").forEach((binary, index) => {
      const span = binary.querySelector("span");

     
        const originalValue = span.textContent;
        const newValue = resultBinaryArray[index] || "0";
        animateBinary(span,(index * 150),40,newValue)
    });
    const spanLenght = outputBinary.querySelectorAll(".binaryNumber").length
    inputFieldAnimation(inputTF,(spanLenght*150),40,inputTF.value)
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
class TuringMachine {
    constructor(tape) {
        this.tape = tape.split(''); // Convert tape string to array
        this.head = 0; // Head position
        this.state = 'start'; // Initial state
        this.steps = []; // Array to record all steps
        this.halted = false; // Flag to ensure halt is recorded once
        this.carry = 0;
    }

    recordStep() {
        if(this.carry > 0 && this.state !== 'halt'){
        this.steps.push({
            tape: this.tape.join(''),
            head: this.head,
            state: 'carry'
        });
        }else{

          this.steps.push({
              tape: this.tape.join(''),
              head: this.head,
              state: this.state
          });
        }
    }

    step() {
        if (this.halted) return false; // Exit if already halted

        let char = this.tape[this.head] || '0';
        this.recordStep(); // Record current state before action

        switch (this.state) {
            case 'start':
                if (char === '1' || char === '0') {
                    this.state = 'find_second_number';
                    this.head++;
                } else {
                    this.state = 'halt';
                }
                break;

            case 'find_second_number':
                if (char === '#') { // Find separator
                    this.state = 'add';
                    this.head--;
                } else {
                    this.head++;
                }
                break;

            case 'add':
                while (this.head >= 0) {
                    let a = parseInt(this.tape[this.head] || '0', 10);
                    let b = parseInt(this.tape[this.head + 9] || '0', 10); // Adjust for offset
                    let sum = a + b + this.carry;

                    // Write result after separator
                    this.tape[this.head + 18] = (sum % 2).toString();
                    this.carry = Math.floor(sum / 2);
                    this.head--;

                    this.recordStep(); // Record each sub-step in addition
                }

                if (this.carry > 0) {
                    this.tape.splice(18, 0, '1'); // Add carry if exists
                    this.recordStep();
                    this.state = 'carry'
                }else{
                  this.recordStep()
                  this.state = 'add' 
                }
                this.state = 'halt';
                break;
            
            case 'carry':
                while (this.head >= 0) {
                    let a = parseInt(this.tape[this.head] || '0', 10);
                    let b = parseInt(this.tape[this.head + 9] || '0', 10); // Adjust for offset
                    let sum = a + b + this.carry;

                    // Write result after separator
                    this.tape[this.head + 18] = (sum % 2).toString();
                    this.carry = Math.floor(sum / 2);
                    this.head--;

                    this.recordStep(); // Record each sub-step in addition
                }

                if (this.carry > 0) {
                    this.tape.splice(18, 0, '1'); // Add carry if exists
                    this.state = 'carry'
                    this.recordStep();
                }else{
                  this.state = 'add'
                }
                this.state = 'halt';
                break;
            
            case 'halt':
                if (!this.halted) {
                    this.halted = true; // Ensure halt is recorded only once
                    this.recordStep();
                }
                return false;

        }

        return true;
    }

    run() {
        while (this.step());
    }

    getSteps() {
        return this.steps;
    }
}

// Initialize tape with two 8-bit binary numbers separated by one #
let tape = '11000010#10110111       '; // No extra # at end
let tm = new TuringMachine(tape);

tm.run();

// Retrieve all steps
const steps = tm.getSteps();
console.log(steps);