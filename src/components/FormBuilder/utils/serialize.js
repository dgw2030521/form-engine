/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

// fork自https://github.com/yahoo/serialize-javascript.git，新增 ignoreUndefined 参数的支持

import { getRandomString } from '@/utils/commonTools';

// Generate an internal UID to make the regexp pattern harder to guess.
const UID = generateUID();
const PLACE_HOLDER_REGEXP = new RegExp(
  `(\\\\)?"@__(F|R|D|M|S|A|U|I|B|L)-${UID}-(\\d+)__@"`,
  'g',
);

const IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
const IS_PURE_FUNCTION = /function.*?\(/;
const IS_ARROW_FUNCTION = /.*?=>.*?/;
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

const RESERVED_SYMBOLS = ['*', 'async'];

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}

function generateUID() {
  return getRandomString(32);
}

function deleteFunctions(obj) {
  const functionKeys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'function') {
      functionKeys.push(key);
    }
  }
  for (let i = 0; i < functionKeys.length; i++) {
    delete obj[functionKeys[i]];
  }
}

function deleteUndefined(obj) {
  const undefinedKeys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'undefined') {
      undefinedKeys.push(key);
    }
  }
  for (let i = 0; i < undefinedKeys.length; i++) {
    delete obj[undefinedKeys[i]];
  }
}

