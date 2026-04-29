import { isPlatformServer } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type ElementRef,
	effect,
	inject,
	input,
	PLATFORM_ID,
	signal,
	untracked,
	viewChild,
} from "@angular/core";
import type { PDFDocumentProxy } from "pdfjs-dist";

@Component({
	selector: "plug-pdf-viewer",
	imports: [],
	templateUrl: "./pdf-viewer.ng.html",
	styleUrl: "./pdf-viewer.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		ngSkipHydration: "true",
	},
})
export class PdfViewer {
	doc = input.required<PDFDocumentProxy>();
	page = input(1);
	zoom = input(0.8);

	#platformId = inject(PLATFORM_ID);

	canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("pdf");

	blobEffect = effect(() => {
		if (isPlatformServer(this.#platformId)) return;

		if (!this.doc()) return;

		this.renderPdf();
	});

	private async renderPdf(): Promise<void> {
		const canvas = untracked(this.canvasRef).nativeElement;

		try {
			// Fetch the first page (To render multiple pages, you'd loop through pdfDocument.numPages)
			const page = await this.doc().getPage(this.page());

			// Calculate the viewport.
			// A scale of 1.5 or 2.0 improves text clarity on high-DPI (Retina) screens.
			const viewport = page.getViewport({ scale: this.zoom() });

			// Prepare the canvas dimensions to match the PDF page
			const context = canvas.getContext("2d");
			if (!context) return;

			canvas.height = viewport.height;
			canvas.width = viewport.width;

			await page.render({
				canvasContext: context,
				viewport: viewport,
				canvas,
			}).promise;
		} catch (error) {
			console.error("Error rendering PDF with PDF.js:", error);
		}
	}
}
