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
        max: 0.85
      }
    },
    paint: {
      fill: {
        color: {
          value: ["#60a5fa", "#34d399", "#f59e0b", "#f472b6"]
        },
        enable: true
      },
      stroke: {
        color: {
          value: "#ffffff"
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
            "❤️",
            "Hi",
            "My Love",
            "❣️",
            "Kisses",
            "🥰",
            "Bye",
            "💞",
            "Hello",
            "💖",
            "Call Me",
            "💕",
            "Love",
            "🧡",
            "Swift"
          ],
          weight: "700"
        }
      }
    },
    size: {
      value: {
        min: 12,
        max: 30
      }
    }
  }
};

export { loginParticles };
