# Benchmark Results

- Generated: 2025-12-29T02:27:11.317Z
- Node.js: v24.11.0
- Dataset size: 1000
- Iterations per library: 100000

| Library | Iterations | Total Time (ms) | Ops/Second |
| --- | ---: | ---: | ---: |
| jet-validators parseObject | 100,000 | 616.63 | 162,172.77 |
| Zod | 100,000 | 258.76 | 386,456.2 |
| Joi | 100,000 | 1,926.35 | 51,911.65 |
| Yup | 100,000 | 3,894.1 | 25,679.87 |
