import { Command } from "commander";

const registerInitCmd = (program: Command) => {
  program
    .command("init")
    .description("Inits the application and opens the local site")
    // .argument("<string>", "string to split")
    // .option("--first", "display just the first substring")
    // .option("-s, --separator <char>", "separator character", ",");

  const fn = () => {
    console.log("init called")
  };

  program.action(fn);
};

export const init = () => {
  const program = new Command();
  program
    .name("galactic")
    .description("CLI to rule the galaxy")
    .version("0.0.1");
  registerInitCmd(program);
  program.parse();
};
