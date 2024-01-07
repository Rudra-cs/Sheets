# Sheets

### Features

- Two way binding -> Manipulation in both UI & Storage(Cell Properties)
- Graph Alog -> Cycle Detection in Directed graph
  - Formula Evaluation
  - Formula Cycle Validation
- Storage Manipulation
  - Cycle Validation Color Tracking
  - Multiple Sheet Handling
- New, Open, Download Sheets
- Cut, Copy, Paste in multiple sheets

#### Storage

- 2D Matrix with objects
  [100][26]
  [ 0[],
  1[],
  2[],
  ...
  100[]
  ]

- Two way binding
  - data modify
  - UI modify

#### Formula Evaluation - > Enter Key

- Normal Expression -> e.g.:(10+20)
- Dependency Expression -> eg: (A1+A2+10)

(A1+A2)
↪ Decode and access values

(A1+A2) -> Encode
(10+20) -> Decode

Formula must be space separated

#### Cycle Detection Algorithm in Directed Graphs

- e.g. Set A1 as 10 and then B1 dependent on A1 in formula A1 + 10
- then again go to A1 and set the formula to be dependant on B1. This creates a cycle.

1. Graph Relation ->

   - Because of dependency on different nodes

   Why is it a graph not tree DS?

   - Tree is a special type of directed graph
     Why is it a directed graph?

   - Bcz it does not have the data of its parent

2. Directed Graph

-

3. Cycle Detection

Algo->

- If one node is cyclic, graph is cyclic
- On node visit start-> vis[node]=T; dfsvis[node]= T
  End - > dfsvis[node] = F
- On already visited node, go back
- vis[node] == T && dfsvis[node]==T => Cycle
