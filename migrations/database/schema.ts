import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, serial, int, json, varchar, timestamp, unique, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const apikey = mysqlTable("apikey", {
	id: serial("id").notNull(),
	uuid: int("uuid"),
	permissions: json("permissions"),
	keyhash: varchar("keyhash", { length: 256 }),
	label: varchar("label", { length: 256 }),
},
(table) => {
	return {
		apikeyId: primaryKey(table.id),
	}
});

export const appwrite = mysqlTable("appwrite", {
	id: serial("id").notNull(),
	uuid: int("uuid"),
	appwriteEndpoint: varchar("appwrite_endpoint", { length: 256 }),
	appwriteProjectid: varchar("appwrite_projectid", { length: 256 }),
	apppwriteApiKey: varchar("apppwrite_api_key", { length: 256 }),
	version: varchar("version", { length: 64 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		appwriteId: primaryKey(table.id),
	}
});

export const auth = mysqlTable("auth", {
	id: serial("id").notNull(),
	uuid: int("uuid"),
	email: varchar("email", { length: 256 }),
	hash: varchar("hash", { length: 256 }).notNull(),
	salt: varchar("salt", { length: 256 }).notNull(),
	passwordResetToken: varchar("password_reset_token", { length: 256 }),
	passwordResetExpiry: timestamp("password_reset_expiry", { mode: 'string' }),
	verificationToken: varchar("verification_token", { length: 256 }),
	verificationExpiry: timestamp("verification_expiry", { mode: 'string' }),
	status: int("status").default(0),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	failedLoginAttempts: int("failed_login_attempts").default(0),
	lockoutUntil: timestamp("lockout_until", { mode: 'string' }),
	twoFactorSecret: varchar("two_factor_secret", { length: 256 }),
	recoveryCodes: text("recovery_codes"),
},
(table) => {
	return {
		authId: primaryKey(table.id),
		authEmailUnique: unique("auth_email_unique").on(table.email),
	}
});

export const n8N = mysqlTable("n8n", {
	id: serial("id").notNull(),
	uuid: int("uuid"),
	webhook: varchar("webhook", { length: 256 }),
	permissions: json("permissions"),
	keyhash: varchar("keyhash", { length: 256 }),
	label: varchar("label", { length: 256 }),
},
(table) => {
	return {
		n8NId: primaryKey(table.id),
	}
});

export const profile = mysqlTable("profile", {
	id: serial("id").notNull(),
	name: varchar("name", { length: 256 }).default('Anon'),
	bio: varchar("bio", { length: 64 }).default(''),
	unsplash: varchar("unsplash", { length: 64 }).default(''),
	github: varchar("github", { length: 64 }).default(''),
	instagram: varchar("instagram", { length: 64 }).default(''),
	discord: varchar("discord", { length: 64 }).default(''),
	uuid: int("uuid"),
},
(table) => {
	return {
		profileId: primaryKey(table.id),
	}
});

export const users = mysqlTable("users", {
	id: int("id").autoincrement().notNull(),
	username: varchar("username", { length: 256 }),
	reputation: int("reputation").default(0),
	exp: int("exp").default(0),
	role: int("role").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		usersId: primaryKey(table.id),
		id: unique("id").on(table.id),
		usersUsernameUnique: unique("users_username_unique").on(table.username),
	}
});