// $(document).ready(function () {
const boardLogic = {

  boardArray: null,
  columnCopy: [],
  diagonalLine: [],

  createCheckArray: function(width, height) {
    this.boardArray = new Array(height).fill('').map(() => new Array(width).fill(' ')); //last fill needs whitespace, because arrays get joined for examination
  },

  addToken: function(row, col, token) {
    this.boardArray[row][col] = token;
    //console.log(this.boardArray);
  },

  checkResult: function(row, col, token, amount) {
    // horizontal examination
    // match throws back a object with the index of the beginning match (row)
    const matchObjHorizontal= this.boardArray[row].join('').match(`[${token}]{${amount}}`);
    if (matchObjHorizontal) {
      $('#debug').text(`debug: ${token} won!`);
      $('div').off();
      return [col, matchObjHorizontal.index, token];
    }

    // vertical examination
    for (let i = 0; i < this.boardArray.length; i++) {
      this.columnCopy.push(this.boardArray[i][col]);
      const matchObjVertical = this.columnCopy.join('').match(`[${token}]{${amount}}`);
      if (i === this.boardArray.length - 1 && matchObjVertical) {
        $('#debug').text(`debug: ${token} won!`);
        $('div').off();
        return [col, matchObjVertical.index, token];
      }
    }
    this.columnCopy = [];

    // diagonal examination
    // looping from left to right (left top to right bottom diagonal lines)
    for (let x = 0; x < this.boardArray.length - (amount - 1); x++) {
      for (let y = 0; y < this.boardArray[x].length - (amount - 1); y++) {
        for (let i = 0; i < amount; i++) {
          //console.log('outside', this.diagonalLine);
          this.diagonalLine.push(this.boardArray[x+i][y+i]);
          if (i === (amount - 1)) {
            //console.log('inside',this.diagnoalLine);
            if (this.diagonalLine.join('').match(`[${token}]{${amount}}`)) {
              $('#debug').text(`debug: ${token} won!`);
              $('div').off();
              return;
            } else {
              this.diagonalLine = [];
            }
          }
        }
      }
    }
    // looping from right to left ( top right to bottom left diagonal lines)
    for (let x = 0; x < this.boardArray.length - (amount - 1); x++) {
      for (let y = this.boardArray.length - 1; y > amount - 2; y--) {
        for (let i = 0; i < amount; i++) {
          //console.log('outside', this.diagonalLine);
          this.diagonalLine.push(this.boardArray[x+i][y-i]);
          if (i === (amount - 1)) {
            //console.log('inside',this.diagnoalLine);
            if (this.diagonalLine.join('').match(`[${token}]{${amount}}`)) {
              $('#debug').text(`debug: ${token} won!`);
              $('div').off();
              return;
            } else {
              this.diagonalLine = [];
            }
          }
        }
      }
    }
    return [,,];
  }
};
