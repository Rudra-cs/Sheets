// Storage -> 2D Matrix (Basic Needed)
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < cols; j++) {
    // Why array -> More than 1 Child relation (dependency)
    row.push([]);
  }
  graphComponentMatrix.push(row);
}

// True -> cyclic, false -> not cyclic
function isGraphCyclic(graphComponentMatrix) {
  // Dependency -> visited, dfsvisited
  let visited = []; // Node visit trace
  let dfsVisited = []; // Start visit trace

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] == false) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        if (response == true) return true;
      }
    }
  }
  return false;
}

// Start -> visited(true) dfsVisited(true)
// End -> dfsVisited(false)
// If vis[i][j] -> already explored path, so go back no use to explore again
// Cycle Detection condition -> if(vis[i][j]==true && dfsVis[i][j]==true) -> cycle
// Return -> true(cyclic) or false(non-cyclic)
function dfsCycleDetection(
  graphComponentMatrix,
  srcr,
  scrc,
  visited,
  dfsVisited
) {
  visited[srcr][scrc] = true;
  dfsVisited[srcr][scrc] = true;

  // A1 -> [ [0,1],[1,0],[3,2], [4,5] .....]
  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
    if (visited[nbrr][nbrc] == false) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        nbrr,
        nbrc,
        visited,
        dfsVisited
      );
      if (response == true) {
        return true; // found cycle so return immediately, no need to explore more path
      } else if (
        visited[nbrr][nbrc] == true &&
        dfsVisited[nbrr][nbrc] == true
      ) {
        // found cycle so return immediately, no need to explore more path
        return true;
      }
    }
  }
  dfsVisited[srcr][scrc] = false;
  return false;
}
