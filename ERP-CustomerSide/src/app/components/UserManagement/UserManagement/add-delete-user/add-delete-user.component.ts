import { Component, OnInit } from '@angular/core';
import { userInfoService } from '../service/userInfo.service';



@Component({
  selector: 'app-add-delete-user',
  templateUrl: './add-delete-user.component.html',
  styleUrls: ['./add-delete-user.component.css']
})
export class AddDeleteUserComponent implements OnInit {
  users: any[] = [];
  newUser = { username: '', email: '' };

  constructor(private userInfoService: userInfoService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userInfoService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  onSubmit(): void {
    this.userInfoService.addUser(this.newUser).subscribe(user => {
      this.users.push(user);
      this.newUser = { username: '', email: '' };  // Yeni kullanıcı için alanları temizleyin
    });
  }

  onDelete(user: any): void {
    this.userInfoService.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter(u => u !== user);
    });
  }
}
