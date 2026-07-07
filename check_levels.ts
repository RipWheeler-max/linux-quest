import { levels } from './src/data/levels';

let bugCount = 0;
for (const level of levels) {
  if (level.steps.length !== level.tasks.length) {
    console.log(`Level ${level.id} "${level.title}" has mismatch: ${level.steps.length} steps, ${level.tasks.length} tasks.`);
    bugCount++;
  }
}
if (bugCount === 0) {
  console.log('All levels match!');
}
