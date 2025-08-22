import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CommonModule]
})
export class BoardComponent implements OnInit {
  squares: (string | null)[] = Array(9).fill(null);
  currentPlayer: string = 'X';
  winner: string | null = null;
  winningCombo: number[] = [];
  mode: 'computer' | 'partner' = 'partner'; 

  constructor(private route: ActivatedRoute,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'partner';
    });
  }

  makeMove(index: number): void {
    if (this.squares[index] || this.winner) return;

    this.squares[index] = this.currentPlayer;
    this.checkWinner();

    if (!this.winner) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

      // If vs Computer and it's AI's turn
      if (this.mode === 'computer' && this.currentPlayer === 'O') {
        this.makeComputerMove();
      }
    }
  }

  makeComputerMove(): void {
    const bestMove = this.findBestMove(this.squares);
    if (bestMove !== -1) {
      setTimeout(() => {
        this.squares[bestMove] = 'O';
        this.checkWinner();
        if (!this.winner) {
          this.currentPlayer = 'X';
        }
      }, 500); // delay for natural feel
    }
  }

  // ---------------- SMART AI ----------------
  findBestMove(board: (string | null)[]): number {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = this.minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  minimax(board: (string | null)[], depth: number, isMaximizing: boolean): number {
    const winner = this.evaluateBoard(board);
    if (winner !== null) {
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
      if (winner === 'Draw') return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          let score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          let score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  evaluateBoard(board: (string | null)[]): string | null {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) return 'Draw';
    return null;
  }

  // ---------------- Original Logic ----------------
  checkWinner(): void {
    const result = this.evaluateBoard(this.squares);
    if (result && result !== 'Draw') {
      this.winner = result;
      this.winningCombo = this.getWinningCombo(this.squares);
    } else if (result === 'Draw') {
      this.winner = 'Draw';
    }
  }

  getWinningCombo(board: (string | null)[]): number[] {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }
    return [];
  }

  restartGame(): void {
    this.squares = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.winningCombo = [];
  }
  goBack() {
  this.router.navigate(['/home']);
}
}
