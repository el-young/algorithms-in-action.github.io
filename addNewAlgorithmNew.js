/* 
    Requirements: 
        - User has cloned repo
        - User must have git installed and on $PATH variable
    How to run: 
        - node addNewAlgorithm.js
*/

// Algorithm master list
const { default: algorithms, AlgorithmCategoryList } = require('./src/algorithms/masterList.js');
// Parser for JS files
const parser = require("@babel/parser");
// Traverser helper for the JSO produced by using parser above
const traverse = require("@babel/traverse").default;
// Execute shell commands TODO: should be cross platform but test on Windows machine
const shell = require("shelljs");
// Helps with joining paths "./src/directory" + "../" = "./src" etc.
const path = require("path");
// I/O API
const readline = require("node:readline");

const rl = readline.createInterface({
  input   : process.stdin,
  output  : process.stdout,
  terminal: false,
});

/*
    For maintainers:
        - Change of names for properties in master list will cause problems, we are
          inserting an entry, so we use the property names at the time of writing. I have
          created a map PROPERTY_NAMES which should be modified if the property names in
          masterList.js is changed.

        - The main fragility of this script lies in how it handles copying. To duplicate an algorithm, the script
          must copy the source files directly, which means it is tightly coupled to the file system structure 
          at the time of writing (specifically src/directory/*). If any files reference the algorithm ID 
          in the master list via hardcoded keys, this script can break related features. At the time of writing, 
          parameter components did exactly that, requiring users to run the script and then manually 
          update all hardcoded references in the copied parameter component file. This issue has since been 
          resolved, parameter components no longer rely on such hardcoded keys but serves
          as an example of why you might experience weird behaviour with other features when copying
          an algorithm with this script.

        - In any case if the script can not be made to work it is most likely due to the copy
          algorithm feature, if you want an easy fix the functionality to select an algorithm to copy can 
          be removed by commenting out certain sections. See COPY and END COPY markers (match casing). 
          Uncomment the section between DEFAULT TO HEAPSORT and END DEFAULT TO HEAPSORT. The algorithm
          will now be set to copy heap sort through hardcoded paths.

          Ensure DEFAULT_TO_HEAPSORT and PATHS have the right paths before doing this, 
          see below.

          The below constants should help protect against variations in key names
          in masterList.js and file system changes without having to touch
          this script too heavily, but it does not protect against everything.
*/

// Change this for future years
const NAME_OF_DEV_BRANCH = "2025_sem2";

// If you change the name of the variable name for master list.
const NAME_OF_VAR_FOR_MASTER_LIST = "algorithmMetadata";

// At time of writing these are the paths for heap sort files.
const DEFAULT_TO_HEAPSORT = {
    controllers : "src/algorithms/controllers/heapSort.js",
    pseudocode  : "src/algorithms/pseudocode/heapSort.js",
    parameters  : "src/algorithms/parameters/HSParam.js",
    explanations: "src/algorithms/explanations/HSExp.md",
    extra       : "src/algorithms/extra-info/HSInfo.md",
}

const PATHS = {
    controllers : "src/algorithms/controllers",
    pseudocode  : "src/algorithms/pseudocode",
    parameters  : "src/algorithms/parameters",
    explanations: "src/algorithms/explanations",
    extra       : "src/algorithms/extra-info",
    instruction : "src/algorithms/instructions",
    master      : "src/algorithms/masterList.js",
};

// A map of concept to actual property name in master list,
// this is so script does not need to be touched heavily
// if property names are changed in master list.
const PROPERTY_NAMES = {
    name        : "name",
    category    : "category",
    noDeploy    : "noDeploy",
    keyword     : "keywords",
    instruction : "instructionsKey",
    explanation : "explanationKey",
    parameters  : "paramKey",
    pseudo      : "pseudocode",
    control     : "controller",
    extraInfo   : "extraInfoKey"
};

