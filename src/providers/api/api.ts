import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(private afs: AngularFirestore) {    
  }

  //::::::::::::::::::::::::::::::::::::::::::::::::: USER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
  createUser(id,data){
    return this.afs.doc('users/'+id).set(data);
  }

  getUserById(id){
    return this.afs.doc('users/'+id).valueChanges();
  }

  updateUser(id,data){
    return this.afs.doc('users/'+id).update(data);
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::: Feautured Songs ::::::::::::::::::::::::::::::::::::::::::

  getFeaturedSongs(){
    return this.afs.collection('featured').snapshotChanges();
  }

}
