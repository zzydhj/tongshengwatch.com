---
name: astro-mobile-menu
description: Implements a responsive Astro site header with a mobile slide-in drawer menu using CSS transform animations, native <details>/<summary> submenus (zero-JS expand/collapse), and config-driven navigation structure. Use when building or replicating an Astro navigation header, mobile hamburger drawer, multi-level dropdown menu, or when the user asks for a stable, easy-to-edit mobile menu in an Astro project.
---

# Astro 响应式导航 + 移动端侧滑菜单方案

一套稳定、流畅、易维护的 Astro 站点导航方案。桌面端为下拉菜单，移动端为右侧滑入抽屉，二三级子菜单用原生 `<details>/<summary>` 实现，菜单层级由 config 数据驱动。本文件自包含全部原理、提示词与完整生产级源码，可直接拷贝到任何电脑、粘贴给任何 AI 复现。

## 何时使用

- 在 Astro 项目中从零搭建站点导航 / 顶部 Header
- 需要移动端汉堡按钮 + 侧滑抽屉菜单
- 需要二三级可折叠子菜单，且不想引入 JS 框架或动画库
- 用户希望菜单"稳定、动效流畅、好编辑"

## 核心设计原则（为什么稳定又好编辑）

1. **抽屉滑动用 CSS `transform`**：GPU 加速，流畅不掉帧；JS 只负责切换 `.open` 类名，不逐帧操作动画。
2. **子菜单用原生 `<details>/<summary>`**：展开/收起是浏览器原生行为，零 JS、自带键盘与无障碍支持，天然稳定。
3. **箭头旋转用 CSS `[open]` 属性选择器**：纯 CSS，无需状态管理。
4. **菜单结构由 config 数据数组驱动**：组件用 `.map()` 渲染，增删二三级菜单只改配置数组，不动组件 HTML。
5. **遮罩 + 点击链接自动关闭 + 锁定 body 滚动**：体验完整。

## 一键复现提示词（可直接粘贴给任何 AI）

```
请用 Astro 帮我实现一个响应式站点导航组件 Header.astro，要求：

1. 桌面端（≥900px）：横向导航，含下拉子菜单，hover 展开，带箭头旋转动画。
2. 移动端（<900px）：右上角汉堡按钮，点击后从右侧滑入抽屉菜单（宽 280px，max-width:80vw），
   带半透明遮罩，点击遮罩或菜单内链接自动关闭，打开时锁定 body 滚动。
3. 二三级子菜单：用原生 <details>/<summary> 标签实现折叠展开，不写 JS，
   展开时箭头用 CSS [open] 选择器旋转 180°。
4. 菜单结构由 config.ts 里的 navItems 数组驱动（字段：zh/en/href/children），
   组件用 .map() 渲染，有 children 渲染成可折叠子菜单，否则渲染成普通链接。
5. 抽屉滑动动画用 CSS transform: translateX(100%) -> translateX(0)，transition 0.3s ease；
   遮罩用 opacity + visibility 过渡。
6. JS 只做三件事：切换 .open 类名、锁定/恢复 body 滚动、绑定关闭事件。

请按上述规范输出完整的 Header.astro（含 <style> 与 <script>）和 config.ts 的 navItems 数据结构。
```

## 关键实现讲解

### 1. 菜单数据（config.ts，数据驱动核心）

```ts
export interface NavItem {
  zh: string;
  en: string;
  href: string; // 统一写中文路径，如 /about/
  children?: { zh: string; en: string; href: string }[];
}
```

> 增删二三级菜单：只需编辑 navItems 数组。有 `children` 自动渲染为可折叠子菜单，没有则渲染为普通链接。

### 2. 移动端子菜单（details/summary，零 JS）

```astro
<details class="mobile-dropdown">
  <summary class="mobile-nav-link">
    {item[lang]}
    <svg class="mobile-arrow">…</svg>
  </summary>
  <ul class="mobile-sub-list">
    {item.children.map((child) => (
      <li><a href={child.href} class="mobile-sub-link">{child[lang]}</a></li>
    ))}
  </ul>
</details>
```

展开/收起交给浏览器原生处理；箭头旋转靠 `.mobile-dropdown[open] .mobile-arrow { transform: rotate(180deg); }` 纯 CSS 实现。

### 3. 抽屉动效（CSS，关键）

