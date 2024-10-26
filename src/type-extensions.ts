// If your plugin extends types from another plugin, you should import the plugin here.

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface DeployedUserConfig {
    deployedDir?: string;

    ignoreContracts?: string[];

    externalContracts?: string[];
  }

  export interface DeployedConfig {
    deployedDir: string;

    ignoreContracts: string[];

    externalContracts: string[];
  }

  export interface HardhatUserConfig {
    deployed?: DeployedUserConfig;
  }

  export interface HardhatConfig {
    deployed: DeployedConfig;
  }
}
