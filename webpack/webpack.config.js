const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   mode: "production",
   entry: {
      main: path.resolve(__dirname, "..", "src","main.ts"),
      data: path.resolve(__dirname, "..", "src","data.ts"),
      popup: {import: path.resolve(__dirname, "..","src","popup","popup.ts"),filename: "popup/popup.ts"}
   },
   output: {
      path: path.join(__dirname, "../dist/"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [{from: ".", to: ".", context: "public"}]
      }),
   ],
};