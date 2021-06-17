import { FormGroup } from '@angular/forms';

export class CtrlErrors {
  static processError(
    form: FormGroup,
    controlName: string,
    labelName: string
  ): string {
    let error = '';
    const control = form.get(controlName);
    if (control.touched && control.errors) {
      error = this.errorToText(control.errors, labelName);
    }
    if (control.dirty && control.errors) {
      error = this.errorToText(control.errors, labelName);
    }
    return error;
  }

  static errorToText(errors: any, labelName: string): string {
    let msgError = '';
    if (errors.required) {
      msgError = `El campo '${labelName}' es requerido`;
    }
    if (errors.document) {
      msgError = `El campo '${labelName}' es inválido`;
    }
    if (errors.number) {
      msgError = `El campo '${labelName}' debe ser numérico`;
    }
    if (errors.minlength != null) {
      msgError = `El campo '${labelName}' debe tener ${errors.minlength.requiredLength} caracteres`;
    }
    if (errors.maxlength != null) {
      msgError = `El campo '${labelName}' debe tener ${errors.maxlength.requiredLength} caracteres`;
    }
    return msgError;
  }
}
