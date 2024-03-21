import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByProperty'
})
export class FilterByPropertyPipe implements PipeTransform {
  transform(items: any[], propertyName: string, propertyValue: any): any[] {
      if (!items || !propertyName || propertyValue === undefined) {
          return items;
      }

      const filteredItems = items.filter(item => {
          if (Array.isArray(item[propertyName])) {
              // Verifica se o item é um array e se o valor está presente no array
              return item[propertyName].includes(propertyValue);
          } else {
              // Verifica diretamente se o valor da propriedade é igual ao valor buscado
              return item[propertyName] === propertyValue;
          }
      });
      return filteredItems;
  }
}
