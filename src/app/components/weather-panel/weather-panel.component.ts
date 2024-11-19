import { Component, OnInit, signal } from '@angular/core';
import { WeatherService } from '../../services/weather.services';
import countriesData from '../../utils/countries.json';
import { CommonModule } from '@angular/common';

interface Country {
  country: string;
  latitude: number;
  longitude: number;
  alpha2: string;
  alpha3: string;
  numeric: number;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather-panel.component.html',
  styleUrls: ['./weather-panel.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class WeatherComponent implements OnInit {
  countries = countriesData.ref_country_codes;
  selectedCountry = signal<Country[]>([this.countries.find(country => country.country === 'Lebanon') || this.countries[0]]);
  weatherData = signal<any>(null);
  weatherMessage = signal<string>('Loading weather info...');
  weatherImageSrc = signal<string>('');

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const country = this.selectedCountry()[0];
    this.fetchWeatherData(country.latitude, country.longitude);
  }

  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = selectElement.selectedIndex;
    const selectedCountry = this.countries[selectedIndex];
    this.selectedCountry.set([selectedCountry]);
    this.fetchWeatherData(selectedCountry.latitude, selectedCountry.longitude);
  }

  async fetchWeatherData(latitude: number, longitude: number): Promise<void> {
    try {
      const data = await this.weatherService.getWeatherData(latitude, longitude);
      this.weatherData.set(data);
      this.updateWeatherMessageAndImage(data.current_weather.temperature);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  updateWeatherMessageAndImage(temp: number): void {
    if (temp <= 10) {
      this.weatherMessage.set(" seems like the weather is cold today. Better to stay at home.");
      this.weatherImageSrc.set('../../assets/winter.jpg');
    } else if (temp > 10 && temp <= 20) {
      this.weatherMessage.set(" today is not so cold. Maybe have a walk to relieve stress after a long time working?");
      this.weatherImageSrc.set('./assets/moderate.jpeg');
    } else if (temp > 20) {
      this.weatherMessage.set(" it's sunny today! How about a summer day this weekend?");
      this.weatherImageSrc.set('./assets/sunny.jpeg');
    }
  }
}
