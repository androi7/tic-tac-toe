$(document).ready(function() {
  const boardGui = {
    player: false,
    boardWidth: function() {
      return Math.floor($(window).width()*0.4);
    },
    boxWidth: function(width) {
      return Math.floor(this.boardWidth()/width);
    },

    createBoard: function(width, height, tokens, checkAmount = 3) {
      boardLogic.createCheckArray(width, height);
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const $boardBox = $('<div></div>').css({
            'flex': `1 1 ${this.boxWidth(width)}px`, // (grow, shrink, basis) problem with border, box-sizing (4*width)
            'height': `${this.boxWidth(width)}px`,
            'background-color': 'gray',
            'border': '2px solid black',
            'box-sizing': 'border-box',
            'text-align': 'center',
            'line-height': `${this.boxWidth(width)}px`,
            'font-size': `${this.boxWidth(width)/2}px`
          }).attr({
            'data-box-row': i,
            'data-box-col': j
          });

          // this.player = this.player.bind(this);
          let newThis = this;

          $boardBox.on('click', function() {
            if ($(this).text() !== '') { // new created divs are empty, not occupied by a token
              return;
            }
            const token = newThis.player ? tokens[0] : tokens[1];
            $(this).text(token.toString());
            boardLogic.addToken(i, j, token); // add token to check array
            boardLogic.checkResult(i, j, token, checkAmount);
            //console.log('player1', newThis.player);
            newThis.player = !newThis.player;
            //console.log('player2', newThis.player);
          });
          $('#board').append($boardBox);
        }
      }
      //this.createResizeBoard(width, height, tokens);
    },

    createResizeBoard: function(width, height, tokens, checkAmount) {
      $(window).resize(() => { // arrow function to bind this
        $('div[data-box-row]').remove();
        this.createBoard(width, height, tokens, checkAmount);
      });
    }
  };

  boardGui.createBoard(8,8,['X', 'O'],4);
  boardGui.createResizeBoard(8,8,['X', 'O'],4);
});
