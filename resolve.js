const colors = require("colors")

if (!process.version.startsWith("v8")) {
  console.log("Please use node v8.x".red)
  process.exit(0)
}


const fs = require("fs")
const { SourceMapConsumer } = require("source-map")
const program = require("commander")

let targetFile = null


program
  .arguments("<file>")
  .option("-l --line <n>", "Line number from console output", parseInt)
  .option("-c --column <n>", "Column/Position number from console output", parseInt)
  .action((file) => {
    targetFile = file
  })

program.parse(process.argv)


const { line, column } = program


if (!line || !column || !targetFile) {
  console.log("You have to specify a file and use both -l and -c options!".red)
  program.help() // exits
}


fs.readFile(targetFile, (error, data) => {

  if (error) {
    console.log("Please fix this problem first: ".red, error)
  } else {

    const json = JSON.parse(data)

    const smc = new SourceMapConsumer(json)

    console.log(JSON.stringify(smc.originalPositionFor({
      line,
      column
    }), undefined, 2).green)
  }

})
