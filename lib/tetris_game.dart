import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class TetrisGame extends StatefulWidget {
  @override
  _TetrisGameState createState() => _TetrisGameState();
}

class _TetrisGameState extends State<TetrisGame> with SingleTickerProviderStateMixin {
  Ticker _ticker;
  Duration _lastTick;
  List<List<int>> _board;
  List<List<int>> _currentPiece;
  int _currentPieceX;
  int _currentPieceY;
  bool _isGameOver;

  @override
  void initState() {
    super.initState();
    _ticker = this.createTicker(_onTick);
    _resetGame();
    _ticker.start();
  }

  void _resetGame() {
    _board = List.generate(20, (_) => List.generate(10, (_) => 0));
    _currentPiece = _generateRandomPiece();
    _currentPieceX = 3;
    _currentPieceY = 0;
    _isGameOver = false;
  }

  List<List<int>> _generateRandomPiece() {
    final pieces = [
      [
        [1, 1, 1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ],
      [
        [0, 1, 0],
        [1, 1, 1]
      ],
      [
        [1, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 1, 1],
        [1, 1, 0]
      ],
      [
        [1, 0, 0],
        [1, 1, 1]
      ],
      [
        [0, 0, 1],
        [1, 1, 1]
      ],
    ];
    return pieces[Random().nextInt(pieces.length)];
  }

  void _onTick(Duration elapsed) {
    if (_lastTick == null) {
      _lastTick = elapsed;
      return;
    }

    final delta = elapsed - _lastTick;
    if (delta.inMilliseconds >= 500) {
      setState(() {
        _movePieceDown();
      });
      _lastTick = elapsed;
    }
  }

  void _movePieceDown() {
    if (_isGameOver) return;

    if (_canMovePiece(_currentPieceX, _currentPieceY + 1)) {
      _currentPieceY++;
    } else {
      _placePiece();
      _clearFullLines();
      _currentPiece = _generateRandomPiece();
      _currentPieceX = 3;
      _currentPieceY = 0;
      if (!_canMovePiece(_currentPieceX, _currentPieceY)) {
        _isGameOver = true;
        _ticker.stop();
      }
    }
  }

  bool _canMovePiece(int x, int y) {
    for (int i = 0; i < _currentPiece.length; i++) {
      for (int j = 0; j < _currentPiece[i].length; j++) {
        if (_currentPiece[i][j] == 1) {
          final newX = x + j;
          final newY = y + i;
          if (newX < 0 || newX >= 10 || newY >= 20 || _board[newY][newX] == 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  void _placePiece() {
    for (int i = 0; i < _currentPiece.length; i++) {
      for (int j = 0; j < _currentPiece[i].length; j++) {
        if (_currentPiece[i][j] == 1) {
          _board[_currentPieceY + i][_currentPieceX + j] = 1;
        }
      }
    }
  }

  void _clearFullLines() {
    _board.removeWhere((row) => row.every((cell) => cell == 1));
    while (_board.length < 20) {
      _board.insert(0, List.generate(10, (_) => 0));
    }
  }

  void _rotatePiece() {
    final newPiece = List.generate(_currentPiece[0].length, (_) => List.generate(_currentPiece.length, (_) => 0));
    for (int i = 0; i < _currentPiece.length; i++) {
      for (int j = 0; j < _currentPiece[i].length; j++) {
        newPiece[j][_currentPiece.length - 1 - i] = _currentPiece[i][j];
      }
    }
    if (_canMovePiece(_currentPieceX, _currentPieceY)) {
      _currentPiece = newPiece;
    }
  }

  void _movePieceLeft() {
    if (_canMovePiece(_currentPieceX - 1, _currentPieceY)) {
      setState(() {
        _currentPieceX--;
      });
    }
  }

  void _movePieceRight() {
    if (_canMovePiece(_currentPieceX + 1, _currentPieceY)) {
      setState(() {
        _currentPieceX++;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tetris'),
      ),
      body: GestureDetector(
        onHorizontalDragUpdate: (details) {
          if (details.primaryDelta > 0) {
            _movePieceRight();
          } else if (details.primaryDelta < 0) {
            _movePieceLeft();
          }
        },
        onVerticalDragUpdate: (details) {
          if (details.primaryDelta > 0) {
            _movePieceDown();
          }
        },
        onTap: _rotatePiece,
        child: CustomPaint(
          size: Size(double.infinity, double.infinity),
          painter: _TetrisPainter(_board, _currentPiece, _currentPieceX, _currentPieceY),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }
}

class _TetrisPainter extends CustomPainter {
  final List<List<int>> board;
  final List<List<int>> currentPiece;
  final int currentPieceX;
  final int currentPieceY;

  _TetrisPainter(this.board, this.currentPiece, this.currentPieceX, this.currentPieceY);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.blue;
    final blockSize = size.width / 10;

    for (int y = 0; y < board.length; y++) {
      for (int x = 0; x < board[y].length; x++) {
        if (board[y][x] == 1) {
          canvas.drawRect(
            Rect.fromLTWH(x * blockSize, y * blockSize, blockSize, blockSize),
            paint,
          );
        }
      }
    }

    for (int y = 0; y < currentPiece.length; y++) {
      for (int x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x] == 1) {
          canvas.drawRect(
            Rect.fromLTWH((currentPieceX + x) * blockSize, (currentPieceY + y) * blockSize, blockSize, blockSize),
            paint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
