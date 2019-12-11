$(document).ready(function() {
  const boardGui = {
    player: true, // true => player1, false = player2
    boardWidth: function() {
      return Math.floor($(window).width()*0.4);
    },
    boxWidth: function(width) {
      return Math.floor(this.boardWidth()/width);
    },
    // default settings
    width: 3,
    height: 3,
    symbolAmount: 3,
    rounds: 1,
    player1: 'Player1',
    player2: 'Player2',
    tokens: ['X', 'O'],

    startGame: function() {
      $('#start').on('click', () => { // arrow function due to this
        // get values from settings
        this.tokens = this.tokens[0] === $('#token1').val() ? this.tokens : this.tokens.reverse();
        this.player1 = $('#setPlayer1').val();
        this.player2 = $('#setPlayer2').val();
        this.width = parseInt($('#boardWidth').val());
        this.height = parseInt($('#boardHeight').val());
        this.rounds = parseInt($('#rounds').val());
        this.symbolAmount = parseInt($('#symbols').val());

        $('.settings').fadeOut(400);
        // display from none to flex then hide for using fadeIn
        $('#board').css('display', 'flex');
        $('#board').hide();
        // same css trick like for diplay flex
        $('#scoreField').css('display', 'grid');
        $('#player1').text(this.player1);
        $('#player2').text(this.player2);
        $('#player1').addClass('redFont');
        $('#scoreField').hide();

        this.createResizeBoard(); //boardWidth, boardHeight, this.tokens, rounds

        $('#scoreField').fadeIn(1000);
        $('#board').fadeIn(1000);
      });
    },

    createBoard: function() { // width, height, tokens, checkAmount
      // to add CSS classes

      const width = this.width;
      const height = this.height;
      //this.width = width;
      //this.height = height;

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

          $boardBox.on('click', function() {
            if ($(this).text() !== '') { // new created divs are empty, not occupied by a token
              return;
            }
            // player: true -> player1, player: false -> player2
            const token = self.player ? self.tokens[0] : self.tokens[1];
            $(this).text(token.toString());
            boardLogic.addToken(i, j, token); // add token to check array
            const [a, b, winnerToken] = boardLogic.checkResult(i, j, token, self.symbolAmount);

            self.updateScore(winnerToken);

            self.player = !self.player;
            $('#player1').toggleClass('redFont');
            $('#player2').toggleClass('redFont');

          });
          $('#board').append($boardBox);
        }
      }
      this.addBoxCSSClasses();
    },

    createResizeBoard: function() { // width, height, tokens, checkAmount
      this.createBoard(); // width, height, tokens, checkAmount
      $(window).resize(() => { // arrow function to bind this
        $('div[data-box-row]').remove();
        this.createBoard(); // width, height, tokens, checkAmount
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
          $('#scorePlayer1').text(parseInt($('#scorePlayer1').text()) + 1);
          this.reset();
        } else if (this.tokens.indexOf(winner) === 1) {
          $('#scorePlayer2').text(parseInt($('#scorePlayer2').text()) + 1);
          this.reset();
        }
      }
    },

    reset: function() {
      window.setTimeout(() => {
        $('div[data-box-row]').remove();
        boardGui.createResizeBoard(4,4,this.tokens,3);
      }, 2000);
    }

  };

  //boardGui.createBoard(8,8,['X', 'O'],4);
  boardGui.startGame();
});
