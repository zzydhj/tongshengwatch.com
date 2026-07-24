// content.config.ts - 内容集合定义（Astro Content Layer）
// ============================================================
// 新闻和产品都用 MDX 文件管理：
//   - 新闻放在  src/content/news/     目录下（.mdx 文件）
//   - 产品放在  src/content/products/ 目录下（.mdx 文件）
// 新增一篇新闻/一个产品 = 新建一个 .mdx 文件，页面自动生成（动态路由）。
// ============================================================
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ===== 新闻集合 =====
const news = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(), // 新闻标题
    date: z.string(), // 发布日期，如 "2025-06-18"
    category: z.string(), // 分类，如 "公司动态" / "行业资讯" / "展会信息"
    summary: z.string(), // 摘要（显示在新闻列表页）
  }),
});

// ===== 产品集合 =====
const products = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(), // 产品名称，如 "实心带"
    feature: z.string(), // 特点标签，如 "抗腐蚀 · 防锈耐汗"
    desc: z.string(), // 简介（显示在产品汇总页）
    image: z.string(), // 产品主图 URL（列表页与详情页共用）
    materials: z.string(), // 材质
    capacity: z.string(), // 产能
    order: z.number(), // 排序（数字越小越靠前）
    summary: z.string().optional(), // SEO 描述（可选）
  }),
});

export const collections = { news, products };
