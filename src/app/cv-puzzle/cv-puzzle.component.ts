import { Component, OnInit, HostListener } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  bgPosition: string;
}

@Component({
  selector: 'app-cv-puzzle',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink],
  templateUrl: './cv-puzzle.component.html',
  styleUrl: './cv-puzzle.component.css'
})
export class CvPuzzleComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  // Configuration du puzzle
  rows: number = 3;
  columns: number = 3;

  // Propriétés du puzzle
  pieces: PuzzlePiece[] = [];
  isCompleted: boolean = false;

  // URL de l'image du CV (remplacer par votre URL)
  cvImageUrl: string = 'images/cv-kawtar.jpg';

  // Variables pour le drag and drop
  draggedPiece: PuzzlePiece | null = null;
  dropTarget: number | null = null;

  cvId: number = 1;

  // Obtenir une pièce par position
  getPieceAtPosition(position: number): PuzzlePiece | undefined {
    return this.pieces.find(piece => piece.currentPosition === position);
  }

  // Calcule si le puzzle est complété
  checkCompletionStatus(): void {
    this.isCompleted = this.pieces.every(piece => piece.currentPosition === piece.correctPosition);
  }

  // Mélange le puzzle aléatoirement
  shufflePuzzle(): void {
    const positions = Array.from({ length: this.rows * this.columns }, (_, i) => i);
    this.shuffleArray(positions);

    this.pieces.forEach((piece, index) => {
      piece.currentPosition = positions[index];
    });

    this.isCompleted = false;
  }

  // Algorithme Fisher-Yates pour mélanger un tableau
  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Initialise le puzzle
  initializePuzzle(): void {
    this.pieces = [];
    const totalPieces = this.rows * this.columns;

    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / this.columns);
      const col = i % this.columns;

      this.pieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        bgPosition: `-${col * 100}px -${row * 100}px`
      });
    }

    // Mélanger les pièces au démarrage
    this.shufflePuzzle();
  }

  ngOnInit(): void {
    const cvId = this.route.snapshot.params['id'];
    this.cvId = cvId;

    if (cvId == 1) {
      this.cvImageUrl = 'images/cv-kawtar.jpg';
    } else if (cvId == 2) {
      this.cvImageUrl = 'images/cv-colin.jpg';      
    } else if (cvId == 3) {
      this.cvImageUrl = 'images/cv-koffi.jpg';      
    } else {
      this.cvImageUrl = 'images/cv-kawtar.jpg';
    }

    this.initializePuzzle();
  }

  // Gestionnaires d'événements HTML5 Drag and Drop
  onDragStart(event: DragEvent, piece: PuzzlePiece): void {
    if (!event.dataTransfer) return;

    this.draggedPiece = piece;
    event.dataTransfer.setData('text/plain', piece.id.toString());

    // Rendre l'image de drag plus petite
    if (event.dataTransfer.setDragImage) {
      const dragImage = new Image();
      dragImage.src = this.cvImageUrl;
      event.dataTransfer.setDragImage(dragImage, 50, 50);
    }
  }

  onDragOver(event: DragEvent, position: number): void {
    event.preventDefault();
    this.dropTarget = position;
  }

  onDragLeave(): void {
    this.dropTarget = null;
  }

  onDrop(event: DragEvent, targetPosition: number): void {
    event.preventDefault();

    if (!this.draggedPiece) return;

    // Trouver la pièce à la position cible (s'il y en a une)
    const targetPiece = this.getPieceAtPosition(targetPosition);

    if (targetPiece) {
      // Échanger les positions
      const tempPosition = this.draggedPiece.currentPosition;
      this.draggedPiece.currentPosition = targetPosition;
      targetPiece.currentPosition = tempPosition;
    } else {
      // Déplacer vers une position vide
      this.draggedPiece.currentPosition = targetPosition;
    }

    this.draggedPiece = null;
    this.dropTarget = null;

    // Vérifier si le puzzle est complété
    this.checkCompletionStatus();
  }

  // Méthode pour obtenir la position de grille à partir de la position
  getGridStyle(position: number): { [key: string]: string } {
    const row = Math.floor(position / this.columns);
    const col = position % this.columns;

    return {
      'grid-row': `${row + 1}`,
      'grid-column': `${col + 1}`
    };
  }

  // Méthode pour réinitialiser le puzzle
  resetPuzzle(): void {
    this.shufflePuzzle();
  }

  // Helper pour convertir les positions en identifiants pour trackBy
  trackByFn(index: number, position: number): number {
    return position;
  }
}
