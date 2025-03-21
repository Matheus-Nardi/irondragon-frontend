import { Routes } from '@angular/router';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { cidadeResolver } from './components/cidade/cidade.resolver';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { estadoResolver } from './components/estado/estado.resolver';
import { FabricanteFormComponent } from './components/fabricante/fabricante-form/fabricante-form.component';
import { FabricanteListComponent } from './components/fabricante/fabricante-list/fabricante-list.component';
import { fabricanteResolver } from './components/fabricante/fabricante.resolver';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { fornecedorResolver } from './components/fornecedor/fornecedor.resolver';
import { LoteListComponent } from './components/lote/lote-list/lote-list.component';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { loteResolver } from './components/lote/lote.resolver';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';

export const routes: Routes = [
  {
    path: 'estados',
    component: EstadoListComponent,
    title: 'Lista de Estados',
  },
  {
    path: 'estados/create',
    component: EstadoFormComponent,
    title: 'Novo Estado',
  },
  {
    path: 'estados/edit/:id',
    component: EstadoFormComponent,
    title: 'Editar Estado',
    resolve: { estado: estadoResolver },
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
    path: 'cidades/edit/:id',
    component: CidadeFormComponent,
    title: 'Editar Cidade',
    resolve: {cidade: cidadeResolver}
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
    path: 'fabricantes/edit/:id',
    component: FabricanteFormComponent,
    title: 'Editar Fabricante',
    resolve: { fabricante: fabricanteResolver },
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
  },
  {
    path: 'fornecedores/edit/:id',
    component: FornecedorFormComponent,
    title: 'Editar Fornecedor',
    resolve: {fornecedor: fornecedorResolver}
  },
  {
    path: 'lotes',
    component: LoteListComponent,
    title: 'Lista de Lotes',
  },
  {
    path: 'lotes/create',
    component: LoteFormComponent,
    title: 'Novo Lote',
  },
  {
    path: 'lotes/edit/:id',
    component: LoteFormComponent,
    title: 'Editar Lote',
    resolve: {lote: loteResolver}
  }
];
