<template>
  <div>
    <div class="">
      <template v-if="$page.post.cover_image">
        <div
          tabindex="0"
          class="header__wrapper relative bg-center overflow-hidden flex flex-col"
          :style="{
            '--background-url': `url(${$page.post.cover_image})`,
            maxHeight: '50vh'
          }"
        >
          <g-image
            alt="Cover image"
            class="header__image block w-full min-h-full m-auto object-contain"
            :src="coverImage"
            width="1280"
            height="720"
            quality="80"
            fit="cover"
            blur="10"
          />
        </div>
      </template>

      <h1
        class="heading text-center lg:text-5xl text-3xl my-8 w-full md:w-10/12 mx-auto"
      >
        {{ $page.post.title }}
      </h1>
    </div>

    <div class="flex">
      <section
        class="table-of-content mx-4 font-bold transition-opacity duration-500 lg:opacity-50 lg:hover:opacity-100 fixed bottom-0 left-0 lg:relative flex items-end flex-col flex-1 z-fg"
      >
        <div
          v-if="$page.post.headings.length > 0"
          class="table-of-content__list sticky hidden lg:block mt-header-height top-0 pt-header-height"
        >
          <h2 class="heading text-2xl mt-10">Table of Content</h2>
          <ul class="mt-5">
            <li
              v-for="(heading, index) in $page.post.headings"
              :key="index"
              class="my-2"
            >
              <a
                v-if="heading.depth === 1"
                :href="heading.anchor"
                class="anchor hover:text-theme-primary"
                :class="{
                  'anchor--is-active': activeAnchor === heading.anchor
                }"
              >
                # {{ heading.value }}
              </a>
            </li>
          </ul>
        </div>

        <Modal
          v-if="$page.post.headings.length > 0"
          class="block lg:hidden"
          transition="slide-ltr"
        >
          <svg
            slot="trigger"
            height="2rem"
            width="2rem"
            viewBox="0 -52 512.00001 512"
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--on-background)"
          >
            <path
              d="m0 113.292969h113.292969v-113.292969h-113.292969zm30.003906-83.289063h53.289063v53.289063h-53.289063zm0 0"
            />
            <path
              d="m149.296875 0v113.292969h362.703125v-113.292969zm332.699219 83.292969h-302.695313v-53.289063h302.695313zm0 0"
            />
            <path
              d="m0 260.300781h113.292969v-113.292969h-113.292969zm30.003906-83.292969h53.289063v53.289063h-53.289063zm0 0"
            />
            <path
              d="m149.296875 260.300781h362.703125v-113.292969h-362.703125zm30.003906-83.292969h302.695313v53.289063h-302.695313zm0 0"
            />
            <path
              d="m0 407.308594h113.292969v-113.296875h-113.292969zm30.003906-83.292969h53.289063v53.289063h-53.289063zm0 0"
            />
            <path
              d="m149.296875 407.308594h362.703125v-113.296875h-362.703125zm30.003906-83.292969h302.695313v53.289063h-302.695313zm0 0"
            />
          </svg>
          <div
            slot="data"
            :style="{ minWidth: '280px' }"
            class="fixed left-0 top-0 bottom-0 pt-header-height mt-10 bg-theme-background flex flex-col z-1 px-4 w-4/12"
          >
            <h2 class="heading text-2xl">Table of Content</h2>
            <ul class="mt-5">
              <li
                v-for="(heading, index) in $page.post.headings"
                :key="index"
                class="my-2"
              >
                <a
                  v-if="heading.depth === 1"
                  :href="heading.anchor"
                  class="hover:text-theme-primary"
                  @click="$emit('toggle-modal', false)"
                >
                  # {{ heading.value }}
                </a>
              </li>
            </ul>
          </div>
        </Modal>
      </section>

      <section class="container max-w-screen-md">
        <article class="article">
          <PostMeta class="article__meta mt-3 mb-6" :post="$page.post" />

          <PathInfo
            class="article__path-info"
            :category-slug="$page.post.category_slug"
          />

          <div
            class="article__content v-html"
            v-html="generateInnerHTML(this.$page.post.content)"
          />

          <div class="flex article__footer my-6">
            <PostTags :post="$page.post" />
          </div>

          <HorizontalLine class="my-6" />

          <BlogInfo class="w-full" />

          <HorizontalLine class="my-6" />

          <div
            class="article-comments surface p-2 w-full md:px-6 lg:px-12 rounded shadow-md"
          >
            <CommentBox :key="commentBoxKey" :css-vars="cssVars" />
          </div>

          <HorizontalLine class="my-6" />
        </article>
      </section>

      <section class="underconstruction hidden lg:flex flex-col flex-auto">
        <p>&nbsp;</p>
      </section>
    </div>
  </div>
</template>

