import {
	Directive,
	OnInit,
	Renderer2,
	input,
	output,
	signal,
} from "@angular/core";

@Directive({
	selector: "[stundzDropzone]",
	host: {
		"(dragover)": "onDragOver($event)",
		"(dragleave)": "onDragLeave($event)",
		"(drop)": "onDrop($event)",
		"(click)": "onHostClick()",
		"[class.drag-over]": "isDragOver()",
	},
})
export class Dropzone implements OnInit {
	private fileInput!: HTMLInputElement;

	acceptedFiles = input<string>("*");
	multiple = input<boolean>(true);
	change = output<File[]>();

	isDragOver = signal(false);

	constructor(private readonly renderer: Renderer2) {}

	ngOnInit(): void {
		this.fileInput = this.renderer.createElement("input");
		this.renderer.setAttribute(this.fileInput, "type", "file");
		this.renderer.setStyle(this.fileInput, "display", "none");
		this.renderer.listen(this.fileInput, "change", (event: Event) => {
			this.onFileSelected(event);
		});
	}

	onHostClick(): void {
		this.fileInput.multiple = this.multiple();
		this.fileInput.accept = this.acceptedFiles();
		this.fileInput.click();
	}

	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver.set(true);
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver.set(false);
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver.set(false);

		const files = event.dataTransfer?.files;
		if (files) {
			this.handleFiles(files);
		}
	}

	private onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			this.handleFiles(input.files);
			input.value = ""; // Reset
		}
	}

	private handleFiles(files: FileList): void {
		const allowedFiles: File[] = [];
		const accepted = this.acceptedFiles();
		const isMultiple = this.multiple();

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (this.isFileTypeAllowed(file, accepted)) {
				allowedFiles.push(file);
			}
		}

		if (allowedFiles.length > 0) {
			if (isMultiple) {
				this.change.emit(allowedFiles);
			} else {
				this.change.emit(allowedFiles.slice(0, 1));
			}
		}
	}

	private isFileTypeAllowed(file: File, acceptedFiles: string): boolean {
		if (acceptedFiles === "*") {
			return true;
		}
		const acceptedTypes = acceptedFiles
			.split(",")
			.map((t) => t.trim().toLowerCase());
		const fileType = file.type.toLowerCase();
		const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

		return acceptedTypes.some((type) => {
			if (type.startsWith(".")) {
				return fileExtension === type;
			}
			if (type.endsWith("/*")) {
				return fileType.startsWith(type.slice(0, -2));
			}
			return fileType === type;
		});
	}
}
