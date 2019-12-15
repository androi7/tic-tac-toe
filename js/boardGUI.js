$(document).ready(function() {
  boardGui = {
    player: true, // true => player1, false = player2
    boardWidth: function() {
      if ($(window).width() < 660) { // responsive design
        return Math.floor($(window).width()*0.7);
      }
      return Math.floor($(window).width()*0.3); // 30% of screen
    },
    boxWidth: function(width) {
      return Math.floor(this.boardWidth()/width);
    },
    // default settings
    resizeStateBefore: [],
    resizeCounter: 0,
    width: 3,
    height: 3,
    symbolAmount: 3,
    rounds: 1,
    tokens: ['X', 'O'],
    players: {
      player1: {
        name: '',
        playerScore: 0,
        token: 'X'
      },
      player2: {
        name: '',
        playerScore: 0,
        token: 'O'
      }
    },


    /*createOnlineGame: function() {
      this.tokens = this.tokens[0] === $('#tokenSelection').val() ? this.tokens : this.tokens.reverse();
      const player = this.players.player1;
      player.name = $('#setPlayer1').val() || 'Player1';
      player.token = this.tokens[0];
      this.symbolAmount = parseInt($('#symbols').val());
      this.rounds = parseInt($('#rounds').val());

      // send to database
      fireBase.writeData('/game', {
        player: true,
        symbolAmount: this.symbolAmount,
        rounds: this.rounds,
        player1: {
          name: player.name,
          playerScore: player.playerScore,
          token: player.token
        }
      });
    },

    joinOnlineGame: function() {
      const initialState = fireBase.readData('/game');
      initialState.then(player1 => { // binding of this
        console.log('promise',player1)
        console.log(player1.player1);
        console.log(player1.player1.name);
        this.symbolAmount = player1.symbolAmount;
        this.player = player1.player;
        this.rounds = player1.rounds;
        this.players.player1.name = player1.player1.name;
        this.players.player1.token = player1.player1.token;
        this.players.player1.playerScore = player1.player1.playerScore;
      });

      const player = this.players.player2;
      player.name = $('#setPlayer2').val() || 'Player2';
      player.token = this.tokens[1];

      fireBase.writeData('/game/player2', {
          name: player.name,
          token: player.token,
          playerScore: 0
      });

    },*/

    startGame: function() {
      $('#start').on('click', () => { // arrow function due to this
        // get values from settings
        this.width = parseInt($('#boardWidth').val());
        this.height = parseInt($('#boardHeight').val());

        if ($('#offline').prop('checked')) {
          console.log('offline');
          this.tokens = this.tokens[0] === $('#tokenSelection').val() ? this.tokens : this.tokens.reverse();
          this.players.player1.token = this.tokens[0];
          this.players.player2.token = this.tokens[1];
          this.players.player1.name = $('#setPlayer1').val() || 'Player1';
          this.players.player2.name = $('#setPlayer2').val() || 'Player2';

          this.rounds = parseInt($('#rounds').val());
          this.symbolAmount = parseInt($('#symbols').val()); // how many symbols have to be in a row
        }
        else if ($('#create').prop('checked')) {
          console.log('create');
          this.createOnlineGame();
        } else {
          console.log('join');
          this.joinOnlineGame();
        }


        $('.settings').hide();
        // display from none to flex then hide for using fadeIn
        $('#board').css('display', 'flex');
        $('#board').hide();

        // same css trick like for diplay flex
        $('#scoreField').css('display', 'grid');
        $('#player1').text(this.players.player1.name);
        $('#player2').text(this.players.player2.name);
        $('#player1').addClass('redFont');
        $('#scoreField').hide();

        //this.createBoard();
        this.createResizeBoard();

        $('#scoreField').fadeIn(1000);
        $('#board').fadeIn(1000);
      });
    },

    createBoard: function() { // width, height, tokens, checkAmount
      // to add CSS classes
      //const self = this;
      boardLogic.createCheckArray(this.width, this.height);

      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          const $boardBox = $('<div class="boardBox">').css({
            'flex': `1 1 ${this.boxWidth(this.width)}px`, // (grow, shrink, basis)
            'height': `${this.boxWidth(this.width)}px`,
            'line-height': `${this.boxWidth(this.width)}px`,
            'font-size': `${this.boxWidth(this.width)/1.5}px`
          }).attr({
            'data-box-row': i,
            'data-box-col': j
          });
          $('#board').append($boardBox);
        }
      }

      this.clickBoard();
      this.addBoxCSSClasses();
    },

    clickBoard: function() {
      const self = this;
      $('.boardBox').on('click', function() {
         if ($(this).text() !== '') { // new created divs are empty, not occupied by a token
           return;
         }
         // player: true -> player1, player: false -> player2
         const token = self.player ? self.tokens[0] : self.tokens[1];
         // add token to particular field
         $(this).text(token.toString());
         // i: height/row, j: width/col
         const row = $(this).data('box-row');
         const col = $(this).data('box-col');
         boardLogic.addToken(row, col, token); // add token to check array
         const [a, b, winnerToken, sort] = boardLogic.checkResult(row, col, token, self.symbolAmount);
         //console.log(a, b, winnerToken, sort);
         self.showSequence(a, b, self.symbolAmount, sort);

         self.updateScore(winnerToken);

         self.player = !self.player;
         $('#player1').toggleClass('redFont');
         $('#player2').toggleClass('redFont');

      });
    },

    createResizeBoard: function() {
      this.createBoard();
      $(window).resize(() => { // arrow function to bind this
        $('div[data-box-row]').remove();
        this.resizeCounter++;
        if (this.resizeCounter === 1) {
          this.resizeStateBefore = boardLogic.boardArray;
        }
        this.createBoard();
        this.saveState();
      });
    },

    saveState: function() {
      // get old data from boarLogic and add to new board divs
      for (let i = 0; i < boardLogic.boardArray.length; i++) {
        for (let j = 0; j < boardLogic.boardArray[i].length; j++) {
          $(`[data-box-row=${i}][data-box-col=${j}]`).text(this.resizeStateBefore[i][j].trim());
          // boardLogic array has whitespace which needs to be deleted
        }
      }
      // resize event invokes several time, copied array will be deleted at the last invoke
      if ($('.boardBox').text().match(/[XO]/)) {
        boardLogic.boardArray = this.resizeStateBefore; // boardLogic Array got lost during resizing
        this.resizeStateBefore = [];
        this.resizeCounter = 0;
      }
    },

    showSequence: function(row, col, amount, sort) {
      if (sort === 'h') {
        for (let i = 0; i < amount; i++) {
          $(`[data-box-row=${row}][data-box-col=${col+i}]`).addClass('redFont');
        }
      } else if (sort === 'v') {
        for (let i = 0; i < amount; i++) {
          $(`[data-box-row=${row+i}][data-box-col=${col}]`).addClass('redFont');
        }
      } else if (sort === 'dl') {
        for (let i = 0; i < amount; i++) {
          $(`[data-box-row=${row+i}][data-box-col=${col+i}]`).addClass('redFont');
        }
      } else if (sort === 'dr') {
        for (let i = 0; i < amount; i++) {
          $(`[data-box-row=${row+i}][data-box-col=${col-i}]`).addClass('redFont');
        }
      }
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
        if (this.tokens.indexOf(winner) === 0) {
          this.players.player1.playerScore++;
          $('#scorePlayer1').text(this.players.player1.playerScore);
          const won = this.checkWinner(this.players.player1);
          this.reset(won);
        } else if (this.tokens.indexOf(winner) === 1) {
          this.players.player2.playerScore++;
          $('#scorePlayer2').text(this.players.player2.playerScore);
          const won = this.checkWinner(this.players.player2);
          this.reset(won);
        } else if (winner === 'draw') {
          this.reset();
        }
      }
    },

    checkWinner: function(player) {
      if (player.playerScore === this.rounds) {
        $('#winner').text(player.name);
        $('.winnerField').css('display', 'block');
        this.playAgain();
        return true;
      } else {
        return false;
      }
    },

    playAgain: function() {
      const self = this;
      $('.winnerField button').on('click', function() {
        $(window).off('resize');
        $('.winnerField').css('display', 'none');
        $('#scoreField').fadeOut(1000);
        $('#board').fadeOut(1000, function() {
          // reset states
          self.players.player1.playerScore = 0;
          self.players.player2.playerScore = 0;
          self.player = true;
          boardLogic.reset();
          $('#scorePlayer1').text(self.players.player1.playerScore);
          $('#scorePlayer2').text(self.players.player2.playerScore);
          $('#player1').removeClass('redFont');
          $('#player2').removeClass('redFont');
          $('div[data-box-row]').remove();
          $('.settings').show();
        });
      })
    },

    reset: function(bool) {
      if (!bool) {
        window.setTimeout(() => {
          $('div[data-box-row]').remove();
          boardGui.createResizeBoard();
        }, 2000);
      }
    }

  };

  boardGui.startGame();
});
