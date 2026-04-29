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
import {
	DomSanitizer,
	type SafeResourceUrl,
	type SafeValue,
} from "@angular/platform-browser";

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
	blob = input.required<Blob>();

	#platformId = inject(PLATFORM_ID);
	#sanitizer = inject(DomSanitizer);

	safeUrl = signal<SafeResourceUrl | null>(null);

	canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("pdf");

	isBrowser = !isPlatformServer(this.#platformId);

	blobEffect = effect((onCleanup) => {
		if (isPlatformServer(this.#platformId)) return;

		const currentBlob = this.blob();

		if (!(currentBlob instanceof Blob) || currentBlob.size === 0) return;

		const url = URL.createObjectURL(
			new Blob([currentBlob], { type: "application/pdf" }),
		);

		this.safeUrl.set(this.#sanitizer.bypassSecurityTrustResourceUrl(url));

		// 3. Untrack the ViewChild to prevent unnecessary effect executions
		const canvasEl = untracked(this.canvasRef).nativeElement;

		// 4. Trigger the rendering process
		this.renderPdf(currentBlob, canvasEl);

		onCleanup(() => {
			URL.revokeObjectURL(url);
		});
	});

	private async renderPdf(
		pdfBlob: Blob,
		canvas: HTMLCanvasElement,
	): Promise<void> {
		try {
			// Convert the Blob to an ArrayBuffer, which is exactly what PDF.js expects
			const arrayBuffer = await pdfBlob.arrayBuffer();

			const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");

			// This file is configured using angular.json assets
			GlobalWorkerOptions.workerSrc = `/pdfjs-dist/pdf.worker.min.mjs`;

			const loadingTask = getDocument(arrayBuffer);
			const pdfDocument = await loadingTask.promise;

			// Fetch the first page (To render multiple pages, you'd loop through pdfDocument.numPages)
			const page = await pdfDocument.getPage(1);

			// Calculate the viewport.
			// A scale of 1.5 or 2.0 improves text clarity on high-DPI (Retina) screens.
			const viewport = page.getViewport({ scale: 1.5 });

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
