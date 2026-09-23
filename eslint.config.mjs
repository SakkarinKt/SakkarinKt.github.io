import next from 'eslint-config-next';

const config = [{ ignores: ['.next/**', 'out/**', 'public/**', 'next-env.d.ts'] }, ...next];

export default config;
