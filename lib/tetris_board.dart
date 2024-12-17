import 'package:flutter/material.dart';
import 'tetris_piece.dart';

class TetrisBoard {
  final int width;
  final int height;
  List<List<int>> _grid;
  TetrisPiece _currentPiece;
  int _currentPieceX;
  int _currentPieceY;

  TetrisBoard({this.width = 10, this.height = 20}) {
    _grid = List.generate(height, (_) => List.generate(width, (_) => 0));
    _spawnPiece();
  }

  void _spawnPiece() {
    _currentPiece = TetrisPiece.getPieces()[Random().nextInt(TetrisPiece.getPieces().length)];
    _currentPieceX = (width / 2 - _currentPiece.shape[0].length / 2).floor();
    _currentPieceY = 0;
  }

  bool _canMovePiece(int newX, int newY) {
    for (int i = 0; i < _currentPiece.shape.length; i++) {
      for (int j = 0; j < _currentPiece.shape[i].length; j++) {
        if (_currentPiece.shape[i][j] == 1) {
          final x = newX + j;
          final y = newY + i;
          if (x < 0 || x >= width || y < 0 || y >= height || _grid[y][x] == 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  void movePieceDown() {
    if (_canMovePiece(_currentPieceX, _currentPieceY + 1)) {
      _currentPieceY++;
    } else {
      _placePiece();
      _clearFullLines();
      _spawnPiece();
    }
  }

  void movePieceLeft() {
    if (_canMovePiece(_currentPieceX - 1, _currentPieceY)) {
      _currentPieceX--;
    }
  }

  void movePieceRight() {
    if (_canMovePiece(_currentPieceX + 1, _currentPieceY)) {
      _currentPieceX++;
    }
  }

  void rotatePiece() {
    final newShape = List.generate(_currentPiece.shape[0].length, (_) => List.generate(_currentPiece.shape.length, (_) => 0));
    for (int i = 0; i < _currentPiece.shape.length; i++) {
      for (int j = 0; j < _currentPiece.shape[i].length; j++) {
        newShape[j][_currentPiece.shape.length - 1 - i] = _currentPiece.shape[i][j];
      }
    }
    if (_canMovePiece(_currentPieceX, _currentPieceY)) {
      _currentPiece.shape = newShape;
    }
  }

  void _placePiece() {
    for (int i = 0; i < _currentPiece.shape.length; i++) {
      for (int j = 0; j < _currentPiece.shape[i].length; j++) {
        if (_currentPiece.shape[i][j] == 1) {
          _grid[_currentPieceY + i][_currentPieceX + j] = 1;
        }
      }
    }
  }

  void _clearFullLines() {
    _grid.removeWhere((row) => row.every((cell) => cell == 1));
    while (_grid.length < height) {
      _grid.insert(0, List.generate(width, (_) => 0));
    }
  }

  List<List<int>> get grid => _grid;
  TetrisPiece get currentPiece => _currentPiece;
  int get currentPieceX => _currentPieceX;
  int get currentPieceY => _currentPieceY;
}
