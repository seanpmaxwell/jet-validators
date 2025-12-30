import fs from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import Joi from 'joi';
import {
  parseObject,
  strictParseObject,
  looseParseObject,
  type Schema,
  strictTestObject,
} from 'jet-validators/utils';
import {
  isBoolean,
  isInArray,
  isNonEmptyString,
  isNumber,
  isUnsignedInteger,
} from 'jet-validators';
import * as yup from 'yup';
import { z } from 'zod';
import {
  boolean as vBoolean,
  email as vEmail,
  integer as vInteger,
  minLength as vMinLength,
  minValue as vMinValue,
  nonEmpty as vNonEmpty,
  number as vNumber,
  parse as parseWithValibot,
  picklist as vPicklist,
  pipe as vPipe,
  strictObject as vStrictObject,
  string as vString,
} from 'valibot';

type Address = {
  street: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
};

const roles = ['user', 'moderator', 'admin'] as const;

type UserRole = (typeof roles)[number];

type UserProfile = {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
  role: UserRole;
  score: number;
  address: Address;
};

type BenchmarkResult = {
  library: string;
  iterations: number;
  datasetSize: number;
  totalMs: number;
  opsPerSec: number;
};

type Validator = (value: unknown) => unknown;

const BENCHMARK_ITERATIONS = 100_000;
const WARMUP_ITERATIONS = 10_000;
const DATASET_SIZE = 1_000;
const RESULTS_FILE = new URL('./RESULTS.md', import.meta.url);

const cities = ['Seattle', 'New York', 'Austin', 'Denver', 'Chicago'];

const sampleDataset: UserProfile[] = Array.from(
  { length: DATASET_SIZE },
  (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: 18 + (index % 40),
    active: index % 3 !== 0,
    role: roles[index % roles.length],
    score: Number(((index % 50) + Math.random()).toFixed(2)),
    address: {
      street: `${index + 10} Main St.`,
      city: cities[index % cities.length],
      postalCode: `${10000 + index}`,
      lat: 40 + (index % 10) * 0.1,
      lng: -74 + (index % 10) * 0.1,
    },
  }),
);

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const parseWithJet = strictParseObject<UserProfile>({
  id: isUnsignedInteger,
  name: isNonEmptyString,
  email: isNonEmptyString,
  age: isUnsignedInteger,
  active: isBoolean,
  role: isInArray(roles),
  score: isNumber,
  address: strictTestObject<Address>({
    street: isNonEmptyString,
    city: isNonEmptyString,
    postalCode: isNonEmptyString,
    lat: isNumber,
    lng: isNumber,
  }),
});
const valibotSchema = vStrictObject({
  id: vPipe(vNumber(), vInteger(), vMinValue(0)),
  name: vPipe(vString(), vNonEmpty()),
  email: vPipe(vString(), vEmail()),
  age: vPipe(vNumber(), vInteger(), vMinValue(0)),
  active: vBoolean(),
  role: vPicklist(roles),
  score: vNumber(),
  address: vStrictObject({
    street: vPipe(vString(), vNonEmpty()),
    city: vPipe(vString(), vNonEmpty()),
    postalCode: vPipe(vString(), vMinLength(5)),
    lat: vNumber(),
    lng: vNumber(),
  }),
});
const zodSchema = z
  .object({
    id: z.number().int().nonnegative(),
    name: z.string().min(1),
    email: z.string().email(),
    age: z.number().int().nonnegative(),
    active: z.boolean(),
    role: z.enum(roles),
    score: z.number(),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      postalCode: z.string().min(5),
      lat: z.number(),
      lng: z.number(),
    }),
  })
  .strict();
const joiSchema = Joi.object({
  id: Joi.number().integer().min(0).required(),
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).required(),
  active: Joi.boolean().required(),
  role: Joi.string()
    .valid(...roles)
    .required(),
  score: Joi.number().required(),
  address: Joi.object({
    street: Joi.string().min(1).required(),
    city: Joi.string().min(1).required(),
    postalCode: Joi.string().min(5).required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  })
    .required()
    .unknown(false),
})
  .required()
  .unknown(false)
  .prefs({ convert: false });
const yupSchema = yup
  .object({
    id: yup.number().integer().min(0).required(),
    name: yup.string().min(1).required(),
    email: yup.string().email().required(),
    age: yup.number().integer().min(0).required(),
    active: yup.boolean().required(),
    role: yup.mixed<UserProfile['role']>().oneOf(roles).required(),
    score: yup.number().required(),
    address: yup
      .object({
        street: yup.string().min(1).required(),
        city: yup.string().min(1).required(),
        postalCode: yup.string().min(5).required(),
        lat: yup.number().required(),
        lng: yup.number().required(),
      })
      .required(),
  })
  .required()
  .strict(true);

const validators: Record<string, Validator> = {
  jetValiators: (value) => {
    const parsed = parseWithJet(value);
    // if (parsed === false) {
    //   throw new Error('parseObject returned false for valid data.');
    // }
    return parsed;
  },
  Zod: (value) => zodSchema.parse(value),
  Joi: (value) => {
    const { error, value: parsed } = joiSchema.validate(value);
    if (error) {
      throw error;
    }
    return parsed;
  },
  Yup: (value) => yupSchema.validateSync(value, { strict: true }),
  Valibot: (value) => parseWithValibot(valibotSchema, value),
};

async function main() {
  const results: BenchmarkResult[] = [];

  for (const [name, validator] of Object.entries(validators)) {
    console.log(`Running benchmark for ${name}...`);
    results.push(await runBenchmark(name, validator));
  }

  await writeResults(results);
  console.log(`Benchmark results written to ${fileURLToPath(RESULTS_FILE)}.`);
}

async function runBenchmark(name: string, validator: Validator) {
  const sink: unknown[] = [];
  const datasetLength = sampleDataset.length;

  // Warm up the validator to allow the JIT to optimize.
  for (let i = 0; i < WARMUP_ITERATIONS; i += 1) {
    const record = sampleDataset[i % datasetLength];
    sink[i % 8] = validator(record);
  }

  const start = performance.now();
  for (let i = 0; i < BENCHMARK_ITERATIONS; i += 1) {
    const record = sampleDataset[i % datasetLength];
    sink[i % 8] = validator(record);
  }
  const totalMs = performance.now() - start;

  return {
    library: name,
    iterations: BENCHMARK_ITERATIONS,
    datasetSize: datasetLength,
    totalMs,
    opsPerSec: (BENCHMARK_ITERATIONS / totalMs) * 1000,
  };
}

async function writeResults(results: BenchmarkResult[]) {
  const rows = results
    .map(
      (result) =>
        `| ${result.library} | ${result.iterations.toLocaleString('en-US')} | ${numberFormatter.format(result.totalMs)} | ${numberFormatter.format(result.opsPerSec)} |`,
    )
    .join('\n');

  const content = [
    '# Benchmark Results',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Node.js: ${process.version}`,
    `- Dataset size: ${DATASET_SIZE}`,
    `- Iterations per library: ${BENCHMARK_ITERATIONS}`,
    '',
    '| Library | Iterations | Total Time (ms) | Ops/Second |',
    '| --- | ---: | ---: | ---: |',
    rows,
    '',
  ].join('\n');

  await fs.writeFile(fileURLToPath(RESULTS_FILE), content, 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
