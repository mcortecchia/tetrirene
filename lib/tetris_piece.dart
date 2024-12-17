import 'dart:math';

class TetrisPiece {
  List<List<int>> shape;
  int color;

  TetrisPiece(this.shape, this.color);

  void rotate() {
    final newShape = List.generate(shape[0].length, (_) => List.generate(shape.length, (_) => 0));
    for (int i = 0; i < shape.length; i++) {
      for (int j = 0; j < shape[i].length; j++) {
        newShape[j][shape.length - 1 - i] = shape[i][j];
      }
    }
    shape = newShape;
  }

  bool canMove(List<List<int>> board, int newX, int newY) {
    for (int i = 0; i < shape.length; i++) {
      for (int j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 1) {
          final x = newX + j;
          final y = newY + i;
          if (x < 0 || x >= board[0].length || y < 0 || y >= board.length || board[y][x] == 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  void move(List<List<int>> board, int newX, int newY) {
    if (canMove(board, newX, newY)) {
      for (int i = 0; i < shape.length; i++) {
        for (int j = 0; j < shape[i].length; j++) {
          if (shape[i][j] == 1) {
            board[newY + i][newX + j] = 1;
          }
        }
      }
    }
  }

  static List<TetrisPiece> getPieces() {
    return [
      TetrisPiece([
        [1, 1, 1, 1]
      ], Colors.cyan.value),
      TetrisPiece([
        [1, 1],
        [1, 1]
      ], Colors.yellow.value),
      TetrisPiece([
        [0, 1, 0],
        [1, 1, 1]
      ], Colors.purple.value),
      TetrisPiece([
        [1, 1, 0],
        [0, 1, 1]
      ], Colors.green.value),
      TetrisPiece([
        [0, 1, 1],
        [1, 1, 0]
      ], Colors.red.value),
      TetrisPiece([
        [1, 0, 0],
        [1, 1, 1]
      ], Colors.blue.value),
      TetrisPiece([
        [0, 0, 1],
        [1, 1, 1]
      ], Colors.orange.value),
    ];
  }
}
