import { Component } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'hidden-innovation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'optimal-human';

  user$: Observable<{userData: string}> = this.storage.watch('user') as Observable<{ userData: string }>;

  constructor(private storage: StorageMap) {

    this.storage.set('user', {
      'userData': 'Old User Data'
    }).subscribe((res) => console.log(res));
  }

  updateUserData() {
    this.storage.set('user', {
      'userData': 'New User Data'
    }).subscribe((res) => console.log(res));
  }
}
