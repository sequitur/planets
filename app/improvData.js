export default {
  test: "ok",
  system: {
    groups: [
      {
        tags: [],
        phrases: [
          "[:sysname]",
          "[:greek]-[#2-70]",
          "[:A][:A][:A][:A][#100-900]",
        ],
      },
    ],
  },
  sysname: {
    groups: [
      {
        tags: [],
        phrases: [
          "Arcturus",
          "Sirius",
          "Neva",
          "Yakotsk",
          "Eidsiva",
          "Nimit",
          "Linares",
          "Eros",
          "Altair",
          "Aleut",
          "Episkopos",
          "Juno",
          "Cronos",
          "Smaland",
          "Skane",
          "Jamtland",
          "Fyn",
          "Bohuslan",
          "Akershus",
          "Halland",
          "Nyland",
          "Viborg",
          "Savolax",
          "Kexholm",
          "Neva",
          "Osel",
          "Memel",
          "Kolberg",
          "Anhalt",
          "Landshut",
          "Trier",
          "Berg",
          "Hainaut",
          "Liege",
          "Breda",
          "Gelre",
          "Friuli",
          "Siena",
          "Malta",
          "Sassari",
          "Krain",
          "Istria",
          "Sopron",
          "Hum",
          "Corfu",
          "Edirne",
          "Tarnovo",
          "Varasd",
          "Bekes",
          "Temes",
          "Bihar",
          "Maros",
          "Silistria",
          "Zemplen",
          "Bern",
          "Leon",
          "Vizcaya",
          "Girona",
          "Gibraltar",
          "Beira",
          "Cornwall",
          "Gwynedd",
          "Cumbria",
          "Fife",
          "Poznan",
          "Plock",
          "Pskov",
          "Brest",
          "Yedisan",
          "Caffa",
          "Tula",
          "Vologda",
          "Kocaeli",
          "Rosetta",
          "Darnah",
          "Aures",
          "Meath",
          "Aden",
          "Suhar",
          "Liwa",
          "Tabriz",
          "Kartli",
          "Qumis",
          "Kerman",
          "Yazd",
          "Birjand",
          "Circassia",
          "Nogay",
          "Sarai",
          "Ryn",
          "Kutch",
          "Multan",
          "Misalmer",
          "Marwar",
          "Girnar",
          "Surat",
          "Mewat",
          "Konkan",
          "Mysore",
          "Venad",
          "Velanadu",
          "Bastar",
          "Koch",
          "Kotte",
          "Ava",
          "Perak",
          "Pattani",
          "Pahang",
          "Ambon",
          "Ceram",
          "Lhasa",
          "Shigatse",
          "Jinan",
          "Kaifeng",
          "Anqing",
          "Hejian",
          "Hotan",
          "Alxa",
          "Uliastai",
          "Setsen",
          "Jirem"
        ],
      },
    ],
  },
  greek: {
    groups: [
      {
        tags: [],
        phrases: [
          "Alpha",
          "Beta",
          "Gamma",
          "Delta",
          "Epsilon",
          "Zeta",
          "Eta",
          "Theta",
          "Iota",
          "Kappa",
          "Lambda",
          "Mu",
          "Nu",
          "Xi",
          "Omicron",
          "Pi",
          "Rho",
          "Sigma",
          "Tau",
          "Upsilon",
          "Phi",
          "Chi",
          "Psi",
          "Omega",
          "Alif",
          "Ba",
          "Ta",
          "Tha",
          "Jim",
          "Ha",
          "Kha",
          "Dal",
          "Dhal",
          "Ra",
          "Zay",
          "Sin",
          "Shin",
          "Sad",
          "Dad",
          "Ta",
          "Za",
          "Ayn",
          "Ghayn",
          "Fa",
          "Qaf",
          "Kaf",
          "Lam",
          "Mim",
          "Nun",
          "Ha",
          "Waw",
          "Ya",
          "Aleph",
          "Beth",
          "Gimel",
          "Daleth",
          "He",
          "Waw",
          "Zayin",
          "Heth",
          "Teth",
          "Yod",
          "Kaph",
          "Lamed",
          "Mem",
          "Nun",
          "Samekh",
          "Ayin",
          "Pe",
          "Sadhe",
          "Qoph",
          "Resh",
          "Shin",
          "Taw",

        ],
      },
    ],
  },
  A: {
    groups: [
      {
        tags: [],
        phrases: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
        ],
      },
    ],
  },
  name: {
    bind: true,
    groups: [
      {
        tags: [['orbits', 'primary']],
        phrases: [
          "[:system] [#1-20]",
        ],
      },
      {
        tags: [['moon', 'yes'], ['orbits', 'planet']],
        phrases: ["[:system] [#1-20] [:A]"]
      }
    ],
  },
  temperature: {
    groups: [
      {
        tags: [['temperature', 'cold']],
        phrases: ["-[#50-200]"]
      },
      {
        tags: [['temperature', 'goldilocks']],
        phrases: ["[#10-40]"]
      },
      {
        tags: [['temperature', 'hot']],
        phrases: ["[#200-700]"]
      }
    ]
  },
  weirdstar: {
    groups: [
      {
        tags: [],
        phrases: [
          "pulsar",
          "cepheid star",
          "carbon star",
          "blue straggler star",
          "neutron star",
          "white dwarf with substellar remnant companion",

        ]
      }
    ]
  },
  factoid: {
    groups: [
      {
        tags: [['life', 'no']],
        phrases: [
          "Due to its inhospitable environment, [:name] houses a notoriously vicious penal colony.",
          "[:name] is considered economically inviable, but it houses a research facility to observe a nearby [:weirdstar].",
          "Alien ruins have been found on the surface of [:name], putting an end to its use as a mass driver calibration target."
        ]
      },
      {
        tags: [['life', 'yes']],
        phrases: [
          "Colonisation of [:name] has been deemed impossible due to the hallucinogenic fungus that suffuses its atmosphere.",
        ]
      },
      {
        tags: [['class', 'titan'], ['life', 'yes']],
        phrases: ["[:name] is home to a lineage of lifeforms with a rare lifecycle based on liquid methane."]
      },
      {
        tags: [['class', 'titan']],
        phrases: [
          "[:name] supplies other nearby planets and stations with volatiles and hydrocarbons, thanks to its low launch costs and abundance of said elements.",
          "[:name] has a surface dotted with lakes of liquid methane; hydrofoil racing on their surface is a popular, though dangerous, sport.",
        ]
      },
      {
        tags: [['class', 'giant'], ['temperature', 'hot']],
        phrases: [
          "[:name] has a bizarrely eccentric orbit, and as a result its primary leaches hydrogen from its upper atmosphere periodically.",
          "On [:name], the upper atmosphere contains vaporised metals such as iron and lithium.",
          "[:name] was originally thought to be a secondary dwarf star, but is now known to be a gas giant that reflects extreme heat from its primary.",
        ]
      },
      {
        tags: [['class', 'giant'], ['temperature', 'cold']],
        phrases: [
          "[:name] has an atmosphere mostly composed of ammonia clouds. Crystallised \"dirty ice\" shards make it a hazardous environment for aerostats."
        ]
      },
      {
        tags: [['life', 'yes'], ['orbits', 'planet']],
        phrases: [
          "[:name] supports thriving ecosystems, but only on the side facing away from the extreme radiation emanating from the gas giant it orbits."
        ]
      },
      {
        tags: [['class', 'europa'], ['life', 'yes']],
        phrases: [
          "[:name] has a liquid ocean under its frozen surface, inhabited by [:aquatics]."
        ]
      },
      {
        tags: [['class', 'aquatic'], ['life', 'yes']],
        phrases: [
          "Though all its surface is underwater, [:name] supports some aquatic life, such as [:aquatics].",
          "Deep beneath the surface of [:name], enormous coral forests can be found, feeding on energy from the planet's core.",
          "While it looks friendly from orbit, [:name] is actually covered in oceans blanketed in toxic kelp.",
          "While [:name] is periodically blanketed with deadly radiation from its variable primary, life survives in it by retreating deep underwater.",
          "[:name] has dramatically high sea levels for a planet of its size. Planetary scientists have theorised that it was at one point bombarded with iceteroids by an aquatic species looking to terraform it.",
        ]
      },
      {
        tags: [['class', 'aquatic']],
        phrases: [
          "Nobody knows exactly what causes the kilometre-wide whirlpools that dot the surface of this planet's singular ocean, but they are regarded as a deterrent to colonisation.",
          "While [:name] is an ocean world, its oceans are mostly salt, ammonia, and heavy metals, rendering it incredibly inhospitable to Earth-lineage life."
        ]
      },
      {
        tags: [['class', 'venus']],
        phrases: [
          "[:name] is known to have high concentrations of rare-earth metals, but mining is virtually impossible due to extreme surface pressures.",
          "[:name] is subject to violent storms that make it impossible to site aerostats in its upper atmosphere.",
          "In the upper atmosphere of [:name], mostly stable aerostats can be placed, allowing for limited colonisation.",
          "Synthetic lifeforms designed to survive in its turbulent upper atmosphere have been experimentally released in [:name].",
        ]
      },
      {
        tags: [['class', 'arid']],
        phrases: [
          "[:name] has a trace atmosphere made up mostly of nitrogen. It is thought the planet lost most of its original atmosphere in some horrible cataclysm.",
          "[:name] has a thick layer of polar ice that conceals preserved ruins built by an alien civilization.",
          "Inconclusive traces of microbial life have been found on [:name].",
          "[:name] has just enough of an atmosphere and surface water to support moisture farming, though going outside still requires a suit.",
        ]
      },
      {
        tags: [['class', 'rocky']],
        phrases: [
          "[:name] is actually a Trojan trailing after a massive gas giant.",
          "[:name] is actually a Greek sharing an orbit with a massive gas giant.",
          "[:name] has an unusually high concentration of carbon on its surface; it is not known what caused this.",
          "[:name] has a mostly featureless surface and no atmosphere, like other rocky worlds and moonlets. However, it is covered in millions of identical stone monoliths arranged in a regular grid pattern; the significance of those artefacts is unknown.",
          "A species native to [:name] evolved sapience sometime in the last few thousand years. The surface is still too irradiated for colonisation.",
          "Patches of the surface of [:name] are covered in an unknown composite material thought to be an inert precursor form of computronium.",
          "[:name] is the largest dwarf planet found in a large asteroid ring orbiting its primary."
        ]
      },
      {
        tags: [['class', 'rocky'], ['temperature', 'hot']],
        phrases: [
          "[:name] was scorched when its primary expanded in the distant past, blowing away whatever atmosphere it once had."
        ]
      },
      {
        tags: [['class', 'molten']],
        phrases: [
          "[:name] is intensely hot, having an sparse but heavy atmosphere of metallic vapors.",
          "The surface of [:name] is cracked and broken from constant cooling and heating cycles caused by the variations of its Cepheid primary.",
          "Astronomers have theorised that [:name] is actually the metallic core of gas giant or brown dwarf; it is not known where its atmosphere went.",
          "[:name] has regions where the geological factors work out so that there are rivers and lakes of molten iron, and occasional lead rain.",
          "[:name] is dotted with geysers that spew superheated metallic plasmas into its viciously corrosive atmosphere.",
          "[:name] has an atmosphere so corrosive, no known material can survive it"
        ]
      },
      {
        tags: [['life', 'yes']],
        phrases: [
          "The lifeforms native to [:name] are preternaturally vicious, and show signs of genetic tampering by some unknown entity.",
          "[:name] has an unusual ecosystem consisting entirely of sessile lifeforms.",
          "[:name] has an unusually thick atmosphere and low density; flying or free-floating lifeforms are common.",
          "Wine grown in [:name] has unusual narcotic properties due to the planet's microflora, and it fetches high prices in the markets of surrounding systems.",
          "[:name] is the original habitat of a pre-warp sapient species, and has been designated as a preserve.",
        ]
      },
      {
        tags: [['class','earth']],
        phrases: [
          "Audiophiles regard [:name] as the perfect site for outdoor concerts, due to the unusual composition of its atmosphere.",
          "[:name] has no conventional vegetation; it appears that in the planet's distant past, a predatory species of photosynthesizing slime mold evolved to completely supplant it.",
          "[:name] is an extremely rare life-supporting world that orbits a [:weirdstar]. Construction of a holiday resort to take advantage of its exotic sunsets has stalled due to logistic issues.",
          "Efforts to save the biodiversity native to [:name] are undergoing, as [a :cataclysm] is expected to cause a mass extinction.",
          "[:name] has an atmosphere impregnated with an airborne pathogen engineered by some unknown entity. It is lethal to all earth species, except cats.",
        ]
      },
      {
        tags: [['class', 'giant']],
        phrases: [
          "Work is underway on a magnetodynamic tether that will generate electricity by being dragged across the upper reaches of its atmosphere.",
          "[:name] has high concentrations of heavy elements dispersed through its atmosphere. It is thought that some unknown process caused its core to fragment and disperse into the upper atmosphere.",
          "[:name] has no moons. The reason for this is a complete mystery.",
          "[:name] is actually a naked stellar core left behind after all of its hydrogen was leached away by its nearby primary. As such, it doesn't quite fit the classification of either a brown dwarf or a gas giant."
        ]
      },
      {
        tags: [['class', 'icy']],
        phrases: [
          "Not much can be said about [:name], a frozen rock of water ice and ammonia that resembles other icy bodies in other systems.",
          "[:name] is covered in a layer of fine snow, in spite of not having an atmosphere. In the vacuum, the snow goes completely undisturbed; visitors to the planet have sometimes found large, crude snow sculptures left behind by some unknown entity.",
          "At some point in the distant past, an enormous slug of radioactive matter was left on the surface of [:name]. It has since sunk to the planet's core due to its heat and density, giving the irradiated dwarf planet a mantle of water and ammonia."
        ]
      },
      {
        tags: [],
        phrases: [
          "[:name] broadcasts a constant radio pulse from its northern pole with a consistent frequency. Not much is known about this phenomenon.",
          "Significant evidence suggests that [:name] used to be larger in the relatively recent past. No known mechanism explains this discrepancy.",
          "[:name] is positioned exactly so that the sixteen brightest stars in its night sky form a perfect grid.",
        ]
      },
      {
        tags: [['orbits', 'planet'], ['life', 'yes']],
        phrases: [
          "[:name] was originally a rogue planet before it became trapped in the orbit of a gas giant. Some of the oldest lifeforms on it might have evolved during the planet's wandering period.",
          "When [:name] dips into the magnetosphere of the gas giant it orbits, spectacular aurora are visible in its night sky.",
        ]
      }
    ]
  },
  cataclysm: {
    groups: [
      {
        tags: [],
        phrases: [
          "planetary alignment with a gamma-spewing brown dwarf",
          "shift in the primary's emission profile",
          "supermassive solar wind",
          "cooling period of its superslow cepheid primary",
        ]
      }
    ]
  },
  aquatics: {
    groups: [
      {
        tags: [],
        phrases: [
          "cephalopod-like inverterbrates",
          "bony fish with dozens of limbs",
          "quasi-sentient coral",
          "high-pressure leviathans"
        ]
      }
    ]
  }
}
