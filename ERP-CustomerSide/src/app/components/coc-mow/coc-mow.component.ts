import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { vesselModel } from '../../models/vesselModel';
import { boUserService } from '../../service/backOfficeUser.service';

@Component({
  selector: 'app-coc-mow',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './coc-mow.component.html',
  styleUrls: ['./coc-mow.component.css']
})
export class CocMowComponent implements OnInit {
  vesselData = {compNo: 0, vesselName: '', description: '', tasks: 0, openedDate: '',status: 0, docNo: ''}
  compNo: number = 0;

  constructor(
    private userService: boUserService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      console.log('Current User:', user); // Log the user object
      if (user) {
        this.userService.getVessels().subscribe({
          next: (response: vesselModel) => {
            if (response) {
              this.vesselData = response; // Correctly assign the array
            }
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      }
    });
  }
}