```css
.mobile-menu {
  transform: translateX(100%);      /* 默认藏在屏幕右侧外 */
  transition: transform 0.3s ease;  /* 滑动动画 */
}
.mobile-menu.open { transform: translateX(0); }  /* 加 .open 滑入 */
```

### 4. 开关逻辑（极简 JS，只做三件事）

```js
function openMenu() {
  menu?.classList.add("open");
  overlay?.classList.add("open");
  document.body.style.overflow = "hidden"; // 锁定背景滚动
}
function closeMenu() { /* 反向移除 .open 并恢复 overflow */ }
// 绑定：汉堡按钮开、关闭按钮关、遮罩关、菜单内链接点击后关
```

## 避坑要点

- **不要用 JS 逐帧做抽屉动画**，用 CSS `transform` + 切类名，否则易卡顿。
- **子菜单别自己写展开逻辑**，用 `<details>/<summary>` 交给浏览器，最稳。
- **Astro 的 `<script>` 默认会被打包**，用 `document.getElementById` 在 DOM 就绪后获取元素即可；如需注入 frontmatter 变量用 `define:vars`。
- **Astro `<style>` 默认作用域化**（自动加 `data-astro-cid`），动态插入的元素若需命中样式注意作用域。
- **记得锁定 body 滚动**（`overflow:hidden`），否则抽屉打开时背景还能滚。
- 桌面/移动切换用 `@media (min-width: 900px)` 控制 `.desktop-nav` 与 `.menu-toggle` 的显隐。

---

## 完整生产级源码

以下为经过生产验证的完整源码，可直接复制使用。

### Header.astro（完整组件）

