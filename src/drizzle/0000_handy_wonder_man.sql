CREATE TABLE `logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer,
	`odometer` integer NOT NULL,
	`liters` real NOT NULL,
	`price_per_liter` real NOT NULL,
	`is_full_tank` integer DEFAULT true NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'gas' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`status_color` text DEFAULT '#006c75' NOT NULL,
	`status_text_color` text DEFAULT '#FFFFFF' NOT NULL,
	`distance` integer DEFAULT 0 NOT NULL,
	`efficiency` real DEFAULT 0 NOT NULL,
	`efficiency_unit` text NOT NULL,
	`efficiency_color` text DEFAULT '#FF7F11' NOT NULL,
	`last_updated` text NOT NULL
);
