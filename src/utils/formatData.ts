export class formatData {
  private static _set(newData: any, data: any) {
    if (typeof newData === 'object' && typeof data === 'object') {
      Object.keys(newData).forEach(key => {
        let dataValue = data[key];
        if (data[key] === undefined) {
          const keyUpp = key.substr(0, 1).toUpperCase() + key.substr(1);
          const keyLow = key.substr(0, 1).toLowerCase() + key.substr(1);
          if (key !== keyUpp) {
            dataValue = data[keyUpp];
          } else if (key !== keyLow) {
            dataValue = data[keyLow];
          }
        }
        if (dataValue !== undefined) {
          if (typeof newData[key] === 'object') {
            if (typeof dataValue === 'object') {
              formatData._set(newData[key], dataValue);
            } else {
              Object.keys(newData[key]).map(_key => {
                if (_key.toLowerCase() === 'value' || _key === '_value') {
                  newData[key][_key] = dataValue;
                } else if (_key === '_active') {
                  newData[key][_key] = true;
                }
              });
            }
          } else {
            newData[key] = dataValue;
          }
        }
      });
    }
  }

  public static set(newData: any, data: any) {
    formatData._set(newData, data);
    return newData;
  }

  private static _get(newData: any) {
    if (newData && typeof newData === 'object') {
      Object.keys(newData).forEach(key => {
        const keyUpp = key.substr(0, 1).toUpperCase() + key.substr(1);
        const keyLow = key.substr(0, 1).toLowerCase() + key.substr(1);
        if (newData[key] && typeof newData[key] === 'object') {
          if (Array.isArray(newData[key])) {
            newData[key].forEach(_item => {
              formatData._get(_item);
            });
            newData[keyUpp] = newData[keyLow] = newData[key];
          } else {
            const _keys = Object.keys(newData[key]);
            if (_keys.length === 1 && _keys[0].toLowerCase() === 'value') {
              newData[keyUpp] = newData[keyLow] = newData[key][_keys[0]];
            } else if (
              _keys.length === 2 &&
              _keys.indexOf('_value') > -1 &&
              _keys.indexOf('_active') > -1
            ) {
              newData[keyUpp] = newData[keyLow] = newData[key]._active
                ? newData[key]._value
                : null;
            } else {
              formatData._get(newData[key]);
              newData[keyUpp] = newData[keyLow] = newData[key];
            }
          }
        } else {
          newData[keyUpp] = newData[keyLow] = newData[key];
        }
      });
    }
  }

  public static get(data: any) {
    formatData._get(data);
    return data;
  }
}
