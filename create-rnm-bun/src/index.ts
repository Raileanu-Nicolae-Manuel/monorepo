import { copyTemplateFromGithub, getPath, getTemplateName, getUser } from "./utils.js";


const argv = process.argv.slice(2);

console.log('Arguments passed to create-rnm:', argv);

const availableTemplates = await getTemplateName();
console.log("template name:", availableTemplates);

// if (templateName && targetDir) {
// 	await copyTemplateFromGithub(templateName, targetDir);
// 	console.log(`Copied template '${templateName}' to ${targetDir}`);
// }

console.log("get author:", getUser());

console.log("get path:", getPath());
console.log("get path:", import.meta.dirname);
console.log(process.argv)