import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Lote } from '../../models/lote.model';
import { inject } from '@angular/core';
import { LoteService } from '../../services/lote.service';

export const loteResolver: ResolveFn<Lote> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(LoteService).findById(route.paramMap.get('id')!);
};
