const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.LLM_API_KEY": JSON.stringify(process.env.LLM_API_KEY),
    }),
  ],
});
