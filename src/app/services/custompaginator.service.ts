import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class CustomPaginatorService extends MatPaginatorIntl {

  override itemsPerPageLabel: string = 'Itens por página';
  override nextPageLabel: string = 'Próxima página';
  override previousPageLabel: string = 'Página anterior';
  override firstPageLabel: string = 'Primeira página';
  override lastPageLabel: string = 'Última página';
  override getRangeLabel: (page: number, pageSize: number, length: number) => string =
      (page: number,
      pageSize: number,
      length: number) => {
      if (length == 0 || pageSize == 0) {
          return `0 de ${length}`
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`
  };
}
