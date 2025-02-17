import { ViEnum } from '@/ViCross/ViEnum';

export class changeData {
  public static options(ValueList: Array<ViEnum>) {
    return ValueList.map(item => {
      return { value: item.Value, label: item.Name };
    });
  }

  public static getName(ValueList: Array<ViEnum>, Value: number) {
    const item = ValueList.find(item => item.Value === Value);
    return item ? item.Name : null;
  }
}