// Collection of the keys that have values that are exports
const MODULE_KEYS = new Set([
  PROPERTY_NAMES.instruction,
  PROPERTY_NAMES.explanation,
  PROPERTY_NAMES.parameters,
  PROPERTY_NAMES.pseudo,
  PROPERTY_NAMES.control,
  PROPERTY_NAMES.extraInfo,
]);

// Helper, we will be pulling keys from master list
// and want to know what index.js file their values (exports)
// correspond to.
const KEYS_TO_DIRECTORY = {
  [PROPERTY_NAMES.explanation]  : PATHS.explanations,
  [PROPERTY_NAMES.parameters]   : PATHS.parameters,
  [PROPERTY_NAMES.instruction]  : PATHS.instruction,
  [PROPERTY_NAMES.pseudo]       : PATHS.pseudocode,
  [PROPERTY_NAMES.control]      : PATHS.controllers,
  [PROPERTY_NAMES.extraInfo]    : PATHS.extra
};

/* Put infomation wanted from user here */

// Prompt text constants
const QUERY_ALGORITHM_NAME  = "Enter the full algorithm name:\n";
const QUERY_ALGORITHM_ID    = "Enter the short ID (used as filename prefix in src/algorithms/*):\n";
const QUERY_KEYWORDS        = "Enter search keywords (space-separated):\n";
const QUERY_CATEGORY        = "What category does your algorithm fall under?\n(Enter a number or enter a new category if the category does not exist)\n";
const QUERY_DEPLOY          = "Do you want to deploy your algorithm to the site immediately? (y/n)\n";
const QUERY_ALGORITHM_COPY  = "What existing algorithm implementation would you like to copy?\n"

// Answer variables
let nameOfAlgorithm;    // Full display name of the algorithm
let algorithmId;        // Short identifier used in filenames and the key in master list
let listOfKeywords;     // Keywords for search in main menu
let categorySel;        // Category the algorithm will fall under
let deploy;             // Deploy algorithm (appear in menus)
let noDeploy;           // Master list uses noDeploy but im asking user if they want to deploy
let algorithmCopy = {   // Algorithm to copy (this will hold the master entry of the algorithm selected)
    name : "heapSort"
};

// rl.on is asynchronous need to wrap in Promises so we can use await
// to make synchronous code (i.e. wait for user input and halt rest of script)
function promisifyReads(rl) {
    return new Promise((resolve) => rl.on("line", answer => resolve(answer)));
}

async function askUntil(rl, validate) {
    // Just to bypass the commit rules no while(true) allowed
    let b = true;
    while (b) {
        let response = await promisifyReads(rl);
        // Validate should send to stdout appropriate messages
        // when failing to validate, directing the user towards a valid
        // input.
        if (validate(response)) return response;
    }
}