```astro
---
// Header.astro - 顶部导航组件（桌面端下拉菜单 + 移动端侧滑菜单 + 语言切换）
import { siteConfig, navItems, localizeHref, type Lang } from "../config";

interface Props {
  lang?: Lang;
}
const lang: Lang = Astro.props.lang ?? "zh";
const site = siteConfig[lang];

// 当前页面路径，用于高亮导航项
const currentPath = Astro.url.pathname;

// 判断导航项是否处于激活状态（对比中文路径，去掉 /en 前缀和锚点）
function isActive(href: string): boolean {
  const path = href.split("#")[0]; // 配置里的中文路径，如 /about/
  const cur = currentPath.replace(/^\/en/, "") || "/"; // 当前路径去掉 /en 前缀
  if (path === "/") return cur === "/";
  return cur.startsWith(path);
}

// 语言切换：跳到另一语言版本的对应页面
const otherLangHref =
  lang === "zh"
    ? `/en${currentPath}`
    : currentPath.replace(/^\/en/, "") || "/";
const switchLabel = lang === "zh" ? "EN" : "中文";
---

<header class="site-header">
  <div class="header-inner">
    <!-- Logo -->
    <a href={localizeHref("/", lang)} class="logo">
      <img src={siteConfig.logo} alt={site.name} class="logo-img" />
      <span class="logo-text">{site.name}</span>
    </a>

    <!-- 桌面端导航 -->
    <nav class="desktop-nav" aria-label="主导航">
      <ul class="nav-list">
        {
          navItems.map((item) => (
            <li class={`nav-item${item.children ? " has-dropdown" : ""}`}>
              <a
                href={localizeHref(item.href, lang)}
                class={`nav-link${isActive(item.href) ? " active" : ""}`}
              >
                {item[lang]}
                {item.children && (
                  <svg
                    class="arrow-icon"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
              </a>
              {item.children && (
                <ul class="dropdown">
                  {item.children.map((child) => (
                    <li>
                      <a
                        href={localizeHref(child.href, lang)}
                        class="dropdown-link"
                      >
                        {child[lang]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        }
        <!-- 语言切换按钮 -->
        <li class="nav-item nav-lang">
          <a href={otherLangHref} class="lang-switch">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            {switchLabel}
          </a>
        </li>
      </ul>
    </nav>

    <!-- 移动端：语言切换 + 汉堡按钮 -->
    <div class="mobile-actions-right">
      <a href={otherLangHref} class="lang-switch lang-switch-mobile">{switchLabel}</a>
      <button class="menu-toggle" id="menuToggle" aria-label="打开菜单">
        <span class="hamburger-line" />
        <span class="hamburger-line" />
        <span class="hamburger-line" />
      </button>
    </div>
  </div>
</header>

<!-- 移动端遮罩 -->
<div class="mobile-overlay" id="mobileOverlay" />

<!-- 移动端侧滑菜单 -->
<nav class="mobile-menu" id="mobileMenu" aria-label="移动端导航">
  <div class="mobile-menu-header">
    <span class="mobile-menu-title">{site.name}</span>
    <button class="menu-close" id="menuClose" aria-label="关闭菜单">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
  <ul class="mobile-nav-list">
    {
      navItems.map((item) => (
        <li class="mobile-nav-item">
          {item.children ? (
            <>
              <details class="mobile-dropdown">
                <summary class="mobile-nav-link">
                  {item[lang]}
                  <svg
                    class="mobile-arrow"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <ul class="mobile-sub-list">
                  <li>
                    <a href={localizeHref(item.href, lang)} class="mobile-sub-link">
                      {item[lang]}{lang === "zh" ? "（总览）" : ""}
                    </a>
                  </li>
                  {item.children.map((child) => (
                    <li>
                      <a href={localizeHref(child.href, lang)} class="mobile-sub-link">
                        {child[lang]}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </>
          ) : (
            <a
              href={localizeHref(item.href, lang)}
              class={`mobile-nav-link${isActive(item.href) ? " active" : ""}`}
            >
              {item[lang]}
            </a>
          )}
        </li>
      ))
    }
  </ul>
</nav>

<script>
  const toggle = document.getElementById("menuToggle");
  const close = document.getElementById("menuClose");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");

  function openMenu() {
    menu?.classList.add("open");
    overlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu?.classList.remove("open");
    overlay?.classList.remove("open");
    document.body.style.overflow = "";
  }

  toggle?.addEventListener("click", openMenu);
  close?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  // 点击菜单内链接后自动关闭
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
</script>

<style>
  /* ========== 顶部固定 Header ========== */
  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: #fff;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
    z-index: 1000;
  }
  .header-inner {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #1a1a1a;
    flex-shrink: 0;
  }
  .logo-img {
    height: 44px;
    width: auto;
    object-fit: contain;
  }
  .logo-text {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 2px;
    white-space: nowrap;
  }

  /* ========== 桌面端导航 ========== */
  .desktop-nav {
    display: none;
  }
  @media (min-width: 900px) {
    .desktop-nav {
      display: block;
    }
    .menu-toggle {
      display: none !important;
    }
  }
  .nav-list {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-item {
    position: relative;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 16px;
    font-size: 15px;
    color: #333;
    text-decoration: none;
    white-space: nowrap;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
    cursor: pointer;
  }
  .nav-link:hover,
  .nav-link.active {
    color: #000;
    font-weight: 600;
  }
  .nav-link.active {
    border-bottom: 2px solid #000;
    border-radius: 0;
  }
  .arrow-icon {
    transition: transform 0.25s;
  }

  /* 下拉菜单 */
  .dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    min-width: 160px;
    background: #fff;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    padding: 8px 0;
    list-style: none;
    margin: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.25s, transform 0.25s, visibility 0.25s;
  }
  .nav-item.has-dropdown:hover .dropdown,
  .nav-item.has-dropdown:focus-within .dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
  .nav-item.has-dropdown:hover .arrow-icon {
    transform: rotate(180deg);
  }
  .dropdown-link {
    display: block;
    padding: 11px 22px;
    font-size: 14px;
    color: #2e2e2f;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
  }
  .dropdown-link:hover {
    background: #f5f5f5;
    color: #000;
  }

  /* ========== 语言切换按钮 ========== */
  .mobile-actions-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lang-switch {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    font-size: 13px;
    color: #444;
    border: 1px solid #d9d9d9;
    border-radius: 999px;
    text-decoration: none;
    white-space: nowrap;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .lang-switch:hover {
    border-color: #000;
    color: #000;
    background: #fafafa;
  }
  .lang-switch-mobile {
    padding: 6px 12px;
  }

  /* 如需暂时隐藏语言切换按钮，取消下面注释 */
  /* .nav-lang,
  .lang-switch-mobile {
    display: none !important;
  } */

  /* ========== 汉堡按钮 ========== */
  .menu-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 42px;
    height: 42px;
    padding: 10px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
  }
  .menu-toggle:hover {
    background: #f2f2f2;
  }
  .hamburger-line {
    display: block;
    width: 100%;
    height: 2px;
    background: #333;
    border-radius: 2px;
    transition: transform 0.3s, opacity 0.3s;
  }

  /* ========== 移动端遮罩 & 侧滑菜单 ========== */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1998;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
  }
  .mobile-overlay.open {
    opacity: 1;
    visibility: visible;
  }
  .mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    max-width: 80vw;
    background: #fff;
    z-index: 1999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .mobile-menu.open {
    transform: translateX(0);
  }
  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }
  .mobile-menu-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  .menu-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: #666;
    border-radius: 6px;
    display: flex;
    transition: background 0.2s;
  }
  .menu-close:hover {
    background: #f2f2f2;
  }
  .mobile-nav-list {
    list-style: none;
    margin: 0;
    padding: 10px 0;
  }
  .mobile-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    font-size: 15px;
    color: #333;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s;
    list-style: none;
  }
  .mobile-nav-link:hover,
  .mobile-nav-link.active {
    background: #f7f7f7;
    color: #000;
  }
  .mobile-dropdown summary::-webkit-details-marker {
    display: none;
  }
  .mobile-dropdown .mobile-arrow {
    transition: transform 0.25s;
  }
  .mobile-dropdown[open] .mobile-arrow {
    transform: rotate(180deg);
  }
  .mobile-sub-list {
    list-style: none;
    margin: 0;
    padding: 0;
    background: #fafafa;
  }
  .mobile-sub-link {
    display: block;
    padding: 12px 24px 12px 42px;
    font-size: 14px;
    color: #555;
    text-decoration: none;
    transition: background 0.15s;
  }
  .mobile-sub-link:hover {
    background: #f0f0f0;
    color: #000;
  }
</style>
```

