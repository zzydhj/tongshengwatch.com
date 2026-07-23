// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "zh", // 默认中文
    locales: ["zh", "en"],
    routing: {
      // 中文放根路径（/about/），英文放 /en/ 前缀（/en/about/）
      prefixDefaultLocale: false,
    },
  },

  integrations: [mdx()],
});