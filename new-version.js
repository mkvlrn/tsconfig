import calver from "calver";
import pkgJson from "./package.json" assert { type: "json" };
import { execSync } from "node:child_process";

calver.useLocalTimme = true;
const format = "YYYY.MM.DD.patch";
const newVersion = calver.inc(format, pkgJson.version.replace("v", ""), "calendar");

// checks if git is clean, exits with message if not
const status = execSync("git status --porcelain", { encoding: "utf-8" });
if (status.trim() !== "") {
  console.error("Git is not clean, please commit all changes before running this script");
  process.exit(1);
}
// update package.json file using a child process
execSync(`npm pkg set version=v${newVersion}`);
// create annotated tag
execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`);
// create commit with updated package.json and tag
execSync(`git commit -am "v${newVersion}"`);
