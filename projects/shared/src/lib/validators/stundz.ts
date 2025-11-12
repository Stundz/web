import { AbstractControl, ValidatorFn } from "@angular/forms";

export class StunzValidator {
	static file(control: AbstractControl) {
		if (control.value! instanceof File) {
			return { file: false };
		}
		return null;
	}

	static size(size: number): ValidatorFn {
		return (control: AbstractControl) => {
			if (control.value instanceof File && control.value.size > size) {
				return { size: control.value.size };
			}

			if (control.value?.length && control.value.length > size) {
				return { size: control.value.length };
			}

			return null;
		};
	}
}
