import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';

export const routes: Routes = [
    {
        path: "estados", component: EstadoListComponent, title: "Lista de Estados"
    },
    {
        path: "cidades", component: CidadeListComponent, title: "Lista de Cidades"
    }
];
