import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the AllergiesFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'allergiesFormat',
})
export class AllergiesFormatPipe implements PipeTransform {
  /**
   * Takes an array and joins it into a single string
   */
  transform(value: Array<String>) {
    var items = [];
    value.forEach(item => {
      items.push(item);
    });
    console.log(items);
    console.log('String: ' + items.join());
    return items.join(', ');
  }
}
