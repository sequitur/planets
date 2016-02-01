'use strict'

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 128;

class GradientNoise {
  // Helper for generating noise similar to Perlin noise
  constructor (grain) {
    // We make a grid of random vectors over our texture
    this.points = [];
    this.noiseGrain = grain;
    for (let i = 0; i*this.noiseGrain < TEXTURE_HEIGHT + this.noiseGrain * 2; i++) {
      this.points[i] = [];
      for (let j = 0; j*this.noiseGrain < TEXTURE_WIDTH + this.noiseGrain * 2; j++) {
        this.points[i][j] = Math.random();
      }
    }
  }

  findNearestPoint (a, b) {
    const pointA = Math.floor(a / this.noiseGrain);
    const pointB = Math.floor(b / this.noiseGrain);
    const offsetA = (a / this.noiseGrain) - pointA;
    const offsetB = (b / this.noiseGrain) - pointB;
    const output = [
      this.points[pointA][pointB],
      this.points[pointA][pointB + 1],
      this.points[pointA + 1][pointB],
      this.points[pointA + 1][pointB + 1],
    ];
    return [output, offsetA, offsetB];
  }

  forPoint (a, b) {
    const points = this.findNearestPoint(a, b);
    const vectors = points[0];
    const offsetA = points[1];
    const offsetB = points[2];
    vectors[0] = vectors[0] * (1 - offsetA) * (1 - offsetB) * 2;
    vectors[1] = vectors[1] * (1 - offsetA) * offsetB * 2;
    vectors[2] = vectors[2] * offsetA * (1 - offsetB) * 2;
    vectors[3] = vectors[3] * offsetA * offsetB * 2;
    const output = vectors.reduce((a, b) => a + b) / 2;
    if (Number.isNaN(output)) throw new Error('Noise point is NaN');
    if (output > 1 || output < 0) throw new Error(`Noise point out of bounds: ${output}`)
    return output;
  }
};

const mediumNoise = new GradientNoise(3);
const largeNoise = new GradientNoise(7);
const hugeNoise = new GradientNoise(40);

const color = {
  randomValue () {
    return Math.floor(Math.random() * 256);
  },

  randomSet () {
    return [
      color.randomValue(),
      color.randomValue(),
      color.randomValue(),
      color.randomValue(),
    ]
  },

  disturb (color, magnitude) {
    return color
      .map(n => n + Math.floor(Math.random() * magnitude - (magnitude * 0.5)));
  },

  spin (color, magnitude) {
    if (typeof magnitude === 'undefined') magnitude = 80;
    const a = Math.floor(Math.random() * 3);
    let b = a + 1;
    if (a === 2) b = 0;
    const c = color.slice(0);
    c[a] += magnitude;
    c[b] -= magnitude;
    return c;
  },

  average (a, b, dif) {
    if (typeof dif === 'undefined') dif = 0.5;
    if (dif < 0 || dif > 1.3) throw new Error(`dif out of bounds: ${dif}`);
    if (dif > 1) return a;
    return a.map((c, i) => (c * dif) + (b[i] * (1 - dif)));
  },

  saturate (color, magnitude) {
    let primary = 0, max = 0;
    for (let i = 0; i < 3; i++) {
      if (color[i] > max) {
        primary = i;
        max = color[i];
      }
    }
    color[primary] = color[primary] * magnitude;
    return color;
  }
}

function findRowColumn (i) {
  const row = Math.floor(i / TEXTURE_WIDTH / 4);
  const column = Math.floor(i / 4 - (row * TEXTURE_WIDTH));
  if (row < 0 || row > TEXTURE_HEIGHT) throw new Error(`Row out of bounds: ${row}`);
  if (column < 0 || column > TEXTURE_WIDTH) throw new Error(`column out of bounds: ${column}`);
  return [row, column];

}

class MapGen {
  constructor () {
    this.colormap = new Uint8ClampedArray(TEXTURE_HEIGHT*TEXTURE_WIDTH*4);
  }

  pixels (cb) {
    // Apply a filter to each individual pixel
    for (let i = 0; i < this.colormap.length; i += 4) {
      const startingValues = [
        this.colormap[i],
        this.colormap[i + 1],
        this.colormap[i + 2],
        this.colormap[i + 3],
      ];
      const cbresults = cb.call(this, startingValues, i);
      this.colormap[i] = cbresults[0];
      this.colormap[i + 1] = cbresults[1];
      this.colormap[i + 2] = cbresults[2];
      this.colormap[i + 3] = cbresults[3];
    }
    return this;
  }

  noise () {
    this.pixels(color.randomSet);
    return this;
  }

  setChannel (channel, value) {
    this.pixels(function (startingValues) {
      startingValues[CHANNELS[channel]] = value;
      return startingValues;
    });
    return this;
  }

  setColor (color) {
    this.pixels(_ => color);
    return this;
  }

  disturb (magnitude) {
    this.pixels(c => color.disturb(c, magnitude))
    return this;
  }

