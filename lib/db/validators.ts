// db/validators.ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { appUsers, sessions, scores } from "./schema";

// -----------------------------
// Users
// -----------------------------
export const insertUserSchema = createInsertSchema(appUsers);
export const selectUserSchema = createSelectSchema(appUsers);

// -----------------------------
// Sessions
// -----------------------------
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

// -----------------------------
// Scores
// -----------------------------
export const insertScoreSchema = createInsertSchema(scores);
export const selectScoreSchema = createSelectSchema(scores);
