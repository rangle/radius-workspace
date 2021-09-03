import factory from "yargs/yargs";

module.exports = function cli(cwd: string) {
  const parser = factory(undefined, cwd);

  parser.alias("h", "help");
  parser.alias("v", "version");

  parser
    .usage("Usage: $0 <command> [options]")
    .demandCommand(
      1,
      "A command is required. Pass --help to see all available commands and options."
    );

  return parser;
};
