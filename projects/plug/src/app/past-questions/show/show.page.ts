import { httpResource } from "@angular/common/http";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Model } from "shared";
import { environment } from "../../../environments/environment";
import { PdfViewer } from "../../common/components/pdf-viewer/pdf-viewer";

@Component({
	selector: "plug-show-past-question",
	imports: [PdfViewer, MatButtonModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	question = input.required<Model.Plug.PastQuestion>({
		alias: "past-question",
	});

	blob = httpResource.blob(() => `https://api.${environment.domain}/pdf`);
}
