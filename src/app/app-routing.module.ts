import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { AuthGuard } from './guards/auth.guard';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cuenta/perfil', component: PerfilComponent,canActivate: [AuthGuard]},
  {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate: [AuthGuard]},
  {path: 'productos', component: IndexProductoComponent},
  {path: 'productos/categoria/:categoria', component: IndexProductoComponent},
  {path: 'productos/:slug', component: ShowProductoComponent},
  {path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
