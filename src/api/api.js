import currencies from './currencies.json';
import languages from './languages.json';

export const fetchCurrencies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currencies);
    }, 500); // จำลอง delay สำหรับการดึงข้อมูล
  });
};

export const fetchLanguages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(languages);
    }, 500);
  });
};
