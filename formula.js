for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activecell, cellProp] = getCellAndCellProp(address);
      let enterData = activecell.innerText;
      if (enterData == cellProp.value) return;
      cellProp.value = enterData;
      // If data modified remove P-C relation, formula empty, update children with new hardcoded (modified) value
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(address);
      console.log(cellProp);
    });
  }
}

let formulabar = document.querySelector(".formula-bar");
formulabar.addEventListener("keydown", async (e) => {
  let inputFormula = formulabar.value;
  if (e.key === "Enter" && inputFormula) {
    // If change in formula, break P-C relation, evaluate new formula, add new P-C relation
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (inputFormula !== cellProp.formula)
      removeChildFromParent(cellProp.formula);

    addChildToGraphComponent(inputFormula, address);
    // Check formula is cyclic or not, then only evaluate
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      // alert("Your formula is cyclic!!");
      let response = confirm(
        "Your formula is cyclic!! Do you want to trace your path?"
      );
      while (response === true) {
        // Keep on tracking color until user is satisfied
        await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
        response = confirm(
          "Your formula is cyclic!! Do you want to trace your path?"
        );
      }

      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);
    // To update UI and cellProp in DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);

    updateChildrenCells(address);
  }
});

function removeChildFromGraphComponent(formula, childAddress) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIdCIdFromAdress(encodedFormula[i]);

      // B1: A1 + 10
      // rid -> i,cid -> j
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIdCIdFromAdress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIdCIdFromAdress(encodedFormula[i]);

      // B1: A1 + 10
      // rid -> i,cid -> j
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childcell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

function addChildToParent(formula) {
  let encodedFormula = formula.split(" ");
  let childAddress = addressBar.value;
  for (let i = 0; i < encodedFormula; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); // Suppose A1 + A2 then it will get A
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let encodedFormula = formula.split(" ");
  let childAddress = addressBar.value;
  for (let i = 0; i < encodedFormula; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); // Suppose A1 + A2 then it will get A
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

// Evaluate the formula
function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); // Suppose A1 + A2 then it will get A
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

// Change the value after evaluation of the formula
function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);

  cell.innerText = evaluatedValue; // UI update
  cellProp.value = evaluatedValue; // DB Update
  cellProp.formula = formula;
}
