$(document).ready(function() {
  const boardGui = {
    player: false,
    boardWidth: function() {
      return Math.floor($(window).width()*0.4);
    },
    boxWidth: function(width) {
      return Math.floor(this.boardWidth()/width);
    },
    width: 0,
    height: 0,
    player1: '',
    player2: '',
    token1: 'X',
    token2: 'O',
    tokens: [], // default ['X', 'O']

    startGame: function() {

      $('#start').on('click', function() {
        this.player1 = $('#setPlayer1').val() || 'Player1';
        this.player2 = $('#setPlayer2').val() || 'Player2';
        $('#player1').text(this.player1);
        $('#player2').text(this.player2);
        this.tokens = [$('#token1').val(), $('#token1').val() === 'X' ? 'O' : 'X'];
        $('.settings').fadeOut(400);
        $('#board').css('display', 'flex');
        boardGui.createResizeBoard(4,4,this.tokens,3);
        $('#scoreField').fadeIn(400);
        $('#board').fadeIn(400);
      });

    },

    createBoard: function(width, height, tokens, checkAmount = 3) {
      // to add CSS classes
      this.width = width;
      this.height = height;
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


    }
  };

  //boardGui.createBoard(8,8,['X', 'O'],4);
  boardGui.startGame();
});