### config.ts（导航相关部分）

```ts
export type Lang = "zh" | "en";

// ---------- 导航结构（双语） ----------
// href 统一写中文路径（如 /about/），Header 会根据语言自动加 /en 前缀
// children 为下拉子菜单，没有 children 则为普通链接
export interface NavItem {
  zh: string;
  en: string;
  href: string;
  children?: { zh: string; en: string; href: string }[];
}

export const navItems: NavItem[] = [
  { zh: "首页", en: "Home", href: "/" },
  {
    zh: "企业介绍",
    en: "Company",
    href: "/about/",
    children: [
      { zh: "企业介绍", en: "Introduction", href: "/about/#intro" },
      { zh: "企业理念", en: "Philosophy", href: "/about/#philosophy" },
      { zh: "发展历程", en: "History", href: "/about/#history" },
      { zh: "质量保证", en: "Quality", href: "/about/#quality" },
      { zh: "资质证书", en: "Certificates", href: "/about/#certificates" },
      { zh: "合作客户", en: "Clients", href: "/about/#clients" },
    ],
  },
  {
    zh: "产品服务",
    en: "Products",
    href: "/products/",
    children: [
      { zh: "产品简介", en: "Overview", href: "/products/#intro" },
      { zh: "实心带", en: "Solid Band", href: "/products/#solid" },
      { zh: "包边带", en: "Edge Band", href: "/products/#edge" },
      { zh: "表壳", en: "Watch Case", href: "/products/#case" },
      { zh: "网带", en: "Mesh Band", href: "/products/#mesh" },
      { zh: "弹弓带", en: "Spring Band", href: "/products/#spring" },
    ],
  },
  { zh: "新闻中心", en: "News", href: "/news/" },
  { zh: "联系我们", en: "Contact", href: "/contact/" },
];

// ---------- 工具函数 ----------
// 根据语言给内部链接加前缀：zh 原样返回，en 加 /en 前缀
// 外部链接（http/tel/mailto）不处理
export function localizeHref(href: string, lang: Lang): string {
  if (/^(https?:|tel:|mailto:)/.test(href)) return href;
  if (lang === "zh") return href;
  // "/" -> "/en/"，"/about/" -> "/en/about/"
  return href === "/" ? "/en/" : `/en${href}`;
}
```

## 复用说明

- **单语言项目**：把 `NavItem` 的 `zh/en` 简化为单个 `label` 字段，组件里 `item[lang]` 改为 `item.label`，去掉 `localizeHref` 直接用 `item.href`。
- **隐藏语言切换**：取消 `Header.astro` 中 `.nav-lang, .lang-switch-mobile { display:none !important; }` 的注释。
- **改断点**：默认 `900px` 切换桌面/移动，可在 `@media` 与对应规则里统一调整。
