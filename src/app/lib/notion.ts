import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import "server-only";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// export const fetchPages = React.cache(() => {
//   return notion.databases.query({
//     database_id: process.env.NOTION_DATABASE_ID!,
//     filter: {
//       property: "Status",
//       select: {
//         equals: "Live",
//       },
//     },
//   });
// });
export const fetchPages = React.cache(async () => {
  console.log("NOTION_DATABASE_ID:", process.env.NOTION_DATABASE_ID);
  console.log("NOTION_TOKEN:", process.env.NOTION_TOKEN);
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });
    console.log("Notion API Response:", response);
    return response;
  } catch (error) {
    console.error("Notion API Error:", error);
    throw error;
  }
});

export const fetchBySlug = React.cache((slug: string) => {
  return notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "slug",
        rich_text: {
          equals: slug,
        },
      },
    })
    .then((response) => {
      return response.results[0] as PageObjectResponse | undefined;
    });
});
export const fetchPageBlocks = React.cache((pageId: string) => {
  return notion.blocks.children
    .list({ block_id: pageId })
    .then((response) => response.results as BlockObjectResponse[]);
});
