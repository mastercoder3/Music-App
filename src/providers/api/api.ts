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

  getAllUsers(){
    return this.afs.collection('users').valueChanges();
  }

  getAllUsersData(){
    return this.afs.collection('users').snapshotChanges();
  }

  getUserByEmail(email){
    return this.afs.collection('users', ref => ref.where('email','==', email)).valueChanges();
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::: Feautured Songs ::::::::::::::::::::::::::::::::::::::::::

  getFeaturedSongs(){
    return this.afs.collection('featured').snapshotChanges();
  }

  getMostPlayedSongs(){
    return this.afs.collection('songs', ref => ref.orderBy('views', 'desc').limit(10)).snapshotChanges();
  }

  getAllSongs(){
    return this.afs.collection('songs').snapshotChanges();
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::: Playlist ::::::::::::::::::::::::::::::::::::::::::::::::::::::

  getPlaylistById(id){
    return this.afs.collection('playlist', ref => ref.where('uid', '==', id)).snapshotChanges();
  }

  updatePlaylist(id, data){
    return this.afs.doc('playlist/'+id).update(data);
  }

  addToPlaylist(data){
    return this.afs.collection('playlist').add(data);
  }

}
