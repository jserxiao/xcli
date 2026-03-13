import type { Plugin, StyleType } from '../../types/index.js';
import { LINTER_VERSIONS } from '../../constants/index.js';

/**
 * 获取 Stylelint 配置
 */
function getStylelintConfig(styleType: StyleType = 'css'): object {
  const config: Record<string, any> = {
    extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
    plugins: ['stylelint-order'],
    rules: {
      'selector-class-pattern': null,
      'no-descending-specificity': null,
      'declaration-block-no-duplicate-properties': true,
      'no-duplicate-selectors': true,
      'property-no-unknown': true,
      'order/properties-order': [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',
        'display',
        'flex',
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',
        'align-content',
        'order',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'width',
        'height',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'border',
        'border-radius',
        'background',
        'background-color',
        'color',
        'font-size',
        'font-weight',
        'line-height',
        'text-align',
        'transition',
        'transform',
        'animation',
      ],
    },
  };

  // SCSS 特殊配置
  if (styleType === 'scss') {
    config.extends = ['stylelint-config-standard-scss', 'stylelint-prettier/recommended'];
  }

  return config;
}

/**
 * 创建 Stylelint 插件实例（支持不同样式类型）
 */
export function createStylelintPlugin(styleType: StyleType = 'css'): Plugin {
  const devDeps: Record<string, string> = {
    stylelint: LINTER_VERSIONS.stylelint,
    'stylelint-config-standard': LINTER_VERSIONS['stylelint-config-standard'],
    'stylelint-order': LINTER_VERSIONS['stylelint-order'],
    'stylelint-prettier': LINTER_VERSIONS['stylelint-prettier'],
  };

  // SCSS 需要额外依赖
  if (styleType === 'scss') {
    devDeps['stylelint-config-standard-scss'] = LINTER_VERSIONS['stylelint-config-standard-scss'];
  }

  // Less 需要额外依赖
  if (styleType === 'less') {
    devDeps['postcss-less'] = LINTER_VERSIONS['postcss-less'];
  }

  return {
    name: 'stylelint',
    displayName: 'Stylelint',
    description: '添加 Stylelint 样式检查配置',
    category: 'linter',
    defaultEnabled: true,
    devDependencies: devDeps,
    scripts: {
      'lint:style': 'stylelint "src/**/*.{css,scss,less}"',
      'lint:style:fix': 'stylelint "src/**/*.{css,scss,less}" --fix',
    },
    files: [
      {
        path: '.stylelintrc.json',
        content: JSON.stringify(getStylelintConfig(styleType), null, 2),
      },
      {
        path: '.stylelintignore',
        content: 'node_modules\ndist\ncoverage\n*.min.css\n',
      },
    ],
  };
}

/**
 * 默认 Stylelint 插件
 */
export const stylelintPlugin: Plugin = createStylelintPlugin();
