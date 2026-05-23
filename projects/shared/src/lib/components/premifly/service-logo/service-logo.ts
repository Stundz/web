import { Component, input } from "@angular/core";
import type { Model } from "../../../types/models";

@Component({
	selector: "stundz-premifly-service-logo",
	imports: [],
	templateUrl: "./service-logo.ng.html",
	styleUrl: "./service-logo.css",
	host: {
		"[class.icon-[logos--claude-icon]]": "service().slug === 'claude'",
		"[class.icon-[logos--openai-icon]]": "service().slug === 'chatgpt'",
		"[class.icon-[vscode-icons--file-type-gemini]]":
			"service().slug === 'gemini'",
		"[class.icon-[ri--grok-ai-fill]]": "service().slug === 'grok'",
		"[class.icon-[logos--netflix-icon]]": "service().slug === 'netflix'",
		"[class.icon-[cbi--prime-video]]": "service().slug === 'prime-video'",
		"[class.text-blue-400!]": "service().slug === 'prime-video'",
		"[class.dark:text-gray-300!]": "service().slug === 'chatgpt'",
	},
})
export class PremiflyServiceLogo {
	service = input.required<Model.Premifly.Service>();
}
