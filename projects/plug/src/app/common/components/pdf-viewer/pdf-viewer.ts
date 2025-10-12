import { isPlatformServer } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	PLATFORM_ID,
	viewChild,
} from "@angular/core";
import { DomSanitizer, SafeValue } from "@angular/platform-browser";
import { getDocument } from "pdfjs-dist";
import { from, lastValueFrom } from "rxjs";

@Component({
	selector: "plug-pdf-viewer",
	imports: [],
	templateUrl: "./pdf-viewer.ng.html",
	styleUrl: "./pdf-viewer.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		ngSkipHydration: "true",
	},
})
export class PdfViewer {
	private _platformId = inject(PLATFORM_ID);
	private _sanitizer = inject(DomSanitizer);
	private _canvas = viewChild<HTMLCanvasElement>("pdfViewer");
	isServer = isPlatformServer(this._platformId);

	data = input.required<SafeValue, Blob>({
		transform: (value) => {
			if (this.isServer) {
				return "";
			}

			return this._sanitizer.bypassSecurityTrustResourceUrl(
				URL.createObjectURL(new Blob([value], { type: "application/pdf" })),
			);
		},
	});
}
