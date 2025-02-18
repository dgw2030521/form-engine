export class storage {
  public static getItem(key) {
    return localStorage.getItem(`${key}`);
  }

  public static setItem(key, value) {
    if (typeof value === 'string') {
      localStorage.setItem(`${key}`, value);
    } else if (typeof value === 'number') {
      localStorage.setItem(`${key}`, value.toString());
    } else {
      localStorage.setItem(`${key}`, JSON.stringify(value));
    }
  }

  public static removeItem(key) {
    localStorage.removeItem(`${key}`);
  }
}
