export class storage {
  public static getItem(key) {
    return localStorage.getItem(`$operation_${key}`);
  }
  public static setItem(key, value) {
    if (typeof value === 'string') {
      localStorage.setItem(`$operation_${key}`, value);
    } else if (typeof value === 'number') {
      localStorage.setItem(`$operation_${key}`, value.toString());
    } else {
      localStorage.setItem(`$operation_${key}`, JSON.stringify(value));
    }
  }
  public static removeItem(key) {
    localStorage.removeItem(`$operation_${key}`);
  }
}
