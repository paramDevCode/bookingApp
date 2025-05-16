// upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UploadResponse {
  files: { path: string, filename: string }[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadUrl = 'http://localhost:5000/api/upload-images'; // ✅ Correct URL

  constructor(private http: HttpClient) {}

  uploadImages(files: File[]): Observable<UploadResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file)); // ✅ Key must match 'images'

    return this.http.post<UploadResponse>(this.uploadUrl, formData);
  }

  deleteImage(filename: string): Observable<any> {
  return this.http.delete(`http://localhost:5000/api/delete-image/${filename}`);
}

}
