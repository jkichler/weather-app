import { LOCATION, GOT_WEATHER, GOT_ERROR } from './types';

const initialState = {
  location: '',
  weather: {},
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION:
      return { ...state, location: action.location };
    case GOT_WEATHER:
      const weather = action.weather;
      //hash table to record min and max
      const hash = {};
      // array for mapping out forecast elements
      const forecastArray = [];

      //because the forecast is in 3 hour increments and min and max is realative to this time period, we must loop through each time period and set the min and max for each day
      action.weather.forecast.list.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0];
        const min = forecast.main.temp_min;
        const max = forecast.main.temp_max;
        //adding new date to table with min and max
        if (!(date in hash)) {
          hash[date] = {
            min,
            max
          };
        } else {
          //checking other forcasts of same day and updated min and max
          if (hash[date].min > min) {
            hash[date].min = min;
          }
          if (hash[date].max < max) {
            hash[date].max = max;
          }
        }
      });
      //adding forcasts to an array to be sent to state for mapping front end elements
      for (let date in hash) {
        forecastArray.push({
          date: date,
          min: hash[date].min,
          max: hash[date].max
        });
      }
      weather.forecast = forecastArray;
      return { ...state, weather };
    case GOT_ERROR:
      console.log('got to reducer');
      return { ...state, error: action.error, weather: {} };
    default:
      return state;
  }
};

export default reducer;
