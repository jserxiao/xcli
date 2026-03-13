import type { Plugin, PluginContext, StyleType } from '../types/index.js';

/**
 * 根据样式类型获取 Stylelint 配置
 */
function getStylelintConfig(styleType: StyleType = 'less'): string {
  // 根据样式类型确定 extends
  let extendsArr: string[];

  if (styleType === 'scss') {
    extendsArr = ['stylelint-config-standard-scss'];
  } else if (styleType === 'less') {
    extendsArr = ['stylelint-config-standard-less'];
  } else {
    extendsArr = ['stylelint-config-standard'];
  }

  // 基础规则
  const rules: Record<string, any> = {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'declaration-block-no-duplicate-properties': true,
    'color-hex-length': 'short',
    'color-named': 'never',
    'font-family-name-quotes': 'always-where-recommended',
  };

  // 根据样式类型添加特定规则
  if (styleType === 'scss') {
    rules['scss/at-rule-no-unknown'] = true;
    rules['scss/dollar-variable-pattern'] = '^[a-z][a-zA-Z0-9]*$';
  } else if (styleType === 'less') {
    rules['less/at-rule-no-unknown'] = true;
  }

  const config = {
    extends: extendsArr,
    rules,
  };

  return JSON.stringify(config, null, 2);
}

/**
 * 获取 .stylelintignore 内容
 */
function getStylelintIgnore(): string {
  return `dist/
node_modules/
coverage/
*.min.css
*.min.less
*.min.scss
`;
}

/**
 * Stylelint 插件（基础版本，依赖在模板中动态添加）
 */
export const stylelintPlugin: Plugin = {
  name: 'stylelint',
  displayName: 'Stylelint',
  description: '添加样式代码规范检查',
  category: 'linter',
  defaultEnabled: true,
  devDependencies: {
    stylelint: '^16.2.0',
    'stylelint-config-standard': '^36.0.0',
  },
  files: [
    {
      path: '.stylelintrc.json',
      content: (context: PluginContext) => getStylelintConfig(context.styleType),
    },
    {
      path: '.stylelintignore',
      content: getStylelintIgnore(),
    },
  ],
  scripts: {
    'lint:style': 'stylelint "src/**/*.{css,less,scss}"',
    'lint:style:fix': 'stylelint "src/**/*.{css,less,scss}" --fix',
  },
};

/**
 * 根据样式类型获取 Stylelint 依赖
 */
export function getStylelintDevDependencies(styleType: StyleType = 'css'): Record<string, string> {
  const deps: Record<string, string> = {
    stylelint: '^16.2.0',
  };

  if (styleType === 'scss') {
    deps['stylelint-config-standard-scss'] = '^13.0.0';
  } else if (styleType === 'less') {
    deps['stylelint-config-standard-less'] = '^3.0.0';
  } else {
    deps['stylelint-config-standard'] = '^36.0.0';
  }

  return deps;
}

/**
 * 根据样式类型创建 Stylelint 插件
 */
export function createStylelintPlugin(styleType: StyleType = 'css'): Plugin {
  return {
    ...stylelintPlugin,
    devDependencies: getStylelintDevDependencies(styleType),
    files: [
      {
        path: '.stylelintrc.json',
        content: getStylelintConfig(styleType),
      },
      {
        path: '.stylelintignore',
        content: getStylelintIgnore(),
      },
    ],
  };
}
