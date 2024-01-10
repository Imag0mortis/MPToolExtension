import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiButtonModule, TuiSvgModule, TuiErrorModule, TuiScrollbarModule, TuiTextfieldControllerModule } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { CardComponent } from './card/card.component';
import { TuiCheckboxModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiInputPhoneModule, TuiIslandModule, TuiTabsModule } from "@taiga-ui/kit";
import { NgApexchartsModule } from "ng-apexcharts";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "./shared/guards/auth.guard";
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import localeRu from '@angular/common/locales/ru';
import { CommonModule, registerLocaleData } from "@angular/common";
import { TuiForAsyncModule } from "@taiga-ui/cdk";
import { LoginModule } from "./shared/login/login.module";


registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    WrapperComponent,
    CardComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      TuiRootModule,
      TuiDialogModule,
      TuiAlertModule,
      TuiIslandModule,
      TuiButtonModule,
      TuiTabsModule,
      NgApexchartsModule,
      FormsModule,
      TuiSvgModule,
      TuiInputModule,
      TuiErrorModule,
      CommonModule,
      TuiErrorModule,
      TuiInputModule,
      ReactiveFormsModule,
      FormsModule,
      TuiFieldErrorPipeModule,
      TuiForAsyncModule,
      TuiInputPasswordModule,
      TuiButtonModule,
      TuiSvgModule,
      TuiErrorModule,
      TuiTextfieldControllerModule,
      TuiCheckboxModule,
      TuiScrollbarModule,
      TuiInputPhoneModule,
      FormsModule,
      LoginModule,
],
providers: [
  { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
  AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  {
    provide: LOCALE_ID,
    useValue: 'ru'
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
