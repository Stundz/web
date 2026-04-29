import { isPlatformServer } from "@angular/common";
import { HttpContext, HttpParams, httpResource } from "@angular/common/http";
import {
	Component,
	computed,
	effect,
	inject,
	input,
	PLATFORM_ID,
	signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, RouterLink } from "@angular/router";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { Model } from "shared";
import { HTTP_SKIP_ON_SERVER } from "shared";
import { environment } from "../../../environments/environment";
import { PdfViewer } from "../../common/components/pdf-viewer/pdf-viewer";
@Component({
	selector: "plug-show-past-question",
	imports: [PdfViewer, MatButtonModule, MatCardModule, RouterLink],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	question = input.required<Model.Plug.PastQuestion>({
		alias: "past-question",
	});

	#platformId = inject(PLATFORM_ID);
	#meta = inject(Meta);
	#title = inject(Title);
	queryParams = toSignal(inject(ActivatedRoute).queryParams, {
		requireSync: true,
	});

	blob = httpResource.blob(
		() => ({
			url: `https://api.${environment.domain}/pdf`,
			params: new HttpParams({ fromObject: this.queryParams() }),
			context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
		}),
		{},
	);

	doc = signal<PDFDocumentProxy | null>(null);
	page = signal(1);
	pages = computed(() => this.doc()?.numPages || 0);

	blobEffect = effect(() => {
		if (isPlatformServer(this.#platformId)) return;

		if (!this.blob.hasValue()) return;

		const currentBlob = this.blob.value();

		if (!(currentBlob instanceof Blob) || currentBlob.size === 0) return;

		console.log("effecting the blob");

		this.prepareDocument(currentBlob);
	});

	private async prepareDocument(blob: Blob) {
		const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");

		// This file is configured using angular.json assets
		GlobalWorkerOptions.workerSrc = `/pdfjs-dist/pdf.worker.min.mjs`;

		this.doc.set(await getDocument(await blob.arrayBuffer()).promise);
	}

	firstPage() {
		this.page.set(1);
	}

	next() {
		if (this.page() < this.pages()) {
			this.page.update((value) => ++value);
		}
	}

	previous() {
		if (this.page() > 1) {
			this.page.update((value) => --value);
		}
	}

	lastPage() {
		this.page.set(this.pages());
	}
}
