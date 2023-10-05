import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})

export class ProfileViewComponent implements OnInit {

  user: any = {};
  updatedUser: any = {};
  movies: any[] = [];
  favoriteMoviesByTitle: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.getUserInfo();

    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      this.user = JSON.parse(localStorage.getItem("user")!);

      console.log(this.user);

      this.generateFavoritesList();
    } else {
      this.router.navigate(["welcome"])
    }
  }

  generateFavoritesList(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const movies = resp;
      movies.forEach((movie: any) => {
        if (this.user.favoriteMovies.includes(movie._id)) {
          this.favoriteMoviesByTitle.push(movie.title);
        }
      });
    });
  }

  getUserInfo(): void {
    this.fetchApiData.getOneUser().subscribe((resp: any) => {
      this.user = resp;
      return this.user;
    });
  }

  // updateUser(): void {
  //   this.fetchApiData.editUser(this.updatedUser).subscribe(
  //     (resp: any) => {
  //       this.snackBar.open('User updated successfully!', 'OK', {
  //         duration: 3000,
  //       });
  //       localStorage.setItem('user', JSON.stringify(resp));
  //     },
  //     (result) => {
  //       // Logic for an unsuccessful user update
  //       this.snackBar.open(result, 'OK', {
  //         duration: 3000,
  //       });
  //     }
  //   );
  // }

  openUserUpdateDialog(): void {
    this.dialog.open(UpdateUserComponent, {
      width: "280px",
    });
  }

  // deleteUser(): void {
  //   this.fetchApiData.deleteUser().subscribe((result) => {
  //     localStorage.clear();
  //     this.router.navigate(['welcome']);
  //     this.snackBar.open('User successfully deleted', 'OK', {
  //       duration: 2000
  //     });
  //   }, (result) => {
  //     this.snackBar.open(result, 'OK', {
  //       duration: 2000
  //     });
  //   });
  // }

  openDeleteUserDialog(): void {
    this.dialog.open(DeleteUserComponent, {
      width: "280px",
    });
  }

}