<script>
import * as clipboard from "clipboard-polyfill/text";

import seoMixin from "~/vue-utils/mixins/seo";
import routerMixin from "~/vue-utils/mixins/router";

import PathInfo from "~/components/common/PathInfo";
import PostMeta from "~/components/common/PostMeta";
import PostTags from "~/components/common/PostTags";
import BlogInfo from "~/components/widgets/BlogInfo";

import CommentBox from "~/components/CommentBox";
import Modal from "~/components/common/Modal";

import { helpers } from "~/utils/";

export default {
  name: "Post",

  components: {
    PathInfo,
    BlogInfo,
    PostMeta,
    PostTags,
    CommentBox,
    Modal
  },

  mixins: [seoMixin, routerMixin],

  inject: {
    $getCssVars: {
      type: Object,
      require: true
    }
  },

  data() {
    return {
      commentBoxKey: 0,
      activeAnchor: null
    };
  },

  computed: {
    cssVars() {
      return this.$getCssVars();
    },

    coverImage() {
      if (!this.$page.post.cover_image) {
        return "";
      }
      return require(`!!assets-loader?width=1280&height=720&fit=cover&blur=10!~/../static${this.$page.post.cover_image}`);
    }
  },

  watch: {
    cssVars: {
      handler(newCssVars) {
        if (helpers.isEmpty(newCssVars)) {
          return;
        }
        this.reloadCommentBox();
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    const codeBlocks = document.querySelectorAll(".gridsome-highlight");
    codeBlocks.forEach((block) => {
      const button = block.querySelector(".copy");
      button.onclick = function () {
        clipboard
          .writeText(block.getElementsByTagName("code")[0].textContent)
          .then(
            () => {
              button.classList.add("copy--is-success");

              setTimeout(() => {
                button.classList.remove("copy--is-success");
              }, 3000);
            },
            () => {
              button.classList.add("copy--is-error");

              setTimeout(() => {
                button.classList.remove("copy--is-error");
              }, 3000);
            }
          );
      };
    });
  },

  methods: {
    reloadCommentBox() {
      this.commentBoxKey += 1;
    },

    generateInnerHTML(html) {
      if (process.isClient) {
        const content = document.createElement("div");
        content.innerHTML = html || "";

        const codeBlocks = content.querySelectorAll(".gridsome-highlight");
        codeBlocks.forEach((block) => {
          const button = document.createElement("button");
          button.className = "copy";
          button.type = "button";
          button.title = "Copy to clipboard";

          block.appendChild(button);

          const highlightBlocks = block.querySelectorAll(
            ".gridsome-highlight-code-line"
          );

          highlightBlocks.forEach((block) => {
            const line_break = document.createElement("text");
            line_break.textContent = "\n";

            block.appendChild(line_break);
          });
        });

        return content.innerHTML;
      }

      return html;
    }
  },

  metaInfo() {
    const {
      title: siteTitle,
      description: siteDescription,
      path
    } = this.$page.post;
    return this.generateMetaInfo({
      siteTitle,
      siteDescription,
      metaImageUrl: this.$page.post.cover_image,
      path
    });
  }
};
</script>

<page-query>
query Post ($path: String!) {
  post: post (path: $path) {
    title
    path
    created_at
    updated_at
    description
    content
    cover_image (width: 1280, height: 720, blur: 10, quality: 80)
    category_slug
    headings {
      value
      anchor
      depth
    }
    tags {
      id
      title
      path
    }
  }
}
</page-query>

<style lang="scss" scoped>
@import "~/assets/styles/_mixins";

.header__wrapper {
  @keyframes waves {
    0% {
      background-position: top left;
    }

    25% {
      background-position: bottom right;
    }

    50% {
      background-position: center;
    }

    75% {
      background-position: top right;
    }

    100% {
      background-position: bottom left;
    }
  }

  &::before {
    position: absolute;
    display: block;
    content: "";
    top: -16px;
    bottom: -16px;
    left: -16px;
    right: -16px;
    background-image: var(--background-url),
      linear-gradient(
        to right,
        var(--darken) 0%,
        var(--secondary) 30%,
        var(--secondary) 70%,
        var(--darken) 100%
      );

    background-size: 105% auto, cover;
    background-position: center;
    animation: waves 45s linear infinite alternate both;
    filter: blur(8px) brightness(75%);
    z-index: -1;
  }

  &:hover,
  &:focus {
    @apply shadow-2xl;
    .header__waves {
      opacity: 0;
    }

    &::before {
      animation-play-state: paused;
    }
  }
}

.anchor--is-active {
  //
}

.article /deep/ .v-html {
  @include typography;

  :target {
    &::before {
      content: "";
      display: block;
      height: var(--header-height);
      margin-top: calc(var(--header-height) * -1);
    }
  }
}
</style>
