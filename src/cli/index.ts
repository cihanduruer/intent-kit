#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { IntentKit } from '../index';
import { createDefaultIntent, ScaleLevel } from '../core/intent';
const program = new Command();
const intentKit = new IntentKit();

program
  .name('intent-kit')
  .description('Intent-driven development toolkit')
  .version('0.1.0');

// Init command
program
  .command('init <project-name>')
  .description('Initialize a new intent file')
  .option('-s, --scale <level>', 'Scale level (solo, startup, team, enterprise)', 'solo')
  .option('-o, --output <file>', 'Output file path', 'intent.yaml')
  .action((projectName: string, options: { scale: string; output: string }) => {
    try {
      const intent = createDefaultIntent(projectName);
      intent.scale = options.scale as ScaleLevel;
      
      const yaml = intentKit.exportYAML(intent);
      fs.writeFileSync(options.output, yaml, 'utf-8');
      
      console.log(chalk.green('✓'), `Created intent file: ${options.output}`);
      console.log(chalk.dim('Edit the file to add your requirements, then run:'));
      console.log(chalk.cyan(`  intent-kit generate ${options.output}`));
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Generate command
program
  .command('generate <intent-file>')
  .description('Generate project from intent file')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(async (intentFile: string, options: { output: string }) => {
    try {
      console.log(chalk.blue('Reading intent file...'));
      
      const content = fs.readFileSync(intentFile, 'utf-8');
      const ext = path.extname(intentFile).toLowerCase();
      
      let intent;
      if (ext === '.yaml' || ext === '.yml') {
        intent = intentKit.parseYAML(content);
      } else if (ext === '.json') {
        intent = intentKit.parseJSON(content);
      } else {
        throw new Error('Unsupported file format. Use .yaml, .yml, or .json');
      }
      
      console.log(chalk.blue('Selecting stack...'));
      const stack = intentKit.selectStack(intent);
      
      console.log(chalk.dim('Selected stack:'));
      console.log(chalk.dim(`  Architecture: ${stack.architecture}`));
      console.log(chalk.dim(`  Backend: ${stack.technologies.backend?.framework || 'N/A'}`));
      console.log(chalk.dim(`  Frontend: ${stack.technologies.frontend?.framework || 'N/A'}`));
      console.log(chalk.dim(`  Database: ${stack.technologies.database?.engine || 'N/A'}`));
      
      console.log(chalk.blue('Generating project...'));
      const result = await intentKit.generateFromIntent(intent, options.output);
      
      if (result.success) {
        console.log(chalk.green('✓'), 'Project generated successfully!');
        console.log(chalk.dim(`Created ${result.filesCreated.length} files`));
        console.log(chalk.dim(`Created ${result.directoriesCreated.length} directories`));
      } else {
        console.log(chalk.yellow('⚠'), 'Project generated with errors:');
        result.errors.forEach(err => console.log(chalk.red('  -'), err));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Describe command
program
  .command('describe <description>')
  .description('Generate project from natural language description')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(async (description: string, options: { output: string }) => {
    try {
      console.log(chalk.blue('Parsing description...'));
      const intent = intentKit.parseNaturalLanguage(description);
      
      console.log(chalk.dim('Interpreted intent:'));
      console.log(chalk.dim(`  Name: ${intent.name}`));
      console.log(chalk.dim(`  Scale: ${intent.scale}`));
      console.log(chalk.dim(`  Requirements: ${intent.requirements.join(', ')}`));
      
      console.log(chalk.blue('Generating project...'));
      const result = await intentKit.generateFromIntent(intent, options.output);
      
      if (result.success) {
        console.log(chalk.green('✓'), 'Project generated successfully!');
      } else {
        console.log(chalk.yellow('⚠'), 'Project generated with errors');
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate <intent-file>')
  .description('Validate an intent file')
  .action((intentFile: string) => {
    try {
      const content = fs.readFileSync(intentFile, 'utf-8');
      const ext = path.extname(intentFile).toLowerCase();
      
      if (ext === '.yaml' || ext === '.yml') {
        intentKit.parseYAML(content);
      } else if (ext === '.json') {
        intentKit.parseJSON(content);
      } else {
        throw new Error('Unsupported file format');
      }
      
      console.log(chalk.green('✓'), 'Intent file is valid');
    } catch (error) {
      console.error(chalk.red('✗'), 'Invalid intent file:', error);
      process.exit(1);
    }
  });

program.parse();
