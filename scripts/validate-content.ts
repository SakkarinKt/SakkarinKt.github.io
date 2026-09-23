import { validateContent } from '../lib/content/validate';

const problems = validateContent();
if (problems.length) {
	console.error(`✗ content validation failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log('✓ content valid');
