import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadFile(
    path: string,
    fileName: string,
    file: File
  ): AngularFireUploadTask {
    const finalPath = `${path}/${fileName}`;
    const fileRef = this.storage.ref(finalPath);
    const task = this.storage.upload(finalPath, file);
    // task.snapshotChanges().pipe(finalize(_ => fileRef.getDownloadURL()));
    return;
  }
}
