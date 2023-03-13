import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/scalpel.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/scalpel.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/scalpel.umd.js',
      format: 'umd',
      name: 'Scalpel',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
