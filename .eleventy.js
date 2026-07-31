module.exports = function(eleventyConfig) {
  // 把 css、js、images、admin 文件夹直接复制到输出目录
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");

  // 把 src/projects/ 里的文件收集成 projects 集合，按 order 排序
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md")
      .sort(function(a, b) {
        return (a.data.order || 99) - (b.data.order || 99);
      });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};