import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { FabricanteListComponent } from './components/fabricante/fabricante-list/fabricante-list.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { FabricanteFormComponent } from './components/fabricante/fabricante-form/fabricante-form.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { estadoResolver } from './resolvers/estado/estado.resolver';

export const routes: Routes = [
  {
    path: 'estados',
    component: EstadoListComponent,
    title: 'Lista de Estados',
  },
  {
    path: 'estados/edit/:id',
    component: EstadoFormComponent,
    title: 'Editar Estado',
    resolve: {estado: estadoResolver}
  },
  {
    path: 'estados/create',
    component: EstadoFormComponent,
    title: 'Novo Estado',
  },
  {
    path: 'cidades',
    component: CidadeListComponent,
    title: 'Lista de Cidades',
  },
  {
    path: 'cidades/create',
    component: CidadeFormComponent,
    title: 'Nova Cidade',
  },
  {
    path: 'fabricantes',
    component: FabricanteListComponent,
    title: 'Lista de Fabricantes',
  },
  {
    path: 'fabricantes/create',
    component: FabricanteFormComponent,
    title: 'Novo fabricante',
  },
  {
    path: 'fornecedores',
    component: FornecedorListComponent,
    title: 'Lista de Fornecedores',
  },
  {
    path: 'fornecedores/create',
    component: FornecedorFormComponent,
    title: 'Novo Fornecedor'
  }
];
