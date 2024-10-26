import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from "hardhat/plugins";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import fs from "fs";
import Mustache from "mustache";
import {
  PLUGIN_NAME,
  INDEX_TS_FILE,
  CONTRACTS_JSON_FILE,
  DEFAULT_DEPLOYED_ADDRESS,
  TASK_DEPLOYED_INIT,
} from "../constants";
import { paths2json } from "../misc/helpers";
import { parseArtifacts } from "../misc/helpers";
import { indexFile } from "../misc/templates";
import { deployedTaskScope } from "./deployed";

deployedTaskScope
  .task(TASK_DEPLOYED_INIT, "Initializes the deployed folder")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // run `compile` task before all operations
    await hre.run(TASK_COMPILE);

    // read configs from `hardhat.config.ts`
    const configs = hre.config.deployed;

    // get network name
    const network = hre.network.name; // default value is `hardhat`

    // if the `deployed` folder already exists, throw an error
    if (fs.existsSync(configs.deployedDir)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "Already initialized, don't initialize again",
      );
    }

    // sourceNames: ["PepeForkToken", "mock/MockERC20"]
    // contracts: [{contractName: "MockERC20", attrs: ["mock", "MockERC2"]}, ...]
    const { contracts } = await parseArtifacts(hre, configs.ignoreContracts, configs.externalContracts);

    // create `deployed` folder
    fs.mkdirSync(configs.deployedDir);
    // write `deployed/index.ts` file
    const code = Mustache.render(indexFile, { contracts });
    fs.writeFileSync(`${configs.deployedDir}/${INDEX_TS_FILE}`, code, {
      flag: "a+",
    });

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
