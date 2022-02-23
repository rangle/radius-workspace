import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

  @Input() movie!: {
    image: string
    title: string
    starRating: string
    rating: string
    year: string
    genre: string
    runtime: string
    cast: string
  }
}
