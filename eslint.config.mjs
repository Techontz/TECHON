import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Flat config. eslint-config-next 16 ships native flat presets, so no
 * FlatCompat layer is needed.
 */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  /**
   * Vendored shadcn/ui primitives and their generated hooks.
   *
   * These are produced by the shadcn CLI and are meant to be re-generated, not
   * hand-edited — patching them to satisfy the React Compiler rules would be
   * silently undone the next time one is updated. They are linted for
   * correctness but exempt from the rules that only flag upstream's authoring
   * style.
   */
  {
    files: ['components/ui/**', 'hooks/use-mobile.ts', 'hooks/use-toast.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]

export default config
