import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(""),
    superhero: new FormControl<string>("", { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(""),
    first_appearance: new FormControl(""),
    characters: new FormControl(""),
    alt_img: new FormControl(""),
  });


  public publishers = [
    { id: "DC Comics", desc: "DC- Comics" },
    { id: "Marvel Comics", desc: "Marvel - Comics" },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes("edit")) return;

    this.activatedRoute.params
      .pipe(
        switchMap(params => this.heroesService.getHeroById(params["id"])),
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl("/");
        this.heroForm.reset(hero);
        return;
      })
  }

  get CurrentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit() {

    if (this.heroForm.invalid) return;
    if (this.CurrentHero.id) {
      this.heroesService.updateHero(this.CurrentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`)
        });

      return;
    }

    this.heroesService.addHero(this.CurrentHero)
      .subscribe(hero => {
        this.router.navigate(["/heroes/edit", hero.id]);
        this.showSnackbar(`${hero.superhero} created!`);
      })

  }

  onDeleteHero() {
    if (!this.CurrentHero.id) throw Error("Hero id is required");

    const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter(result => result == true),
        switchMap(() => this.heroesService.deleteHeroById(this.CurrentHero.id),
        )
      ).subscribe(wasDeleted => {
        if (wasDeleted)
          this.router.navigate(["/heroes"]);
      });
  }


  showSnackbar(message: string): void {
    this.snackbar.open(message, "done", {
      duration: 2500,
    });
  }


}
