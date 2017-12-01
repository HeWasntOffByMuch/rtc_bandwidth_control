import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './src/index.js',
  name: 'front',
  output: {
    format: 'es',
    file: './dist/bundle.js',
  },
  plugins: [
    commonjs(),
    resolve(),
  ],
  acorn: {
    allowReserved: true,
    ecmaVersion: 8,
  },
};
