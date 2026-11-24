import { GridPoint, Obstacle } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, HOSPITAL_DEPARTMENTS } from '../data/hospitalLayout';

// Generate static collision grid (walls and room interiors that are blocked)
export function createHospitalCollisionMap(): boolean[][] {
  const grid: boolean[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      // Default: outer boundary walls are impassable except the Exit door
      if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1) {
        if (y === GRID_HEIGHT - 1 && x >= 12 && x <= 15) {
          row.push(false); // Exit walkway
        } else {
          row.push(true); // Outer perimeter wall
        }
      } else {
        row.push(false); // Open corridor
      }
    }
    grid.push(row);
  }

  // Mark room boundaries as walls, leaving doors open
  HOSPITAL_DEPARTMENTS.forEach(dept => {
    const { bounds, doorGrid } = dept;
    for (let y = bounds.y; y < bounds.y + bounds.h; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.w; x++) {
        // Perimeter of the room is a wall
        const isWall = (
          x === bounds.x ||
          x === bounds.x + bounds.w - 1 ||
          y === bounds.y ||
          y === bounds.y + bounds.h - 1
        );

        // Check if this point is the designated doorway
        const isDoor = (x === doorGrid.x && y === doorGrid.y);

        if (isWall && !isDoor) {
          if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
            grid[y][x] = true;
          }
        }
      }
    }
  });

  return grid;
}

interface PathNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

// A* Pathfinding Algorithm
export function findPathAStar(
  start: GridPoint,
  goal: GridPoint,
  obstacles: Obstacle[] = [],
  ignoreObstacleAtGoal = true
): GridPoint[] {
  // If start and goal are the same
  if (start.x === goal.x && start.y === goal.y) {
    return [start];
  }

  const collisionMap = createHospitalCollisionMap();

  // Add obstacles to collision map
  obstacles.forEach(obs => {
    if (obs.x >= 0 && obs.x < GRID_WIDTH && obs.y >= 0 && obs.y < GRID_HEIGHT) {
      if (!(ignoreObstacleAtGoal && obs.x === goal.x && obs.y === goal.y)) {
        collisionMap[obs.y][obs.x] = true;
      }
    }
  });

  // Ensure start and goal are not marked as blocked
  if (start.y >= 0 && start.y < GRID_HEIGHT && start.x >= 0 && start.x < GRID_WIDTH) {
    collisionMap[start.y][start.x] = false;
  }
  if (goal.y >= 0 && goal.y < GRID_HEIGHT && goal.x >= 0 && goal.x < GRID_WIDTH) {
    collisionMap[goal.y][goal.x] = false;
  }

  const openSet: PathNode[] = [];
  const closedSet: Set<string> = new Set();

  const startNode: PathNode = {
    x: start.x,
    y: start.y,
    g: 0,
    h: Math.hypot(goal.x - start.x, goal.y - start.y),
    f: Math.hypot(goal.x - start.x, goal.y - start.y),
    parent: null
  };

  openSet.push(startNode);

  const key = (x: number, y: number) => `${x},${y}`;

  // 8-directional or 4-directional movements
  const directions = [
    { dx: 0, dy: -1, cost: 1 },
    { dx: 0, dy: 1, cost: 1 },
    { dx: -1, dy: 0, cost: 1 },
    { dx: 1, dy: 0, cost: 1 },
    { dx: -1, dy: -1, cost: 1.414 },
    { dx: 1, dy: -1, cost: 1.414 },
    { dx: -1, dy: 1, cost: 1.414 },
    { dx: 1, dy: 1, cost: 1.414 },
  ];

  while (openSet.length > 0) {
    // Find node with lowest f cost
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    const current = openSet.splice(lowestIndex, 1)[0];
    closedSet.add(key(current.x, current.y));

    // Goal reached
    if (current.x === goal.x && current.y === goal.y) {
      const path: GridPoint[] = [];
      let temp: PathNode | null = current;
      while (temp !== null) {
        path.unshift({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return path;
    }

    // Explore neighbors
    for (const dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;

      // Bounds check
      if (nx < 0 || nx >= GRID_WIDTH || ny < 0 || ny >= GRID_HEIGHT) {
        continue;
      }

      // Check wall collision
      if (collisionMap[ny][nx]) {
        continue;
      }

      // For diagonals, ensure adjacent orthogonals are free so robot does not cut corners through walls
      if (dir.dx !== 0 && dir.dy !== 0) {
        if (collisionMap[current.y][nx] && collisionMap[ny][current.x]) {
          continue; // Blocked corner
        }
      }

      const neighborKey = key(nx, ny);
      if (closedSet.has(neighborKey)) {
        continue;
      }

      const gScore = current.g + dir.cost;
      let neighbor = openSet.find(n => n.x === nx && n.y === ny);

      if (!neighbor) {
        neighbor = {
          x: nx,
          y: ny,
          g: gScore,
          h: Math.hypot(goal.x - nx, goal.y - ny),
          f: gScore + Math.hypot(goal.x - nx, goal.y - ny),
          parent: current
        };
        openSet.push(neighbor);
      } else if (gScore < neighbor.g) {
        neighbor.g = gScore;
        neighbor.f = gScore + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  // If no direct path, fallback to empty or closest path
  return [];
}

// Helper to calculate heading angle from current point to next point
export function calculateHeading(from: GridPoint, to: GridPoint): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angleRad = Math.atan2(dy, dx);
  let angleDeg = (angleRad * 180) / Math.PI + 90; // 0 deg is North
  if (angleDeg < 0) angleDeg += 360;
  return Math.round(angleDeg);
}
