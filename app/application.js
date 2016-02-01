import $ from 'jquery';
import THREE from 'three';
import Improv from 'improv';
import improvData from 'improvData';

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 128;

const improv = new Improv(improvData, {
  filters: [
    Improv.filters.mismatchFilter(),
  ],
  reincorporate: true,
});

const factoids = new Improv(improvData, {
  filters: [
    Improv.filters.mismatchFilter(),
    Improv.filters.dryness(),
  ],
  reincorporate: true,
  persistence: true,
});

const canvas = document.createElement('canvas');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
let camera, planet;

const TEXTURES = [
  'gasgiant',
  'venus',
  'earth',
  'titan',
  'mars',
  'rocky',
  'icy'
]

function dieRoll (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 5 Three units = 1 Earth radius

const MODELS = [
  function () {
    // A gas giant
    return {
      size: dieRoll(18, 60),
      textureModel: 'gasgiant',
      large: true,
      class: 'Gas giant',
      tags: [
        ['moon', 'no'],
        ['size', 'normal'],
        ['life', 'no'],
        ['class', 'giant']
      ]
    }
  },
  function () {
    // A Venus-like planet with thick atmosphere
    return {
      size: dieRoll(4, 10),
      textureModel: 'venus',
      class: 'Gaseous',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['life', 'no'],
        ['class', 'venus']
      ]
    }
  },
  function () {
    // A Mars-like arid planet
    return {
      size: dieRoll(4, 10),
      textureModel: 'mars',
      class: 'Arid',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['life', 'no'],
        ['class', 'mars']
      ]
    }
  },
  function () {
    // An earthlike planet
    return {
      size: dieRoll(4, 10),
      textureModel: 'earth',
      class: 'Earthlike',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['life', 'yes'],
        ['temperature', 'goldilocks'],
        ['class', 'earth'],
      ]
    }
  },
  function () {
    // A hydrocarbon world
    return {
      size: dieRoll(3, 8),
      textureModel: 'titan',
      class: 'Titanian',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['temperature', 'cold'],
        ['class', 'titan'],
      ]
    }
  },
  function () {
    // A rocky body
    return {
      size: dieRoll(1, 4),
      textureModel: 'rocky',
      class: 'Rocky Body',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['life', 'no'],
        ['class', 'rocky'],
      ]
    }
  },
  function () {
    // An icy body
    return {
      size: dieRoll(1, 4),
      textureModel: 'icy',
      class: 'Icy Body',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['life', 'no'],
        ['class', 'icy'],
      ]
    }
  },
  function () {
    // A frozen world like Europa
    return {
      size: dieRoll(2, 8),
      textureModel: 'europa',
      class: 'Ice World',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['temperature', 'cold'],
        ['class', 'europa'],
      ]
    }
  },
  function () {
    // A world with high sea level
    return {
      size: dieRoll(2, 8),
      textureModel: 'waterworld',
      class: 'Aquatic',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['temperature', 'goldilocks'],
        ['class', 'aquatic'],
      ]
    }
  },
  function () {
    // A world with a molten metallic surface
    return {
      size: dieRoll(2, 8),
      textureModel: 'molten',
      class: 'Vulcanic',
      tags: [
        ['moon', 'yes'],
        ['size', 'normal'],
        ['life', 'no'],
        ['temperature', 'hot'],
        ['class', 'molten']
      ]
    }
  },
];


function randomModel() {
  const x = dieRoll(0, MODELS.length);
  return MODELS[x]();
}

class Planet {
  constructor () {
    //shuffle(PLANET_VARIANTS);
    this.model = randomModel();
    this.geometry = new THREE.IcosahedronGeometry(this.model.size, 2);
    this.textureModel = this.model.textureModel;
    this.name = improv.gen('name', this.model);
  }

  assembleTexture (data) {
    const imgData = new ImageData(data, TEXTURE_WIDTH, TEXTURE_HEIGHT);
    // const canvas = document.createElement('canvas');
    // canvas.width = 512;
    // canvas.height = 256;
    // const context = canvas.getContext('2d');
    // context.putImageData(imgData, 0, 0);
    // $('body').append(canvas);
    this.texture = new THREE.Texture(imgData);
    this.texture.anisotropy = renderer.getMaxAnisotropy();
    this.texture.needsUpdate = true;
    this.texture.magFilter = THREE.NearestFilter;
    this.material = new THREE.MeshLambertMaterial({
      //color: '#ff0000',
      map: this.texture,
      transparent: true,
    });
  }

  assembleMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  get desc () {
    let factoid;
    try {
      factoid = factoids.gen('factoid', this.model);
    } catch (e) {
      console.log("Recycling factoids...");
      factoids.clearHistory();
      factoid = factoids.gen('factoid', this.model);
    }
    return `
    <h1>
      ${this.name}
    </h1>
    <p>
      Class: ${this.model.class}
    </p>
    <p>
      Radius: ~${this.model.size / 5} Earth radii
    </p>
    <p>
      Reference temperature: ${improv.gen('temperature', this.model)}C
    </p>
    <p class="factoid">
      ${factoid}
    </p>
    `;
  }
}

let myPlanet = new Planet();

function render () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  //sphere.rotation.x += 0.1;
  myPlanet.mesh.rotation.y += 0.001;
}

function setupScene () {
  scene.add(myPlanet.mesh);
  scene.add( new THREE.AmbientLight(0x101010) );
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-10, 0, 5);
  scene.add(light);
}

const textureWorker = new Worker('texture.js');

export default {
  init () {
    const container = $('.container');
    const [height, width] = [container.height(), container.width()];
    camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    renderer.setSize(width, height);
    container.append(renderer.domElement);
    camera.position.z = 70;
    camera.position.y = 30;
    camera.rotation.x = -0.3;

    function adjustCamera () {
      if (myPlanet.model.large) {
        console.log("we got a big one!");
        camera.position.z = 70;
        camera.position.y = 30;
      } else {
        camera.position.z = 14;
        camera.position.y = 7;
      }
    }

    textureWorker.onmessage = function (e) {
      console.log("Completed texture generation.");
      console.log(e);
      myPlanet.assembleTexture(e.data);
      myPlanet.assembleMesh();
      setupScene();
      adjustCamera();
      render();
    }

    textureWorker.postMessage(myPlanet.textureModel);


    const myDiv = $(`<div class="desc">${myPlanet.desc}</div>`);
    container.append(myDiv);

    let generatorLock = false;

    container.on('click', function () {
      if (generatorLock) return;
      generatorLock = true;
      const generating = $(`<div class="generating">Generating...</div>`);
      container.append(generating);
      const newPlanet = new Planet();
      textureWorker.onmessage = function (e) {
        console.log("Received texture data.");
        scene.remove(myPlanet.mesh);
        myPlanet = newPlanet;
        myPlanet.assembleTexture(e.data);
        myPlanet.assembleMesh();
        adjustCamera();
        scene.add(myPlanet.mesh);
        $('.desc').replaceWith(`<div class="desc">${myPlanet.desc}</div>`);
        generating.remove();
        generatorLock = false;
      };

      textureWorker.postMessage(newPlanet.textureModel);
      console.log('App initialised.');
    });

  }
};
