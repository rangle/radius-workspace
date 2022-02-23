import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  @Input() movies: {
    image: string
    title: string
    starRating: string
    rating: string
    year: string
    genre: string
    runtime: string
    cast: string
  }[] = [{
    image: 'https://tailwindcss.com/_next/static/media/prognosis-negative.a3c55fb717747ce6804f7375a2147a76.jpg',
    title: 'Prognosis Negative',
    starRating: '2.66',
    rating: 'PG-13',
    year: '2021',
    genre: 'Comedy',
    runtime: '1h 46m',
    cast: 'Simon Pegg, Zach Galifianakis'
  }, {
    image: 'https://tailwindcss.com/_next/static/media/rochelle-rochelle.3dafce5e8fef150b65e158fc34a74769.jpg',
    title: 'Rochelle, Rochelle',
    starRating: '3.25',
    rating: 'R',
    year: '2021',
    genre: 'Romance',
    runtime: '1h 46m',
    cast: 'Emilia Clarke'
  }, {
    image: 'https://tailwindcss.com/_next/static/media/death-blow.8f06f1c002165401a49a4c6ec95e6500.jpg',
    title: 'Death Blow',
    starRating: '4.95',
    rating: '18A',
    year: '2020',
    genre: 'Action',
    runtime: '2h 46m',
    cast: 'Idris Elba, John Cena, Thandiwe Newton'
  }]

}