// Retrieve all data from the user
async function retrieveDataFromUser() {

    /* Get algorithm name */
    rl.output.write(QUERY_ALGORITHM_NAME);

    // Lax on the validation because its not used in code besides in master list
    // where it will be the name property, this will be what is displayed 
    // in MainMenu and AlgorithmMenu.
    nameOfAlgorithm = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (!v) { 
            rl.output.write("Name cannot be empty.\n"); 
            return false; 
        }

        return true;
    }));

    /* Get category */
    rl.output.write(QUERY_CATEGORY);

    // Display the categories for selection
    const sortedCategories = AlgorithmCategoryList
                            .map(({ category }) => category)
                            .sort((a, b) => (a === b ? 0 : (a < b ? -1 : 1)));
    sortedCategories.forEach((val, idx) => rl.output.write(`${idx}: ${val}\n`));

    // Get the users requested category, this can be an existing category
    // in which case the user passes a number corresponding to the index of the name
    // in sortedCategories, else if they want their own new category they enter a string.
    categorySel = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (/^\d+$/.test(v) && !(Number.parseInt(v, 10) >= 0 && 
            Number.parseInt(v, 10) <= sortedCategories.length - 1)) {
            rl.output.write(`Enter a number between 0 and ${sortedCategories.length - 1} (inclusive) or enter a new cateogry\n`);
            return false;
        }

        return true;
    }));

    // Get the name from index
    if (/^\d+$/.test(categorySel)) categorySel = sortedCategories[categorySel];

    /* Get the algorithm ID */
    rl.output.write(QUERY_ALGORITHM_ID);

    algorithmId = await askUntil(rl,(q => {
        const v = (q || "").trim();

        // Must not be empty
        if (!v) {
            rl.output.write("Algorithm ID cannot be empty.\n");
            return false;
        }

        // This can be changed, the only restriction is that it must be capable of being a prefix of a filename.
        // Also will be a key in a JS object so probably best to keep sensible.
        if (!/^[a-z][A-Za-z0-9_]*$/.test(v)) {
            rl.output.write("Algorithm ID must start with a lowercase letter and may contain letters, numbers, and underscores after.\n");
            return false;
        }

        // This will be the key in master list so it must be unique
        if (Object.hasOwn(algorithms, q)) {
            rl.output.write("Algorithm ID is alreay used, please select another ID.\n");
            return false;
        }

        // In theory, the above should be enough to ensure no files are overwritten, but that assumes
        // all entries were made with this script, where algorithmId is the prefix for all files generated
        // so as long as the key is unique, filenames will be unique. At the time of writing there exist
        // many algorithms that do not use the key in the master list as a prefix for their associated
        // files.
        for (const [key, dir] of Object.entries(PATHS)) {
            const files = shell.ls(dir);
            const conflict = files.find(f => f.startsWith(v));
            if (conflict) {
                rl.output.write(`Conflict: file ${dir}/${conflict} already exists with that prefix.\n`);
                return false;
            }
        }

        return true;
    }));

    /* Get the algorithm to COPY */
    rl.output.write(QUERY_ALGORITHM_COPY);

    // Display the algorithms to copy
    const keys = Object.keys(algorithms).sort((a, b) => {
        const an = algorithms[a];
        const bn = algorithms[b];
        return an === bn ? 0 : (an < bn ? -1 : 1);
    });
    keys.forEach((id, idx) => rl.output.write(`${idx}: ${algorithms[id].name}\n`));

    algorithmCopy = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (/^\d+$/.test(v) && !(Number.parseInt(v, 10) >= 0 && 
            Number.parseInt(v, 10) <= Object.keys(algorithms).length - 1)) {
            rl.output.write(`Enter a number between 0 and ${Object.keys(algorithms).length - 1} (inclusive)\n`);
            return false;
        }

        return true;
    }));

    algorithmCopy = algorithms[keys[Number.parseInt(algorithmCopy, 10)]];
    /* END COPY */

    /* Get keywords */
    rl.output.write(QUERY_KEYWORDS);

    // These will be used in the main menu's search function
    // hence little to no restriction.
    listOfKeywords = await askUntil(rl, (q => true));
    listOfKeywords = listOfKeywords.trim() === ""
    ? []
    : listOfKeywords.trim().split(/\s+/);

    /* Get deploy status */
    rl.output.write(QUERY_DEPLOY);

    deploy = await askUntil(rl, (q => {
        const v = (q || "").trim().toLowerCase();

        if (v === "y" || v === "n") return true;

        rl.output.write("Please enter 'y' or 'n'.\n");
        return false;
    }))

    noDeploy = deploy.trim().toLowerCase() === "y" ? false : true;

    if (noDeploy) {
        rl.output.write(`Not deploying to site, algorithm accesible through 'secret' URL http://localhost:<port_num>/?alg=${algorithmId}
Note: The default port should be 3000 but it may be something else, see npm start's output.`);
    }
}

