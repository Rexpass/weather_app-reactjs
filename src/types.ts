export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
}

export interface WeatherBackground {
  day: {
    clear: string;
    clouds: string;
    rain: string;
    snow: string;
    mist: string;
  };
  night: {
    clear: string;
    clouds: string;
    rain: string;
    snow: string;
    mist: string;
  };
}

export interface AirQuality {
  value: number;
  level: 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  color: string;
}