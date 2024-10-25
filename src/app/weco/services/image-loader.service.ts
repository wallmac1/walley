import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageLoaderService {

  private imageCache: { [key: string]: SafeUrl } = {}; // Cache per gli URL delle immagini

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  // Metodo per ottenere l'immagine con autenticazione e caching
  getImageWithToken(imageUrl: string): Observable<SafeUrl> {
    // Controlla se l'URL dell'immagine è già in cache
    if (this.imageCache[imageUrl]) {
      return of(this.imageCache[imageUrl]); // Restituisce l'URL sicuro dalla cache
    }

    // Se non è in cache, esegui la richiesta HTTP
    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
      map((blob) => {
        const objectURL = URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.imageCache[imageUrl] = safeUrl; // Memorizza l'URL sicuro nella cache
        return safeUrl;
      }),
      catchError((error) => {
        console.error('Errore nel caricamento dell\'immagine:', error);
        return of(''); // Restituisce un valore vuoto in caso di errore
      })
    );
  }
}
