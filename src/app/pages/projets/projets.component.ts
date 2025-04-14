import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  standalone: true,
  styleUrls: ['./projets.component.css'] // ou scss si tu l’utilises
})
export class ProjetsComponent implements OnInit {
  projectId: number = 1;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
  }
}
