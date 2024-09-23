import { program } from "commander";

program
  .name("first-community-ingester")
  .description(
    "Ingest data from First Community Credit Union CSV exports and store it in the database",
  )
  .version("0.0.1");

program.parse();
