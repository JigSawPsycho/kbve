/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference lib="webworker" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vanillajs" />

interface Window {
	Alpine: import('alpinejs').Alpine;
}

declare module 'https://esm.sh/@lottiefiles/dotlottie-web' {
	export const DotLottieWorker: any;
}

export interface DotLottieInstance {
	play(): void;
	pause(): void;
	destroy(): void;
}

export type SharedWorkerCommand =
	| { type: 'connect_websocket' }
	| { type: 'close_websocket' }
	| { type: 'fetch_metrics' }
	| { type: 'panel'; payload: PanelRequest }
	| { type: 'db_get'; store: KnownStore; key: string }
	| { type: 'db_set'; store: KnownStore; key: string; value: any }
	| { type: 'db_delete'; store: KnownStore; key: string }
	| { type: 'db_list'; store: KnownStore };

export type CommandPayload<T extends SharedWorkerCommand['type']> =
	Extract<SharedWorkerCommand, { type: T }> extends { type: T }
		? Omit<Extract<SharedWorkerCommand, { type: T }>, 'type'>
		: never;

export const knownStores = ['jsonservers', 'htmlservers', 'meta', 'panel', 'notifications'] as const;
export type KnownStore = (typeof knownStores)[number];

export interface NotificationToast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
	sent?: boolean;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface DiscordServer {
	server_id: string;
	owner_id: string;
	lang: number;
	status: number;
	invite: string;
	name: string;
	summary: string;
	description?: string | null;
	website?: string | null;
	logo?: string | null;
	banner?: string | null;
	video?: string | null;
	categories: number;
	updated_at: string;
}

export interface DiscordTag {
	tag_id: string;
	name: string;
	status: number;
}

export interface LiveServerCardsData {
	initial: DiscordServer[];
	servers: Record<string, DiscordServer>;
	refresh(): Promise<void>;
	updateServer(server: DiscordServer): void;
}

export interface CarouselSlide {
	id: string;
	content?: DiscordServer | any;
}

export interface CarouselData {
	slides: CarouselSlide[];
	currentSlideIndex: number;
	autoplay: boolean;
	autoplayInterval: number;
	intervalId: number | null;
	init(): void;
	destroy(): void;
	startAutoplay(): void;
	stopAutoplay(): void;
	previous(): void;
	next(): void;
	goTo(index: number): void;
}

export type PanelDirection = 'top' | 'right' | 'bottom' | 'left';
export type PanelId = PanelDirection;

export interface PanelPayload {
name?: string;
description?: string;
server?: DiscordServer;
tag?: DiscordTag;
image?: string;
video?: string;
[key: string]: any;
}

export type PanelSlot = {
open: boolean;
payload?: PanelPayload | null;
};

export interface PanelRequest {
	type: 'open' | 'close' | 'toggle';
	id: PanelId;
	payload?: PanelPayload;
}

export interface PanelState {
	open: boolean;
	id: PanelId;
	payload?: PanelPayload;
	content?: string;
}

export interface Panel {
	id: PanelId;
	direction: PanelDirection;
	x: number;
	y: number;
	width: number;
	height: number;
	zIndex: number;
	open: boolean;
	transition?: string;
	content?: string;
	payload?: Record<string, any>;
}

export interface PanelManagerStore {
	openPanels: Partial<Record<PanelId, PanelState>>;
	init(): Promise<void>;
	openPanel(id: PanelId, payload?: Record<string, any>): Promise<void>;
	closePanel(id: PanelId): Promise<void>;
	togglePanel(id: PanelId, payload?: Record<string, any>): Promise<void>;
	loadContent(id: PanelId): Promise<void>;
	getPanel(id: PanelId): PanelState | undefined;
}

export type RenderType = 'lottie' | 'chart' | 'webgl' | 'particles' | 'text';
export type RenderTypeOptionsMap = {
	lottie: { loop?: boolean };
	chart: { data: any[]; config?: object };
	webgl: { shaderSrc: string };
	particles: { particleCount: number };
	text: { content: string; fontSize?: number };
};

export interface RenderMessage<T extends RenderType = RenderType> {
	type: 'render';
	renderType: T;
	canvas: OffscreenCanvas;
	src?: string;
	options?: RenderTypeOptionsMap[T];
}

export type SpecificRenderMessage<T extends RenderType> = RenderMessage<T>;

// ** Web Worker Dedicated Types ** //

export type WebWorkerHandler<T extends WebWorkerCommand> = (msg: T) => Promise<void>;

export type WebWorkerCommand =
	| WebRenderMessage
	| { type: 'destroy'; id: string };

export interface WebRenderMessage<T extends RenderType = RenderType> {
		type: 'render';
		id: string;
		renderType: T;
		canvas: OffscreenCanvas;
		src?: string;
		options?: RenderTypeOptionsMap[T];
	}

export type WebWorkerResponse =
	| { type: 'render_success'; id: string }
	| { type: 'render_error'; id: string; error: string }
	| { type: 'destroy_success'; id: string }
	| { type: 'destroy_error'; id: string; error: string };

export type WebWorkerPayload<T extends WebWorkerCommand['type']> =
	Extract<WebWorkerCommand, { type: T }> extends { type: T }
		? Omit<Extract<WebWorkerCommand, { type: T }>, 'type'>
		: never;