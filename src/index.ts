import produce from 'immer';
import concat from 'ramda/es/concat';
import filter from 'ramda/es/filter';
import lt from 'ramda/es/lt';
// tslint:disable-next-line: export-name
export default class RxForm {
  public data: number[] = [];
  constructor() {
    this.data = produce(this.data, draft => {
      return filter(lt(3), concat(draft, [1, 2, 3, 4, 5]));
    });

    this.data[0] = 2;
  }
}
