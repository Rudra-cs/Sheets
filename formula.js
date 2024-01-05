for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activecell, cellProp] = getCellAndCellProp(address);
      let enterData = activecell.innerText;

      cellProp.value = enterData;
      console.log(cellProp);
    });
  }
}

let formulabar = document.querySelector(".formula-bar");
formulabar.addEventListener("keydown", (e) => {
  let inputFormula = formulabar.value;
  if (e.key === "Enter" && inputFormula) {
    let evaluatedValue = evaluateFormula(inputFormula);
    // To update UI and cell
    setCellUIAndCellProp(evaluatedValue, inputFormula);
  }
});

function evaluateFormula(formula) {
  return eval(formula);
}

function setCellUIAndCellProp(evaluatedValue, formula) {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cell.innerText = evaluatedValue; // UI update
  cellProp.value = evaluatedValue; // DB Update
  cellProp.formula = formula;
}
