import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { CidadeService } from '../../services/cidade.service';
import { inject } from '@angular/core';
import { Cidade } from '../../models/cidade.model';

export const cidadeResolver: ResolveFn<Cidade> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(CidadeService).findById(route.paramMap.get('id')!);
};
