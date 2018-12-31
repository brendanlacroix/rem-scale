function getAveragePixel(sizes) {
  return Math.round(sizes.reduce(function(a, b) { return a + b; }, 0) / sizes.length);
}

function getAverageMinPixel(styles) {
  let minSizes = [];

  Object.keys(styles).forEach((style) => {
    const minConfig = styles[style].min;

    minSizes.push(minConfig.fontSize);
    minSizes.push(minConfig.lineHeight);
  });

  return getAveragePixel(minSizes);
}

function getAverageMaxPixel(styles) {
  let maxSizes = [];

  Object.keys(styles).forEach((style) => {
    const maxConfig = styles[style].max;

    maxSizes.push(maxConfig.fontSize);
    maxSizes.push(maxConfig.lineHeight);
  });

  return getAveragePixel(maxSizes);
}

function getRootFontSize(minPixel, maxPixel, config) {
  const {
    browserDefaultPx,
    maxWidth,
    minWidth
  } = config;

  const minRootFontSizeRem = minPixel / browserDefaultPx;
  const viewportCalc = minWidth / 100;
  const scaleCalc = (100 * (maxPixel - minPixel) / (maxWidth - minWidth));

  return `calc(${minRootFontSizeRem}rem + ((1vw - ${viewportCalc}px) * ${scaleCalc}))`;
}

function getFontSizeForStyle(style, minPixel, maxPixel, config) {
  const minSizeREM = style.min.fontSize / minPixel;
  const maxSizeREM = style.max.fontSize / maxPixel;
  const minWidthRem = config.minWidth / minPixel;
  const scaleCalc = (100 * (maxSizeREM - minSizeREM) / ((config.maxWidth / maxPixel) - minWidthRem));

  return `calc(${minSizeREM}rem + ((1vw - ${(minWidthRem / 100)}rem) * ${scaleCalc}))`;
}

function getLineHeightForStyle(style, minPixel, maxPixel, config) {
  const minSizeREM = style.min.lineHeight / minPixel;
  const maxSizeREM = style.max.lineHeight / maxPixel;
  const minWidthRem = config.minWidth / minPixel;
  const scaleCalc = (100 * (maxSizeREM - minSizeREM) / ((config.maxWidth / maxPixel) - minWidthRem));

  return `calc(${minSizeREM}rem + ((1vw - ${(minWidthRem / 100)}rem) * ${scaleCalc}))`;
}

function remScale(styleConfigs, config) {
  const {
    browserDefaultPx,
    maxWidth,
    minWidth
  } = config;

  const minPixel = getAverageMinPixel(styleConfigs);
  const maxPixel = getAverageMaxPixel(styleConfigs);

  const styles = {};

  Object.keys(styleConfigs).forEach((style) => {
    const styleConfig = styleConfigs[style]

    styles[style] = {
      fontSize   : getFontSizeForStyle(styleConfig, minPixel, maxPixel, config),
      lineHeight : getLineHeightForStyle(styleConfig, minPixel, maxPixel, config)
    }
  });

  return {
    root : getRootFontSize(minPixel, maxPixel, config),
    styles,
    maxPixel,
    minPixel
  }
}

module.exports = remScale;
