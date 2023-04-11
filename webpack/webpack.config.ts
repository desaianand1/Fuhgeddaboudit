import CopyPlugin from "copy-webpack-plugin";
import { resolve, join } from "path";
import { Configuration } from "webpack";

const config: Configuration = {
  mode: "production",
  entry: {
    main: resolve(__dirname, "..", "src", "main.ts"),
    phrase_data: resolve(__dirname, "..", "src", "phrase_data.ts"),
    replacer: resolve(__dirname, "..", "src", "replacer.ts"),
    service_worker: resolve(__dirname, "..", "src", "service_worker.ts"),
    popup: {
      import: resolve(__dirname, "..", "src", "popup", "popup.ts"),
      filename: join("popup", "popup.js"),
    },
    headline: {
      import: resolve(__dirname, "..", "src", "popup", "headline.ts"),
      filename: join("popup", "headline.js"),
    }
  },
  output: {
    path: join(__dirname, "../dist/"),
    filename: "[name].js",
    clean: true,
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
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};

export default config;
