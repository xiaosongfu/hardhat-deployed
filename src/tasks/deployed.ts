import { scope } from "hardhat/config";
import { TASK_SCOPE_DEPLOYED } from "../constants";

export const deployedTaskScope = scope(TASK_SCOPE_DEPLOYED, "'deployed' tasks");
