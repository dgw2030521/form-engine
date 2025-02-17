import smCrypto from 'sm-crypto';

export class checkValue {
  public static notEmpty(value: string | number | null | undefined) {
    if (value && value !== '0') {
      return true;
    }
    return false;
  }

  public static toString(value: string | number | null | undefined) {
    if (value) {
      return value.toString();
    }
    return '0';
  }

  public static toNull(value: string | number | null | undefined) {
    if (value && value !== '0') {
      return value;
    }
    return null;
  }

  public static notSpecialCharRegExp =
    /^[^\[\]\(\)\{\}\<\>\|\\\/\,\.\?\:\;\"\'\~\`\!\@\#\$\%\^\&\*\-\+\_\=！＠＃￥？…《》：•·、。，；（）【】‘’“”∷±＋－×÷≈≡≠＝≤≥＜＞]*$/;

  public static notSpecialChar(value: string) {
    const _regExp = checkValue.notSpecialCharRegExp;
    return _regExp.test(value);
  }

  public static isPhoneRegExp = /^1[0-9]{10}$/;

  public static isPhone(value: string) {
    const _regExp = checkValue.isPhoneRegExp;
    return _regExp.test(value);
  }

  public static isIDCardRegExp =
    /^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$|^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

  public static isIDCard(value: string) {
    const _regExp = checkValue.isIDCardRegExp;
    return _regExp.test(value);
  }

  public static isCreditCodeRegExp =
    /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14}$/;

  public static isCreditCode(value: string) {
    const _regExp = checkValue.isCreditCodeRegExp;
    return _regExp.test(value);
  }

  public static isBankCardRegExp = /^\d{13,19}$/;

  public static isBankCard(value: string) {
    const _regExp = checkValue.isBankCardRegExp;
    return _regExp.test(value);
  }

  public static isEmailRegExp =
    /^[a-zA-Z0-9\_\-\.]+@[a-zA-Z0-9\_\-]+(\.[a-zA-Z0-9\_\-]+)+$/;

  public static isEmail(value: string) {
    const _regExp = checkValue.isEmailRegExp;
    return _regExp.test(value);
  }

  public static accountRegExp = /^[a-zA-Z]([a-zA-Z0-9_]{3,19})$/;

  public static isAccount(value: string) {
    const _regExp = checkValue.accountRegExp;
    return _regExp.test(value);
  }

  public static passwordRegExp =
    /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,32}$/;

  public static isPassword(value: string) {
    const _regExp = checkValue.passwordRegExp;
    return _regExp.test(value);
  }

  public static rand(value: string) {
    return `${value}-${(+new Date()).toString(32)}-${Math.random()
      .toString()
      .substr(2, 6)}`;
  }

  public static sm3(UUKey: string, Password: string) {
    return smCrypto.sm3(`${UUKey}-${Password}`);
  }
}
