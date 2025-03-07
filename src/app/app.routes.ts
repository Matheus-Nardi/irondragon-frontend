import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { FabricanteListComponent } from './components/fabricante/fabricante-list/fabricante-list.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';

export const routes: Routes = [
    {
        path: "estados", component: EstadoListComponent, title: "Lista de Estados"
    },
    {
        path: "cidades", component: CidadeListComponent, title: "Lista de Cidades"
    },
    {
        path: "fabricantes", component: FabricanteListComponent, title: "Lista de Fabricantes"
    },
    {
        path: "fornecedores", component: FornecedorListComponent, title: "Lista de Fornecedores"
    }
];
