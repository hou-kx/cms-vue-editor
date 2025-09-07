import { $t } from "@/plugins/i18n";

export default {
  path: "/article",
  redirect: "/article/index",
  meta: {
    icon: "ri/information-line",
    // showLink: false,
    title: $t("menus.pureAbnormal"),
    rank: 10
  },
  children: [
    {
      path: "/article/index",
      name: "article",
      component: () => import("@/views/article/index.vue"),
      meta: {
        title: $t("menus.article")
      }
    }
  ]
} satisfies RouteConfigsTable;
