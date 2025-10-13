import { isPlatformServer } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { Component, inject, input, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../environments/environment";
import { PdfViewer } from "../../common/components/pdf-viewer/pdf-viewer";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-show",
	imports: [PdfViewer, MatButtonModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	private _platformId = inject(PLATFORM_ID);
	isServer = isPlatformServer(this._platformId);

	id = input.required({ alias: "past-question" });
	question = httpResource<any>(() => ({
		url: `http://api.stundz.localhost/plug/past-question/${this.id()}`,
		params: {
			page: 2,
		},
	}));
	blob = httpResource.blob(() => `${environment.url.api}/pdf`);
}
