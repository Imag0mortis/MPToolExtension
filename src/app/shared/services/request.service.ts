import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient) {}

  public loginRequest(mail: string, password: string) {
    return this.http.post(environment.siteUrl + '/api/login.php', {
      mail: mail,
      password: password
    });
  }

  // получение данных о продажах/остатках 

  public postReleaseData(sku:string) {
    return this.http.post(environment.siteUrl + 'api/extension/wb/product.php', {
      sku: sku,
    });
  }

  // получение данных о позиции по запросу
  
  public postCatgalogPositionData(sku:string) {
    return this.http.post(environment.siteUrl + 'api/extension/wb/queryPosition.php', {
      sku: sku,
    });
  }

  // получение данных о позиции в каталоге

  public postRealPositionData(sku:string) {
    return this.http.post(environment.siteUrl + 'api/extension/wb/catalogPosition.php', {
      sku: sku,
    });
  }

}
