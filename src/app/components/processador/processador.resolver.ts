import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Processador } from '../../models/processador/processador.model';
import { inject } from '@angular/core';
import { ProcessadorService } from '../../services/processador.service';

export const processadorResolver: ResolveFn<Processador> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(ProcessadorService).findById(route.paramMap.get('id')!);
};
