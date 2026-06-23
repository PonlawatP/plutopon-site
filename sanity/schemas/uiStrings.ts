import { defineType, defineField } from "sanity";

const ls = (name: string, title: string) =>
  defineField({ name, title, type: "localizedString" });

export const uiStrings = defineType({
  name: "uiStrings",
  title: "UI Strings",
  type: "document",
  groups: [
    { name: "nav", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "common", title: "Common" },
  ],
  fields: [
    defineField({
      name: "nav",
      title: "Navigation",
      type: "object",
      group: "nav",
      fields: [
        ls("home", "Home"),
        ls("projects", "Projects"),
        ls("blog", "Blog"),
        ls("resume", "Resume"),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [ls("copyright", "Copyright")],
    }),
    defineField({
      name: "common",
      title: "Common",
      type: "object",
      group: "common",
      fields: [ls("readMore", "Read More"), ls("backHome", "Back Home")],
    }),
  ],
});
