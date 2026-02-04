# Typetify Examples

Practical examples demonstrating how to use typetify in real-world scenarios.

## Examples

- [01-basic-usage.ts](./01-basic-usage.ts) - Guards, collections, and objects
- [02-logic-utilities.ts](./02-logic-utilities.ts) - Replace ternaries and optional chaining
- [03-iterators.ts](./03-iterators.ts) - Lazy iterators for large datasets
- [04-async.ts](./04-async.ts) - Async utilities and error handling
- [05-real-world.ts](./05-real-world.ts) - Complete real-world scenarios

## Running Examples

```bash
# Install dependencies
npm install

# Run an example with ts-node
npx ts-node examples/01-guards.ts

# Or compile and run
npx tsc examples/01-guards.ts --outDir dist/examples
node dist/examples/01-guards.js
```

## Import Patterns

```typescript
// Import everything
import * as tf from 'typetify'

// Import specific modules
import { isString, isNumber } from 'typetify/guards'
import { chunk, groupBy } from 'typetify/collection'
import { get, ifElse, coalesce } from 'typetify/logic'

// Import from main entry (tree-shakeable)
import { isString, chunk, pipe } from 'typetify'
```
