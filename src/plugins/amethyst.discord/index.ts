import type { Presence } from "discord-rpc";
import { Client } from "discord-rpc";
import { APP_VERSION } from "../../main/mainWindow";

const DISCORD_CLIENT_ID = "1071679030153191454"; 

export type FormatIcons = "aiff" | "flac" | "mpeg" | "ogg" | "wave";

export class Discord {
	private readonly client: Client;

	private readonly connected: Promise<boolean>;

	private destroyed: boolean;

	constructor() {
		this.client = new Client({ transport: "ipc" });
		this.connected = this.connect();
		this.destroyed = false;

		this.client.on("ready", () => {
			// Do something when ready
		});
		this.client.once("disconnected", () => this.destroyed = true);
	}

	public connect(): Promise<boolean> {
		return new Promise(resolve => {
			// The app will crash with status 3489660927 if the RPC won't connect unless rate limited
			this.client.login({
				clientId: DISCORD_CLIENT_ID,
			}).then(() => resolve(true)).catch(() => resolve(false));
		});
	}

	public clearRichPresence(): void {
		this.connected.then(check => check && !this.destroyed && this.client.clearActivity());
	}

	public updateRichPresence(args: Presence): void {
		this.connected.then(check => check && !this.destroyed && this.client.setActivity(args));
	}

	public updateCurrentSong(title: string, duration: string, seek: string, format?: FormatIcons): void {
		this.connected.then(check => check && !this.destroyed && this.updateRichPresence({
			state: `${seek} - ${duration}`,
			details: title,
			largeImageKey: "logo",
			largeImageText: `Sapphire v${APP_VERSION}\n`,
			smallImageKey: format || "blank",
			smallImageText: format?.toUpperCase() || "Unknown Format",
			buttons: [
				{
					label: "Download Sapphire",
					url: "https://atomix.one/sapphire/",
				},
			],
		}));
	}
}