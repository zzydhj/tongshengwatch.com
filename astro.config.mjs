// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en", // 默认英文
    locales: ["en", "zh"],
    routing: {
      // 英文放根路径（/about/），中文放 /zh/ 前缀（/zh/about/）
      prefixDefaultLocale: false,
    },
  },

  integrations: [mdx()],
});