import { Command } from "commander";

const registerInitCmd = (program: Command) => {
  program
    .name("string-util")
    .description("CLI to some JavaScript string utilities")
    .version("0.8.0");

  program
    .command("split")
    .description("Split a string into substrings and display as an array")
    .argument("<string>", "string to split")
    .option("--first", "display just the first substring")
    .option("-s, --separator <char>", "separator character", ",");

  const fn = (str: any, options: any) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  };

  program.action(fn);
};

export const init = () => {
  const program = new Command();
  registerInitCmd(program);
  program.parse();
};
