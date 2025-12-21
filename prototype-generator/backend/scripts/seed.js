/**
 * Database Seed Script
 * Populates demo data for testing
 */

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding database with demo data...\n');

    // Clean existing data
    console.log('🗑️  Cleaning existing data...');
    await prisma.projectAnalytics.deleteMany({});
    await prisma.projectVersion.deleteMany({});
    await prisma.projectTemplate.deleteMany({});
    await prisma.aPIKey.deleteMany({});
    await prisma.notificationSettings.deleteMany({});
    await prisma.billing.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.costLog.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.ideafinderData.deleteMany({});
    await prisma.brainstormingData.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.userQuota.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});

    // Create demo user
    console.log('👤 Creating demo user...');
    const hashedPassword = await hashPassword('demo12345');
    const user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        username: 'demouser',
        password: hashedPassword,
        name: 'Demo User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        bio: 'Testing Prototype Generator features',
      },
    });

    console.log(`  ✅ Created user: ${user.email}`);

    // Create user quota
    console.log('📊 Creating user quota...');
    const quota = await prisma.userQuota.create({
      data: {
        userId: user.id,
        monthlyTokenLimit: 100000,
        tokensUsedThisMonth: 25000,
        monthlyBudgetLimit: 10.0,
        spentThisMonth: 3.50,
      },
    });
    console.log(`  ✅ Created quota with ${100000 - 25000} tokens remaining`);

    // Create subscription
    console.log('💳 Creating subscription...');
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeCustomerId: 'cus_demo_123',
        plan: 'free',
        status: 'active',
      },
    });
    console.log(`  ✅ Created ${subscription.plan} subscription`);

    // Create notification settings
    console.log('🔔 Creating notification settings...');
    const notifications = await prisma.notificationSettings.create({
      data: {
        userId: user.id,
        emailOnComplete: true,
        emailOnQuotaWarning: true,
        emailOnBilling: true,
        emailWeeklyDigest: false,
      },
    });
    console.log(`  ✅ Created notification settings`);

    // Create demo projects
    console.log('\n📁 Creating demo projects...');

    // Project 1: Brainstorming
    const project1 = await prisma.project.create({
      data: {
        userId: user.id,
        title: 'AI Scheduling Assistant',
        description: 'A smart calendar app powered by AI',
        mode: 'brainstorming',
        topic: 'AI scheduling assistant for busy professionals',
        prdContent: `# AI Scheduling Assistant PRD

## Executive Summary
An intelligent scheduling tool that uses AI to optimize calendar management.

## Key Features
- Smart meeting scheduling
- Conflict detection
- Time zone handling
- Meeting suggestions

## Target Users
- Busy professionals
- Executives
- Project managers`,
        prototypeHtml: `<!DOCTYPE html>
<html>
<head>
  <title>AI Scheduler</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header p { font-size: 1.1em; opacity: 0.9; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .feature-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .feature-card h3 { color: #667eea; margin-bottom: 10px; }
    .feature-card p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 AI Scheduler</h1>
      <p>Intelligent calendar management powered by AI</p>
    </div>
    <div class="features">
      <div class="feature-card">
        <h3>🤖 Smart Scheduling</h3>
        <p>AI analyzes your preferences and suggests optimal meeting times.</p>
      </div>
      <div class="feature-card">
        <h3>⚡ Conflict Detection</h3>
        <p>Automatically prevents double-booking and scheduling conflicts.</p>
      </div>
      <div class="feature-card">
        <h3>🌍 Global Timezone</h3>
        <p>Seamlessly handle meetings across different time zones.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
        isFavorite: true,
      },
    });
    console.log(`  ✅ Created project: ${project1.title}`);

    // Create brainstorming data
    await prisma.brainstormingData.create({
      data: {
        projectId: project1.id,
        topic: 'AI scheduling assistant for busy professionals',
        chatHistory: JSON.stringify([
          {
            sender: 'user',
            message: 'I want to create an AI scheduling assistant',
            timestamp: new Date(),
          },
          {
            sender: 'ai',
            message:
              'Great idea! Who would be your primary users - professionals, enterprises, or both?',
            timestamp: new Date(),
          },
        ]),
      },
    });

    // Create analytics for project 1
    await prisma.projectAnalytics.create({
      data: {
        userId: user.id,
        projectId: project1.id,
        viewCount: 5,
        editCount: 2,
        exportCount: 1,
        totalTokensUsed: 5000,
        totalCost: 0.75,
        lastViewedAt: new Date(),
      },
    });

    // Project 2: Ideafinder
    const project2 = await prisma.project.create({
      data: {
        userId: user.id,
        title: 'Health & Fitness App',
        description: 'Generated from ideafinder with market analysis',
        mode: 'ideafinder',
        topic: 'Health and wellness technology',
        prdContent: `# Health & Fitness App PRD

## Market Analysis
High demand for personalized fitness solutions.

## Product Overview
A comprehensive health tracking application.

## Revenue Model
Freemium with premium features.`,
      },
    });
    console.log(`  ✅ Created project: ${project2.title}`);

    // Create analytics for project 2
    await prisma.projectAnalytics.create({
      data: {
        userId: user.id,
        projectId: project2.id,
        viewCount: 3,
        editCount: 1,
        exportCount: 0,
        totalTokensUsed: 3500,
        totalCost: 0.52,
        lastViewedAt: new Date(),
      },
    });

    // Create project templates
    console.log('\n🎨 Creating project templates...');
    const templates = [
      {
        name: 'SaaS Starter',
        description: 'Template for building SaaS applications',
        category: 'saas',
        prdTemplate: '# SaaS Product Requirements\n\n## Overview\n## Features\n## Pricing',
      },
      {
        name: 'Mobile App',
        description: 'Template for mobile applications',
        category: 'mobile',
        prdTemplate: '# Mobile App PRD\n\n## Platform\n## Core Features\n## UX/UI',
      },
      {
        name: 'E-Commerce',
        description: 'Template for e-commerce platforms',
        category: 'ecommerce',
        prdTemplate: '# E-Commerce PRD\n\n## Product Catalog\n## Payment Integration\n## Shipping',
      },
    ];

    for (const template of templates) {
      await prisma.projectTemplate.create({ data: template });
      console.log(`  ✅ Created template: ${template.name}`);
    }

    // Create API key
    console.log('\n🔑 Creating API key...');
    const crypto = await import('crypto');
    const rawKey = crypto.default.randomBytes(32).toString('hex');
    const hashedKey = crypto.default
      .createHash('sha256')
      .update(rawKey)
      .digest('hex');

    const apiKey = await prisma.aPIKey.create({
      data: {
        userId: user.id,
        name: 'Demo API Key',
        key: hashedKey,
        isActive: true,
      },
    });
    console.log(`  ✅ Created API key: ${apiKey.name}`);
    console.log(`     Key: ${rawKey}`);

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('✅ Demo Database Seeding Complete!\n');
    console.log('📊 Summary:');
    console.log(`  - Users: 1`);
    console.log(`  - Projects: 2`);
    console.log(`  - Templates: 3`);
    console.log(`  - API Keys: 1`);
    console.log('═'.repeat(50));
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
