import { SweetType } from '../components/SweetIcon';

export const BOARD_SIZE = 6;
export const BASE_SWEET_TYPES: SweetType[] = ['motichoor', 'star_peda', 'kaju_katli', 'jalebi', 'gulab_jamun'];

export interface BoardCell {
  id: string;
  row: number;
  col: number;
  type: SweetType;
  isPopping?: boolean;
  isSpecial?: boolean;
}

export type Board = BoardCell[][];

export interface MatchResult {
  matchedCells: { row: number; col: number }[];
  specialSpawn?: { row: number; col: number; type: SweetType };
  matchCount: number;
}

let cellCounter = 0;
export const getUniqueCellId = () => `sweet_${Date.now()}_${++cellCounter}`;

export function getRandomSweetType(): SweetType {
  const index = Math.floor(Math.random() * BASE_SWEET_TYPES.length);
  return BASE_SWEET_TYPES[index];
}

/**
 * Creates initial 6x6 board with NO pre-existing 3-in-a-row matches
 */
export function createInitialBoard(): Board {
  const board: Board = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      let allowedTypes = [...BASE_SWEET_TYPES];

      // Disallow 3 in a horizontal row
      if (c >= 2 && board[r][c - 1].type === board[r][c - 2].type) {
        allowedTypes = allowedTypes.filter(t => t !== board[r][c - 1].type);
      }
      // Disallow 3 in a vertical column
      if (r >= 2 && board[r - 1][c].type === board[r - 2][c].type) {
        allowedTypes = allowedTypes.filter(t => t !== board[r - 1][c].type);
      }

      const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)] || BASE_SWEET_TYPES[0];

      board[r][c] = {
        id: getUniqueCellId(),
        row: r,
        col: c,
        type: randomType,
      };
    }
  }

  return board;
}

/**
 * Find all matching lines (horizontal & vertical)
 */
export function findMatches(board: Board): MatchResult {
  const matchedSet = new Set<string>();
  let specialSpawn: { row: number; col: number; type: SweetType } | undefined;
  let totalMatchGroups = 0;

  // Horizontal match check
  for (let r = 0; r < BOARD_SIZE; r++) {
    let matchLength = 1;
    for (let c = 0; c < BOARD_SIZE; c++) {
      const current = board[r][c];
      const next = c < BOARD_SIZE - 1 ? board[r][c + 1] : null;

      if (next && current.type === next.type && current.type !== 'bomb_special' && current.type !== 'maha_laddu') {
        matchLength++;
      } else {
        if (matchLength >= 3) {
          totalMatchGroups++;
          const matchStartCol = c - matchLength + 1;
          for (let k = 0; k < matchLength; k++) {
            matchedSet.add(`${r},${matchStartCol + k}`);
          }
          if (matchLength === 4) {
            specialSpawn = { row: r, col: matchStartCol + 1, type: 'bomb_special' };
          } else if (matchLength >= 5) {
            specialSpawn = { row: r, col: matchStartCol + 2, type: 'maha_laddu' };
          }
        }
        matchLength = 1;
      }
    }
  }

  // Vertical match check
  for (let c = 0; c < BOARD_SIZE; c++) {
    let matchLength = 1;
    for (let r = 0; r < BOARD_SIZE; r++) {
      const current = board[r][c];
      const next = r < BOARD_SIZE - 1 ? board[r + 1][c] : null;

      if (next && current.type === next.type && current.type !== 'bomb_special' && current.type !== 'maha_laddu') {
        matchLength++;
      } else {
        if (matchLength >= 3) {
          totalMatchGroups++;
          const matchStartRow = r - matchLength + 1;
          for (let k = 0; k < matchLength; k++) {
            matchedSet.add(`${matchStartRow + k},${c}`);
          }
          if (matchLength === 4 && !specialSpawn) {
            specialSpawn = { row: matchStartRow + 1, col: c, type: 'bomb_special' };
          } else if (matchLength >= 5) {
            specialSpawn = { row: matchStartRow + 2, col: c, type: 'maha_laddu' };
          }
        }
        matchLength = 1;
      }
    }
  }

  const matchedCells: { row: number; col: number }[] = [];
  matchedSet.forEach(coord => {
    const [row, col] = coord.split(',').map(Number);
    matchedCells.push({ row, col });
  });

  return {
    matchedCells,
    specialSpawn,
    matchCount: totalMatchGroups,
  };
}

/**
 * Handle 3x3 Bomb Explosion
 */
export function getBombExplosionCoords(r: number, c: number): { row: number; col: number }[] {
  const coords: { row: number; col: number }[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        coords.push({ row: nr, col: nc });
      }
    }
  }
  return coords;
}

/**
 * Handle Maha Rainbow Laddu clearing all of a target type
 */
export function getRainbowClearCoords(board: Board, targetType: SweetType): { row: number; col: number }[] {
  const coords: { row: number; col: number }[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c].type === targetType || board[r][c].type === 'maha_laddu') {
        coords.push({ row: r, col: c });
      }
    }
  }
  return coords;
}

/**
 * Applies gravity and fills board from above with new sweets
 */
export function applyGravity(board: Board): Board {
  const newBoard: Board = board.map(row => row.map(cell => ({ ...cell })));

  for (let c = 0; c < BOARD_SIZE; c++) {
    let emptyRow = BOARD_SIZE - 1;

    // Shift down existing non-popping sweets
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (!newBoard[r][c].isPopping) {
        if (r !== emptyRow) {
          newBoard[emptyRow][c] = {
            ...newBoard[r][c],
            row: emptyRow,
            col: c,
          };
          newBoard[r][c] = {
            id: getUniqueCellId(),
            row: r,
            col: c,
            type: getRandomSweetType(),
            isPopping: true,
          };
        }
        emptyRow--;
      }
    }

    // Fill all remaining empty top cells
    for (let r = emptyRow; r >= 0; r--) {
      newBoard[r][c] = {
        id: getUniqueCellId(),
        row: r,
        col: c,
        type: getRandomSweetType(),
        isPopping: false,
      };
    }
  }

  return newBoard;
}
