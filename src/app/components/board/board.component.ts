import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CommonModule]
})
export class BoardComponent {
  squares: (string | null)[] = Array(9).fill(null);
  currentPlayer: string = 'X';
  winner: string | null = null;
  winningCombo: number[] = [];

  makeMove(index: number): void {
    if (this.squares[index] || this.winner) {
      return;
    }

    this.squares[index] = this.currentPlayer;
    this.checkWinner();

    if (!this.winner) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(): void {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const [a, b, c] of winPatterns) {
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        this.winner = this.squares[a];
        this.winningCombo = [a, b, c];
        return;
      }
    }

    // Check for draw
    if (this.squares.every(cell => cell !== null)) {
      this.winner = 'Draw';
    }
  }

  restartGame(): void {
    this.squares = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.winningCombo = [];
  }
}
