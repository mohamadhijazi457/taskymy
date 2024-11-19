import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather.services';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch weather data successfully', async () => {
    // Mocking the fetch function
    const mockFetch = spyOn(window, 'fetch').and.callFake(() =>
      Promise.resolve({
        json: () => Promise.resolve({ current_weather: { temperature: 20 } }),
      } as Response)
    );

    const latitude = 40.7128;
    const longitude = -74.0060;

    const data = await service.getWeatherData(latitude, longitude);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    expect(data.current_weather.temperature).toBe(20);
  });

  it('should handle an error when fetching weather data', async () => {
    // Mocking the fetch function to reject with an error
    const mockFetch = spyOn(window, 'fetch').and.callFake(() =>
      Promise.reject('Fetch error')
    );

    const latitude = 40.7128;
    const longitude = -74.0060;

    try {
      await service.getWeatherData(latitude, longitude);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockFetch).toHaveBeenCalled();
      expect(error).toBe('Fetch error');
    }
  });
});
