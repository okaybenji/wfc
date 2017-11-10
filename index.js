/**
 * Returns a new array with the passed length (for iteration);
 */
const createArray = length => new Array(length).fill(0);

/**
 * Get image data from a file path.
 * @param {String}   path      The path, e.g. 'test.png'.
 * @param {Function} callback  Accepts the image data once it has been retrieved.
 */
const imgUrlToData = (path, callback) => {
  const img = document.createElement('img');
  img.src = path;
  img.onload = (e) => {
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    callback(imgData);
  };
};

/**
 * Return the value of the pixel in image data at the given position.
 */
const getPixel = (imgData, x, y) => {
  const index = y * imgData.width + x;
  const i = index * 4;
  const d = imgData.data;

  return [d[i], d[i+1], d[i+2], d[i+3]];
};

/**
 * Print output imgData to given ctx.
 */
const print = (ctx, imgData) => {
  ctx.putImageData(imgData, 0, 0);
};

/**
 * Map image data to an array.
 * Note this only works with black and white input.
 */
const worldFromImg = (imgData) => {
  const colorMap = {
    '0:0:0:255': '■',
    '255:255:255:255': ' ',
  };

  const world = createArray(imgData.width)
    .map((row, y) => createArray(imgData.height)
      .map((pixel, x) => colorMap[getPixel(imgData, x, y).join(':')]));

  return world;
};

const start = (id) => {
  const output = document.getElementById('output');
  const ctx = output.getContext('2d');
  imgData = ctx.createImageData(48, 48);

  const input = id.data;
  const {width, height} = id;
  const n = 2;
  const outputWidth = outputHeight = 48;
  const periodicInput = true;
  const periodicOutput = false;
  const symmetry = 1;
  const ground = 0;

  const model = new OverlappingModel(input, width, height, n, outputWidth, outputHeight, periodicInput, periodicOutput, symmetry, ground);
  const seedFn = Math.random;

  let success;
  let attempts = 0;

  while (!success && attempts < 100) {
    success = model.generate(seedFn, 0);
    attempts++;
  }

  if (!success) {
    console.warn(`Warning! WFC unsuccessful after ${attempts} attempts.`);
    return;
  }

  if (attempts > 1) {
    console.log(`WFC successful after: ${attempts} attempts.`);
  }

  model.graphics(imgData.data);
  print(ctx, imgData);
  console.log(worldFromImg(imgData)); // <- This only works w/ black & white images
};
