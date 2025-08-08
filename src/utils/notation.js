/**
 * Converts board coordinates (row, col) to chess notation (e.g., "a1", "h8").
 * Rows are 0-indexed from top (0) to bottom (7).
 * Columns are 0-indexed from left (0) to right (7).
 * 
 * @param {number} row - Row index (0 to 7)
 * @param {number} col - Column index (0 to 7)
 * @returns {string} Chess notation string
 */
export function coordsToNotation(row, col) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  if (row < 0 || row > 7 || col < 0 || col > 7) {
    throw new Error('Invalid board coordinates');
  }
  return files[col] + ranks[row];
}

/**
 * Converts chess notation (e.g., "a1", "h8") to board coordinates (row, col).
 * 
 * @param {string} notation - Chess notation string
 * @returns {[number, number]} Tuple of [row, col]
 */
export function notationToCoords(notation) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  if (notation.length !== 2) {
    throw new Error('Invalid notation format');
  }
  const file = notation[0];
  const rank = notation[1];
  const col = files.indexOf(file);
  const row = ranks.indexOf(rank);
  if (col === -1 || row === -1) {
    throw new Error('Invalid notation characters');
  }
  return [row, col];
}
