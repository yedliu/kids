import {Route} from 'vue-router';
import {clearHeader} from '@/utils';
// import _isEmpty from 'lodash/isEmpty';

export async function routerBeforeEachFunc(to: Route, from: Route, next: any) {
  clearHeader();
  next();
}
/*tslint:disable*/
export function routerAfterEachFunc(to: Route, from: Route) {
}