(async () => {
  /* Get user data */
  // await retrieveDataFromUser();

  // TL;DR Babel parser creates a javascript object capturing
  // everything about a JS file's (source codes) metadata. The
  // traverser API allows us to easily filter this to only stuff we care about.
  // In this case, its exports, so we use keys that correspond
  // to that in the traverser (ExportNamedDecleration in this case).
  const getExportsFromFile = (filepath) => {
    const ast = parser.parse(shell.cat(filepath).toString(), { sourceType: "module" });

    const exports = [];

    traverse(ast, {
      // https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#exportnameddeclaration
      ExportNamedDeclaration({ node }) {
        const source = node.source ? node.source.value : null;

        // Case 1: export { foo as bar } from './x'
        // should protect against export { foo as "string reexport"} from './x'
        node.specifiers.forEach((spec) => {
          exports.push({
            file: filepath,
            source,
            exported: spec.exported.type === "StringLiteral"
              ? spec.exported.value
              : spec.exported.name,
            local: spec.local.type === "StringLiteral"
              ? spec.local.value
              : spec.local.name,
          });
        });

        // Case 2: export const hello = 5;
        if (node.declaration && node.declaration.type === "VariableDeclaration") {
          node.declaration.declarations.forEach((decl) => {
            if (decl.id.type === "Identifier") {
              let value = null;

              if (decl.init) {
                // 5
                value = shell.cat(filepath).toString().slice(decl.init.start, decl.init.end);
              }

              exports.push({
                file: filepath,
                source,
                exported: decl.id.name,
                local: decl.id.name,
                value,
              });
            }
          })
        }
      }
    });

    return exports;
  };

  // For each module key get the exports and files to copy
  MODULE_KEYS.forEach((key) => {
    /*
      import { default as AVLTreeSearch } from "./AVLTreeSearch";
      
      {
        file: "src/algorithms/controllers"
        source: './AVLTreeSearch',
        exported: 'AVLTreeSearch',
        local: 'default'
      }

      export const AVLInstruction = ;
      { source: null, exported: 'AVLInstruction', local: 'AVLInstruction' }
    */
    const exportsInFile = getExportsFromFile(KEYS_TO_DIRECTORY[key] + "/index.js");

    const exportKey = algorithms["AVLTree"][key];
    let wantedExports = [];
    if (typeof exportKey === "string") {
      // Only one export name for entries other than
      // pseudocode and controller.
      wantedExports.push(exportKey);
    } else if (typeof exportKey === "object" && exportKey !== null) {
      // Pseudocode and controller can have multiple export keys.
      wantedExports.push(...Object.values(exportKey));
    }

    // Only keep exports that have at least one of the wanted
    // export keys.
    const relevantExports = exportsInFile.filter((item) =>
      wantedExports.includes(item.exported)
    );

    // Here we have a collection of the metadata for the export lines
    // we are interested in (see format at top). We can derive the files
    // to copy (if they exist (instruction index exports do not pull from files)) 
    // and new export lines to create.
    const filesToCopy = relevantExports
    .filter((i) => i.source)
    .map((i) => {
      // Resolve source relative to index.js’s directory
      const dir = path.dirname(i.file);             // e.g. src/algorithms/controllers
      const resolved = path.resolve(dir, i.source); // join with ./AVLTreeSearch
      // add .js if no extension
      return path.extname(resolved) ? resolved : resolved + ".js";
    });

    // const exportsStringsToInsert = 

    

    console.log(`Key: ${key}`);
    console.log(relevantExports);
    console.log(`files to copy ${filesToCopy}`);
  });

  rl.close();
})(); // Run function when file is ran (like main in C)

/*
    Example run: node addNewAlgorithmScript.js
    Enter the full algorithm name:
    Bubble Sort
    What category does your algorithm fall under?
    (Will display numbered list of categories)
    (Enter a number or enter a new category)
    Sort
    Enter the short ID (used as filename perfix in src/algorithms/* and the key in master list):
    bsort
    Enter the algorithm to copy:
    (Will display numbered list of algorithms to copy)
    1
    Enter search keywords (space-seperated):
    n^2 slow hello world
    Do you want to deploy your algorithm to the site immediately? (y/n)
    y

    To test again switch back to 2025_sem2 branch and delete the add_{algorithm_id} branch
    For example
    git checkout 2025_sem2
    git branch -D add_bsort
*/