  perlinish (noise, weight) {
    if (typeof weight === 'undefined') weight = 0.7;
    this.pixels(function (currentColor, i) {
      const rowColumn = findRowColumn(i);
      const row = rowColumn[0];
      const column = rowColumn[1];
      const mult = noise.forPoint(row, column);
      const colorV = mult * 255;
      const newColor = color.average(currentColor, [colorV, colorV, colorV, 255], weight);
      // console.log(newColor);
      return newColor;
    });
    return this;
  }

  icecaps (size, iceColor) {
    if (typeof iceColor === 'undefined') iceColor = [210,210,220,255];
    this.pixels(function (c, i) {
      const threshold = (size + (Math.random() * 10));
      const lowerRow = TEXTURE_HEIGHT - threshold;
      const currentRow = Math.floor(i / 4 / TEXTURE_WIDTH);
      if (currentRow > threshold && currentRow < lowerRow) return c;
      return color.disturb(iceColor, 20);
    });
    return this;
  }

  feature (featureColor, sharp, divider, plier) {
    if (typeof divider === 'undefined') divider = 1;
    if (typeof plier === 'undefined') plier = 1;
    const hugeNoise = new GradientNoise(70);
    const largeNoise = new GradientNoise(7);
    this.pixels (function (c, i) {
      const rowColumn = findRowColumn(i);
      const row = rowColumn[0];
      const column = rowColumn[1];
      const mult = (hugeNoise.forPoint(row, column) + largeNoise.forPoint(row, column)) / ((Math.random() + 3) * divider);
      if (mult > 0.95) return color.average(featureColor, [0,0,0,255], mult * plier);
      if (mult > 0.4 && sharp) return color.average(featureColor, c, mult * plier);
      if (mult < 0.3) return c;
      return color.average(featureColor, c, mult * plier);
    });
    return this;
  }

  clouds (featureColor, opacity) {
    if (typeof featureColor === 'undefined') featureColor = [210,210,230,255];
    if (typeof opacity === 'undefined') opacity = 0.8;
    const hugeNoise = new GradientNoise(70);
    const largeNoise = new GradientNoise(12);
    this.pixels (function (c, i) {
      const rowColumn = findRowColumn(i);
      const row = rowColumn[0];
      const column = rowColumn[1];
      const mult = (hugeNoise.forPoint(row, column) + largeNoise.forPoint(row, column)) / (Math.random() + 1.5);
      if (mult > 0.6) return color.average(featureColor, c, mult * opacity);
      return c;
    });
    return this;
  }

  cracks (featureColor) {
    if (typeof featureColor === 'undefined') featureColor = [0,0,0,255];
    const noiseA = new GradientNoise(20);
    const noiseB = new GradientNoise(8);
    this.pixels (function (c, i) {
      const rowColumn = findRowColumn(i);
      const row = rowColumn[0];
      const column = rowColumn[1];
      const x = (noiseA.forPoint(row, column) + noiseB.forPoint(row, column)) / 2;
      const point = 1 - (Math.pow(x - 0.5, 2) * 100);
      if (point < 0) return c;
      return color.average(featureColor, c, point * 0.2);
    });
    return this;
  }

  stripes (featureColor) {
    const noise = new GradientNoise(20);
    this.pixels(function (c, i) {
      const rowColumn = findRowColumn(i);
      const row = rowColumn[0];
      const column = rowColumn[1];
      const x = row / 12;
      const point = Math.pow(Math.sin(x), 2) + (noise.forPoint(row, column) * 2)
      return color.average(featureColor, c, point / 3);
    });
    return this;
  }

  saturate () {
    this.pixels(c => color.saturate(c, 1.1));
    return this;
  }

  darken () {
    this.pixels(c => c.map(v => v * 0.9));
    return this;
  }

}

