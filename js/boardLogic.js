const boardLogic = {

  boardArray: null,
  columnCopy: [], // holds all tokens of a column for match() method in vertical examination
  diagonalLine: [], // holds all tokens of diagonal lines for match() method in diagonal examination

  createCheckArray: function(width, height) {
    this.boardArray = new Array(height).fill('').map(() => new Array(width).fill(' ')); //last fill needs whitespace, because arrays get joined for examination
  },

  addToken: function(row, col, token) {
    this.boardArray[row][col] = token;
  },

  checkResult: function(row, col, token, amount) {
    // checks if player has won and returns [row, col, token, sort]
    // input row & col: position of the current token
    // input token: token ('X' or 'O')
    // input amount: how many token in a row
    // return row & col: first row and col of first position of token which is correct
    // return token: which symbol
    // return sort: kind of examination -> 'h', 'v', 'dl', 'dr'

    // horizontal examination
    // check only current row
    // match throws back a object with the index of the beginning match (row)
    // null if no match/ index of first col of token
    const matchObjHorizontal= this.boardArray[row].join('').match(`[${token}]{${amount}}`);
    if (matchObjHorizontal) {
      $('.boardBox').off(); // stop event listener
      return [row, matchObjHorizontal.index, token, 'h'];
    }

    // vertical examination
    for (let i = 0; i < this.boardArray.length; i++) {
      // check only specific col
      this.columnCopy.push(this.boardArray[i][col]);
    }
    const matchObjVertical = this.columnCopy.join('').match(`[${token}]{${amount}}`);
    if (matchObjVertical) {
      $('.boardBox').off();
      return [matchObjVertical.index, col, token, 'v'];
    }
    this.columnCopy = [];

    // diagonal examination
    // looping from left to right (left top to right bottom diagonal lines)
    // iteration variables x & y need only to loop through from beginning to the first possible occurence of a potential diagonal match: array.length - (amount) - 1
    // because it iterates through the diagonal line within the most inner loop (3. loop)
    for (let x = 0; x < this.boardArray.length - (amount - 1); x++) {
      for (let y = 0; y < this.boardArray[x].length - (amount - 1); y++) {
        for (let i = 0; i < amount; i++) {
          //console.log('outside', this.diagonalLine);
          this.diagonalLine.push(this.boardArray[x+i][y+i]);
          if (i === (amount - 1)) {
            if (this.diagonalLine.join('').match(`[${token}]{${amount}}`)) {
              $('.boardBox').off();
              return [x, y, token, 'dl'];
            } else {
              this.diagonalLine = [];
            }
          }
        }
      }
    }
    // looping from right to left ( top right to bottom left diagonal lines)
    for (let x = 0; x < this.boardArray.length - (amount - 1); x++) {
      for (let y = this.boardArray[x].length - 1; y > amount - 2; y--) {
        for (let i = 0; i < amount; i++) {
          //console.log('outside', this.diagonalLine);
          this.diagonalLine.push(this.boardArray[x+i][y-i]);
          if (i === (amount - 1)) {
            if (this.diagonalLine.join('').match(`[${token}]{${amount}}`)) {
              $('.boardBox').off();
              return [x, y, token, 'dr'];
            } else {
              this.diagonalLine = [];
            }
          }
        }
      }
    }
    return [,,,]; // if not matched, return complete array undefined
  }
};
