$(document).ready(function() {
  let player = false;
  let boardArray = null;

  const createBoard = function(width, height) {
    boardArray = new Array(height).fill(' ').map(() => new Array(width).fill(' '));
    const boardWidth = Math.floor($(document).width()*0.4);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const $boardBox = $('<div></div>').css({
          flex: `1 1 ${Math.floor((boardWidth - 4*width)/width)}px`, // problem with border, box-sizing
          height: `${Math.floor((boardWidth - 4*width)/width)}px`,
          backgroundColor: 'gray',
          border: '2px solid black',
          borderSizing: 'border-box',
          textAlign: 'center',
          lineHeight: `${Math.floor((boardWidth - 4*width)/width)}px`,
          fontSize: `${Math.floor((boardWidth - 4*width)/width)/2}px`
        }).attr({
          'data-box-row': i,
          'data-box-col': j
        });

        $boardBox.on('click', function() {
          if ($(this).text() !== '') {
            return;
          }
          player ? $(this).text('X') : $(this).text('O');
          boardArray[i][j] = $(this).text();
          //console.log(boardArray);
          checkResult();
          player = !player;
        });
        $('#board').append($boardBox);
      }
    }
  };

  const checkResult = function() {
    for (const item of boardArray) {
      if (item.join('').match('[X]{3}')) {
        console.log('X won!');
        $('div').off();
        return;
      } else if (item.join('').match('[O]{3}')) {
        console.log('O won!');
        $('div').off();
        return;
      }
    }
    let boardColumnCopy = [];
    for (let i = 0; i < boardArray.length; i++) {
      for (let j = 0; j < boardArray[i].length; j++) {
        boardColumnCopy[j] += boardArray[i][j];
        if (i === boardArray[i].length - 1) {
          console.log(boardColumnCopy[j]);
          if (boardColumnCopy[j].match('[X]{3}')) {
            console.log('X won!');
            $('div').off();
            return;
          } else if (boardColumnCopy[j]
            .match('[O]{3}')) {
            console.log('O won!');
            $('div').off();
            return;
          } else {
            boardColumnCopy[j] = '';
          }
        }
      }
    }
    for (let i = 1; i < boardArray.length-1; i++) {
      for (let j = 1; j < boardArray[i].length - 1; j++) {
        if (boardArray[i][j] === 'X' && (boardArray[i-1][j-1] === 'X' && boardArray[i+1][j+1] === 'X' || boardArray[i-1][j+1] === 'X' && boardArray[i+1][j-1] === 'X')) {
          console.log('X won!');
          $('div').off();
        } else if (boardArray[i][j] === 'O' && (boardArray[i-1][j-1] === 'O' && boardArray[i+1][j+1] === 'O' || boardArray[i-1][j+1] === 'O' && boardArray[i+1][j-1] === 'O')) {
          console.log('O won!');
          $('div').off();
        }
      }
    }
  };


  createBoard(5, 5);
  $(window).resize(function() {
    $('div[data-box-row]').remove();
    createBoard(5, 5);
  });


});
