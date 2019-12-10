// $(document).ready(function () {
  const boardLogic = {

    boardArray: null,
    columnCopy: [],

    createCheckArray: function(width, height) {
      this.boardArray = new Array(height).fill('').map(() => new Array(width).fill(' ')); //last fill needs whitespace, because arrays get joined for examination
    },

    addToken: function(row, col, token) {
      this.boardArray[row][col] = token;
      console.log(this.boardArray);
    },

    checkResult: function(row, col, token) {
      // horizontal examination
      if (this.boardArray[row].join('').match(`[${token}]{3}`)) {
        $('#debug').text(`debug: ${token} won!`);
        $('div').off();
        return;
      }

      // vertical examination
      for (let i = 0; i < this.boardArray.length; i++) {
        this.columnCopy.push(this.boardArray[i][col]);
        console.log(this.columnCopy);
        if (i === this.boardArray.length - 1 && this.columnCopy.join('').match(`[${token}]{3}`)) {
          $('#debug').text(`debug: ${token} won!`);
          $('div').off();
          return;
        }
      }
      this.columnCopy = [];

      // diagonal examination
      for (let i = 1; i < this.boardArray.length-1; i++) {
        for (let j = 1; j < this.boardArray[i].length - 1; j++) {
          if (this.boardArray[i][j] === token && (this.boardArray[i-1][j-1] === token && this.boardArray[i+1][j+1] === token || this.boardArray[i-1][j+1] === token && this.boardArray[i+1][j-1] === token)) {
            $('#debug').text(`debug: ${token} won!`);
            $('div').off();
          } else if (this.boardArray[i][j] === 'O' && (this.boardArray[i-1][j-1] === 'O' && this.boardArray[i+1][j+1] === 'O' || this.boardArray[i-1][j+1] === 'O' && this.boardArray[i+1][j-1] === 'O')) {
            console.log('O won!');
            $('#debug').text('debug: O won!');
            $('div').off();
          }
        }
      }
    }
};

// });
