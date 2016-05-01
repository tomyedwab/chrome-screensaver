"use strict";

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

var ScreenSaver = React.createClass({
    displayName: "ScreenSaver",

    getInitialState: function() {
        return {
            dark: false,
            time: "",
            date: "",
            hue: 0
        };
    },

    componentDidMount: function() {
        window.setInterval(function() {
            var date = new Date();
            this.setState({
                time: date.toLocaleTimeString(),
                date: date.toDateString(),
                hue: this.state.hue + 0.001
            });
        }.bind(this), 1000);
    },

    render: function render() {
        if (!this.state.dark) {
            // TODO: Move this to a button on the toolbar instead
            return React.createElement(
                    "div",
                    {
                        style: {
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "30px",
                            backgroundColor: "black",
                            opacity: 0.2,
                            textAlign: "center",
                            zIndex: 999
                        },
                        onClick: function() {
                            this.setState({dark: true});
                        }.bind(this)
                    },
                    "Click to turn into a screensaver");
        }

        var color = HSVtoRGB(this.state.hue, 0.5, 0.25);

        var styleTime = {
            fontFamily: "'Merriweather', serif",
            fontWeight: 900,
            fontSize: "96px",
            color: "rgb(" + color.r + "," + color.g + "," + color.b + ")",
            marginLeft: 120
        };

        var styleDate = JSON.parse(JSON.stringify(styleTime));
        styleDate.fontWeight = 400;
        styleDate.fontSize = "76px";

        styleTime.marginTop = 40;

        return React.createElement(
                "div",
                {
                    style: {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        zIndex: 999
                    }
                },
                React.createElement("div", {style: styleTime}, this.state.time),
                React.createElement("div", {style: styleDate}, this.state.date));
    }
});

// Add our font
var link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css?family=Merriweather:400,900';
document.head.appendChild(link)

// Add our component
var mountNode = document.createElement("div");
document.body.appendChild(mountNode);
ReactDOM.render(React.createElement(ScreenSaver, {}), mountNode);