function dieRoll(min, max) {
  return Math.floor((Math.random() * (max - min)) + min);
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function aridTexture () {
  // Dry, potentially reddish planet similar to Mars.
  const base_color = [dieRoll(120, 220), dieRoll(100, 120), dieRoll(70, 80)];
  const feature_color = base_color.map(n => n + dieRoll(10, 50));
  base_color.push(255); feature_color.push(255);

  const generator = new MapGen();
  return generator
    .setColor(base_color)
    .perlinish(largeNoise, 0.7)
    .cracks()
    .saturate()
    .darken()
    .feature(feature_color, true)
    .perlinish(mediumNoise, 0.9)
    .icecaps(20)
    // .clouds([220, 220, 220, 255])
    .disturb(30)
    .colormap;
}

function rockyBody () {
  // Blasted rock similar to Mercury
  const mult = dieRoll(7, 8) / 10;
  const base_color = [dieRoll(150, 180) * mult, dieRoll(150, 180) * mult, dieRoll(150, 180) * mult];
  const feature_color = base_color.map(a => a + dieRoll(10, 20));
  base_color.push(255); feature_color.push(255);
  const generator = new MapGen();
  return generator
    .setColor(base_color)
    .cracks()
    .feature(feature_color, true)
    .cracks()
    .disturb(10)
    .perlinish(mediumNoise, 0.9)
    .perlinish(largeNoise, 0.8)
    .perlinish(new GradientNoise(30), 0.8)
    .colormap;
}

const GASEOUS_COLORS = [
  [200, 70, 180, 255], // Purple
  [180, 160, 70, 255], // Yellow
  [180, 140, 70, 255], // Orange
  [80, 170, 80, 255], // Green
  [100, 70, 200, 255], // Blue
];

function gaseous () {
  // Gas giant, or heavy-atmosphere planet like Venus
  shuffle(GASEOUS_COLORS);
  const base_color = color.spin(GASEOUS_COLORS[0], 20);
  const feature_color = color.spin(base_color);
  const cloud_color = color.spin(base_color);

  const generator = new MapGen();
  return generator
    .setColor(base_color)
    .feature(feature_color)
    .clouds(cloud_color, 0.4)
    .cracks(cloud_color)
    .stripes(feature_color)
    .clouds(cloud_color, 0.2)
    .disturb(10)
    .colormap;
}

function hydrocarbon() {
  // Frozen, hydrocarbon-rich world similar to Titan

  const base_color = color.spin([180, 160, 40, 255], 20);
  const feature_color = color.spin([10, 10, 20, 255], 10);
  const cloud_color = color.spin([110,110,140,255], 10);

  const generator = new MapGen();

  return generator
    .setColor(base_color)
    .cracks()
    .cracks()
    .stripes(feature_color)
    .feature(feature_color, true, 0.9, 1.4)
    .icecaps(20, color.spin([20,20,40,255], 10))
    .clouds(cloud_color, 0.6)
    .perlinish(new GradientNoise(20), 0.8)
    .disturb(10)
    .colormap;
}

function icyBody () {
  // Frozen planet similar to Pluto
  const mult = dieRoll(9, 10) / 10;
  const base_color = [dieRoll(200, 230) * mult, dieRoll(200, 230) * mult, dieRoll(200, 230) * mult];
  const feature_color = base_color.map(a => a + dieRoll(10, 20));
  base_color.push(255); feature_color.push(255);
  const generator = new MapGen();
  return generator
    .setColor(base_color)
    // .cracks()
    .feature(feature_color, true)
    .perlinish(mediumNoise, 0.9)
    .perlinish(largeNoise, 0.9)
    .perlinish(new GradientNoise(30), 0.8)
    .cracks([255,255,255,255])
    .disturb(20)
    .colormap;
}

const VEGETATION_COLORS = [
  [0, 220, 60, 255], // Earthlike green vegetation
  [0, 60, 220, 255], // Blue vegetation
  [220, 0, 220, 255], // Purple vegetation
]

function earthLike() {
  shuffle(VEGETATION_COLORS);
  const base_color = [100,100,60,255];
  const vegetation_color = color.spin(VEGETATION_COLORS[0], 10);
  const ocean_color = color.spin([10,20,180,255], 10);

  const generator = new MapGen();

  return generator
    .setColor(base_color)
    .feature(vegetation_color, false, 0.8, 1.5)
    .cracks()
    .perlinish(new GradientNoise(20), 0.8)
    .feature(ocean_color, true, 0.8, 1.5)
    .icecaps(15)
    .clouds()
    .disturb(50)
    .colormap;
}

function frozenWorld() {
  const base_color = color.spin([160,200,240,255], 5);

  const generator = new MapGen();

  return generator
    .setColor(base_color)
    .icecaps(40, color.spin(base_color, 5))
    .cracks()
    .feature(color.spin([250,250,250,255], 5))
    .cracks([255,255,255,255])
    .perlinish(new GradientNoise(20), 0.8)
    .clouds()
    .disturb(10)
    .colormap;
}

function waterWorld() {
  const waterColors = [
    [80,180,220,255],
    [180,180,80,255],
    [180,80,180,255],
    [80,180,180,255],
  ]
  const base_color = waterColors[Math.floor(Math.random() * waterColors.length)]

  const generator = new MapGen();

  return generator
    .setColor(base_color)
    .stripes(color.spin(base_color, 40))
    .perlinish(new GradientNoise(20))
    .icecaps(15)
    .clouds()
    .disturb(10)
    .colormap;
}

function metalWorld() {
  const metalColors = [
    [100,100,100,255],
    [200,0,0,255],
    [180,160,0,255],
    [180,100,80,255],
    [0,160,180,255]
  ]
  const base_color = metalColors[Math.floor(Math.random() * metalColors.length)]

  const generator = new MapGen();

  return generator
    .setColor([30,20,20,255])
    //.feature([250,70,10,255], true, 0.7, 0.9)
    .feature(base_color, false, 0.9, 0.9)
    .icecaps(30, base_color)
    .cracks()
    .cracks([255,70,0,255])
    .disturb(30)
    .perlinish(new GradientNoise(40), 0.9)
    .colormap;
}


const textureModels = {
  'gasgiant': gaseous,
  'venus': gaseous,
  'earth': earthLike,
  'titan': hydrocarbon,
  'mars': aridTexture,
  'rocky': rockyBody,
  'icy': icyBody,
  'europa': frozenWorld,
  'waterworld': waterWorld,
  'molten': metalWorld,
}

onmessage = function(e) {
  console.log("Starting texture generation...");
  console.log(e);

  const result = textureModels[e.data]();
  postMessage(result);
}
