$(document).ready(function() {
  let player = false;
  let boardArray = null;

  const createBoard = function(width, height) {
    boardArray = new Array(height).fill('').map(() => new Array(width).fill(''));
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
          player ? $(this).text('X') : $(this).text('0');
          boardArray[i][j] = $(this).text();
          console.log(boardArray);
          player = !player;
        });
        $('#board').append($boardBox);
      }
    }
  };

  const checkResult = function() {
    
  };


  createBoard(3, 3);
  $(window).resize(function() {
    $('div[data-box-row]').remove();
    createBoard(3, 3);
  });


});
