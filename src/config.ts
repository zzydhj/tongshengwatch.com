// ============================================
// 站点全局配置（双语）- 东莞市同盛钟表有限公司
// 修改导航 / 联系信息 / 备案号 只需要改这一个文件
// ============================================

export type Lang = "zh" | "en";

// 站点基本信息（双语）
export const siteConfig = {
  zh: {
    name: "同盛钟表",
    fullName: "东莞市同盛钟表有限公司",
    description:
      "东莞市同盛钟表有限公司成立于2004年，深耕中高端手表配件领域二十载，专注为全球高端腕表品牌打造实心表带、包边表带、表壳、网带、弹弓带等高品质配件，月产能达实心带8万条、包边带10万条、表壳4万套。",
    copyright: "版权所有:东莞市同盛钟表有限公司",
  },
  en: {
    name: "Tongsheng Watch",
    fullName: "Dongguan Tongsheng Watch Co., Ltd.",
    description:
      "Founded in 2004, Dongguan Tongsheng Watch Co., Ltd. has been dedicated to mid-to-high-end watch accessories for 20 years, producing solid bands, edge-wrapped bands, watch cases, mesh bands and spring bands for global premium watch brands.",
    copyright: "Copyright: Dongguan Tongsheng Watch Co., Ltd.",
  },
  // 以下信息两种语言共用
  // LOGO 网络占位图。后续替换：把真实 logo 放到 public/images/logo.png，再改回 "/images/logo.png"
  logo: "https://placehold.co/120x44/1a1d23/ffffff?text=同盛钟表",
  icp: "粤ICP备XXXXXXXX号-1", // TODO: 替换为真实备案号
  icpUrl: "https://beian.miit.gov.cn/",
  gongan: "粤公网安备XXXXXXXXXXXXX号", // TODO: 替换为真实公安备案号
  gonganUrl:
    "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=XXXXXXXXXXXXX",
};

// 联系信息（footer / 联系页使用，两种语言共用）
export const contactInfo = {
  address: "广东省东莞市东城街道榴花工业路6号1栋201室",
  addressEn:
    "Room 201, Building 1, No.6 Liuhua Industrial Road, Dongcheng Street, Dongguan, Guangdong, China",
  // 三个业务部门联系人
  contacts: [
    { name: "付先生（实心带部）", nameEn: "Mr. Fu (Solid Band)", tel: "13925827336" },
    { name: "吴小姐（包边带部）", nameEn: "Ms. Wu (Edge Band)", tel: "13686216590" },
    { name: "杨先生（表壳部）", nameEn: "Mr. Yang (Watch Case)", tel: "15917731500" },
  ],
  // 三个业务邮箱
  emails: [
    { label: "同盛实心带", labelEn: "Solid Band", email: "tszb9899@163.com" },
    { label: "创盛包边带", labelEn: "Edge Band", email: "tszb9999@163.com" },
    { label: "创盛表壳", labelEn: "Watch Case", email: "cszb1688@163.com" },
  ],
  mapUrl:
    "http://m.amap.com/search/view/keywords=广东省东莞市东城街道榴花工业路6号1栋201室",
};

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

// ---------- 页脚界面文字（双语） ----------
export const footerText = {
  zh: {
    aboutUs: "关于我们",
    products: "产品服务",
    contactUs: "联系我们",
    address: "地址",
    aboutLinks: [
      { label: "企业简介", href: "/about/#intro" },
      { label: "发展历程", href: "/about/#history" },
      { label: "新闻动态", href: "/news/" },
    ],
    productLinks: [
      { label: "实心带", href: "/products/#solid" },
      { label: "包边带", href: "/products/#edge" },
      { label: "表壳", href: "/products/#case" },
      { label: "网带 · 弹弓带", href: "/products/#mesh" },
    ],
  },
  en: {
    aboutUs: "About Us",
    products: "Products",
    contactUs: "Contact Us",
    address: "Address",
    aboutLinks: [
      { label: "Introduction", href: "/about/#intro" },
      { label: "History", href: "/about/#history" },
      { label: "News", href: "/news/" },
    ],
    productLinks: [
      { label: "Solid Band", href: "/products/#solid" },
      { label: "Edge Band", href: "/products/#edge" },
      { label: "Watch Case", href: "/products/#case" },
      { label: "Mesh · Spring Band", href: "/products/#mesh" },
    ],
  },
};

// ---------- 移动端底部快捷栏（双语） ----------
export const mobileActions = {
  zh: [
    { label: "首页", href: "/", icon: "home" },
    { label: "新闻", href: "/news/", icon: "news" },
    { label: "联系我们", href: "tel:13925827336", icon: "phone" },
    {
      label: "地址",
      href: "http://m.amap.com/search/view/keywords=广东省东莞市东城街道榴花工业路6号1栋201室",
      icon: "location",
    },
  ],
  en: [
    { label: "Home", href: "/", icon: "home" },
    { label: "News", href: "/news/", icon: "news" },
    { label: "Call", href: "tel:13925827336", icon: "phone" },
    {
      label: "Map",
      href: "http://m.amap.com/search/view/keywords=广东省东莞市东城街道榴花工业路6号1栋201室",
      icon: "location",
    },
  ],
};

// ---------- 工具函数 ----------
// 根据语言给内部链接加前缀：zh 原样返回，en 加 /en 前缀
// 外部链接（http/tel/mailto）不处理
export function localizeHref(href: string, lang: Lang): string {
  if (/^(https?:|tel:|mailto:)/.test(href)) return href;
  if (lang === "zh") return href;
  // "/" -> "/en/"，"/about/" -> "/en/about/"
  return href === "/" ? "/en/" : `/en${href}`;
}
