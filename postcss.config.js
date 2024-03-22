const variables = require("./postcss.variables");
for (const key in variables) {
  if ({}.hasOwnProperty.call(variables, key) && !key.includes(" ")) {
    const fallbackRegex = /var\((\-\-[^\)]+)\)/gm;
    let match;
    const testString = variables[key];
    do {
      match = fallbackRegex.exec(testString);
      if (match)
        variables[key] = variables[key].replace(match[0], variables[match[1]]);
    } while (match);
  }
}

module.exports = {
  plugins: [
    "postcss-import",
    "postcss-mixins",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": true,
          "focus-within-pseudo-class": false,
          "nesting-rules": true,
        },
      },
    ],
    [
      "postcss-css-variables",
      {
        preserve: true,
        variables,
      },
    ],
    "postcss-flexbugs-fixes",
  ],
};
