import express from "express";
import { CheapestItemRequest } from "./types.js";
export declare const client: import("better-bay-common").BetterBayClient;
export declare function cheapestItemHandler(req: CheapestItemRequest, res: express.Response): void;
