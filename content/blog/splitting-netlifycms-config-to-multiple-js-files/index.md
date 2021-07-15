---
title: "Splitting huge NetlifyCMS config.yml file to multiple JS files"
date: "2021-07-15"
description: "An approach to modularize a huge NetlifyCMS configuration file using JavaScript."
---

For a long time, I have been procrastinating in finding a solution to my ever-growing NetlifyCMS config.yml file.

## Context

The website I have been working on consists of 18 unique pages (home page, about page, contact page, etc) as well as of a blog feature. The content of each page is stored in frontmatter inside markdown files, except for the content of the blog posts which is stored in actual markdown.

To demonstrate the differences between the content of each page, have a look at the following snippets of 3 of those pages:

**Home page**

```yaml
---
title: Home
seo:
  title: Lorem ipsum dolor sit amet
  description: >-
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat.
header:
  title:
    text_part_1: Sed ut perspiciatis
    text_part_2: unde omnis iste natus
  button:
    text: Lorem ipsum
    url: /lorem
  subtitle: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
key_facts_section:
  title: At vero eos et accusamus
  key_facts:
    - title: Et harum quidem
      icon: static/images/icons/clock.svg
    - title: Nam libero tempore
      icon: static/images/icons/earth.svg
testimonials: ...
---

```

**About page**

```yaml
---
title: About
menu:
  footer:
    weight: 40
  main:
    weight: 20
seo:
  title: Quis autem vel eum
  description: Et harum quidem rerum facilis est et expedita distinctio.
header:
  title: About
video_section:
  text: >-
    Et harum quidem rerum facilis est et expedita distinctio. Nam libero
    tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus
    id quod maxime placeat facere possimus.
  title: Rerum necessitatibus saepe
  video: https://player.vimeo.com/video/845028457
team_section: ...
---

```

**Blog post**

```yaml
---
title: Et harum quidem rerum facilis est et expedita
date: 2017-02-28
description: >-
  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
  quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda
  est, omnis dolor repellendus. Temporibus autem quibusdam et aut.
image: /images/uploads/featured-image.jpg
---
This is the body of the **blog post**, written in markdown.
```

As you can see the content of each page is vastly different from the others, yet there are some patterns that repeat themselves. To create a NetlifyCMS configuration file for all of the 18 pages and other data files I needed a **2'000 lines of code** config.yml file. This approach works, but the code is not very DRY and it is really hard to change something or add something new. It's time to improve.

## Make the NetlifyCMS configuration code DRY

One valid approach to not repeatting parts of the YAML configuration would be to use [YAML anchors (`&`), aliases (`*`), and overrides (`<<`)](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/). But I discovered a better approach. ✨

### Using JavaScript instead of YAML

