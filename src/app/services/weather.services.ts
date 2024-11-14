import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Country {
  name: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
// The countries json was added to dynamically choose countries in the weather API
  private countriesUrl = 'utils/countries.json';
  private apiUrl = 'https://climate-api.open-meteo.com/v1/climate';

  constructor(private http: HttpClient) {}

  // Fetch the list of countries
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl);
  }

  // Fetch weather data for a specific country by latitude and longitude
  getWeatherData(latitude: number, longitude: number): Observable<any> {
    const params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      start_date: '1950-01-01',
      end_date: '2050-12-31',
      models: 'CMCC_CM2_VHR4,FGOALS_f3_H,HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S',
      daily: 'temperature_2m_max'
    };

    return this.http.get<any>(this.apiUrl, { params });
  }
}
