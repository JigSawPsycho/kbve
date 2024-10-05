// import { Scene } from 'phaser';

// export interface GridEngineScene extends Scene {
//   gridEngine: any;
// }

export interface AtlasItem {
	error: string;
	message: string;
	state: 'active' | 'update' | 'disable' | 'process';
}

export interface AtlasData {
	plugin: AtlasItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Persistable {}

export interface MetaData {
	__actionId: string;
	__data: string;
	__error: string;
	__message: string;
}

// Define an interface for error logs
export interface ErrorLog {
	id?: number; // Primary key
	actionId?: string;
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	details?: any;
	timestamp: Date;
}

export interface ActionULID {
	id: string; // Unique ID (ULID) for the action
	action: string; // Name of the action, e.g., "registerUser"
	timestamp: Date; // Timestamp when the action was performed
	status: 'pending' | 'completed' | 'failed'; // Status of the action
	errorId?: number; // Optional reference to an error log ID
}

export interface IKiloBase {
	hcaptcha: string;
	hcaptcha_api: string;
	api: string;
	anonKey: string;
}

export interface IPlayerStats {
	username: string;
	health: string;
	mana: string;
	energy: string;
	maxHealth: string;
	maxMana: string;
	maxEnergy: string;
	armour: string;
	agility: string;
	strength: string;
	intelligence: string;
	experience: string;
	reputation: string;
	faith: string;
}

export interface IconProps {
	styleClass?: string;
	size?: number;
	color?: string;
	onClick?: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface UserGenericMenu {
	id: string | null;
	position: {
		x: number;
		y: number;
	};
}

export interface UserSettings {
	tooltipItem: UserGenericMenu;
	submenuItem: UserGenericMenu;
	tooltipNPC: UserGenericMenu;
	isStatsMenuCollapsed: boolean;
	isSettingsMenuCollapsed: boolean;
	debugMode: boolean;
	textSpeed: number;
}

export interface IStatBoost extends Partial<IPlayerStats> {
	duration: number;
	expiry?: number;
}

export interface IPlayerState {
	inCombat: boolean;
	isDead: boolean;
	isResting: boolean;
	activeBoosts: Record<string, IStatBoost>;
}

export interface IObject {
	id: string; // ULID
	name: string;
	type: string;
	category?: string;
	description?: string;
	img?: string;
	bonuses?: {
		armor?: string;
		intelligence?: string;
		health?: string;
		mana?: string;
		energy?: string;
		[key: string]: string | undefined;
	};
	durability?: string;
	weight?: string;
	equipped?: boolean;
	consumable?: boolean;
	cooldown?: string;
	slug?: string;
	craftingMaterials?: string[];
	rarity?: string;
}

export interface IConsumable extends IObject {
	type: 'food' | 'scroll' | 'drink' | 'potion';
	effects: {
		health?: number;
		mana?: number;
		energy?: number;
		[key: string]: number | undefined;
	};
	boost?: IStatBoost;
	duration?: number;
	action?: string;
}

export interface ItemAction {
	actionEvent: 'consume' | 'equip' | 'unequip' | 'discard' | 'view';
	actionDetails?: string;
}

export interface IObjectAction extends ItemAction {
	itemId: string;
	itemObject: IObject;
	actionId: string;
}

export interface IEquipment extends IObject {
	type:
		| 'head'
		| 'body'
		| 'legs'
		| 'feet'
		| 'hands'
		| 'weapon'
		| 'shield'
		| 'accessory';
	bonuses?: {
		armor?: string;
		intelligence?: string;
		health?: string;
		mana?: string;
		[key: string]: string | undefined;
	};
	durability?: string;
	weight?: string;
}

export interface IPlayerInventory {
	backpack: string[];
	equipment: {
		head: string | null;
		body: string | null;
		legs: string | null;
		feet: string | null;
		hands: string | null;
		weapon: string | null;
		shield: string | null;
		accessory: string | null;
	};
}

// Player data interface
export interface IPlayerData {
	stats: IPlayerStats;
	inventory: IPlayerInventory;
	state: IPlayerState;
}

export interface NotificationType {
	type: 'caution' | 'warning' | 'danger' | 'success' | 'info';
	color: string;
	imgUrl: string;
}

export interface INotification {
	id: number;
	title: string;
	message: string;
	notificationType: NotificationType;
}

/**
 *
 *  IQuest - Slay 15 Goblins in the Castle and kill their leader.
 *     - IJournal 1 - Go to the Castle
 *          - ITask (1) -> (is X, Y Zone within Castle)
 *     - IJournal 2 - KIll 15 Goblins
 *          - ITask (15) -> Kill a Goblin
 *     - IJournal 3 - Slay The Goblin Leader
 *          - ITask (1) -> Kill Goblin Leader
 *
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ITask<T = any> {
	id: string; // ULID
	name: string;
	description: string;
	isComplete: boolean;
	action: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IJournal<T = any> {
	id: string; // ULID
	title: string;
	tasks: ITask<T>[];
	isComplete: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IQuest<T = any> {
	id: string; // ULID
	title: string;
	description: string;
	journals: IJournal<T>[];
	isComplete: boolean;
	reward: string;
}



export interface ItemActionEventData {
	itemId: string;
	action: ItemAction['actionEvent'];
}

export interface PlayerViewItem {
	itemId: string;
}

export interface NotificationEventData {
	title: string;
	message: string;
	notificationType: NotificationType;
}

export interface PlayerRewardEvent {
	message: string;
	item: IObject;
}

export interface PlayerCombatDamage {
	damage: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PlayerStealEventData<T = any> {
	npcId: string;
	npcName: string;
	data?: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface NPCInteractionEventData<T = any> {
	npcId: string;
	npcName: string;
	actions: string[];
	data?: T;
	coords: {
		x: number;
		y: number;
	};
}

export interface NPCMessageEventData {
	npcId: string;
	npcName: string;
	message: string;
}

export interface PlayerMoveEventData {
	x: number;
	y: number;
}

export interface OpenModalEventData {
	message: string;
}

export interface PlayerEventData extends IPlayerData {
	account: string;
}

export interface SceneTransitionEventData {
	newSceneKey: string;
	additionalInfo?: string;
}

export interface CharacterEventData {
	message: string;
	character_name?: string;
	character_image?: string;
	background_image?: string;
}

export interface WASMEventData {
	result: {
		value: number;
		description: string;
	};
}

export interface GameEvent {
	type: 'levelUp' | 'itemFound';
	payload: {
		level?: number;
		item?: string;
	};
}

export interface TaskCompletionEventData {
	taskId: string;
	isComplete: boolean;
}

export interface MinigameDiceProps {
	styleClass?: string;
	textures: DiceTextures;
	diceCount: number;
}

export type GameMode = 'Idle' | 'Dice' | 'Slot' | 'War';

export interface DiceAction {
	type: 'ROLL_DICE';
	diceValues: number[];
	isRolling: boolean;
}

export interface SlotAction {
	type: 'SPIN_SLOT';
	slotValues: number[];
}

export interface WarAction {
	type: 'PLAY_WAR';
	playerCard: string;
	opponentCard: string;
}

export type MinigameAction = DiceAction | SlotAction | WarAction;

export interface DiceTextures {
	side1: string;
	side2: string;
	side3: string;
	side4: string;
	side5: string;
	side6: string;
}

export interface SlotTextures {
	reel1: string;
	reel2: string;
	reel3: string;
}

export interface WarTextures {
	cardBack: string;
	playerCards: { [key: string]: string }; // Mapping of card names to URLs
	opponentCards: { [key: string]: string }; // Mapping of card names to URLs
}

export type MinigameTextures = DiceTextures | SlotTextures | WarTextures;

export interface MinigameState {
	gamemode: GameMode;
	action: MinigameAction;
	textures: MinigameTextures;
}

export interface DiceRollResultEventData {
	diceValues: number[];
}

// Type Guards

export function isDiceAction(action: MinigameAction): action is DiceAction {
	return action.type === 'ROLL_DICE';
}

// NPC Engine

// export interface INPCPosition {
//   x: number;
//   y: number;
// }

//* 08-03-2024 Extension
export interface INPCPosition extends Point {
	id?: string;
}

export interface INPCData {
	id: string;
	name: string;
	spriteKey: string;
	walkingAnimationMapping: number;
	startPosition: INPCPosition;
	speed: number;
	scale: number;
	slug: string;
	actions: NPCAction[];
	effects?: string[];
	stats?: IPlayerStats;
	//spriteImage?: Blob; // Optional field to store sprite image as Blob
	spriteImageId?: string;
	avatarImageId?: string;
	dialogues?: INPCDialogue[];
}

export interface ISprite {
	id: string; // ULID
	spriteName: string;
	assetLocation: string;
	frameWidth: number;
	frameHeight: number;
	scale?: number;
	spriteData?: Blob;
	slug: string;
}

export interface IAvatar {
	id: string; // ULID
	avatarName: string;
	avatarLocation: string;
	avatarData: Blob;
	slug: string;
}

export type NPCAction =
	| 'talk'
	| 'quest'
	| 'trade'
	| 'combat'
	| 'heal'
	| 'steal'
	| 'lore';

export interface INPCDialogue {
	dialogueId: string;
	read: boolean;
	priority: number;
}

export interface IDialogueObject {
	id: string;
	title: string;
	message: string;
	playerResponse?: string;
	actions?: string[]; // Array of ULIDs pointing to actions/effects
	options?: string[]; // Array of ULIDs pointing to other dialogue objects
	style?: string;
	backgroundImage?: string;
}

export interface NPCDialogueEventData {
	npcId: string;
	dialogue: IDialogueObject & { priority: number; read: boolean };
}

export enum CaptchaTheme {
	DARK = 'dark', // Represents the dark theme.
	LIGHT = 'light', // Represents the light theme.
}

export interface UILoginState {
	email: string;
	password: string;
	actionId: string;
	captchaToken: string;
	error_message: string;
	successful_message: string;
}

export interface UIRegiserState {
	email: string;
	password: string;
	confirm: string;
	username: string;
	captchaToken: string;
	svelte_internal_message: string;
	successful_message: string;
}

// Base interface for authentication-related fields
export interface Auth {
	id: string;
	email: string;
	updatedAt: Date;
}

// UserProfile interface extending Auth and adding optional fields
export interface UserProfile extends Auth {
	fullName?: string; // Optional field for full name
	username?: string; // Optional field for username
	avatarUrl?: string; // Optional field for avatar
	bio?: string;
}

export interface LoaderOptions {
	elementIdOrName: string;
	duration?: number; // in milliseconds, default to 500
	onComplete?: () => void; // optional callback function
}

export interface IResponse {
	status: number; // Numeric status code of the response.
	error: boolean; // Boolean flag indicating whether there was an error.
	message: string; // Message associated with the response.
	data: any; // Data payload of the response. 'any' type allows flexibility.
}

//* Loot Table */

export interface LootableObject {
	ulid?: string;
	name?: string;
	chance: number;
}

//* MapData */

export interface INPCObjectGPS {
	ulid: string;
	position: INPCPosition;
}

export interface IMapData {
	bounds: Bounds;
	tilemapKey: string;
	tilesetName: string;
	tilesetLayer: string;
	tilesetImageUrl: string;
	tilesetKey: string;
	scale: number;
	npcs: INPCObjectGPS[];
	jsonDataUrl: string;
}

//* QuadTree */
export interface Bounds {
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface Range {
	name: string;
	bounds: Bounds;
	action: () => void;
}

// Addtional User - Events

export interface UserRedirectEvent {
	location: string;
	timer?: number;
	replace?: boolean;
}

export interface UserProfileUpdateEvent {
	actionId: string;
	updatedFields: Partial<UserProfile>;
	timestamp: Date; 
  }

// export interface UserLogout {}