Through the [related GitHub issue](https://github.com/netlify/netlify-cms/issues/3624#issuecomment-616076374) and the new [beta NetlifyCMS feature of manual initialization](https://www.netlifycms.org/docs/beta-features/#manual-initialization) I discovered that I am not restricted to using YAML to configure the CMS. Using JS does not only allow me to split the configuration into multiple files but to create objects and functions to keep my code DRY as well.

#### File structure

The file structure that fits my needs is the following (the tree view is simplified to only show the related pages from the example snippets I mentioned above). Below I explain what the purpose and contents of each file are.

```
└── cms
    ├── index.js
    ├── editor-components.js
    └── config/
        ├── index.js
        ├── fields.js
        ├── patterns.js
        └── collections/
            ├── blog-posts
            │   └── index.js
            └── pages
                ├── about.js
                ├── blog.js
                ├── home.js
                └── index.js
```

##### `cms/index.js`

Here is where I import the NetlifyCMS library. This file will eventually be parsed by Webpack in my setup and included in the `admin.html` file that is used to load the CMS.

```js
// Import NetlifyCMS library
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

// Import custom editor component from cms/editor-components.js
import myCustomEditorComponent from "./editor-components";
// Import NetlifyCMS JS configuration object from cms/config/index.js
import config from "./config";

// Disable loading of the configuration from the default config.yml file
window.CMS_MANUAL_INIT = true;
// Initialize NetlifyCMS with the JS configuration objext
window.CMS_CONFIGURATION = config;
CMS.init({ config });
// Register the custom editor component
CMS.registerEditorComponent(myCustomEditorComponent);
```

##### `cms/editor-components.js`

This file is not necessary to explain the setup, I've written another blog post on [creating custom NetlifyCMS editor components](/blog/post/embeding-youtube-videos-markdown-gatsby-netlifycms/), check it out!

##### `cms/config/index.js`

This is where we build our NetlifyCMS JS configuration object.

```js
// Import the configuration of each collection from cms/config/collections
import blogPostsCollection from "./collections/blog-posts";
import pagesCollection from "./collections/pages";
import pressReleasesCollection from "./collections/press-releases";
import servicesCollection from "./collections/services";
import siteConfigurationCollection from "./collections/site-configuration";
import testimonialsCollection from "./collections/testimonials";

// Build the Netlify JS configuration object
const config = {
  backend: {
    name: "gitlab",
    repo: "website",
    branch: "staging",
    auth_type: "implicit",
    app_id: "MY_APP_ID",
    api_root: "https://my-self-hosted-gitlab.com/api/v4",
    base_url: "https://my-self-hosted-gitlab.com",
    auth_endpoint: "oauth/authorize",
  },
  // It is not required to set `load_config_file` if the `config.yml` file is
  // missing, but will improve performance and avoid a load error.
  load_config_file: false,
  publish_mode: "editorial_workflow",
  media_folder: "site/static/images/uploads",
  public_folder: "/images/uploads",
  collections: [
    // Include the collections imported from cms/config/collections
    pagesCollection,
    servicesCollection,
    blogPostsCollection,
    commonPageSectionsCollection,
    testimonialsCollection,
    pressReleasesCollection,
    siteConfigurationCollection,
  ],
};

export default config;
```

##### `cms/config/collections/pagesCollection/index.js`

This file groups together all the configuration objects from each individual page.

```js
import { collectionDefaults } from "../../patterns";
import homePageConfig from "./home";
import aboutPageConfig from "./about";

const pagesCollection = {
  ...collectionDefaults("Pages", "pages"),
  files: [homePageConfig, aboutPageConfig],
};

export default pagesCollection;
```

##### `cms/config/collections/pagesCollection/home.js`

The configuration of a page. It utilizes fields and groups of fields (patterns) to keep the configuration code of the page DRY.

```js
import { stringField, textField, objectField, listField } from "../../fields";
import {
  pageDefaults,
  buttonDefaults,
  titleWithSubtitleDefaults,
} from "../../patterns";

export default {
  label: "Home page",
  name: "home",
  file: "site/content/_index.md",
  fields: [
    ...pageDefaults,
    objectField("Header", "header", [
      ...titleWithSubtitleDefaults(),
      buttonDefaults(),
    ]),
    objectField("Keyfacts section", "keyfacts_section", [
      ...titleWithSubtitleDefaults(),
      listField("Keyfacts", "keyfacts", [
        stringField("Title", "title", true),
        textField("Text", "text"),
        stringField("Icon", "icon", true),
      ]),
    ]),
  ],
};
```

##### `cms/config/fields.js`

The basic building blocks of the configuration file. Creating functions that return JS objects allows us to keep the code DRY by passing the necessary parameters when needed.

```js
export const textField = (label = "Text", name = "text", required = false) => ({
  label,
  name,
  widget: "text",
  required,
})

export const stringField = (
  label = "String",
  name = "string",
  required = false
) => ({
  label,
  name,
  widget: "string",
  required,
})

export const objectField = (
  label = "Object",
  name = "object",
  fields = [],
  required = true
) => ({
  label,
  name,
  widget: "object",
  fields,
  required,
})`
```

##### `cms/config/patterns.js`

Sometimes, patterns in the configuration of pages and collections emerge. This file groups fields together and exports these patterns.

```js
import { stringField, textField, objectField, hiddenField } from "./fields";

export const collectionDefaults = (label, name) => ({
  label,
  name,
  editor: {
    preview: false,
  },
});

export const pageDefaults = [
  stringField("Menu title", "title", true),
  hiddenField("Menu", "menu"),
  objectField("SEO", "seo", [
    stringField("SEO title", "title"),
    textField("SEO description", "description"),
  ]),
];

export const multiColorTitleDefaults = objectField("Title", "title", [
  stringField("Text part 1", "text_part_1"),
  stringField("Text part 2", "text_part_2"),
]);

export const buttonDefaults = (label = "Button", name = "button") =>
  objectField(label, name, [
    stringField("Text", "text", true),
    stringField("URL", "url", true),
  ]);

export const titleWithSubtitleDefaults = (subtitleIsMarkdown = false) => [
  multiColorTitleDefaults,
  subtitleIsMarkdown
    ? markdownField("Subtitle", "subtitle")
    : textField("Subtitle", "subtitle"),
];
```

## Conclusion

The above setup helped me reduce the total lines of code from around 2000 to just 900. It has also been proven that making updates to the configuration of each page has become a piece of cake 🍰 (navigating to the dedicated file is very easy by typing for example _"cms about"_ into the search bar of my editor to reach the configuration of the about page).

## Other resources

- [Configuring NetlicyCMS manual initialization in Gatsby](https://mrkaluzny.com/blog/dry-netlify-cms-config-with-manual-initialization/)
