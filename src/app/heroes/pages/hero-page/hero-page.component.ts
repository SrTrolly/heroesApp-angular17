import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrl: './hero-page.component.css'
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => this.heroesService.getHeroById(params["id"]))
      ).subscribe(heroe => {
        if (!heroe) return this.router.navigate(["/heroes.list"]);
        this.hero = heroe;
        console.log(this.hero);
        return;
      })
  }


  goBack() {
    this.router.navigateByUrl("heroes/list");
  }

}
