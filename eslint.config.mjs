// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any':           'error',
    '@typescript-eslint/no-unused-vars':            ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports':   ['error', { prefer: 'type-imports' }],

    // Vue
    'vue/component-api-style':        ['error', ['script-setup']],
    'vue/define-props-declaration':   ['error', 'type-based'],
    'vue/define-emits-declaration':   ['error', 'type-based'],
    'vue/no-v-html':                  'error',
    'vue/no-multiple-template-root':  'off', // Nuxt pages can have fragments
    'vue/html-self-closing':          ['error', { html: { void: 'always', normal: 'always', component: 'always' } }],
    'vue/block-order':                ['error', { order: ['script', 'template', 'style'] }],

    // General
    'no-console':    ['warn', { allow: ['warn', 'error'] }],
    'no-debugger':   'error',
    'prefer-const':  'error',
  },
})
