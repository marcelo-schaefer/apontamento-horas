import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarModule} from "primeng/calendar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {MultiSelectModule} from "primeng/multiselect";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


import { HistoricosColaboradorComponent } from './features/historicos-colaborador/historicos-colaborador.component';
import { InputSwitchModule } from 'primeng/inputswitch';


@NgModule({
    declarations: [
        AppComponent,
        HistoricosColaboradorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CalendarModule,
        DropdownModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        InputNumberModule,
        MultiSelectModule,
        TableModule,
        ButtonModule,
        InputSwitchModule,

         ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
