import type { ISourceOptions } from "@tsparticles/engine";

const loginParticles: ISourceOptions = {
  key: "Swift",
  name: "Swift Mini",

  background: {
    color: {
      value: "transparent"
    }
  },

  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      },
      onClick: {
        enable: true,
        mode: "push"
      }
    },
    modes: {
      grab: {
        distance: 50,
        links: {
          opacity: 1
        }
      },
      bubble: {
        distance: 50,
        size: 40,
        duration: 2,
        opacity: 0.8
      },
      repulse: {
        distance: 50
      },
      push: {
        quantity: 4
      },
      remove: {
        quantity: 2
      }
    }
  },

  particles: {
    move: {
      enable: true,
      speed: 0.8
    },
    number: {
      value: 40
    },
    opacity: {
      value: {
        min: 0.35,
        max: 0.95
      }
    },
    paint: {
      fill: {
        color: {
          value: [
            "#60a5fa",
            "#b80422",
            "#34d399",
            "#f59e0b",
            "#f472b6",
            "#ff8000",
            "#2bff00"
          ]
        },
        enable: true
      },
      stroke: {
        color: {
          value: "#000000"
        },
        width: 0
      }
    },
    shape: {
      type: "text",
      close: true,
      options: {
        text: {
          close: true,
          font: "Agbalumo",
          style: "",
          value: [
            "Swift",
            "Swift",
            "Hey!",
            "Sup",
            "BRB",
            "LMAO",
            "OMG",
            "Wyd?",
            "TTYL",
            "Nice!",
            "Lol",
            "Gtg",
            "Yo",
            "😊",
            "🔥",
            "✨",
            "👋",
            "💬",
            "❤️"
          ],
          weight: "700"
        }
      }
    },
    size: {
      value: {
        min: 15,
        max: 35
      }
    }
  }
};

export { loginParticles };
