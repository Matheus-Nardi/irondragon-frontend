import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {PlacaIntegrada} from '../../models/processador/placaintegrada.model';
import {inject} from '@angular/core';
import {PlacaintegradaService} from '../../services/placaintegrada.service';

export const placaintegradaResolver: ResolveFn<PlacaIntegrada> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PlacaintegradaService).findById(route.paramMap.get('id')!);
};
