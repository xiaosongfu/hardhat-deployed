import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from "hardhat/plugins";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import fs from "fs";
import {
  PLUGIN_NAME,
  CONTRACTS_JSON_FILE,
  DEFAULT_DEPLOYED_ADDRESS,
  TASK_DEPLOYED_ADD,
} from "../constants";
import { parseArtifacts, paths2json } from "../misc/helpers";
import { deployedTaskScope } from "./deployed";

deployedTaskScope
  .task(TASK_DEPLOYED_ADD, "Add new network deployed")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // run `compile` task before all operations
    await hre.run(TASK_COMPILE);

    // read configs from `hardhat.config.ts`
    const configs = hre.config.deployed;

    // get network name
    const network = hre.network.name; // default value is `hardhat`

    // if the network folder already exists, throw an error
    if (fs.existsSync(`${configs.deployedDir}/${network}`)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "Already added, you can migrate it by using 'deployed migrate' task",
      );
    }

    const { contracts } = await parseArtifacts(hre, configs.ignoreContracts);

    // create <network> folder
    fs.mkdirSync(`${configs.deployedDir}/${network}`);
    // write `<network>/contracts.json` file
    const data = paths2json({}, contracts, DEFAULT_DEPLOYED_ADDRESS);
    fs.writeFileSync(
      `${configs.deployedDir}/${network}/${CONTRACTS_JSON_FILE}`,
      data,
      {
        flag: "a+",
      },
    );
  });
