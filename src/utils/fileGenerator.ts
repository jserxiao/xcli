import fs from 'fs-extra';
import path from 'path';
import type { Plugin, PluginContext, PluginFile } from '../types/index.js';
import { getGitignoreContent } from '../templates/shared.js';

/**
 * 文件生成器
 */
export class FileGenerator {
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * 生成单个文件
   */
  async generateFile(file: PluginFile): Promise<void> {
    const filePath = path.join(this.context.projectPath, file.path);
    const dir = path.dirname(filePath);

    // 确保目录存在
    await fs.ensureDir(dir);

    // 生成文件内容
    const content =
      typeof file.content === 'function'
        ? file.content(this.context)
        : file.content;

    // 写入文件
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * 批量生成文件
   */
  async generateFiles(files: PluginFile[]): Promise<void> {
    for (const file of files) {
      await this.generateFile(file);
    }
  }

  /**
   * 根据插件生成文件
   */
  async generateFromPlugins(plugins: Plugin[]): Promise<void> {
    for (const plugin of plugins) {
      if (plugin.files && plugin.files.length > 0) {
        await this.generateFiles(plugin.files);
      }
    }
  }
}

/**
 * 创建基础文件（.gitignore 和 README.md）
 */
export async function createBaseFiles(
  projectPath: string,
  projectName: string,
  projectType: string
): Promise<void> {
  // 使用共享的 gitignore 内容（但保留 library 项目的简化版）
  const isLibrary = projectType === 'library';

  if (isLibrary) {
    // library 项目使用简化版的 gitignore
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      `# Dependencies
node_modules/

# Build output
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/

# Environment
.env
.env.local
.env.*.local
`,
      'utf-8'
    );
  } else {
    // React/Vue 项目使用完整的 gitignore
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      getGitignoreContent(),
      'utf-8'
    );
  }

  // 根据 projectType 生成不同的 README
  let readmeContent = `# ${projectName}\n\n`;

  if (projectType === 'react' || projectType === 'vue') {
    readmeContent += `## 开发

\`\`\`bash
npm install
npm run dev
\`\`\`

## 构建

\`\`\`bash
npm run build
\`\`\`

## 预览

\`\`\`bash
npm run preview
\`\`\`
`;
  } else {
    readmeContent += `## Installation

\`\`\`bash
npm install ${projectName}
\`\`\`

## Usage

\`\`\`typescript
import { hello } from '${projectName}';

console.log(hello('World'));
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test
\`\`\`
`;
  }

  readmeContent += `\n## License\n\nMIT`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent, 'utf-8');
}
