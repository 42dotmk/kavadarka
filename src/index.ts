import { createFilter } from '@rollup/pluginutils';
import typescript from 'typescript';
import { mapping } from './mapping';

function keywordExceptInString(word: string) {
  return new RegExp(`${word}(?=[^"]*(?:"[^"]*"[^"]*)*$)`, "gm");
}

function doReplacements(code: string) {
  let transformedCode = code;
  for (const key in mapping) {
    const regex = keywordExceptInString(key);
    const value = mapping[key];
    transformedCode = transformedCode.replace(regex, value);
  }
  return transformedCode;
}

type KavadarkaOptions = {
  include?: Array<string | RegExp> | string | RegExp | null,
	exclude?: Array<string | RegExp> | string | RegExp | null,

  tsOptions?: typescript.CompilerOptions;
}

export function kavadarka(options: KavadarkaOptions = {}) {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: "kavadarka",
    transform(code: string, id: string) {
      if (!filter(id)) return null;
      const finalTs = doReplacements(code);
      const transpiled = typescript.transpile(finalTs, options.tsOptions);

      return {
        code: transpiled,
        map: null
      };
    }
  };
}

export default kavadarka;
