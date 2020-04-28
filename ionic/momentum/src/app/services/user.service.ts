import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getUser(uid: string) {
    return this.afs.collection('users', ref => ref
      .where('id', '==', uid))
      .valueChanges();
  }

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

  async usernameExists(username: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const user = await this.afs.doc(`users/${username}`).get().toPromise().then((doc) => doc.exists);

      if (user) {
        reject(new Error('Username is already taken.'));
      } else {
        resolve(true);
      }
    });
  }
}
