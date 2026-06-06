import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { appConfig } from "./app/app.config";

// Global register locale data used in the system
import "@angular/common/locales/global/en-CM";
import "@angular/common/locales/global/fr-CM";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