function serializeUtil(obj, options) {
  options || (options = {});

  // Backwards-compatibility for `space` as the second argument.
  if (typeof options === 'number' || typeof options === 'string') {
    options = { space: options };
  }

  const functions = [];
  const regexps = [];
  const dates = [];
  const maps = [];
  const sets = [];
  const arrays = [];
  const undefs = [];
  const infinities = [];
  const bigInts = [];
  const urls = [];

  // Returns placeholders for functions and regexps (identified by index)
  // which are later replaced by their string representation.
  function replacer(key, value) {
    // For nested function
    if (options.ignoreFunction) {
      deleteFunctions(value);
    }

    if (options.ignoreUndefined) {
      deleteUndefined(value);
    }

    if (!value && value !== undefined) {
      return value;
    }

    // If the value is an object w/ a toJSON method, toJSON is called before
    // the replacer runs, so we use this[key] to get the non-toJSONed value.
    const origValue = this[key];
    const type = typeof origValue;

    if (type === 'object') {
      if (origValue instanceof RegExp) {
        return `@__R-${UID}-${regexps.push(origValue) - 1}__@`;
      }

      if (origValue instanceof Date) {
        return `@__D-${UID}-${dates.push(origValue) - 1}__@`;
      }

      if (origValue instanceof Map) {
        return `@__M-${UID}-${maps.push(origValue) - 1}__@`;
      }

      if (origValue instanceof Set) {
        return `@__S-${UID}-${sets.push(origValue) - 1}__@`;
      }

      if (origValue instanceof Array) {
        const isSparse =
          origValue.filter(function () {
            return true;
          }).length !== origValue.length;
        if (isSparse) {
          return `@__A-${UID}-${arrays.push(origValue) - 1}__@`;
        }
      }

      if (origValue instanceof URL) {
        return `@__L-${UID}-${urls.push(origValue) - 1}__@`;
      }
    }

    if (type === 'function') {
      return `@__F-${UID}-${functions.push(origValue) - 1}__@`;
    }

    if (type === 'undefined') {
      return `@__U-${UID}-${undefs.push(origValue) - 1}__@`;
    }

    if (type === 'number' && !isNaN(origValue) && !isFinite(origValue)) {
      return `@__I-${UID}-${infinities.push(origValue) - 1}__@`;
    }

    if (type === 'bigint') {
      return `@__B-${UID}-${bigInts.push(origValue) - 1}__@`;
    }

    return value;
  }

  function serializeFunc(fn) {
    const serializedFn = fn.toString();
    if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
      throw new TypeError(`Serializing native function: ${fn.name}`);
    }

    // pure functions, example: {key: function() {}}
    if (IS_PURE_FUNCTION.test(serializedFn)) {
      return serializedFn;
    }

    // arrow functions, example: arg1 => arg1+5
    if (IS_ARROW_FUNCTION.test(serializedFn)) {
      return serializedFn;
    }

    const argsStartsAt = serializedFn.indexOf('(');
    const def = serializedFn
      .substr(0, argsStartsAt)
      .trim()
      .split(' ')
      .filter(function (val) {
        return val.length > 0;
      });

    const nonReservedSymbols = def.filter(function (val) {
      return RESERVED_SYMBOLS.indexOf(val) === -1;
    });

    // enhanced literal objects, example: {key() {}}
    if (nonReservedSymbols.length > 0) {
      return `${def.indexOf('async') > -1 ? 'async ' : ''}function${
        def.join('').indexOf('*') > -1 ? '*' : ''
      }${serializedFn.substr(argsStartsAt)}`;
    }

    // arrow functions
    return serializedFn;
  }

  // Check if the parameter is function
  if (options.ignoreFunction && typeof obj === 'function') {
    obj = undefined;
  }
  // Protects against `JSON.stringify()` returning `undefined`, by serializing
  // to the literal string: "undefined".
  if (obj === undefined) {
    return String(obj);
  }

  let str;

  // Creates a JSON string representation of the value.
  // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
  if (options.isJSON && !options.space) {
    str = JSON.stringify(obj);
  } else {
    str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
  }

  // Protects against `JSON.stringify()` returning `undefined`, by serializing
  // to the literal string: "undefined".
  if (typeof str !== 'string') {
    return String(str);
  }

  // Replace unsafe HTML and invalid JavaScript line terminator chars with
  // their safe Unicode char counterpart. This _must_ happen before the
  // regexps and functions are serialized and added back to the string.
  if (options.unsafe !== true) {
    str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
  }

  if (
    functions.length === 0 &&
    regexps.length === 0 &&
    dates.length === 0 &&
    maps.length === 0 &&
    sets.length === 0 &&
    arrays.length === 0 &&
    undefs.length === 0 &&
    infinities.length === 0 &&
    bigInts.length === 0 &&
    urls.length === 0
  ) {
    return str;
  }

  // Replaces all occurrences of function, regexp, date, map and set placeholders in the
  // JSON string with their string representations. If the original value can
  // not be found, then `undefined` is used.
  return str.replace(
    PLACE_HOLDER_REGEXP,
    function (match, backSlash, type, valueIndex) {
      // The placeholder may not be preceded by a backslash. This is to prevent
      // replacing things like `"a\"@__R-<UID>-0__@"` and thus outputting
      // invalid JS.
      if (backSlash) {
        return match;
      }

      if (type === 'D') {
        return `new Date("${dates[valueIndex].toISOString()}")`;
      }

      if (type === 'R') {
        return `new RegExp(${serialize(regexps[valueIndex].source)}, "${
          regexps[valueIndex].flags
        }")`;
      }

      if (type === 'M') {
        return `new Map(${serialize(
          Array.from(maps[valueIndex].entries()),
          options,
        )})`;
      }

      if (type === 'S') {
        return `new Set(${serialize(
          Array.from(sets[valueIndex].values()),
          options,
        )})`;
      }

      if (type === 'A') {
        return `Array.prototype.slice.call(${serialize(
          {
            length: arrays[valueIndex].length,
            ...arrays[valueIndex],
          },
          options,
        )})`;
      }

      if (type === 'U') {
        return 'undefined';
      }

      if (type === 'I') {
        return infinities[valueIndex];
      }

      if (type === 'B') {
        return `BigInt("${bigInts[valueIndex]}")`;
      }

      if (type === 'L') {
        return `new URL("${urls[valueIndex].toString()}")`;
      }

      const fn = functions[valueIndex];

      return serializeFunc(fn);
    },
  );
}

/**
 * @description 使用serialize-javascript进行序列化，替代JSON.stringify()
 * @description 组件rules里面会存储一些validator函数，如果用JSON.stringify提交给接口会丢失
 * @param {*} obj 传入需要序列化的值
 * @returns 序列化后的值
 */
function serialize(obj) {
  return serializeUtil(obj, {
    ignoreUndefined: true,
  });
}

/**
 * @description 序列化成编辑器需要的展示格式
 * @param {*} obj  传入需要序列化的值
 * @return {*}  序列化后的值
 */
function serializeToDraft(obj) {
  return serializeUtil(obj, {
    space: 2,
    ignoreUndefined: true,
  });
}

/**
 * @description 对serialize-javascript序列化后的值进行反序列化化
 * @param {*} serializedJavascript 反序列化后的值
 * @returns
 */
function deserialize(serializedJavascript) {
  return new Function(`return ${serializedJavascript}`)();
}

export { deserialize, serialize, serializeToDraft, serializeUtil };
