import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  createUser(user: any) {
    return this.afs.doc(`users/${user.username}`).set(user);
  }

  searchUsers(username: string) {
    return this.afs.collection('users', ref => ref
      .where('username', '>=', username)
      .where('username', '<=', username + '\uf8ff')
      .limit(10)
      .orderBy('username'))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        return a.payload.doc.data();
      }))
    );
  }

  usernameExists(username: string): Promise<boolean> {
    return this.afs.doc(`users/${username}`).get().pipe(
      map(doc => {
        return doc.exists;
      })
    ).toPromise();
  }
}
