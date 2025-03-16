const appendLocation = '.user';
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const CACHE_EXPIRATION = 30 * 60 * 1000;
const STORAGE_KEYS = {
  users: 'users',
  buttonUsed: 'reloadButtonUsed'
};

class UserManager {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error(`"${selector}" seçicisine sahip bir element bulunamadı`);
      return;
    }
    this.init();
  }

  init() {
    console.log("UserManager başlatıldı");
  }
}

new UserManager(appendLocation);