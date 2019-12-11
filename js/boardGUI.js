$(document).ready(function() {
  const boardGui = {
    player: true, // true => player1, false = player2
    boardWidth: function() {
      return Math.floor($(window).width()*0.4);
    },
    boxWidth: function(width) {
      return Math.floor(this.boardWidth()/width);
    },
    width: 0,
    height: 0,
    tokens: ['X', 'O'], // default ['X', 'O']

    startGame: function() {
      $('#start').on('click', () => { // arrow function due to this
        this.tokens = this.tokens[0] === $('#token1').val() ? this.tokens : this.tokens.reverse();
        $('.settings').fadeOut(400);
        $('#board').css('display', 'flex');
        $('#board').hide();
        $('#scoreField').css('display', 'grid');
        $('#scoreField').hide();

        boardGui.createResizeBoard(4,4,this.tokens,3);

        $('#scoreField').fadeIn(1000);
        $('#board').fadeIn(1000);
      });

    },

    createBoard: function(width, height, tokens, checkAmount = 3) {
      // to add CSS classes
      this.width = width;
      this.height = height;
      const self = this;
      boardLogic.createCheckArray(width, height);

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const $boardBox = $('<div></div>').css({
            'flex': `1 1 ${this.boxWidth(width)}px`, // (grow, shrink, basis) problem with border, box-sizing (4*width)
            'height': `${this.boxWidth(width)}px`,
            'line-height': `${this.boxWidth(width)}px`,
            'font-size': `${this.boxWidth(width)/1.5}px`
          }).attr({
            'data-box-row': i,
            'data-box-col': j,
            'class': 'boardBox',
          });

          // this.player = this.player.bind(this);

          $boardBox.on('click', function() {
            if ($(this).text() !== '') { // new created divs are empty, not occupied by a token
              return;
            }
            const token = self.player ? tokens[0] : tokens[1];
            $(this).text(token.toString());
            boardLogic.addToken(i, j, token); // add token to check array
            const [a, b, winner] = boardLogic.checkResult(i, j, token, checkAmount);

            self.updateScore(winner);

            self.player = !self.player;

          });
          $('#board').append($boardBox);
        }
      }
      this.addBoxCSSClasses();
    },

    createResizeBoard: function(width, height, tokens, checkAmount) {
      width = width > 10 ? 10 : width;
      height = height > 10 ? 10 : height;
      this.createBoard(width, height, tokens, checkAmount);
      $(window).resize(() => { // arrow function to bind this
        $('div[data-box-row]').remove();
        this.createBoard(width, height, tokens, checkAmount);
      });
    },

    addBoxCSSClasses: function() {
      $(`[data-box-row=0][data-box-col=0]`).addClass('boxBorderTopLeftRadius');
      $(`[data-box-row=0][data-box-col=${this.width-1}]`).addClass('boxBorderTopRightRadius');
      $(`[data-box-row=${this.height-1}][data-box-col=0]`).addClass('boxBorderBottomLeftRadius');
      $(`[data-box-row=${this.height-1}][data-box-col=${this.width-1}]`).addClass('boxBorderBottomRightRadius');

      $('[data-box-row=0]').addClass('boxBorderTopNone');
      $('[data-box-col=0]').addClass('boxBorderLeftNone');
      $(`[data-box-row=${this.height-1}]`).addClass('boxBorderBottomNone');
      $(`[data-box-col=${this.width-1}]`).addClass('boxBorderRightNone');
      if (this.width > 4 || this.height > 4) {
        $('.boardBox').addClass('boxSmallerBorder');
      }
    },

    updateScore: function(winner) {
      if (winner !== undefined) {
        console.log('tokens:', this.tokens, 'winner', winner);
        if (this.tokens.indexOf(winner) === 0) {
          console.log('worked?');
          $('#scorePlayer1').text(parseInt($('#scorePlayer1').text() + 1));
          this.reset();
        } else if (this.tokens.indexOf(winner) === 1) {
          $('#scorePlayer2').text(parseInt($('#scorePlayer2').text() + 1));
          this.reset();
        }
      }
    },

    reset: function() {
      $('.boardBox').text('');
      boardLogic.boardArray = null;
    }

  };

  //boardGui.createBoard(8,8,['X', 'O'],4);
  boardGui.startGame();
});
