import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { BlankComponent } from '../blank/blank.component';
import { MainSidebarComponent } from '../layouts/main-sidebar/main-sidebar.component';
import { vesselModel } from '../../models/vesselModel';
import { api } from '../../constants';
import { boUserService } from '../../service/backOfficeUser.service';

@Component({
  selector: 'app-coc-mow',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './coc-mow.component.html',
  styleUrls: ['./coc-mow.component.css']
})

export class CocMowComponent implements OnInit {
  constructor(private vessels: vesselModel,
              private userService: boUserService
  ) {}

  
  vesselModel: string[] = [];

  ngOnInit(): void {
    this.userService.getVessels().subscribe(
      (response: vesselModel) => { 
        for (const vesselName of response.vesselName) {
          this.vesselModel.push(vesselName);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}

