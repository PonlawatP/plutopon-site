import { createElement } from "react";
import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoUrl",
      title: "Logo URL",
      description: "External logo URL. Takes priority over the uploaded image below.",
      type: "url",
    }),
    defineField({
      name: "logo",
      title: "Logo (upload fallback)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first.",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.en", logo: "logo", logoUrl: "logoUrl" },
    prepare({ title, logo, logoUrl }: { title?: string; logo?: unknown; logoUrl?: string }) {
      return {
        title,
        media: logoUrl
          ? createElement("img", { src: logoUrl, alt: "", style: { objectFit: "cover" } })
          : (logo as never),
      };
    },
  },
});
