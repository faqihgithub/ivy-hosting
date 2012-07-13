var Cufon = (function () {
    var m = function () {
            return m.replace.apply(null, arguments)
        };
    var x = m.DOM = {
        ready: (function () {
            var C = false,
                E = {
                    loaded: 1,
                    complete: 1
                };
            var B = [],
                D = function () {
                    if (C) {
                        return
                    }
                    C = true;
                    for (var F; F = B.shift(); F()) {}
                };
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", D, false);
                window.addEventListener("pageshow", D, false)
            }
            if (!window.opera && document.readyState) {
                (function () {
                    E[document.readyState] ? D() : setTimeout(arguments.callee, 10)
                })()
            }
            if (document.readyState && document.createStyleSheet) {
                (function () {
                    try {
                        document.body.doScroll("left");
                        D()
                    } catch (F) {
                        setTimeout(arguments.callee, 1)
                    }
                })()
            }
            q(window, "load", D);
            return function (F) {
                if (!arguments.length) {
                    D()
                } else {
                    C ? F() : B.push(F)
                }
            }
        })(),
        root: function () {
            return document.documentElement || document.body
        }
    };
    var n = m.CSS = {
        Size: function (C, B) {
            this.value = parseFloat(C);
            this.unit = String(C).match(/[a-z%]*$/)[0] || "px";
            this.convert = function (D) {
                return D / B * this.value
            };
            this.convertFrom = function (D) {
                return D / this.value * B
            };
            this.toString = function () {
                return this.value + this.unit
            }
        },
        addClass: function (C, B) {
            var D = C.className;
            C.className = D + (D && " ") + B;
            return C
        },
        color: j(function (C) {
            var B = {};
            B.color = C.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function (E, D, F) {
                B.opacity = parseFloat(F);
                return "rgb(" + D + ")"
            });
            return B
        }),
        fontStretch: j(function (B) {
            if (typeof B == "number") {
                return B
            }
            if (/%$/.test(B)) {
                return parseFloat(B) / 100
            }
            return {
                "ultra-condensed": 0.5,
                "extra-condensed": 0.625,
                condensed: 0.75,
                "semi-condensed": 0.875,
                "semi-expanded": 1.125,
                expanded: 1.25,
                "extra-expanded": 1.5,
                "ultra-expanded": 2
            }[B] || 1
        }),
        getStyle: function (C) {
            var B = document.defaultView;
            if (B && B.getComputedStyle) {
                return new a(B.getComputedStyle(C, null))
            }
            if (C.currentStyle) {
                return new a(C.currentStyle)
            }
            return new a(C.style)
        },
        gradient: j(function (F) {
            var G = {
                id: F,
                type: F.match(/^-([a-z]+)-gradient\(/)[1],
                stops: []
            },
                C = F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);
            for (var E = 0, B = C.length, D; E < B; ++E) {
                D = C[E].split("=", 2).reverse();
                G.stops.push([D[1] || E / (B - 1), D[0]])
            }
            return G
        }),
        quotedList: j(function (E) {
            var D = [],
                C = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,
                B;
            while (B = C.exec(E)) {
                D.push(B[3] || B[1])
            }
            return D
        }),
        recognizesMedia: j(function (G) {
            var E = document.createElement("style"),
                D, C, B;
            E.type = "text/css";
            E.media = G;
            try {
                E.appendChild(document.createTextNode("/**/"))
            } catch (F) {}
            C = g("head")[0];
            C.insertBefore(E, C.firstChild);
            D = (E.sheet || E.styleSheet);
            B = D && !D.disabled;
            C.removeChild(E);
            return B
        }),
        removeClass: function (D, C) {
            var B = RegExp("(?:^|\\s+)" + C + "(?=\\s|$)", "g");
            D.className = D.className.replace(B, "");
            return D
        },
        supports: function (D, C) {
            var B = document.createElement("span").style;
            if (B[D] === undefined) {
                return false
            }
            B[D] = C;
            return B[D] === C
        },
        textAlign: function (E, D, B, C) {
            if (D.get("textAlign") == "right") {
                if (B > 0) {
                    E = " " + E
                }
            } else {
                if (B < C - 1) {
                    E += " "
                }
            }
            return E
        },
        textShadow: j(function (F) {
            if (F == "none") {
                return null
            }
            var E = [],
                G = {},
                B, C = 0;
            var D = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
            while (B = D.exec(F)) {
                if (B[0] == ",") {
                    E.push(G);
                    G = {};
                    C = 0
                } else {
                    if (B[1]) {
                        G.color = B[1]
                    } else {
                        G[["offX", "offY", "blur"][C++]] = B[2]
                    }
                }
            }
            E.push(G);
            return E
        }),
        textTransform: (function () {
            var B = {
                uppercase: function (C) {
                    return C.toUpperCase()
                },
                lowercase: function (C) {
                    return C.toLowerCase()
                },
                capitalize: function (C) {
                    return C.replace(/\b./g, function (D) {
                        return D.toUpperCase()
                    })
                }
            };
            return function (E, D) {
                var C = B[D.get("textTransform")];
                return C ? C(E) : E
            }
        })(),
        whiteSpace: (function () {
            var D = {
                inline: 1,
                "inline-block": 1,
                "run-in": 1
            };
            var C = /^\s+/,
                B = /\s+$/;
            return function (H, F, G, E) {
                if (E) {
                    if (E.nodeName.toLowerCase() == "br") {
                        H = H.replace(C, "")
                    }
                }
                if (D[F.get("display")]) {
                    return H
                }
                if (!G.previousSibling) {
                    H = H.replace(C, "")
                }
                if (!G.nextSibling) {
                    H = H.replace(B, "")
                }
                return H
            }
        })()
    };
    n.ready = (function () {
        var B = !n.recognizesMedia("all"),
            E = false;
        var D = [],
            H = function () {
                B = true;
                for (var K; K = D.shift(); K()) {}
            };
        var I = g("link"),
            J = g("style");

        function C(K) {
            return K.disabled || G(K.sheet, K.media || "screen")
        }function G(M, P) {
            if (!n.recognizesMedia(P || "all")) {
                return true
            }
            if (!M || M.disabled) {
                return false
            }
            try {
                var Q = M.cssRules,
                    O;
                if (Q) {
                    search: for (var L = 0, K = Q.length; O = Q[L], L < K; ++L) {
                        switch (O.type) {
                        case 2:
                            break;
                        case 3:
                            if (!G(O.styleSheet, O.media.mediaText)) {
                                return false
                            }
                            break;
                        default:
                            break search
                        }
                    }
                }
            } catch (N) {}
            return true
        }function F() {
            if (document.createStyleSheet) {
                return true
            }
            var L, K;
            for (K = 0; L = I[K]; ++K) {
                if (L.rel.toLowerCase() == "stylesheet" && !C(L)) {
                    return false
                }
            }
            for (K = 0; L = J[K]; ++K) {
                if (!C(L)) {
                    return false
                }
            }
            return true
        }
        x.ready(function () {
            if (!E) {
                E = n.getStyle(document.body).isUsable()
            }
            if (B || (E && F())) {
                H()
            } else {
                setTimeout(arguments.callee, 10)
            }
        });
        return function (K) {
            if (B) {
                K()
            } else {
                D.push(K)
            }
        }
    })();

    function s(D) {
        var C = this.face = D.face,
            B = {
                "\u0020": 1,
                "\u00a0": 1,
                "\u3000": 1
            };
        this.glyphs = D.glyphs;
        this.w = D.w;
        this.baseSize = parseInt(C["units-per-em"], 10);
        this.family = C["font-family"].toLowerCase();
        this.weight = C["font-weight"];
        this.style = C["font-style"] || "normal";
        this.viewBox = (function () {
            var F = C.bbox.split(/\s+/);
            var E = {
                minX: parseInt(F[0], 10),
                minY: parseInt(F[1], 10),
                maxX: parseInt(F[2], 10),
                maxY: parseInt(F[3], 10)
            };
            E.width = E.maxX - E.minX;
            E.height = E.maxY - E.minY;
            E.toString = function () {
                return [this.minX, this.minY, this.width, this.height].join(" ")
            };
            return E
        })();
        this.ascent = -parseInt(C.ascent, 10);
        this.descent = -parseInt(C.descent, 10);
        this.height = -this.ascent + this.descent;
        this.spacing = function (L, N, E) {
            var O = this.glyphs,
                M, K, G, P = [],
                F = 0,
                J = -1,
                I = -1,
                H;
            while (H = L[++J]) {
                M = O[H] || this.missingGlyph;
                if (!M) {
                    continue
                }
                if (K) {
                    F -= G = K[H] || 0;
                    P[I] -= G
                }
                F += P[++I] = ~~ (M.w || this.w) + N + (B[H] ? E : 0);
                K = M.k
            }
            P.total = F;
            return P
        }
    }function f() {
        var C = {},
            B = {
                oblique: "italic",
                italic: "oblique"
            };
        this.add = function (D) {
            (C[D.style] || (C[D.style] = {}))[D.weight] = D
        };
        this.get = function (H, I) {
            var G = C[H] || C[B[H]] || C.normal || C.italic || C.oblique;
            if (!G) {
                return null
            }
            I = {
                normal: 400,
                bold: 700
            }[I] || parseInt(I, 10);
            if (G[I]) {
                return G[I]
            }
            var E = {
                1: 1,
                99: 0
            }[I % 100],
                K = [],
                F, D;
            if (E === undefined) {
                E = I > 400
            }
            if (I == 500) {
                I = 400
            }
            for (var J in G) {
                if (!k(G, J)) {
                    continue
                }
                J = parseInt(J, 10);
                if (!F || J < F) {
                    F = J
                }
                if (!D || J > D) {
                    D = J
                }
                K.push(J)
            }
            if (I < F) {
                I = F
            }
            if (I > D) {
                I = D
            }
            K.sort(function (M, L) {
                return (E ? (M >= I && L >= I) ? M < L : M > L : (M <= I && L <= I) ? M > L : M < L) ? -1 : 1
            });
            return G[K[0]]
        }
    }function r() {function D(F, G) {
            if (F.contains) {
                return F.contains(G)
            }
            return F.compareDocumentPosition(G) & 16
        }function B(G) {
            var F = G.relatedTarget;
            if (!F || D(this, F)) {
                return
            }
            C(this, G.type == "mouseover")
        }function E(F) {
            C(this, F.type == "mouseenter")
        }function C(F, G) {
            setTimeout(function () {
                var H = d.get(F).options;
                m.replace(F, G ? h(H, H.hover) : H, true)
            }, 10)
        }
        this.attach = function (F) {
            if (F.onmouseenter === undefined) {
                q(F, "mouseover", B);
                q(F, "mouseout", B)
            } else {
                q(F, "mouseenter", E);
                q(F, "mouseleave", E)
            }
        }
    }function u() {
        var C = [],
            D = {};

        function B(H) {
            var E = [],
                G;
            for (var F = 0; G = H[F]; ++F) {
                E[F] = C[D[G]]
            }
            return E
        }
        this.add = function (F, E) {
            D[F] = C.push(E) - 1
        };
        this.repeat = function () {
            var E = arguments.length ? B(arguments) : C,
                F;
            for (var G = 0; F = E[G++];) {
                m.replace(F[0], F[1], true)
            }
        }
    }function A() {
        var D = {},
            B = 0;

        function C(E) {
            return E.cufid || (E.cufid = ++B)
        }
        this.get = function (E) {
            var F = C(E);
            return D[F] || (D[F] = {})
        }
    }function a(B) {
        var D = {},
            C = {};
        this.extend = function (E) {
            for (var F in E) {
                if (k(E, F)) {
                    D[F] = E[F]
                }
            }
            return this
        };
        this.get = function (E) {
            return D[E] != undefined ? D[E] : B[E]
        };
        this.getSize = function (F, E) {
            return C[F] || (C[F] = new n.Size(this.get(F), E))
        };
        this.isUsable = function () {
            return !!B
        }
    }function q(C, B, D) {
        if (C.addEventListener) {
            C.addEventListener(B, D, false)
        } else {
            if (C.attachEvent) {
                C.attachEvent("on" + B, function () {
                    return D.call(C, window.event)
                })
            }
        }
    }function v(C, B) {
        var D = d.get(C);
        if (D.options) {
            return C
        }
        if (B.hover && B.hoverables[C.nodeName.toLowerCase()]) {
            b.attach(C)
        }
        D.options = B;
        return C
    }function j(B) {
        var C = {};
        return function (D) {
            if (!k(C, D)) {
                C[D] = B.apply(null, arguments)
            }
            return C[D]
        }
    }function c(F, E) {
        var B = n.quotedList(E.get("fontFamily").toLowerCase()),
            D;
        for (var C = 0; D = B[C]; ++C) {
            if (i[D]) {
                return i[D].get(E.get("fontStyle"), E.get("fontWeight"))
            }
        }
        return null
    }function g(B) {
        return document.getElementsByTagName(B)
    }function k(C, B) {
        return C.hasOwnProperty(B)
    }function h() {
        var C = {},
            B, F;
        for (var E = 0, D = arguments.length; B = arguments[E], E < D; ++E) {
            for (F in B) {
                if (k(B, F)) {
                    C[F] = B[F]
                }
            }
        }
        return C
    }function o(E, M, C, N, F, D) {
        var K = document.createDocumentFragment(),
            H;
        if (M === "") {
            return K
        }
        var L = N.separate;
        var I = M.split(p[L]),
            B = (L == "words");
        if (B && t) {
            if (/^\s/.test(M)) {
                I.unshift("")
            }
            if (/\s$/.test(M)) {
                I.push("")
            }
        }
        for (var J = 0, G = I.length; J < G; ++J) {
            H = z[N.engine](E, B ? n.textAlign(I[J], C, J, G) : I[J], C, N, F, D, J < G - 1);
            if (H) {
                K.appendChild(H)
            }
        }
        return K
    }function l(D, M) {
        var C = D.nodeName.toLowerCase();
        if (M.ignore[C]) {
            return
        }
        var E = !M.textless[C];
        var B = n.getStyle(v(D, M)).extend(M);
        var F = c(D, B),
            G, K, I, H, L, J;
        if (!F) {
            return
        }
        for (G = D.firstChild; G; G = I) {
            K = G.nodeType;
            I = G.nextSibling;
            if (E && K == 3) {
                if (H) {
                    H.appendData(G.data);
                    D.removeChild(G)
                } else {
                    H = G
                }
                if (I) {
                    continue
                }
            }
            if (H) {
                D.replaceChild(o(F, n.whiteSpace(H.data, B, H, J), B, M, G, D), H);
                H = null
            }
            if (K == 1) {
                if (G.firstChild) {
                    if (G.nodeName.toLowerCase() == "cufon") {
                        z[M.engine](F, null, B, M, G, D)
                    } else {
                        arguments.callee(G, M)
                    }
                }
                J = G
            }
        }
    }
    var t = " ".split(/\s+/).length == 0;
    var d = new A();
    var b = new r();
    var y = new u();
    var e = false;
    var z = {},
        i = {},
        w = {
            autoDetect: false,
            engine: null,
            forceHitArea: false,
            hover: false,
            hoverables: {
                a: true
            },
            ignore: {
                applet: 1,
                canvas: 1,
                col: 1,
                colgroup: 1,
                head: 1,
                iframe: 1,
                map: 1,
                optgroup: 1,
                option: 1,
                script: 1,
                select: 1,
                style: 1,
                textarea: 1,
                title: 1,
                pre: 1
            },
            printable: true,
            selector: (window.Sizzle || (window.jQuery && function (B) {
                return jQuery(B)
            }) || (window.dojo && dojo.query) || (window.Ext && Ext.query) || (window.YAHOO && YAHOO.util && YAHOO.util.Selector && YAHOO.util.Selector.query) || (window.$$ && function (B) {
                return $$(B)
            }) || (window.$ && function (B) {
                return $(B)
            }) || (document.querySelectorAll && function (B) {
                return document.querySelectorAll(B)
            }) || g),
            separate: "words",
            textless: {
                dl: 1,
                html: 1,
                ol: 1,
                table: 1,
                tbody: 1,
                thead: 1,
                tfoot: 1,
                tr: 1,
                ul: 1
            },
            textShadow: "none"
        };
    var p = {
        words: /\s/.test("\u00a0") ? /[^\S\u00a0]+/ : /\s+/,
        characters: "",
        none: /^/
    };
    m.now = function () {
        x.ready();
        return m
    };
    m.refresh = function () {
        y.repeat.apply(y, arguments);
        return m
    };
    m.registerEngine = function (C, B) {
        if (!B) {
            return m
        }
        z[C] = B;
        return m.set("engine", C)
    };
    m.registerFont = function (D) {
        if (!D) {
            return m
        }
        var B = new s(D),
            C = B.family;
        if (!i[C]) {
            i[C] = new f()
        }
        i[C].add(B);
        return m.set("fontFamily", '"' + C + '"')
    };
    m.replace = function (D, C, B) {
        C = h(w, C);
        if (!C.engine) {
            return m
        }
        if (!e) {
            n.addClass(x.root(), "cufon-active cufon-loading");
            n.ready(function () {
                n.addClass(n.removeClass(x.root(), "cufon-loading"), "cufon-ready")
            });
            e = true
        }
        if (C.hover) {
            C.forceHitArea = true
        }
        if (C.autoDetect) {
            delete C.fontFamily
        }
        if (typeof C.textShadow == "string") {
            C.textShadow = n.textShadow(C.textShadow)
        }
        if (typeof C.color == "string" && /^-/.test(C.color)) {
            C.textGradient = n.gradient(C.color)
        } else {
            delete C.textGradient
        }
        if (!B) {
            y.add(D, arguments)
        }
        if (D.nodeType || typeof D == "string") {
            D = [D]
        }
        n.ready(function () {
            for (var F = 0, E = D.length; F < E; ++F) {
                var G = D[F];
                if (typeof G == "string") {
                    m.replace(C.selector(G), C, true)
                } else {
                    l(G, C)
                }
            }
        });
        return m
    };
    m.set = function (B, C) {
        w[B] = C;
        return m
    };
    return m
})();
Cufon.registerEngine("vml", (function () {
    var e = document.namespaces;
    if (!e) {
        return
    }
    e.add("cvml", "urn:schemas-microsoft-com:vml");
    e = null;
    var b = document.createElement("cvml:shape");
    b.style.behavior = "url(#default#VML)";
    if (!b.coordsize) {
        return
    }
    b = null;
    var h = (document.documentMode || 0) < 8;
    document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:' + (h ? "middle" : "text-bottom") + ";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g, "!important;"));

    function c(i, j) {
        return a(i, / ( ? : em | ex | % ) $ | ^ [a - z - ] + $ / i.test(j) ? "1em" : j)
    }function a(l, m) {
        if (m === "0") {
            return 0
        }
        if (/px$/i.test(m)) {
            return parseFloat(m)
        }
        var k = l.style.left,
            j = l.runtimeStyle.left;
        l.runtimeStyle.left = l.currentStyle.left;
        l.style.left = m.replace("%", "em");
        var i = l.style.pixelLeft;
        l.style.left = k;
        l.runtimeStyle.left = j;
        return i
    }function f(l, k, j, n) {
        var i = "computed" + n,
            m = k[i];
        if (isNaN(m)) {
            m = k.get(n);
            k[i] = m = (m == "normal") ? 0 : ~~j.convertFrom(a(l, m))
        }
        return m
    }
    var g = {};

    function d(p) {
        var q = p.id;
        if (!g[q]) {
            var n = p.stops,
                o = document.createElement("cvml:fill"),
                i = [];
            o.type = "gradient";
            o.angle = 180;
            o.focus = "0";
            o.method = "sigma";
            o.color = n[0][1];
            for (var m = 1, l = n.length - 1; m < l; ++m) {
                i.push(n[m][0] * 100 + "% " + n[m][1])
            }
            o.colors = i.join(",");
            o.color2 = n[l][1];
            g[q] = o
        }
        return g[q]
    }
    return function (ac, G, Y, C, K, ad, W) {
        var n = (G === null);
        if (n) {
            G = K.alt
        }
        var I = ac.viewBox;
        var p = Y.computedFontSize || (Y.computedFontSize = new Cufon.CSS.Size(c(ad, Y.get("fontSize")) + "px", ac.baseSize));
        var y, q;
        if (n) {
            y = K;
            q = K.firstChild
        } else {
            y = document.createElement("cufon");
            y.className = "cufon cufon-vml";
            y.alt = G;
            q = document.createElement("cufoncanvas");
            y.appendChild(q);
            if (C.printable) {
                var Z = document.createElement("cufontext");
                Z.appendChild(document.createTextNode(G));
                y.appendChild(Z)
            }
            if (!W) {
                y.appendChild(document.createElement("cvml:shape"))
            }
        }
        var ai = y.style;
        var R = q.style;
        var l = p.convert(I.height),
            af = Math.ceil(l);
        var V = af / l;
        var P = V * Cufon.CSS.fontStretch(Y.get("fontStretch"));
        var U = I.minX,
            T = I.minY;
        R.height = af;
        R.top = Math.round(p.convert(T - ac.ascent));
        R.left = Math.round(p.convert(U));
        ai.height = p.convert(ac.height) + "px";
        var F = Y.get("color");
        var ag = Cufon.CSS.textTransform(G, Y).split("");
        var L = ac.spacing(ag, f(ad, Y, p, "letterSpacing"), f(ad, Y, p, "wordSpacing"));
        if (!L.length) {
            return null
        }
        var k = L.total;
        var x = -U + k + (I.width - L[L.length - 1]);
        var ah = p.convert(x * P),
            X = Math.round(ah);
        var O = x + "," + I.height,
            m;
        var J = "r" + O + "ns";
        var u = C.textGradient && d(C.textGradient);
        var o = ac.glyphs,
            S = 0;
        var H = C.textShadow;
        var ab = -1,
            aa = 0,
            w;
        while (w = ag[++ab]) {
            var D = o[ag[ab]] || ac.missingGlyph,
                v;
            if (!D) {
                continue
            }
            if (n) {
                v = q.childNodes[aa];
                while (v.firstChild) {
                    v.removeChild(v.firstChild)
                }
            } else {
                v = document.createElement("cvml:shape");
                q.appendChild(v)
            }
            v.stroked = "f";
            v.coordsize = O;
            v.coordorigin = m = (U - S) + "," + T;
            v.path = (D.d ? "m" + D.d + "xe" : "") + "m" + m + J;
            v.fillcolor = F;
            if (u) {
                v.appendChild(u.cloneNode(false))
            }
            var ae = v.style;
            ae.width = X;
            ae.height = af;
            if (H) {
                var s = H[0],
                    r = H[1];
                var B = Cufon.CSS.color(s.color),
                    z;
                var N = document.createElement("cvml:shadow");
                N.on = "t";
                N.color = B.color;
                N.offset = s.offX + "," + s.offY;
                if (r) {
                    z = Cufon.CSS.color(r.color);
                    N.type = "double";
                    N.color2 = z.color;
                    N.offset2 = r.offX + "," + r.offY
                }
                N.opacity = B.opacity || (z && z.opacity) || 1;
                v.appendChild(N)
            }
            S += L[aa++]
        }
        var M = v.nextSibling,
            t, A;
        if (C.forceHitArea) {
            if (!M) {
                M = document.createElement("cvml:rect");
                M.stroked = "f";
                M.className = "cufon-vml-cover";
                t = document.createElement("cvml:fill");
                t.opacity = 0;
                M.appendChild(t);
                q.appendChild(M)
            }
            A = M.style;
            A.width = X;
            A.height = af
        } else {
            if (M) {
                q.removeChild(M)
            }
        }
        ai.width = Math.max(Math.ceil(p.convert(k * P)), 0);
        if (h) {
            var Q = Y.computedYAdjust;
            if (Q === undefined) {
                var E = Y.get("lineHeight");
                if (E == "normal") {
                    E = "1em"
                } else {
                    if (!isNaN(E)) {
                        E += "em"
                    }
                }
                Y.computedYAdjust = Q = 0.5 * (a(ad, E) - parseFloat(ai.height))
            }
            if (Q) {
                ai.marginTop = Math.ceil(Q) + "px";
                ai.marginBottom = Q + "px"
            }
        }
        return y
    }
})());
Cufon.registerEngine("canvas", (function () {
    var b = document.createElement("canvas");
    if (!b || !b.getContext || !b.getContext.apply) {
        return
    }
    b = null;
    var a = Cufon.CSS.supports("display", "inline-block");
    var e = !a && (document.compatMode == "BackCompat" || /frameset|transitional/i.test(document.doctype.publicId));
    var f = document.createElement("style");
    f.type = "text/css";
    f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;" + (e ? "" : "font-size:1px;line-height:1px;") + "}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}" + (a ? "cufon canvas{position:relative;}" : "cufon canvas{position:absolute;}") + "}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g, "!important;")));
    document.getElementsByTagName("head")[0].appendChild(f);

    function d(p, h) {
        var n = 0,
            m = 0;
        var g = [],
            o = /([mrvxe])([^a-z]*)/g,
            k;
        generate: for (var j = 0; k = o.exec(p); ++j) {
            var l = k[2].split(",");
            switch (k[1]) {
            case "v":
                g[j] = {
                    m: "bezierCurveTo",
                    a: [n + ~~l[0], m + ~~l[1], n + ~~l[2], m + ~~l[3], n += ~~l[4], m += ~~l[5]]
                };
                break;
            case "r":
                g[j] = {
                    m: "lineTo",
                    a: [n += ~~l[0], m += ~~l[1]]
                };
                break;
            case "m":
                g[j] = {
                    m: "moveTo",
                    a: [n = ~~l[0], m = ~~l[1]]
                };
                break;
            case "x":
                g[j] = {
                    m: "closePath"
                };
                break;
            case "e":
                break generate
            }
            h[g[j].m].apply(h, g[j].a)
        }
        return g
    }function c(m, k) {
        for (var j = 0, h = m.length; j < h; ++j) {
            var g = m[j];
            k[g.m].apply(k, g.a)
        }
    }
    return function (V, w, P, t, C, W) {
        var k = (w === null);
        if (k) {
            w = C.getAttribute("alt")
        }
        var A = V.viewBox;
        var m = P.getSize("fontSize", V.baseSize);
        var B = 0,
            O = 0,
            N = 0,
            u = 0;
        var z = t.textShadow,
            L = [];
        if (z) {
            for (var U = z.length; U--;) {
                var F = z[U];
                var K = m.convertFrom(parseFloat(F.offX));
                var I = m.convertFrom(parseFloat(F.offY));
                L[U] = [K, I];
                if (I < B) {
                    B = I
                }
                if (K > O) {
                    O = K
                }
                if (I > N) {
                    N = I
                }
                if (K < u) {
                    u = K
                }
            }
        }
        var Z = Cufon.CSS.textTransform(w, P).split("");
        var E = V.spacing(Z, ~~m.convertFrom(parseFloat(P.get("letterSpacing")) || 0), ~~m.convertFrom(parseFloat(P.get("wordSpacing")) || 0));
        if (!E.length) {
            return null
        }
        var h = E.total;
        O += A.width - E[E.length - 1];
        u += A.minX;
        var s, n;
        if (k) {
            s = C;
            n = C.firstChild
        } else {
            s = document.createElement("cufon");
            s.className = "cufon cufon-canvas";
            s.setAttribute("alt", w);
            n = document.createElement("canvas");
            s.appendChild(n);
            if (t.printable) {
                var S = document.createElement("cufontext");
                S.appendChild(document.createTextNode(w));
                s.appendChild(S)
            }
        }
        var aa = s.style;
        var H = n.style;
        var j = m.convert(A.height);
        var Y = Math.ceil(j);
        var M = Y / j;
        var G = M * Cufon.CSS.fontStretch(P.get("fontStretch"));
        var J = h * G;
        var Q = Math.ceil(m.convert(J + O - u));
        var o = Math.ceil(m.convert(A.height - B + N));
        n.width = Q;
        n.height = o;
        H.width = Q + "px";
        H.height = o + "px";
        B += A.minY;
        H.top = Math.round(m.convert(B - V.ascent)) + "px";
        H.left = Math.round(m.convert(u)) + "px";
        var r = Math.max(Math.ceil(m.convert(J)), 0) + "px";
        if (a) {
            aa.width = r;
            aa.height = m.convert(V.height) + "px"
        } else {
            aa.paddingLeft = r;
            aa.paddingBottom = (m.convert(V.height) - 1) + "px"
        }
        var X = n.getContext("2d"),
            D = j / A.height;
        X.scale(D, D * M);
        X.translate(-u, - B);
        X.save();

        function T() {
            var x = V.glyphs,
                ab, l = -1,
                g = -1,
                y;
            X.scale(G, 1);
            while (y = Z[++l]) {
                var ab = x[Z[l]] || V.missingGlyph;
                if (!ab) {
                    continue
                }
                if (ab.d) {
                    X.beginPath();
                    if (ab.code) {
                        c(ab.code, X)
                    } else {
                        ab.code = d("m" + ab.d, X)
                    }
                    X.fill()
                }
                X.translate(E[++g], 0)
            }
            X.restore()
        }
        if (z) {
            for (var U = z.length; U--;) {
                var F = z[U];
                X.save();
                X.fillStyle = F.color;
                X.translate.apply(X, L[U]);
                T()
            }
        }
        var q = t.textGradient;
        if (q) {
            var v = q.stops,
                p = X.createLinearGradient(0, A.minY, 0, A.maxY);
            for (var U = 0, R = v.length; U < R; ++U) {
                p.addColorStop.apply(p, v[U])
            }
            X.fillStyle = p
        } else {
            X.fillStyle = P.get("color")
        }
        T();
        return s
    }
})());;
/*
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data `2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({
    "w": 200,
    "face": {
        "font-family": "Liberation Sans",
        "font-weight": 400,
        "font-stretch": "normal",
        "units-per-em": "360",
        "panose-1": "2 11 6 4 2 2 2 2 2 4",
        "ascent": "288",
        "descent": "-72",
        "x-height": "4",
        "bbox": "-9 -316.029 360 76.6956",
        "underline-thickness": "26.3672",
        "underline-position": "-51.3281",
        "unicode-range": "U+0020-U+2122"
    },
    "glyphs": {
        " ": {
            "w": 100,
            "k": {
                "Y": 7,
                "T": 7,
                "A": 20
            }
        },
        "\u00a0": {
            "w": 100
        },
        "!": {
            "d": "63,-70r-26,0r-4,-178r34,0xm33,0r0,-35r34,0r0,35r-34,0",
            "w": 100
        },
        "\"": {
            "d": "109,-170r-25,0r-4,-78r32,0xm44,-170r-25,0r-4,-78r33,0",
            "w": 127
        },
        "#": {
            "d": "158,-156r-14,65r45,0r0,19r-49,0r-16,72r-19,0r15,-72r-64,0r-15,72r-19,0r15,-72r-35,0r0,-19r39,0r14,-65r-44,0r0,-19r48,0r15,-71r20,0r-16,71r64,0r16,-71r19,0r-16,71r37,0r0,19r-40,0xm75,-156r-14,65r63,0r14,-65r-63,0"
        },
        "$": {
            "d": "194,-70v0,46,-34,64,-81,66r0,29r-22,0r0,-29v-49,-1,-79,-23,-87,-63r30,-6v5,28,25,41,57,43r0,-87v-38,-9,-76,-20,-76,-67v1,-42,33,-58,76,-59r0,-23r22,0r0,23v45,0,67,20,76,56r-31,6v-5,-23,-18,-35,-45,-37r0,78v41,10,81,20,81,70xm113,-29v51,7,71,-66,19,-77v-6,-2,-12,-4,-19,-6r0,83xm91,-219v-47,-6,-63,57,-18,69v6,2,12,3,18,5r0,-74"
        },
        "%": {
            "d": "252,-156v43,0,55,33,55,80v0,46,-13,78,-56,78v-42,0,-55,-33,-55,-78v0,-48,12,-80,56,-80xm93,0r-28,0r162,-248r28,0xm13,-171v-1,-47,13,-79,56,-79v43,0,55,33,55,79v0,46,-13,79,-55,79v-43,0,-56,-33,-56,-79xm251,-17v28,0,30,-29,30,-59v0,-31,-1,-60,-29,-60v-29,0,-31,29,-31,60v0,29,2,59,30,59xm69,-112v27,0,28,-30,29,-59v0,-31,-1,-60,-29,-60v-29,0,-30,30,-30,60v0,30,2,59,30,59",
            "w": 320
        },
        "&": {
            "d": "234,-2v-28,10,-62,0,-77,-18v-40,39,-149,32,-144,-45v3,-43,29,-61,60,-76v-25,-40,-17,-114,47,-108v35,3,59,15,59,50v0,44,-40,53,-71,69v14,26,32,50,51,72v14,-21,24,-43,30,-72r26,8v-9,33,-21,57,-38,82v13,13,33,22,57,15r0,23xm97,-151v25,-10,52,-18,56,-48v-1,-18,-13,-29,-33,-29v-42,0,-39,50,-23,77xm42,-66v-3,51,71,58,98,28v-20,-24,-41,-51,-56,-80v-23,10,-40,24,-42,52",
            "w": 240
        },
        "'": {
            "d": "47,-170r-25,0r-4,-78r33,0",
            "w": 68
        },
        "(": {
            "d": "87,75v-38,-42,-65,-92,-65,-169v0,-76,28,-126,65,-167r31,0v-38,41,-64,92,-64,168v0,76,26,127,64,168r-31,0",
            "w": 119
        },
        ")": {
            "d": "33,-261v38,41,65,92,65,168v0,76,-27,127,-65,168r-31,0v37,-41,64,-92,64,-168v0,-76,-27,-127,-64,-168r31,0",
            "w": 119
        },
        "*": {
            "d": "80,-196r47,-18r7,23r-49,13r32,44r-20,13r-27,-46r-27,45r-21,-12r33,-44r-49,-13r8,-23r47,19r-2,-53r23,0",
            "w": 140
        },
        "+": {
            "d": "118,-107r0,75r-26,0r0,-75r-74,0r0,-26r74,0r0,-75r26,0r0,75r74,0r0,26r-74,0",
            "w": 210
        },
        ",": {
            "d": "68,-38v1,34,0,65,-14,84r-22,0v9,-13,17,-26,17,-46r-16,0r0,-38r35,0",
            "w": 100
        },
        "-": {
            "d": "16,-82r0,-28r88,0r0,28r-88,0",
            "w": 119
        },
        "\u00ad": {
            "d": "16,-82r0,-28r88,0r0,28r-88,0",
            "w": 119
        },
        ".": {
            "d": "33,0r0,-38r34,0r0,38r-34,0",
            "w": 100
        },
        "\/": {
            "d": "0,4r72,-265r28,0r-72,265r-28,0",
            "w": 100
        },
        "0": {
            "d": "101,-251v68,0,85,55,85,127v0,72,-20,128,-86,128v-67,0,-86,-56,-86,-128v0,-73,17,-127,87,-127xm100,-22v47,0,54,-49,54,-102v0,-53,-4,-102,-53,-102v-51,0,-55,48,-55,102v0,53,5,102,54,102"
        },
        "1": {
            "d": "27,0r0,-27r64,0r0,-190r-56,39r0,-29r58,-41r29,0r0,221r61,0r0,27r-156,0",
            "k": {
                "1": 27
            }
        },
        "2": {
            "d": "101,-251v82,-7,93,87,43,132r-62,55v-11,11,-23,22,-29,37r129,0r0,27r-164,0v2,-99,128,-94,128,-182v0,-28,-16,-43,-45,-43v-29,0,-46,15,-49,41r-32,-3v6,-41,34,-60,81,-64"
        },
        "3": {
            "d": "126,-127v33,6,58,20,58,59v0,88,-139,92,-164,29v-3,-8,-5,-16,-6,-25r32,-3v6,27,21,44,54,44v32,0,53,-15,52,-46v-1,-38,-36,-46,-79,-43r0,-28v39,1,72,-4,72,-42v0,-27,-17,-43,-46,-43v-28,0,-47,15,-49,41r-32,-3v6,-42,35,-63,81,-64v48,-1,79,21,79,65v0,36,-21,52,-52,59"
        },
        "4": {
            "d": "155,-56r0,56r-30,0r0,-56r-117,0r0,-25r114,-167r33,0r0,167r35,0r0,25r-35,0xm125,-212v-27,46,-58,90,-88,131r88,0r0,-131"
        },
        "5": {
            "d": "54,-142v48,-35,137,-8,131,61v11,99,-154,114,-171,26r32,-4v7,23,22,37,52,37v35,-1,51,-22,54,-58v4,-55,-73,-65,-99,-34r-31,0r8,-134r141,0r0,27r-112,0"
        },
        "6": {
            "d": "110,-160v48,1,74,30,74,79v0,53,-28,85,-80,85v-65,0,-83,-55,-86,-122v-5,-90,50,-162,133,-122v14,7,22,21,27,39r-31,6v-5,-40,-67,-38,-82,-6v-9,19,-15,44,-15,74v11,-20,30,-34,60,-33xm103,-22v34,0,49,-23,49,-58v0,-35,-16,-56,-50,-56v-29,0,-50,16,-49,49v1,36,15,65,50,65"
        },
        "7": {
            "d": "64,0v3,-98,48,-159,88,-221r-134,0r0,-27r164,0r0,26v-39,65,-84,121,-85,222r-33,0"
        },
        "8": {
            "d": "134,-131v28,9,52,24,51,62v-1,50,-34,73,-85,73v-51,0,-83,-23,-84,-73v0,-36,21,-54,49,-61v-75,-25,-45,-126,34,-121v46,3,78,18,79,63v0,33,-17,51,-44,57xm100,-142v31,1,46,-15,46,-44v0,-28,-17,-43,-47,-42v-29,0,-46,13,-45,42v1,28,16,44,46,44xm101,-20v35,0,51,-18,51,-52v0,-30,-18,-46,-53,-46v-33,0,-51,17,-51,47v0,34,19,51,53,51"
        },
        "9": {
            "d": "99,-251v64,0,84,50,84,122v0,92,-53,162,-136,121v-14,-7,-20,-23,-25,-40r30,-5v6,39,69,39,84,7v9,-19,16,-44,16,-74v-10,22,-31,35,-62,35v-49,0,-73,-33,-73,-83v0,-54,28,-83,82,-83xm98,-110v31,-1,51,-18,51,-49v0,-36,-14,-67,-51,-67v-34,0,-49,23,-49,58v0,34,15,58,49,58"
        },
        ":": {
            "d": "33,-154r0,-36r34,0r0,36r-34,0xm33,0r0,-36r34,0r0,36r-34,0",
            "w": 100
        },
        ";": {
            "d": "68,-36v1,33,-1,63,-14,82r-22,0v9,-13,17,-26,17,-46r-16,0r0,-36r35,0xm33,-154r0,-36r35,0r0,36r-35,0",
            "w": 100
        },
        "\u037e": {
            "d": "68,-36v1,33,-1,63,-14,82r-22,0v9,-13,17,-26,17,-46r-16,0r0,-36r35,0xm33,-154r0,-36r35,0r0,36r-35,0",
            "w": 100
        },
        "<": {
            "d": "18,-100r0,-36r175,-74r0,27r-151,65r151,64r0,27",
            "w": 210
        },
        "=": {
            "d": "18,-150r0,-26r174,0r0,26r-174,0xm18,-60r0,-26r174,0r0,26r-174,0",
            "w": 210
        },
        ">": {
            "d": "18,-27r0,-27r151,-64r-151,-65r0,-27r175,74r0,36",
            "w": 210
        },
        "?": {
            "d": "103,-251v84,0,111,97,45,133v-19,10,-37,24,-39,52r-31,0v0,-63,77,-55,77,-114v0,-30,-21,-42,-52,-43v-32,0,-53,17,-56,46r-32,-2v7,-45,34,-72,88,-72xm77,0r0,-35r34,0r0,35r-34,0"
        },
        "@": {
            "d": "198,-261v85,0,136,45,136,128v0,61,-22,111,-78,115v-29,2,-39,-18,-37,-44v-12,23,-32,44,-66,44v-41,0,-58,-28,-58,-68v0,-60,30,-105,88,-108v29,-1,43,15,54,32r7,-28r28,0v-9,45,-23,84,-27,134v-1,11,6,17,14,16v39,-4,51,-48,51,-92v0,-69,-42,-107,-112,-107v-93,0,-145,59,-145,153v0,71,41,112,115,113v43,0,78,-13,106,-28r9,19v-30,18,-67,32,-115,32v-89,0,-140,-51,-140,-136v0,-107,62,-175,170,-175xm158,-41v46,0,70,-43,70,-90v0,-26,-17,-40,-43,-40v-44,0,-59,41,-61,85v-1,26,9,45,34,45",
            "w": 365
        },
        "A": {
            "d": "205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240,
            "k": {
                "\u2019": 27,
                "y": 7,
                "w": 7,
                "v": 7,
                "Y": 27,
                "W": 13,
                "V": 27,
                "T": 27,
                " ": 20
            }
        },
        "B": {
            "d": "160,-131v35,5,61,23,61,61v0,87,-106,68,-191,70r0,-248v76,3,177,-17,177,60v0,33,-19,50,-47,57xm63,-142v50,-1,110,9,110,-42v0,-47,-63,-36,-110,-37r0,79xm63,-27v55,-2,124,14,124,-45v0,-56,-70,-42,-124,-44r0,89",
            "w": 240
        },
        "C": {
            "d": "212,-179v-10,-28,-35,-45,-73,-45v-59,0,-87,40,-87,99v0,60,29,101,89,101v43,0,62,-24,78,-52r27,14v-18,38,-51,66,-107,66v-80,0,-117,-50,-121,-129v-6,-104,99,-153,187,-111v19,9,31,26,39,46",
            "w": 259
        },
        "D": {
            "d": "30,-248v118,-7,216,8,213,122v-3,78,-43,126,-121,126r-92,0r0,-248xm63,-27v89,8,146,-16,146,-99v0,-83,-60,-101,-146,-95r0,194",
            "w": 259
        },
        "E": {
            "d": "30,0r0,-248r187,0r0,28r-154,0r0,79r144,0r0,27r-144,0r0,87r162,0r0,27r-195,0",
            "w": 240
        },
        "F": {
            "d": "63,-220r0,92r138,0r0,28r-138,0r0,100r-33,0r0,-248r175,0r0,28r-142,0",
            "w": 219,
            "k": {
                "A": 20,
                ".": 40,
                ",": 40
            }
        },
        "G": {
            "d": "143,4v-82,0,-121,-48,-125,-129v-5,-107,100,-154,193,-111v17,8,29,25,37,43r-32,9v-13,-25,-37,-40,-76,-40v-61,0,-88,39,-88,99v0,61,29,100,91,101v35,0,62,-11,79,-27r0,-45r-74,0r0,-28r105,0r0,86v-25,25,-61,42,-110,42",
            "w": 280
        },
        "H": {
            "d": "197,0r0,-115r-134,0r0,115r-33,0r0,-248r33,0r0,105r134,0r0,-105r34,0r0,248r-34,0",
            "w": 259
        },
        "I": {
            "d": "33,0r0,-248r34,0r0,248r-34,0",
            "w": 100
        },
        "J": {
            "d": "153,-248v-8,100,35,252,-73,252v-44,-1,-67,-25,-74,-66r32,-5v4,25,16,42,43,43v27,0,39,-20,39,-49r0,-147r-48,0r0,-28r81,0",
            "w": 180
        },
        "K": {
            "d": "194,0r-99,-120r-32,25r0,95r-33,0r0,-248r33,0r0,124r119,-124r40,0r-105,108r119,140r-42,0",
            "w": 240
        },
        "L": {
            "d": "30,0r0,-248r33,0r0,221r125,0r0,27r-158,0",
            "k": {
                "\u2019": 20,
                "y": 13,
                "Y": 27,
                "W": 27,
                "V": 27,
                "T": 27,
                " ": 13
            }
        },
        "M": {
            "d": "240,0r2,-218v-23,76,-54,145,-80,218r-23,0r-81,-218r1,218r-29,0r0,-248r44,0r77,211v21,-75,51,-140,76,-211r43,0r0,248r-30,0",
            "w": 299
        },
        "N": {
            "d": "190,0r-132,-211r1,211r-29,0r0,-248r39,0r133,213r-2,-213r31,0r0,248r-41,0",
            "w": 259
        },
        "O": {
            "d": "140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "P": {
            "d": "30,-248v87,1,191,-15,191,75v0,78,-77,80,-158,76r0,97r-33,0r0,-248xm63,-123v57,0,124,11,124,-50v0,-59,-68,-47,-124,-48r0,98",
            "w": 240,
            "k": {
                "A": 27,
                ".": 46,
                ",": 46,
                " ": 7
            }
        },
        "Q": {
            "d": "140,-251v81,0,123,46,123,126v0,72,-35,117,-100,126v7,30,30,48,69,40r0,23v-55,16,-95,-15,-103,-61v-73,-6,-112,-51,-112,-128v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "R": {
            "d": "233,-177v-1,41,-23,64,-60,70r70,107r-38,0r-65,-103r-77,0r0,103r-33,0r0,-248v88,3,205,-21,203,71xm63,-129v60,-2,137,13,137,-47v0,-61,-80,-42,-137,-45r0,92",
            "w": 259,
            "k": {
                "Y": 7,
                "W": 7,
                "V": 7,
                "T": 7
            }
        },
        "S": {
            "d": "185,-189v-5,-48,-123,-54,-124,2v14,75,158,14,163,119v3,78,-121,87,-175,55v-17,-10,-28,-26,-33,-46r33,-7v5,56,141,63,141,-1v0,-78,-155,-14,-162,-118v-5,-82,145,-84,179,-34v5,7,8,16,11,25",
            "w": 240
        },
        "T": {
            "d": "127,-220r0,220r-34,0r0,-220r-85,0r0,-28r204,0r0,28r-85,0",
            "w": 219,
            "k": {
                "y": 20,
                "w": 20,
                "u": 13,
                "s": 40,
                "r": 13,
                "o": 40,
                "i": 13,
                "e": 40,
                "c": 40,
                "a": 40,
                "O": 7,
                "A": 27,
                ";": 40,
                ":": 40,
                ".": 40,
                "-": 20,
                ",": 40,
                " ": 7
            }
        },
        "U": {
            "d": "232,-93v-1,65,-40,97,-104,97v-61,0,-100,-32,-100,-94r0,-158r33,0v8,89,-33,224,67,224v102,0,64,-133,71,-224r33,0r0,155",
            "w": 259
        },
        "V": {
            "d": "137,0r-34,0r-101,-248r35,0r83,218r83,-218r36,0",
            "w": 240,
            "k": {
                "y": 13,
                "u": 13,
                "r": 13,
                "o": 20,
                "i": 7,
                "e": 20,
                "a": 27,
                "A": 27,
                ";": 13,
                ":": 13,
                ".": 33,
                "-": 20,
                ",": 33
            }
        },
        "W": {
            "d": "266,0r-40,0r-56,-210r-55,210r-40,0r-73,-248r35,0r59,218r15,-64r43,-154r32,0r59,218r59,-218r35,0",
            "w": 339,
            "k": {
                "y": 3,
                "u": 7,
                "r": 7,
                "o": 7,
                "e": 7,
                "a": 13,
                "A": 13,
                ";": 7,
                ":": 7,
                ".": 20,
                "-": 7,
                ",": 20
            }
        },
        "X": {
            "d": "195,0r-74,-108r-76,108r-37,0r94,-129r-87,-119r37,0r69,98r67,-98r37,0r-84,118r92,130r-38,0",
            "w": 240
        },
        "Y": {
            "d": "137,-103r0,103r-34,0r0,-103r-95,-145r37,0r75,118r75,-118r37,0",
            "w": 240,
            "k": {
                "v": 20,
                "u": 20,
                "q": 33,
                "p": 27,
                "o": 33,
                "i": 13,
                "e": 33,
                "a": 27,
                "A": 27,
                ";": 23,
                ":": 20,
                ".": 46,
                "-": 33,
                ",": 46,
                " ": 7
            }
        },
        "Z": {
            "d": "209,0r-198,0r0,-25r151,-195r-138,0r0,-28r176,0r0,25r-150,196r159,0r0,27",
            "w": 219
        },
        "[": {
            "d": "26,75r0,-336r71,0r0,23r-41,0r0,290r41,0r0,23r-71,0",
            "w": 100
        },
        "\\": {
            "d": "72,4r-72,-265r28,0r72,265r-28,0",
            "w": 100
        },
        "]": {
            "d": "3,75r0,-23r41,0r0,-290r-41,0r0,-23r71,0r0,336r-71,0",
            "w": 100
        },
        "^": {
            "d": "138,-118r-54,-112r-54,112r-28,0r64,-130r36,0r65,130r-29,0",
            "w": 168
        },
        "_": {
            "d": "-5,72r0,-23r209,0r0,23r-209,0"
        },
        "`": {
            "d": "77,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0",
            "w": 119
        },
        "a": {
            "d": "141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41"
        },
        "b": {
            "d": "115,-194v53,0,69,39,70,98v0,66,-23,100,-70,100v-31,-1,-49,-11,-59,-34r-2,30r-31,0r1,-261r32,0r0,101v10,-23,28,-34,59,-34xm107,-20v40,0,45,-34,45,-75v0,-40,-5,-75,-45,-74v-42,0,-51,32,-51,76v0,43,10,73,51,73"
        },
        "c": {
            "d": "96,-169v-40,0,-48,33,-48,73v0,40,9,75,48,75v24,0,41,-14,43,-38r32,2v-6,37,-31,61,-74,61v-59,0,-76,-41,-82,-99v-10,-93,101,-131,147,-64v4,7,5,14,7,22r-32,3v-4,-21,-16,-35,-41,-35",
            "w": 180
        },
        "d": {
            "d": "85,-194v31,0,48,13,60,33r-1,-100r32,0r1,261r-30,0v-2,-10,0,-23,-3,-31v-10,23,-28,35,-59,35v-53,0,-69,-39,-70,-98v0,-66,23,-100,70,-100xm94,-170v-40,0,-46,34,-46,75v0,40,6,74,45,74v42,0,51,-32,51,-76v0,-42,-9,-74,-50,-73"
        },
        "e": {
            "d": "100,-194v63,0,86,42,84,106r-135,0v0,40,14,67,53,68v26,1,43,-12,49,-29r28,8v-11,28,-37,45,-77,45v-58,0,-88,-37,-87,-100v1,-61,26,-98,85,-98xm152,-113v6,-60,-76,-77,-97,-28v-3,7,-6,17,-6,28r103,0"
        },
        "f": {
            "d": "101,-234v-31,-9,-42,10,-38,44r38,0r0,23r-38,0r0,167r-31,0r0,-167r-27,0r0,-23r27,0v-7,-52,17,-82,69,-68r0,24",
            "w": 100,
            "k": {
                "\u2019": -7,
                "f": 7
            }
        },
        "g": {
            "d": "177,-190v-10,125,41,293,-110,261v-23,-6,-38,-20,-44,-43r32,-5v15,47,100,32,89,-28r0,-30v-11,21,-29,36,-61,36v-54,0,-68,-41,-68,-96v0,-56,16,-97,71,-98v29,-1,48,16,59,35v1,-10,0,-23,2,-32r30,0xm94,-22v36,0,50,-32,50,-73v0,-42,-14,-75,-50,-75v-39,0,-46,34,-46,75v0,41,6,73,46,73"
        },
        "h": {
            "d": "106,-169v-72,0,-44,102,-49,169r-32,0r0,-261r32,0r-1,103v12,-21,28,-36,61,-36v89,0,53,116,60,194r-32,0r0,-121v2,-32,-8,-49,-39,-48"
        },
        "i": {
            "d": "24,-231r0,-30r32,0r0,30r-32,0xm24,0r0,-190r32,0r0,190r-32,0",
            "w": 79
        },
        "j": {
            "d": "24,-231r0,-30r32,0r0,30r-32,0xm-9,49v24,4,33,-6,33,-30r0,-209r32,0r0,214v2,40,-23,58,-65,49r0,-24",
            "w": 79
        },
        "k": {
            "d": "143,0r-64,-87r-23,19r0,68r-32,0r0,-261r32,0r0,163r83,-92r37,0r-77,82r82,108r-38,0",
            "w": 180
        },
        "l": {
            "d": "24,0r0,-261r32,0r0,261r-32,0",
            "w": 79
        },
        "m": {
            "d": "210,-169v-67,3,-38,105,-44,169r-31,0r0,-121v0,-29,-5,-50,-35,-48v-66,4,-38,104,-44,169r-31,0r-1,-190r30,0v1,10,-1,24,2,32v10,-44,99,-50,107,0v11,-21,27,-35,58,-36v85,-2,47,119,55,194r-31,0r0,-121v0,-29,-5,-49,-35,-48",
            "w": 299
        },
        "n": {
            "d": "117,-194v89,-4,53,116,60,194r-32,0r0,-121v0,-31,-8,-49,-39,-48v-72,2,-44,102,-49,169r-32,0r-1,-190r30,0v1,10,-1,24,2,32v11,-22,29,-35,61,-36"
        },
        "o": {
            "d": "100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75"
        },
        "p": {
            "d": "115,-194v55,1,70,41,70,98v0,57,-16,98,-70,100v-31,0,-49,-13,-60,-34r1,105r-32,0r-1,-265r31,0r2,30v10,-21,28,-34,59,-34xm107,-20v40,0,45,-34,45,-75v0,-41,-6,-73,-45,-74v-42,0,-51,32,-51,76v0,43,10,73,51,73"
        },
        "q": {
            "d": "145,-31v-11,22,-29,35,-60,35v-53,0,-69,-39,-70,-98v0,-59,17,-99,70,-100v32,-1,48,14,60,33v0,-11,-1,-24,2,-32r30,0r-1,268r-32,0xm93,-21v41,0,51,-33,51,-76v0,-43,-8,-73,-50,-73v-40,0,-46,35,-46,75v0,40,5,74,45,74"
        },
        "r": {
            "d": "114,-163v-78,-16,-53,91,-57,163r-32,0r-1,-190r30,0v1,12,-1,29,2,39v6,-27,23,-49,58,-41r0,29",
            "w": 119,
            "k": {
                "\u2019": -13,
                ".": 20,
                ",": 20
            }
        },
        "s": {
            "d": "135,-143v-3,-34,-86,-38,-87,0v15,53,115,12,119,90v4,78,-150,74,-157,8r28,-5v4,36,97,45,98,0v-10,-56,-113,-15,-118,-90v-4,-57,82,-63,122,-42v12,7,21,19,24,35",
            "w": 180
        },
        "t": {
            "d": "59,-47v-2,24,18,29,38,22r0,24v-33,10,-70,5,-70,-39r0,-127r-22,0r0,-23r24,0r9,-43r21,0r0,43r35,0r0,23r-35,0r0,120",
            "w": 100
        },
        "u": {
            "d": "84,4v-89,4,-54,-116,-61,-194r32,0r0,120v0,31,7,50,39,49v72,-2,45,-101,50,-169r31,0r1,190r-30,0v-1,-10,1,-25,-2,-33v-11,22,-28,36,-60,37"
        },
        "v": {
            "d": "108,0r-38,0r-69,-190r34,0r54,165r56,-165r34,0",
            "w": 180,
            "k": {
                ".": 27,
                ",": 27
            }
        },
        "w": {
            "d": "206,0r-36,0r-40,-164r-41,164r-36,0r-54,-190r32,0r39,164r43,-164r34,0r41,164r42,-164r31,0",
            "w": 259,
            "k": {
                ".": 20,
                ",": 20
            }
        },
        "x": {
            "d": "141,0r-51,-78r-52,78r-34,0r68,-98r-65,-92r35,0r48,74r47,-74r35,0r-64,92r68,98r-35,0",
            "w": 180
        },
        "y": {
            "d": "179,-190r-86,221v-14,28,-37,51,-81,42r0,-24v39,6,53,-20,64,-50r-75,-189r34,0r57,156r54,-156r33,0",
            "w": 180,
            "k": {
                ".": 27,
                ",": 27
            }
        },
        "z": {
            "d": "9,0r0,-24r116,-142r-109,0r0,-24r144,0r0,24r-116,142r123,0r0,24r-158,0",
            "w": 180
        },
        "{": {
            "d": "39,-94v74,12,-11,154,75,146r0,23v-44,4,-70,-10,-70,-52v0,-46,11,-107,-38,-105r0,-22v81,4,-7,-162,84,-157r24,0r0,23v-82,-15,-2,131,-75,144",
            "w": 120
        },
        "|": {
            "d": "32,76r0,-337r29,0r0,337r-29,0",
            "w": 93
        },
        "}": {
            "d": "76,-40v2,64,8,128,-70,115r0,-23v80,12,3,-131,74,-146v-40,-6,-34,-59,-34,-106v1,-29,-11,-41,-40,-38r0,-23v44,-4,70,10,70,52v0,47,-12,108,38,105r0,22v-26,1,-39,14,-38,42",
            "w": 120
        },
        "~": {
            "d": "16,-127v37,-31,93,-2,135,6v18,-1,32,-8,43,-16r0,26v-50,42,-130,-35,-178,9r0,-25",
            "w": 210
        },
        "\u00a1": {
            "d": "47,-120r26,0r4,177r-34,0xm77,-190r0,35r-34,0r0,-35r34,0",
            "w": 119
        },
        "\u00a2": {
            "d": "95,-195v-57,5,-51,139,0,145r0,-145xm24,-123v0,-56,20,-93,71,-97r0,-28r21,0r0,28v36,3,56,24,62,56r-33,2v-3,-18,-11,-30,-29,-33r0,145v17,-4,29,-16,31,-36r32,2v-6,34,-26,56,-63,60r0,29r-21,0r0,-29v-51,-5,-70,-44,-71,-99"
        },
        "\u00a3": {
            "d": "45,-27v46,-4,117,17,120,-31r29,3v-5,33,-21,55,-59,55r-123,0r0,-27v27,-12,33,-42,31,-83r-33,0r0,-23r33,0v-23,-96,57,-153,128,-96v4,5,8,11,10,18r-31,10v-5,-15,-16,-24,-36,-24v-47,0,-39,48,-39,92r71,0r0,23r-71,0v2,40,-6,70,-30,83"
        },
        "\u00a4": {
            "d": "56,-182v21,-19,67,-19,89,-1r17,-17r18,19r-17,16v17,22,18,67,0,89r17,18r-18,18r-17,-18v-22,18,-67,18,-89,0r-18,18r-18,-18r18,-18v-18,-22,-18,-67,0,-89r-18,-17r18,-18xm101,-170v-30,0,-50,20,-50,49v0,30,20,50,50,50v29,0,49,-20,49,-50v0,-29,-20,-49,-49,-49"
        },
        "\u00a5": {
            "d": "127,-125r56,0r0,22r-67,0r0,27r67,0r0,23r-67,0r0,53r-32,0r0,-53r-67,0r0,-23r67,0r1,-27r-68,0r0,-22r57,0r-74,-123r35,0r65,114r66,-114r35,0"
        },
        "\u00a6": {
            "d": "32,-124r0,-137r29,0r0,137r-29,0xm32,76r0,-137r29,0r0,137r-29,0",
            "w": 93
        },
        "\u00a7": {
            "d": "31,-209v-2,-70,138,-68,145,-6r-28,3v-3,-36,-88,-36,-89,0v12,56,121,17,121,91v0,27,-17,41,-38,48v19,10,37,21,37,48v2,76,-153,72,-159,7r29,-5v2,42,101,43,102,0v-13,-58,-124,-24,-124,-95v0,-26,18,-41,40,-47v-20,-7,-36,-18,-36,-44xm55,-120v4,42,95,53,97,3v-4,-43,-95,-54,-97,-3"
        },
        "\u00a8": {
            "d": "77,-214r0,-33r29,0r0,33r-29,0xm8,-214r0,-33r29,0r0,33r-29,0",
            "w": 119
        },
        "\u00a9": {
            "d": "133,-251v76,0,127,50,127,127v0,77,-50,127,-127,127v-77,0,-128,-49,-128,-127v0,-77,49,-127,128,-127xm133,-14v66,0,110,-42,110,-110v0,-69,-43,-111,-110,-111v-66,0,-111,45,-111,111v0,65,44,110,111,110xm173,-157v-17,-41,-97,-25,-85,32v-11,59,71,77,87,30r21,6v-12,22,-28,41,-62,40v-46,-1,-69,-29,-69,-76v0,-78,101,-100,128,-37",
            "w": 265
        },
        "\u00aa": {
            "d": "92,-140v-14,34,-87,38,-87,-13v0,-44,44,-42,86,-43v1,-23,-4,-39,-27,-38v-17,1,-26,6,-27,24r-27,-2v5,-26,23,-40,54,-40v31,0,52,13,52,44r0,54v-2,15,5,22,18,18v1,13,1,22,-14,21v-18,-1,-26,-9,-28,-25xm66,-179v-35,-9,-50,45,-13,45v26,0,40,-17,38,-46",
            "w": 133
        },
        "\u00ab": {
            "d": "156,-25r-60,-64r0,-11r60,-65r29,0r0,5r-59,66r60,64r0,5r-30,0xm74,-25r-59,-64r0,-11r59,-65r29,0r0,5r-59,66r59,64r0,5r-29,0"
        },
        "\u00ac": {
            "d": "167,-32r0,-75r-149,0r0,-26r174,0r0,101r-25,0",
            "w": 210
        },
        "\u00ae": {
            "d": "133,-251v76,0,127,50,127,127v0,77,-50,127,-127,127v-77,0,-128,-49,-128,-127v0,-77,49,-127,128,-127xm133,-14v66,0,110,-42,110,-110v0,-69,-43,-111,-110,-111v-66,0,-111,45,-111,111v0,65,44,110,111,110xm136,-197v59,-9,68,78,19,85r38,61r-25,0r-35,-59r-28,0r0,59r-23,0r0,-146r54,0xm105,-127v30,1,60,3,60,-28v0,-27,-32,-26,-60,-25r0,53",
            "w": 265
        },
        "\u00af": {
            "d": "202,-255r-205,0r0,-17r205,0r0,17",
            "w": 198
        },
        "\u00b0": {
            "d": "72,-251v31,0,50,20,50,50v0,30,-20,50,-50,50v-30,0,-51,-20,-51,-50v0,-30,19,-50,51,-50xm72,-170v19,0,31,-12,31,-31v1,-20,-13,-32,-31,-32v-18,0,-32,12,-31,32v0,19,12,31,31,31",
            "w": 143
        },
        "\u00b1": {
            "d": "112,-120r0,70r-26,0r0,-70r-75,0r0,-25r75,0r0,-69r26,0r0,69r74,0r0,25r-74,0xm11,0r0,-25r175,0r0,25r-175,0",
            "w": 197
        },
        "\u00b2": {
            "d": "111,-209v0,50,-58,54,-76,90r78,0r0,20r-105,0r-1,-18v15,-40,70,-45,80,-90v-1,-15,-9,-25,-26,-24v-17,0,-27,9,-29,25r-23,-2v5,-26,22,-42,53,-42v30,0,49,14,49,41",
            "w": 119
        },
        "\u00b3": {
            "d": "78,-176v19,5,35,13,35,36v0,52,-87,57,-104,18v-2,-5,-3,-10,-4,-15r24,-2v2,17,12,24,32,24v18,0,28,-8,28,-26v0,-23,-21,-25,-44,-24r0,-19v21,0,39,-4,40,-24v0,-15,-9,-23,-25,-23v-16,0,-27,8,-28,24r-24,-3v1,-50,101,-56,101,-2v0,21,-12,32,-31,36",
            "w": 119
        },
        "\u00b4": {
            "d": "13,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0",
            "w": 119
        },
        "\u00b5": {
            "d": "146,-31v-12,30,-63,49,-90,21r0,85r-31,0r0,-265r31,0v8,62,-26,169,40,169v69,0,43,-102,48,-169r32,0r0,143v-1,18,6,31,23,24r0,23v-26,9,-56,0,-53,-31",
            "w": 207
        },
        "\u00b6": {
            "d": "14,-184v-3,-80,89,-63,164,-64r0,18r-23,0r0,276r-19,0r0,-276r-38,0r0,276r-20,0r0,-168v-40,-1,-62,-22,-64,-62",
            "w": 193
        },
        "\u00b7": {
            "d": "33,-78r0,-39r34,0r0,39r-34,0",
            "w": 100
        },
        "\u2219": {
            "d": "33,-78r0,-39r34,0r0,39r-34,0",
            "w": 100
        },
        "\u00b8": {
            "d": "52,18v19,-1,33,8,33,26v0,31,-30,33,-64,32r0,-18v18,2,39,4,41,-13v1,-15,-18,-13,-34,-13r12,-32r19,0",
            "w": 119
        },
        "\u00b9": {
            "d": "14,-99r0,-19r37,0r0,-109r-35,25r0,-22v18,-9,27,-27,58,-24r0,130r38,0r0,19r-98,0",
            "w": 119
        },
        "\u00ba": {
            "d": "66,-252v43,0,62,25,61,69v0,43,-19,69,-62,69v-41,0,-60,-27,-60,-69v0,-43,19,-69,61,-69xm65,-133v29,0,36,-19,36,-50v0,-30,-5,-50,-34,-50v-30,-1,-36,21,-36,50v0,28,6,50,34,50",
            "w": 131
        },
        "\u00bb": {
            "d": "126,-25r-29,0r0,-5r59,-64r-59,-66r0,-5r29,0r60,65r0,11xm44,-25r-29,0r0,-5r59,-64r-59,-66r0,-5r29,0r59,65r0,11"
        },
        "\u00bc": {
            "d": "264,-32r0,32r-23,0r0,-32r-71,0r0,-19r68,-98r26,0r0,97r20,0r0,20r-20,0xm242,-126v-15,26,-33,50,-50,74r49,0xm87,0r-26,0r155,-248r25,0xm10,-99r0,-19r37,0r0,-109r-35,25r0,-22v18,-9,27,-27,58,-24r0,130r38,0r0,19r-98,0",
            "w": 300
        },
        "\u00bd": {
            "d": "87,0r-26,0r155,-248r25,0xm10,-99r0,-19r37,0r0,-109r-35,25r0,-22v18,-9,27,-27,58,-24r0,130r38,0r0,19r-98,0xm289,-110v0,50,-58,54,-76,90r78,0r0,20r-105,0r-1,-18v15,-40,70,-45,80,-90v-1,-15,-9,-25,-26,-24v-17,0,-27,9,-29,25r-23,-2v5,-26,22,-42,53,-42v30,0,49,14,49,41",
            "w": 300
        },
        "\u00be": {
            "d": "264,-32r0,32r-23,0r0,-32r-71,0r0,-19r68,-98r26,0r0,97r20,0r0,20r-20,0xm242,-126v-15,26,-33,50,-50,74r49,0xm90,0r-26,0r155,-248r26,0xm86,-176v19,5,35,13,35,36v0,52,-87,57,-104,18v-2,-5,-3,-10,-4,-15r24,-2v2,17,12,24,32,24v18,0,28,-8,28,-26v0,-23,-21,-25,-44,-24r0,-19v21,0,39,-4,40,-24v0,-15,-9,-23,-25,-23v-16,0,-27,8,-28,24r-24,-3v1,-50,101,-56,101,-2v0,21,-12,32,-31,36",
            "w": 300
        },
        "\u00bf": {
            "d": "107,61v-50,0,-82,-22,-84,-70v-2,-65,71,-58,78,-115r30,0v1,64,-76,54,-76,114v0,30,21,42,52,43v32,0,53,-17,56,-46r32,2v-6,46,-36,72,-88,72xm133,-190r0,35r-34,0r0,-35r34,0",
            "w": 219
        },
        "\u00c0": {
            "d": "132,-269r-55,-38r0,-5r37,0v12,15,29,25,38,43r-20,0xm205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240
        },
        "\u00c1": {
            "d": "96,-269v9,-18,26,-28,38,-43r37,0r0,5r-55,38r-20,0xm205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240
        },
        "\u00c2": {
            "d": "139,-315v12,16,30,27,39,46v-29,2,-38,-16,-57,-24v-19,8,-29,26,-59,24v10,-19,29,-29,41,-46r36,0xm205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240
        },
        "\u00c3": {
            "d": "184,-316v-4,23,-8,48,-36,47v-28,-1,-64,-43,-75,0r-16,0v4,-23,8,-48,36,-47v28,1,64,44,74,0r17,0xm205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240
        },
        "\u00c4": {
            "d": "141,-269r0,-32r29,0r0,32r-29,0xm72,-269r0,-32r29,0r0,32r-29,0xm205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240
        },
        "\u00c5": {
            "d": "121,-314v26,0,42,16,42,42v0,27,-18,40,-42,43v-25,-3,-43,-16,-43,-43v0,-26,17,-42,43,-42xm121,-248v14,0,23,-10,23,-24v0,-13,-10,-23,-23,-23v-14,0,-24,9,-24,23v0,14,10,24,24,24xm205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0",
            "w": 240
        },
        "\u00c6": {
            "d": "170,0r0,-72r-96,0r-35,72r-35,0r121,-248r212,0r0,28r-133,0r0,79r123,0r0,27r-123,0r0,87r141,0r0,27r-175,0xm170,-222v-33,-8,-36,21,-46,42r-38,81r84,0r0,-123",
            "w": 360
        },
        "\u00c7": {
            "d": "212,-179v-10,-28,-35,-45,-73,-45v-59,0,-87,40,-87,99v0,60,29,101,89,101v43,0,62,-24,78,-52r27,14v-18,38,-51,66,-107,66v-80,0,-117,-50,-121,-129v-6,-104,99,-153,187,-111v19,9,31,26,39,46xm142,18v19,-1,33,8,33,26v0,31,-30,33,-64,32r0,-18v18,2,39,4,41,-13v1,-15,-18,-13,-34,-13r12,-32r19,0",
            "w": 259
        },
        "\u00c8": {
            "d": "129,-269r-54,-38r0,-5r36,0v12,15,29,25,38,43r-20,0xm30,0r0,-248r187,0r0,28r-154,0r0,79r144,0r0,27r-144,0r0,87r162,0r0,27r-195,0",
            "w": 240
        },
        "\u00c9": {
            "d": "97,-269v9,-18,26,-28,38,-43r36,0r0,5r-54,38r-20,0xm30,0r0,-248r187,0r0,28r-154,0r0,79r144,0r0,27r-144,0r0,87r162,0r0,27r-195,0",
            "w": 240
        },
        "\u00ca": {
            "d": "143,-315v12,16,30,27,39,46v-29,2,-38,-16,-57,-24v-19,8,-29,26,-59,24v10,-19,29,-29,41,-46r36,0xm30,0r0,-248r187,0r0,28r-154,0r0,79r144,0r0,27r-144,0r0,87r162,0r0,27r-195,0",
            "w": 240
        },
        "\u00cb": {
            "d": "143,-269r0,-32r29,0r0,32r-29,0xm74,-269r0,-32r29,0r0,32r-29,0xm30,0r0,-248r187,0r0,28r-154,0r0,79r144,0r0,27r-144,0r0,87r162,0r0,27r-195,0",
            "w": 240
        },
        "\u00cc": {
            "d": "56,-269r-54,-38r0,-5r36,0v12,15,29,25,38,43r-20,0xm33,0r0,-248r34,0r0,248r-34,0",
            "w": 100
        },
        "\u00cd": {
            "d": "25,-269v9,-18,26,-28,38,-43r36,0r0,5r-54,38r-20,0xm33,0r0,-248r34,0r0,248r-34,0",
            "w": 100
        },
        "\u00ce": {
            "d": "69,-315v12,16,30,27,39,46v-29,2,-38,-16,-57,-24v-19,8,-29,26,-59,24v10,-19,29,-29,41,-46r36,0xm33,0r0,-248r34,0r0,248r-34,0",
            "w": 100
        },
        "\u00cf": {
            "d": "70,-269r0,-32r29,0r0,32r-29,0xm1,-269r0,-32r29,0r0,32r-29,0xm33,0r0,-248r34,0r0,248r-34,0",
            "w": 100
        },
        "\u00d0": {
            "d": "243,-126v-3,78,-43,126,-121,126r-92,0r0,-114r-28,0r0,-27r28,0r0,-107v118,-7,216,8,213,122xm63,-27v89,8,146,-16,146,-99v0,-83,-60,-101,-146,-95r0,80r71,0r0,27r-71,0r0,87",
            "w": 259
        },
        "\u00d1": {
            "d": "195,-316v-3,24,-8,48,-35,47v-28,-1,-64,-43,-75,0r-16,0v4,-23,8,-48,36,-47v28,1,64,44,74,0r16,0xm190,0r-132,-211r1,211r-29,0r0,-248r39,0r133,213r-2,-213r31,0r0,248r-41,0",
            "w": 259
        },
        "\u00d2": {
            "d": "150,-269r-54,-38r0,-5r36,0v12,15,29,25,38,43r-20,0xm140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "\u00d3": {
            "d": "109,-269v9,-18,26,-28,38,-43r37,0r0,5r-55,38r-20,0xm140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "\u00d4": {
            "d": "159,-315v12,16,30,27,40,46v-30,3,-38,-16,-57,-24v-20,8,-29,27,-60,24v10,-20,29,-29,42,-46r35,0xm140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "\u00d5": {
            "d": "201,-316v-4,23,-8,48,-36,47v-27,-2,-64,-44,-74,0r-16,0v4,-23,8,-48,36,-47v28,1,64,44,74,0r16,0xm140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "\u00d6": {
            "d": "160,-269r0,-32r29,0r0,32r-29,0xm91,-269r0,-32r29,0r0,32r-29,0xm140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101",
            "w": 280
        },
        "\u00d7": {
            "d": "25,-58r62,-62r-62,-62r19,-18r61,62r62,-62r18,19r-61,61r61,62r-17,18r-63,-62r-62,62",
            "w": 210
        },
        "\u00d8": {
            "d": "233,-215v19,21,30,51,30,90v0,79,-44,129,-123,129v-30,0,-54,-8,-73,-20r-21,25r-34,0r36,-42v-20,-21,-31,-53,-31,-92v0,-80,42,-125,123,-126v31,0,53,7,73,19r21,-26r34,0xm140,-24v87,0,108,-103,71,-166r-124,150v13,10,30,16,53,16xm140,-224v-87,0,-109,102,-71,165r124,-149v-13,-10,-30,-16,-53,-16",
            "w": 280
        },
        "\u00d9": {
            "d": "143,-269r-55,-38r0,-5r37,0v12,15,29,25,38,43r-20,0xm232,-93v-1,65,-40,97,-104,97v-61,0,-100,-32,-100,-94r0,-158r33,0v8,89,-33,224,67,224v102,0,64,-133,71,-224r33,0r0,155",
            "w": 259
        },
        "\u00da": {
            "d": "99,-269v9,-18,26,-28,38,-43r37,0r0,5r-55,38r-20,0xm232,-93v-1,65,-40,97,-104,97v-61,0,-100,-32,-100,-94r0,-158r33,0v8,89,-33,224,67,224v102,0,64,-133,71,-224r33,0r0,155",
            "w": 259
        },
        "\u00db": {
            "d": "149,-315v12,16,30,27,39,46v-29,2,-38,-16,-57,-24v-19,8,-29,26,-59,24v10,-19,29,-29,41,-46r36,0xm232,-93v-1,65,-40,97,-104,97v-61,0,-100,-32,-100,-94r0,-158r33,0v8,89,-33,224,67,224v102,0,64,-133,71,-224r33,0r0,155",
            "w": 259
        },
        "\u00dc": {
            "d": "150,-269r0,-32r29,0r0,32r-29,0xm81,-269r0,-32r29,0r0,32r-29,0xm232,-93v-1,65,-40,97,-104,97v-61,0,-100,-32,-100,-94r0,-158r33,0v8,89,-33,224,67,224v102,0,64,-133,71,-224r33,0r0,155",
            "w": 259
        },
        "\u00dd": {
            "d": "94,-269v9,-18,26,-28,38,-43r37,0r0,5r-55,38r-20,0xm137,-103r0,103r-34,0r0,-103r-95,-145r37,0r75,118r75,-118r37,0",
            "w": 240
        },
        "\u00de": {
            "d": "63,-203v79,-2,158,-5,158,74v0,77,-76,82,-158,77r0,52r-33,0r0,-248r33,0r0,45xm63,-77v58,0,124,9,124,-51v0,-59,-66,-50,-124,-50r0,101",
            "w": 240
        },
        "\u00df": {
            "d": "140,-139v13,36,65,36,65,87v0,58,-68,64,-113,47r0,-29v22,14,87,23,83,-17v-4,-47,-80,-39,-61,-102v7,-22,36,-25,36,-53v0,-21,-19,-30,-43,-30v-36,0,-51,20,-50,57r0,179r-32,0r0,-181v0,-54,29,-79,82,-80v41,0,71,15,73,52v3,39,-32,43,-40,70",
            "w": 219
        },
        "\u00e0": {
            "d": "141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41xm110,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0"
        },
        "\u00e1": {
            "d": "141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41xm73,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0"
        },
        "\u00e2": {
            "d": "115,-262v12,18,31,29,40,51v-33,3,-38,-21,-58,-30v-20,10,-27,33,-59,30v9,-22,29,-33,41,-51r36,0xm141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41"
        },
        "\u00e3": {
            "d": "130,-211v-27,0,-66,-44,-75,0r-16,0v4,-23,8,-48,36,-47v28,1,64,44,74,0r16,0v-4,23,-8,47,-35,47xm141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41"
        },
        "\u00e4": {
            "d": "141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41xm118,-214r0,-33r29,0r0,33r-29,0xm49,-214r0,-33r29,0r0,33r-29,0"
        },
        "\u00e5": {
            "d": "98,-290v26,0,42,16,42,42v0,27,-18,40,-42,43v-25,-2,-41,-18,-43,-43v3,-24,16,-42,43,-42xm98,-224v13,0,23,-8,23,-24v0,-15,-8,-23,-23,-23v-15,-1,-24,9,-24,23v0,15,10,24,24,24xm141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41"
        },
        "\u00e6": {
            "d": "220,-194v63,1,86,42,84,106r-134,0v0,40,13,67,51,68v27,1,43,-12,50,-29r28,8v-11,29,-37,44,-78,45v-38,0,-62,-16,-74,-46v-14,27,-36,45,-76,46v-37,0,-59,-20,-59,-57v-1,-64,63,-63,126,-63v3,-35,-8,-55,-41,-54v-25,0,-41,8,-44,31r-33,-3v1,-59,111,-68,139,-27v13,-16,34,-24,61,-25xm78,-20v42,-2,63,-28,60,-74v-43,2,-94,-4,-94,41v0,20,13,33,34,33xm271,-113v7,-60,-75,-77,-95,-28v-3,7,-5,17,-5,28r100,0",
            "w": 320
        },
        "\u00e7": {
            "d": "96,-169v-40,0,-48,33,-48,73v0,40,9,75,48,75v24,0,41,-14,43,-38r32,2v-6,37,-31,61,-74,61v-59,0,-76,-41,-82,-99v-10,-93,101,-131,147,-64v4,7,5,14,7,22r-32,3v-4,-21,-16,-35,-41,-35xm99,18v19,-1,33,8,33,26v0,31,-30,33,-64,32r0,-18v18,2,39,4,41,-13v1,-15,-18,-13,-34,-13r12,-32r19,0",
            "w": 180
        },
        "\u00e8": {
            "d": "100,-194v63,0,86,42,84,106r-135,0v0,40,14,67,53,68v26,1,43,-12,49,-29r28,8v-11,28,-37,45,-77,45v-58,0,-88,-37,-87,-100v1,-61,26,-98,85,-98xm152,-113v6,-60,-76,-77,-97,-28v-3,7,-6,17,-6,28r103,0xm116,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0"
        },
        "\u00e9": {
            "d": "100,-194v63,0,86,42,84,106r-135,0v0,40,14,67,53,68v26,1,43,-12,49,-29r28,8v-11,28,-37,45,-77,45v-58,0,-88,-37,-87,-100v1,-61,26,-98,85,-98xm152,-113v6,-60,-76,-77,-97,-28v-3,7,-6,17,-6,28r103,0xm78,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0"
        },
        "\u00ea": {
            "d": "120,-262v12,18,30,30,39,51v-31,2,-38,-20,-57,-30v-20,10,-27,32,-59,30v9,-22,29,-33,41,-51r36,0xm100,-194v63,0,86,42,84,106r-135,0v0,40,14,67,53,68v26,1,43,-12,49,-29r28,8v-11,28,-37,45,-77,45v-58,0,-88,-37,-87,-100v1,-61,26,-98,85,-98xm152,-113v6,-60,-76,-77,-97,-28v-3,7,-6,17,-6,28r103,0"
        },
        "\u00eb": {
            "d": "100,-194v63,0,86,42,84,106r-135,0v0,40,14,67,53,68v26,1,43,-12,49,-29r28,8v-11,28,-37,45,-77,45v-58,0,-88,-37,-87,-100v1,-61,26,-98,85,-98xm152,-113v6,-60,-76,-77,-97,-28v-3,7,-6,17,-6,28r103,0xm121,-214r0,-33r29,0r0,33r-29,0xm52,-214r0,-33r29,0r0,33r-29,0"
        },
        "\u00ec": {
            "d": "34,0r0,-190r32,0r0,190r-32,0xm60,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0",
            "w": 100
        },
        "\u00ed": {
            "d": "34,0r0,-190r32,0r0,190r-32,0xm24,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0",
            "w": 100
        },
        "\u00ee": {
            "d": "69,-262v12,18,30,30,39,51v-32,3,-37,-21,-57,-30v-20,10,-27,32,-59,30v9,-22,29,-33,41,-51r36,0xm34,0r0,-190r32,0r0,190r-32,0",
            "w": 100
        },
        "\u00ef": {
            "d": "34,0r0,-190r32,0r0,190r-32,0xm70,-214r0,-33r29,0r0,33r-29,0xm1,-214r0,-33r29,0r0,33r-29,0",
            "w": 100
        },
        "\u00f0": {
            "d": "187,-91v0,61,-28,95,-88,95v-56,0,-81,-33,-84,-89v-3,-71,63,-105,126,-77v-10,-21,-24,-43,-41,-58r-53,23r0,-20r39,-16v-14,-10,-27,-20,-43,-28v31,-3,52,4,67,18r53,-23r0,20r-37,16v35,32,61,74,61,139xm99,-20v41,1,54,-25,55,-65v0,-40,-14,-64,-53,-64v-39,0,-53,24,-53,64v1,41,13,64,51,65"
        },
        "\u00f1": {
            "d": "130,-211v-27,0,-66,-44,-75,0r-16,0v4,-23,8,-48,36,-47v28,1,64,44,74,0r16,0v-4,23,-8,47,-35,47xm118,-194v89,-4,53,116,60,194r-32,0r0,-121v0,-31,-8,-49,-39,-48v-72,2,-44,102,-49,169r-32,0r-1,-190r30,0v1,10,-1,24,2,32v11,-22,29,-35,61,-36"
        },
        "\u00f2": {
            "d": "100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75xm116,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0"
        },
        "\u00f3": {
            "d": "100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75xm76,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0"
        },
        "\u00f4": {
            "d": "119,-262v12,18,31,29,40,51v-33,3,-38,-21,-58,-30v-20,10,-27,32,-59,30v9,-22,29,-33,41,-51r36,0xm100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75"
        },
        "\u00f5": {
            "d": "130,-211v-27,0,-65,-44,-75,0r-16,0v4,-23,8,-48,36,-47v28,1,64,44,74,0r16,0v-2,24,-9,47,-35,47xm100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75"
        },
        "\u00f6": {
            "d": "100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75xm121,-214r0,-33r29,0r0,33r-29,0xm52,-214r0,-33r29,0r0,33r-29,0"
        },
        "\u00f7": {
            "d": "84,-168r0,-33r30,0r0,33r-30,0xm11,-107r0,-26r175,0r0,26r-175,0xm84,-39r0,-32r30,0r0,32r-30,0",
            "w": 197
        },
        "\u00f8": {
            "d": "181,-161v11,16,11,39,14,66v9,87,-81,123,-140,81r-18,21r-29,0r32,-38v-10,-16,-13,-38,-15,-64v-8,-91,81,-121,141,-83r16,-18r30,0xm109,-20v57,4,58,-63,49,-114r-85,99v7,11,20,15,36,15xm111,-170v-56,-3,-57,65,-48,113r85,-99v-8,-10,-20,-13,-37,-14",
            "w": 219
        },
        "\u00f9": {
            "d": "85,4v-89,4,-54,-116,-61,-194r32,0r0,120v0,31,7,50,39,49v72,-2,45,-101,50,-169r31,0r1,190r-30,0v-1,-10,1,-25,-2,-33v-11,22,-28,36,-60,37xm118,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0"
        },
        "\u00fa": {
            "d": "85,4v-89,4,-54,-116,-61,-194r32,0r0,120v0,31,7,50,39,49v72,-2,45,-101,50,-169r31,0r1,190r-30,0v-1,-10,1,-25,-2,-33v-11,22,-28,36,-60,37xm73,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0"
        },
        "\u00fb": {
            "d": "119,-262v12,18,30,30,39,51v-31,2,-38,-20,-57,-30v-20,10,-27,32,-59,30v9,-22,29,-33,41,-51r36,0xm85,4v-89,4,-54,-116,-61,-194r32,0r0,120v0,31,7,50,39,49v72,-2,45,-101,50,-169r31,0r1,190r-30,0v-1,-10,1,-25,-2,-33v-11,22,-28,36,-60,37"
        },
        "\u00fc": {
            "d": "85,4v-89,4,-54,-116,-61,-194r32,0r0,120v0,31,7,50,39,49v72,-2,45,-101,50,-169r31,0r1,190r-30,0v-1,-10,1,-25,-2,-33v-11,22,-28,36,-60,37xm119,-214r0,-33r29,0r0,33r-29,0xm50,-214r0,-33r29,0r0,33r-29,0"
        },
        "\u00fd": {
            "d": "179,-190r-86,221v-14,28,-37,51,-81,42r0,-24v39,6,53,-20,64,-50r-75,-189r34,0r57,156r54,-156r33,0xm63,-211v8,-23,27,-35,38,-54r36,0r0,5r-58,49r-16,0",
            "w": 180
        },
        "\u00fe": {
            "d": "115,4v-31,0,-49,-13,-60,-34r1,105r-32,0r0,-336r32,0r0,101v10,-21,28,-34,59,-34v55,1,70,41,70,98v0,57,-16,98,-70,100xm107,-20v40,0,45,-34,45,-75v0,-41,-6,-73,-45,-74v-42,0,-51,32,-51,76v0,43,10,73,51,73"
        },
        "\u00ff": {
            "d": "179,-190r-86,221v-14,28,-37,51,-81,42r0,-24v39,6,53,-20,64,-50r-75,-189r34,0r57,156r54,-156r33,0xm110,-214r0,-33r29,0r0,33r-29,0xm41,-214r0,-33r29,0r0,33r-29,0",
            "w": 180
        },
        "\u2013": {
            "d": "0,-79r0,-24r200,0r0,24r-200,0"
        },
        "\u2014": {
            "d": "0,-79r0,-24r360,0r0,24r-360,0",
            "w": 360
        },
        "\u2018": {
            "d": "22,-167v-1,-32,1,-62,14,-81r22,0v-9,13,-17,26,-17,46r16,0r0,35r-35,0",
            "w": 79,
            "k": {
                "\u2018": 7
            }
        },
        "\u2019": {
            "d": "58,-248v1,32,-1,62,-14,81r-22,0v9,-13,17,-27,17,-46r-16,0r0,-35r35,0",
            "w": 79,
            "k": {
                "\u2019": 7,
                "s": 7,
                " ": 13
            }
        },
        "\u201c": {
            "d": "72,-167v-1,-32,0,-62,13,-81r22,0v-9,13,-17,26,-17,46r16,0r0,35r-34,0xm13,-167v-1,-32,1,-62,14,-81r22,0v-9,13,-17,26,-17,46r15,0r0,35r-34,0",
            "w": 119
        },
        "\u201d": {
            "d": "107,-248v1,32,-1,62,-14,81r-21,0v8,-13,16,-27,16,-46r-15,0r0,-35r34,0xm49,-248v1,32,-1,62,-14,81r-22,0v8,-13,16,-27,17,-46r-16,0r0,-35r35,0",
            "w": 119
        },
        "\u2026": {
            "d": "277,0r0,-38r34,0r0,38r-34,0xm163,0r0,-38r34,0r0,38r-34,0xm49,0r0,-38r34,0r0,38r-34,0",
            "w": 360
        },
        "\u2032": {
            "d": "15,-156r11,-92r35,0r-28,92r-18,0",
            "w": 67
        },
        "\u2033": {
            "d": "15,-156r11,-92r35,0r-28,92r-18,0xm75,-156r11,-92r35,0r-28,92r-18,0",
            "w": 127
        },
        "\u2122": {
            "d": "297,-111r0,-109r-44,109r-19,0r-42,-109r0,109r-23,0r0,-137r34,0r42,107r42,-107r32,0r0,137r-22,0xm101,-228r0,117r-23,0r0,-117r-45,0r0,-20r114,0r0,20r-46,0",
            "w": 360
        }
    }
});
/*
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data ? 2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({
    "w": 200,
    "face": {
        "font-family": "Liberation Sans",
        "font-weight": 700,
        "font-stretch": "normal",
        "units-per-em": "360",
        "panose-1": "2 11 7 4 2 2 2 2 2 4",
        "ascent": "288",
        "descent": "-72",
        "x-height": "4",
        "bbox": "-15 -323 360 80",
        "underline-thickness": "37.793",
        "underline-position": "-94.5703",
        "unicode-range": "U+0020-U+2122"
    },
    "glyphs": {
        " ": {
            "w": 100,
            "k": {
                "Y": 7,
                "A": 13
            }
        },
        "\u00a0": {
            "w": 100
        },
        "!": {
            "d": "80,-75r-40,0r-6,-173r52,0xm34,0r0,-47r51,0r0,47r-51,0",
            "w": 119
        },
        "\"": {
            "d": "142,-158r-39,0r-4,-90r48,0xm67,-158r-39,0r-4,-90r48,0",
            "w": 170
        },
        "#": {
            "d": "160,-152r-12,59r37,0r0,26r-43,0r-14,67r-28,0r14,-67r-54,0r-14,67r-26,0r13,-67r-27,0r0,-26r33,0r13,-59r-37,0r0,-26r42,0r15,-67r27,0r-15,67r54,0r15,-67r27,0r-14,67r28,0r0,26r-34,0xm79,-152r-13,59r55,0r12,-59r-54,0"
        },
        "$": {
            "d": "111,-147v44,9,85,22,84,75v-1,49,-35,65,-84,68r0,31r-20,0r0,-31v-51,-1,-79,-23,-86,-68r45,-8v4,24,15,38,41,40v-2,-22,4,-51,-2,-69v-39,-10,-76,-22,-76,-72v0,-47,35,-60,78,-63r0,-23r20,0r0,23v47,1,70,23,78,62r-46,7v-4,-18,-12,-32,-32,-34r0,62xm91,-210v-33,-4,-45,46,-13,54v4,1,8,2,13,4r0,-58xm111,-40v39,5,53,-51,15,-60v-7,-2,-7,-2,-15,-4r0,64"
        },
        "%": {
            "d": "249,-155v45,1,62,31,62,79v-1,48,-18,79,-63,79v-45,0,-61,-32,-62,-79v0,-48,16,-79,63,-79xm97,0r-36,0r162,-248r36,0xm9,-172v0,-48,16,-79,63,-78v46,0,62,31,62,78v0,48,-18,79,-63,79v-45,0,-62,-31,-62,-79xm249,-25v24,0,24,-26,24,-51v0,-26,-1,-52,-24,-52v-24,0,-25,26,-25,52v0,25,0,51,25,51xm71,-120v23,0,24,-25,24,-52v0,-26,0,-51,-23,-51v-25,0,-25,25,-25,51v0,27,1,52,24,52",
            "w": 320
        },
        "&": {
            "d": "168,-19v-44,38,-157,30,-152,-49v3,-43,29,-60,59,-75v-25,-44,-12,-111,53,-106v37,3,64,15,64,52v0,43,-40,52,-69,68v12,22,27,41,43,59v14,-19,21,-38,28,-64r37,13v-8,29,-19,52,-34,74v12,10,32,16,52,10r0,35v-28,11,-65,-2,-81,-17xm110,-158v19,-9,43,-14,43,-39v0,-14,-10,-22,-25,-22v-34,0,-33,41,-18,61xm60,-68v-3,40,55,47,79,25v-18,-20,-34,-42,-48,-67v-18,8,-30,20,-31,42",
            "w": 259
        },
        "'": {
            "d": "62,-158r-38,0r-5,-90r48,0",
            "w": 85
        },
        "(": {
            "d": "67,-93v0,74,22,123,53,168r-50,0v-30,-45,-52,-93,-52,-168v0,-75,22,-123,52,-168r50,0v-32,44,-53,94,-53,168",
            "w": 119
        },
        ")": {
            "d": "102,-93v0,74,-22,123,-52,168r-50,0v30,-46,54,-93,53,-168v0,-74,-22,-123,-53,-168r50,0v30,45,52,94,52,168",
            "w": 119
        },
        "*": {
            "d": "86,-200r42,-18r12,35r-44,11r32,37r-32,21r-26,-44r-26,44r-32,-21r33,-37r-44,-11r12,-35r42,18r-3,-48r38,0",
            "w": 140
        },
        "+": {
            "d": "125,-100r0,72r-40,0r0,-72r-70,0r0,-39r70,0r0,-72r40,0r0,72r71,0r0,39r-71,0",
            "w": 210
        },
        ",": {
            "d": "76,-54v-1,42,2,86,-19,110r-33,0v12,-14,22,-32,24,-56r-23,0r0,-54r51,0",
            "w": 100
        },
        "-": {
            "d": "14,-72r0,-43r91,0r0,43r-91,0",
            "w": 119
        },
        "\u00ad": {
            "d": "14,-72r0,-43r91,0r0,43r-91,0",
            "w": 119
        },
        ".": {
            "d": "24,0r0,-54r51,0r0,54r-51,0",
            "w": 100
        },
        "\/": {
            "d": "4,7r51,-268r42,0r-51,268r-42,0",
            "w": 100
        },
        "0": {
            "d": "101,-251v68,0,84,54,84,127v0,74,-19,128,-86,128v-67,0,-84,-56,-85,-128v-1,-75,17,-127,87,-127xm100,-35v37,-5,36,-46,36,-89v0,-43,4,-89,-36,-89v-39,0,-36,45,-36,89v0,43,-3,85,36,89"
        },
        "1": {
            "d": "23,0r0,-37r61,0r0,-169r-59,37r0,-38r62,-41r46,0r0,211r57,0r0,37r-167,0",
            "k": {
                "1": 20
            }
        },
        "2": {
            "d": "182,-182v0,78,-84,86,-111,141r115,0r0,41r-174,0v-6,-101,99,-100,120,-180v1,-22,-12,-31,-33,-32v-23,0,-32,14,-35,34r-49,-3v5,-45,32,-70,84,-70v51,0,83,22,83,69"
        },
        "3": {
            "d": "128,-127v34,4,56,21,59,58v7,91,-148,94,-172,28v-4,-9,-6,-17,-7,-26r51,-5v1,24,16,35,40,36v23,0,39,-12,38,-36v-1,-31,-31,-36,-65,-34r0,-40v32,2,59,-3,59,-33v0,-20,-13,-33,-34,-33v-21,0,-33,13,-35,32r-50,-3v6,-44,37,-68,86,-68v50,0,83,20,83,66v0,35,-22,52,-53,58"
        },
        "4": {
            "d": "165,-50r0,50r-47,0r0,-50r-113,0r0,-38r105,-160r55,0r0,161r33,0r0,37r-33,0xm118,-87r2,-116r-74,116r72,0"
        },
        "5": {
            "d": "139,-81v0,-46,-55,-55,-73,-27r-48,0r9,-140r149,0r0,37r-104,0r-4,63v44,-38,133,-4,122,66v11,103,-169,117,-179,20r49,-4v5,18,15,30,39,30v26,0,40,-18,40,-45"
        },
        "6": {
            "d": "115,-159v48,0,72,30,72,78v0,54,-30,85,-83,85v-64,0,-91,-50,-91,-122v0,-98,58,-163,141,-120v15,8,21,24,27,44r-47,6v-5,-31,-48,-31,-61,-4v-7,14,-11,33,-11,60v9,-17,28,-27,53,-27xm102,-35v24,0,36,-20,36,-45v0,-25,-11,-43,-37,-43v-23,0,-36,14,-36,38v0,27,11,50,37,50"
        },
        "7": {
            "d": "52,0v1,-96,47,-148,87,-207r-124,0r0,-41r169,0r0,40v-36,62,-79,113,-81,208r-51,0"
        },
        "8": {
            "d": "138,-131v27,9,52,24,51,61v0,53,-36,74,-89,74v-53,0,-89,-23,-89,-73v0,-35,22,-54,51,-61v-78,-25,-46,-121,38,-121v51,0,83,19,83,66v0,30,-18,49,-45,54xm100,-147v24,0,32,-13,32,-36v1,-23,-11,-34,-32,-34v-22,0,-33,12,-32,34v0,22,9,36,32,36xm101,-31v27,0,37,-17,37,-43v0,-25,-13,-39,-39,-39v-24,0,-37,15,-37,40v0,27,11,42,39,42"
        },
        "9": {
            "d": "99,-251v69,0,84,53,88,123v5,99,-61,162,-144,118v-15,-8,-21,-25,-26,-45r46,-6v4,31,50,33,63,7v7,-15,12,-36,12,-60v-9,18,-29,28,-54,28v-48,0,-72,-32,-72,-82v0,-55,31,-83,87,-83xm98,-123v24,0,37,-16,37,-39v0,-27,-10,-51,-37,-51v-25,0,-35,19,-35,45v0,25,10,45,35,45"
        },
        ":": {
            "d": "35,-132r0,-50r50,0r0,50r-50,0xm35,0r0,-49r50,0r0,49r-50,0",
            "w": 119
        },
        ";": {
            "d": "35,-132r0,-50r51,0r0,50r-51,0xm86,-49v1,42,0,83,-19,105r-33,0v12,-14,22,-32,24,-56r-23,0r0,-49r51,0",
            "w": 119
        },
        "\u037e": {
            "d": "35,-132r0,-50r51,0r0,50r-51,0xm86,-49v1,42,0,83,-19,105r-33,0v12,-14,22,-32,24,-56r-23,0r0,-49r51,0",
            "w": 119
        },
        "<": {
            "d": "15,-91r0,-56r181,-69r0,40r-147,57r147,57r0,40",
            "w": 210
        },
        "=": {
            "d": "15,-148r0,-39r180,0r0,39r-180,0xm15,-51r0,-39r180,0r0,39r-180,0",
            "w": 210
        },
        ">": {
            "d": "15,-22r0,-40r146,-57r-146,-57r0,-40r181,69r0,56",
            "w": 210
        },
        "?": {
            "d": "110,-251v83,-7,118,89,53,130v-17,10,-36,21,-38,46r-47,0v2,-56,65,-53,71,-103v2,-21,-15,-35,-38,-34v-25,1,-41,14,-44,38r-50,-2v6,-48,39,-70,93,-75xm77,0r0,-47r51,0r0,47r-51,0",
            "w": 219
        },
        "@": {
            "d": "192,-256v86,0,138,45,138,129v0,61,-26,109,-84,114v-27,2,-36,-18,-34,-42v-11,22,-31,42,-62,42v-41,0,-58,-28,-58,-68v0,-58,29,-104,88,-107v26,-1,39,14,48,30r7,-26r27,0r-27,131v-1,11,6,15,14,16v38,-7,54,-45,54,-90v0,-68,-42,-104,-111,-104v-92,0,-143,58,-143,150v0,72,40,113,113,113v43,0,75,-12,103,-28r11,22v-32,17,-67,31,-116,31v-89,0,-139,-50,-139,-138v0,-109,65,-175,171,-175xm156,-38v42,-5,58,-44,60,-89v1,-24,-14,-38,-37,-38v-41,0,-55,40,-57,84v-1,25,9,46,34,43",
            "w": 351
        },
        "A": {
            "d": "199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259,
            "k": {
                "\u2019": 20,
                "y": 13,
                "w": 7,
                "v": 13,
                "Y": 33,
                "W": 20,
                "V": 27,
                "T": 27,
                " ": 13
            }
        },
        "B": {
            "d": "182,-130v37,4,62,22,62,59v0,94,-128,67,-220,71r0,-248v84,5,203,-23,205,63v0,31,-19,50,-47,55xm76,-148v40,-3,101,13,101,-30v0,-44,-60,-28,-101,-31r0,61xm76,-38v48,-3,116,14,116,-37v0,-48,-69,-32,-116,-35r0,72",
            "w": 259
        },
        "C": {
            "d": "67,-125v0,53,21,87,73,88v37,1,54,-22,65,-47r45,17v-17,42,-51,71,-110,71v-82,0,-120,-46,-125,-129v-7,-110,109,-156,196,-107v18,10,29,29,36,50r-46,12v-8,-25,-30,-41,-62,-41v-52,0,-71,34,-72,86",
            "w": 259
        },
        "D": {
            "d": "24,-248v120,-7,223,5,221,122v-1,80,-44,126,-121,126r-100,0r0,-248xm76,-40v74,7,117,-18,117,-86v0,-67,-45,-88,-117,-82r0,168",
            "w": 259
        },
        "E": {
            "d": "24,0r0,-248r195,0r0,40r-143,0r0,63r132,0r0,40r-132,0r0,65r150,0r0,40r-202,0",
            "w": 240
        },
        "F": {
            "d": "76,-208r0,77r127,0r0,40r-127,0r0,91r-52,0r0,-248r183,0r0,40r-131,0",
            "w": 219,
            "k": {
                "A": 20,
                ".": 40,
                ",": 40
            }
        },
        "G": {
            "d": "67,-125v0,54,23,88,75,88v28,0,53,-7,68,-21r0,-34r-60,0r0,-39r108,0r0,91v-26,26,-66,44,-118,44v-82,0,-120,-46,-125,-129v-7,-111,111,-155,200,-109v19,10,29,26,37,47r-47,15v-11,-23,-29,-39,-63,-39v-53,1,-75,33,-75,86",
            "w": 280
        },
        "H": {
            "d": "184,0r0,-106r-108,0r0,106r-52,0r0,-248r52,0r0,99r108,0r0,-99r52,0r0,248r-52,0",
            "w": 259
        },
        "I": {
            "d": "24,0r0,-248r52,0r0,248r-52,0",
            "w": 100
        },
        "J": {
            "d": "176,-78v10,88,-125,109,-160,43v-5,-9,-9,-19,-11,-32r52,-8v4,21,12,37,35,38v23,0,32,-16,32,-40r0,-130r-49,0r0,-41r101,0r0,170"
        },
        "K": {
            "d": "195,0r-88,-114r-31,24r0,90r-52,0r0,-248r52,0r0,113r112,-113r60,0r-106,105r115,143r-62,0",
            "w": 259
        },
        "L": {
            "d": "24,0r0,-248r52,0r0,208r133,0r0,40r-185,0",
            "w": 219,
            "k": {
                "\u2019": 20,
                "y": 13,
                "Y": 33,
                "W": 20,
                "V": 27,
                "T": 27,
                " ": 7
            }
        },
        "M": {
            "d": "230,0r2,-204r-64,204r-37,0r-63,-204r2,204r-46,0r0,-248r70,0r56,185r57,-185r69,0r0,248r-46,0",
            "w": 299
        },
        "N": {
            "d": "175,0r-108,-191v6,58,2,128,3,191r-46,0r0,-248r59,0r110,193v-6,-58,-2,-129,-3,-193r46,0r0,248r-61,0",
            "w": 259
        },
        "O": {
            "d": "140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "P": {
            "d": "24,-248v93,1,206,-16,204,79v-1,75,-69,88,-152,82r0,87r-52,0r0,-248xm76,-127v47,0,100,7,100,-41v0,-47,-54,-39,-100,-39r0,80",
            "w": 240,
            "k": {
                "A": 27,
                ".": 46,
                ",": 46,
                " ": 7
            }
        },
        "Q": {
            "d": "140,-251v80,0,125,45,125,126v0,70,-33,111,-92,124v6,28,34,38,68,31r-1,36v-63,17,-111,-11,-120,-64v-69,-8,-105,-52,-105,-127v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "R": {
            "d": "240,-174v0,40,-23,61,-54,70r67,104r-59,0r-57,-94r-61,0r0,94r-52,0r0,-248v93,4,217,-23,216,74xm76,-134v48,-2,112,12,112,-38v0,-48,-66,-32,-112,-35r0,73",
            "w": 259,
            "k": {
                "Y": 13,
                "W": 7,
                "V": 7
            }
        },
        "S": {
            "d": "169,-182v-1,-43,-94,-46,-97,-3v18,66,151,10,154,114v3,95,-165,93,-204,36v-6,-8,-10,-19,-12,-30r50,-8v3,46,112,56,116,5v-17,-69,-150,-10,-154,-114v-4,-87,153,-88,188,-35v5,8,8,18,10,28",
            "w": 240
        },
        "T": {
            "d": "136,-208r0,208r-52,0r0,-208r-80,0r0,-40r212,0r0,40r-80,0",
            "w": 219,
            "k": {
                "y": 27,
                "w": 27,
                "u": 27,
                "s": 27,
                "r": 20,
                "o": 27,
                "i": 7,
                "e": 27,
                "c": 27,
                "a": 27,
                "O": 7,
                "A": 27,
                ";": 40,
                ":": 40,
                ".": 40,
                "-": 20,
                ",": 40
            }
        },
        "U": {
            "d": "238,-95v0,69,-44,99,-111,99v-64,0,-105,-29,-105,-97r0,-155r51,0r0,151v-1,38,19,59,55,60v90,1,49,-130,58,-211r52,0r0,153",
            "w": 259
        },
        "V": {
            "d": "147,0r-53,0r-92,-248r55,0r64,206v17,-72,42,-137,63,-206r54,0",
            "w": 240,
            "k": {
                "y": 13,
                "u": 13,
                "r": 20,
                "o": 27,
                "i": 7,
                "e": 20,
                "a": 20,
                "A": 27,
                ";": 20,
                ":": 20,
                ".": 33,
                "-": 20,
                ",": 33
            }
        },
        "W": {
            "d": "275,0r-61,0r-44,-196r-44,196r-62,0r-64,-248r53,0r44,199r45,-199r58,0r43,199r44,-199r52,0",
            "w": 339,
            "k": {
                "y": 7,
                "u": 7,
                "r": 7,
                "o": 7,
                "i": 3,
                "e": 7,
                "a": 13,
                "A": 20,
                ";": 7,
                ":": 7,
                ".": 20,
                "-": 7,
                ",": 20
            }
        },
        "X": {
            "d": "182,0r-62,-99r-62,99r-55,0r86,-130r-79,-118r55,0r55,88r55,-88r55,0r-75,118r82,130r-55,0",
            "w": 240
        },
        "Y": {
            "d": "146,-102r0,102r-52,0r0,-102r-88,-146r54,0r60,105r60,-105r54,0",
            "w": 240,
            "k": {
                "v": 20,
                "u": 20,
                "q": 27,
                "p": 20,
                "o": 27,
                "i": 13,
                "e": 20,
                "a": 20,
                "A": 33,
                ";": 27,
                ":": 27,
                ".": 40,
                "-": 20,
                ",": 40,
                " ": 7
            }
        },
        "Z": {
            "d": "210,0r-199,0r0,-37r134,-170r-121,0r0,-41r178,0r0,36r-134,171r142,0r0,41",
            "w": 219
        },
        "[": {
            "d": "20,75r0,-336r95,0r0,34r-48,0r0,268r48,0r0,34r-95,0",
            "w": 119
        },
        "\\": {
            "d": "54,7r-50,-268r42,0r51,268r-43,0",
            "w": 100
        },
        "]": {
            "d": "4,75r0,-34r49,0r0,-268r-49,0r0,-34r96,0r0,336r-96,0",
            "w": 119
        },
        "^": {
            "d": "162,-90r-57,-133r-57,133r-40,0r69,-158r56,0r69,158r-40,0",
            "w": 210
        },
        "_": {
            "d": "-4,44r0,-14r207,0r0,14r-207,0"
        },
        "`": {
            "d": "71,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0",
            "w": 119
        },
        "a": {
            "d": "133,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm85,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27"
        },
        "b": {
            "d": "135,-194v52,0,70,43,70,98v0,56,-19,99,-73,100v-30,1,-46,-15,-58,-35r-2,31r-48,0r1,-261r50,0r0,104v11,-23,29,-37,60,-37xm114,-30v31,0,40,-27,40,-66v0,-37,-7,-63,-39,-63v-32,0,-41,28,-41,65v0,36,8,64,40,64",
            "w": 219
        },
        "c": {
            "d": "190,-63v-7,42,-38,67,-86,67v-59,0,-84,-38,-90,-98v-12,-110,154,-137,174,-36r-49,2v-2,-19,-15,-32,-35,-32v-30,0,-35,28,-38,64v-6,74,65,87,74,30"
        },
        "d": {
            "d": "88,-194v31,-1,46,15,58,34r-1,-101r50,0r1,261r-48,0v-2,-10,0,-23,-3,-31v-11,23,-29,35,-61,35v-52,0,-68,-45,-69,-99v0,-56,19,-97,73,-99xm105,-30v33,0,40,-30,41,-66v1,-37,-9,-64,-41,-64v-32,0,-38,30,-39,65v0,43,13,65,39,65",
            "w": 219
        },
        "e": {
            "d": "185,-48v-13,30,-37,53,-82,52v-60,-2,-89,-37,-89,-100v0,-63,30,-98,90,-98v62,0,83,45,84,108r-122,0v0,31,8,55,39,56v18,0,30,-7,34,-22xm140,-117v5,-46,-57,-63,-70,-21v-2,6,-4,13,-4,21r74,0"
        },
        "f": {
            "d": "121,-226v-27,-7,-43,5,-38,36r38,0r0,33r-38,0r0,157r-49,0r0,-157r-28,0r0,-33r28,0v-9,-59,32,-81,87,-68r0,32",
            "w": 119,
            "k": {
                "\u2019": -7
            }
        },
        "g": {
            "d": "195,-6v11,88,-120,106,-164,52v-4,-6,-6,-13,-8,-21r49,-6v3,16,16,24,34,25v40,0,42,-37,40,-79v-11,22,-30,35,-61,35v-53,0,-70,-43,-70,-97v0,-56,18,-96,73,-97v30,0,46,14,59,34r2,-30r47,0xm105,-35v32,0,41,-27,41,-63v0,-35,-9,-62,-40,-62v-32,0,-39,29,-40,63v0,36,9,62,39,62",
            "w": 219
        },
        "h": {
            "d": "114,-157v-59,0,-34,97,-39,157r-50,0r0,-261r50,0r-1,109v12,-26,28,-41,61,-42v86,-1,58,113,63,194r-50,0v-7,-57,23,-157,-34,-157",
            "w": 219
        },
        "i": {
            "d": "25,-224r0,-37r50,0r0,37r-50,0xm25,0r0,-190r50,0r0,190r-50,0",
            "w": 100
        },
        "j": {
            "d": "25,-224r0,-37r50,0r0,37r-50,0xm75,22v2,45,-34,59,-81,51r0,-35v22,5,31,-5,31,-27r0,-201r50,0r0,212",
            "w": 100
        },
        "k": {
            "d": "147,0r-51,-86r-21,15r0,71r-50,0r0,-261r50,0r0,150r67,-79r53,0r-66,74r72,116r-54,0"
        },
        "l": {
            "d": "25,0r0,-261r50,0r0,261r-50,0",
            "w": 100
        },
        "m": {
            "d": "220,-157v-53,9,-28,100,-34,157r-49,0r0,-107v1,-27,-5,-49,-29,-50v-53,10,-27,100,-33,157r-50,0r-1,-190r47,0v2,12,-1,28,3,38v10,-53,101,-56,108,0v13,-22,24,-43,59,-42v82,1,51,116,57,194r-49,0r0,-107v-1,-25,-5,-48,-29,-50",
            "w": 320
        },
        "n": {
            "d": "135,-194v87,-1,58,113,63,194r-50,0v-7,-57,23,-157,-34,-157v-59,0,-34,97,-39,157r-50,0r-1,-190r47,0v2,12,-1,28,3,38v12,-26,28,-41,61,-42",
            "w": 219
        },
        "o": {
            "d": "110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65",
            "w": 219
        },
        "p": {
            "d": "135,-194v53,0,70,44,70,98v0,56,-19,98,-73,100v-31,1,-45,-17,-59,-34v3,33,2,69,2,105r-50,0r-1,-265r48,0v2,10,0,23,3,31v11,-24,29,-35,60,-35xm114,-30v33,0,39,-31,40,-66v0,-38,-9,-64,-40,-64v-56,0,-55,130,0,130",
            "w": 219
        },
        "q": {
            "d": "84,4v-52,0,-69,-45,-69,-99v0,-55,18,-99,73,-99v29,0,47,12,58,34r2,-30r48,0r-1,265r-49,0r0,-107v-10,23,-32,36,-62,36xm105,-30v32,0,41,-29,41,-66v0,-36,-9,-64,-40,-64v-33,0,-39,30,-40,65v0,43,13,65,39,65",
            "w": 219
        },
        "r": {
            "d": "135,-150v-39,-12,-60,13,-60,57r0,93r-50,0r-1,-190r47,0v2,13,-1,29,3,40v6,-28,27,-53,61,-41r0,41",
            "w": 140,
            "k": {
                "\u2019": -13,
                ".": 20,
                ",": 20
            }
        },
        "s": {
            "d": "137,-138v1,-29,-70,-34,-71,-4v15,46,118,7,119,86v1,83,-164,76,-172,9r43,-7v4,19,20,25,44,25v33,8,57,-30,24,-41v-43,-14,-102,-11,-104,-66v-2,-80,154,-74,161,-7"
        },
        "t": {
            "d": "115,-3v-36,14,-87,7,-87,-42r0,-112r-24,0r0,-33r27,0r15,-45r31,0r0,45r36,0r0,33r-36,0r0,99v-1,23,16,31,38,25r0,30",
            "w": 119
        },
        "u": {
            "d": "85,4v-87,1,-58,-113,-63,-194r50,0v7,57,-23,150,33,157v60,-5,35,-97,40,-157r50,0r1,190r-47,0v-2,-12,1,-28,-3,-38v-12,25,-28,42,-61,42",
            "w": 219
        },
        "v": {
            "d": "128,0r-59,0r-68,-190r53,0r45,150r48,-150r52,0",
            "k": {
                ".": 27,
                ",": 27
            }
        },
        "w": {
            "d": "231,0r-52,0r-39,-155r-40,155r-52,0r-49,-190r46,0r32,145v9,-52,24,-97,36,-145r53,0r37,145r32,-145r46,0",
            "w": 280,
            "k": {
                ".": 13,
                ",": 13
            }
        },
        "x": {
            "d": "144,0r-44,-69r-45,69r-53,0r70,-98r-66,-92r53,0r41,62r40,-62r54,0r-67,91r71,99r-54,0"
        },
        "y": {
            "d": "123,10v-15,43,-43,76,-104,62r0,-35v35,8,53,-11,59,-39r-75,-188r52,0r48,148v12,-52,28,-100,44,-148r51,0",
            "k": {
                ".": 27,
                ",": 27
            }
        },
        "z": {
            "d": "12,0r0,-35r95,-120r-88,0r0,-35r142,0r0,35r-94,119r103,0r0,36r-158,0",
            "w": 180
        },
        "{": {
            "d": "133,41r0,34v-50,4,-88,-6,-87,-53v0,-46,9,-101,-40,-98r0,-34v48,2,40,-52,40,-98v-1,-47,37,-57,87,-53r0,34v-79,-14,-6,124,-77,134v73,11,-4,147,77,134",
            "w": 140
        },
        "|": {
            "d": "27,80r0,-341r46,0r0,341r-46,0",
            "w": 100
        },
        "}": {
            "d": "94,-36v2,56,4,113,-52,111r-34,0r0,-34v77,13,5,-124,76,-135v-39,-5,-38,-51,-36,-97v1,-27,-12,-38,-40,-36r0,-34v49,-4,87,6,86,53v-1,47,-8,101,41,98r0,34v-26,1,-42,13,-41,40",
            "w": 140
        },
        "~": {
            "d": "197,-105v-54,44,-136,-36,-183,10r0,-38v53,-45,135,36,183,-10r0,38",
            "w": 210
        },
        "\u00a1": {
            "d": "35,-143r0,-47r51,0r0,47r-51,0xm34,57r6,-172r40,0r6,172r-52,0",
            "w": 119
        },
        "\u00a2": {
            "d": "89,-182v-41,11,-41,110,0,120r0,-120xm141,-150v-2,-16,-10,-26,-24,-31r0,119v14,-5,23,-17,25,-35r50,3v-6,39,-34,61,-75,66r0,33r-28,0r0,-33v-52,-5,-79,-37,-80,-93v0,-57,29,-88,80,-94r0,-33r28,0r0,33v41,4,64,26,73,62"
        },
        "\u00a3": {
            "d": "49,-37v46,-1,105,11,107,-34r41,7v-8,36,-27,63,-69,64r-122,0r0,-36v23,-11,33,-34,31,-70r-33,0r0,-30r31,0v-19,-91,50,-145,124,-101v12,7,18,21,22,37r-41,8v-3,-16,-11,-26,-29,-26v-38,-2,-29,46,-30,82r50,0r0,30r-50,0v2,36,-9,57,-32,69"
        },
        "\u00a4": {
            "d": "34,-82v-13,-18,-13,-59,0,-77r-23,-23r27,-28r23,23v21,-12,57,-13,78,0r23,-23r28,28r-24,23v14,19,14,58,0,77r24,23r-28,28r-23,-23v-23,14,-58,13,-78,0r-23,24r-28,-28xm100,-157v-22,0,-37,14,-37,36v0,23,15,37,37,37v22,0,37,-14,37,-37v0,-22,-15,-36,-37,-36"
        },
        "\u00a5": {
            "d": "135,-121r48,0r0,25r-59,0r0,29r59,0r0,26r-59,0r0,41r-48,0r0,-41r-59,0r0,-26r59,0r0,-29r-59,0r0,-25r48,0r-64,-127r51,0r48,105r48,-105r51,0"
        },
        "\u00a6": {
            "d": "27,-119r0,-137r46,0r0,137r-46,0xm27,80r0,-137r46,0r0,137r-46,0",
            "w": 100
        },
        "\u00a7": {
            "d": "20,-196v-2,-73,154,-73,161,-7r-42,5v-1,-30,-76,-33,-76,-1v17,50,123,12,123,88v0,24,-15,39,-35,46v18,8,32,20,32,45v0,84,-165,77,-174,10r42,-7v1,35,89,40,90,2v-11,-55,-125,-13,-125,-90v0,-26,17,-38,37,-45v-16,-10,-33,-21,-33,-46xm59,-110v4,31,81,43,85,5v-1,-36,-84,-46,-85,-5"
        },
        "\u00a8": {
            "d": "79,-211r0,-38r38,0r0,38r-38,0xm3,-211r0,-38r37,0r0,38r-37,0",
            "w": 119
        },
        "\u00a9": {
            "d": "133,-251v76,0,127,50,127,127v0,77,-50,127,-127,127v-77,0,-127,-48,-127,-127v0,-78,49,-127,127,-127xm133,-17v65,0,107,-42,107,-107v0,-65,-42,-107,-107,-107v-65,0,-107,41,-107,107v0,65,42,107,107,107xm168,-150v-15,-40,-80,-24,-72,25v-10,51,61,67,73,25r29,8v-11,23,-29,42,-63,42v-47,-1,-71,-27,-71,-75v0,-80,109,-98,131,-32",
            "w": 265
        },
        "\u00aa": {
            "d": "85,-152v-12,32,-77,35,-77,-11v0,-37,38,-38,76,-37v8,-30,-33,-41,-38,-12r-34,-2v5,-24,23,-35,53,-35v55,0,52,44,52,95v2,6,8,4,16,4r0,19v-21,7,-48,2,-48,-21xm41,-165v0,10,6,15,17,15v18,-2,26,-15,26,-34v-18,3,-44,-3,-43,19",
            "w": 133
        },
        "\u00ab": {
            "d": "142,-25r-45,-63r0,-13r45,-64r42,0v-9,30,-32,46,-45,71r45,63r0,6r-42,0xm62,-25r-46,-63r0,-13r46,-64r41,0v-9,30,-32,46,-45,71r45,63r0,6r-41,0"
        },
        "\u00ac": {
            "d": "156,-25r0,-75r-141,0r0,-39r180,0r0,114r-39,0",
            "w": 210
        },
        "\u00ae": {
            "d": "133,-251v76,0,127,50,127,127v0,77,-50,127,-127,127v-77,0,-127,-48,-127,-127v0,-78,49,-127,127,-127xm133,-17v65,0,107,-42,107,-107v0,-65,-42,-107,-107,-107v-65,0,-107,41,-107,107v0,65,42,107,107,107xm137,-195v60,-10,70,72,23,84r38,59r-36,0r-31,-55r-21,0r0,55r-31,0r0,-143r58,0xm110,-130v25,1,49,2,49,-23v0,-22,-25,-21,-49,-20r0,43",
            "w": 265
        },
        "\u00af": {
            "d": "202,-255r-205,0r0,-17r205,0r0,17",
            "w": 198
        },
        "\u00b0": {
            "d": "72,-250v34,0,56,21,56,55v0,34,-22,55,-56,55v-34,0,-56,-21,-56,-55v0,-34,22,-55,56,-55xm72,-166v18,-1,29,-12,29,-29v0,-18,-12,-29,-29,-29v-17,0,-29,11,-29,29v0,17,12,29,29,29",
            "w": 143
        },
        "\u00b1": {
            "d": "118,-124r0,60r-39,0r0,-60r-70,0r0,-39r70,0r0,-60r39,0r0,60r71,0r0,39r-71,0xm9,0r0,-39r180,0r0,39r-180,0",
            "w": 197
        },
        "\u00b2": {
            "d": "110,-214v0,40,-46,42,-61,68r63,0r0,24r-103,0v-6,-58,56,-49,66,-90v0,-10,-3,-17,-14,-16v-10,0,-16,6,-17,17r-34,-1v1,-48,100,-55,100,-2",
            "w": 119
        },
        "\u00b3": {
            "d": "82,-188v16,4,30,11,30,31v0,47,-85,48,-100,14v-2,-4,-3,-9,-4,-14r33,-2v2,10,7,17,20,16v12,0,17,-5,18,-16v0,-18,-17,-17,-34,-17r0,-22v15,-1,31,0,31,-16v0,-9,-7,-14,-16,-14v-10,0,-16,6,-17,15r-33,-2v2,-45,99,-50,99,-3v0,18,-10,27,-27,30",
            "w": 119
        },
        "\u00b4": {
            "d": "15,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0",
            "w": 119
        },
        "\u00b5": {
            "d": "104,-34v27,0,31,-28,31,-55r0,-101r49,0r2,190r-47,0v-1,-6,-3,-17,-3,-25v-5,30,-49,38,-64,13v2,28,1,58,1,87r-49,0r0,-265r49,0r0,106v-1,29,5,50,31,50",
            "w": 207
        },
        "\u00b6": {
            "d": "12,-184v-3,-82,98,-62,176,-64r0,25r-23,0r0,269r-27,0r0,-269r-34,0r0,269r-28,0r0,-168v-40,-1,-63,-22,-64,-62"
        },
        "\u00b7": {
            "d": "25,-93r0,-54r50,0r0,54r-50,0",
            "w": 100
        },
        "\u2219": {
            "d": "25,-93r0,-54r50,0r0,54r-50,0",
            "w": 100
        },
        "\u00b8": {
            "d": "55,14v20,1,33,9,33,27v0,32,-36,36,-71,33r0,-21v15,1,39,4,39,-11v0,-13,-16,-12,-31,-12r11,-30r25,0",
            "w": 119
        },
        "\u00b9": {
            "d": "14,-122r0,-21r33,0r0,-83r-31,19r0,-21r32,-21r31,0r0,106r30,0r0,21r-95,0",
            "w": 119
        },
        "\u00ba": {
            "d": "67,-249v39,0,58,21,58,60v0,40,-21,62,-59,62v-38,0,-58,-24,-58,-62v0,-38,19,-60,59,-60xm66,-152v20,0,24,-15,24,-37v0,-20,-3,-35,-23,-35v-20,0,-24,14,-24,35v0,21,4,37,23,37",
            "w": 131
        },
        "\u00bb": {
            "d": "16,-25r0,-6r45,-63r-44,-65r0,-6r42,0r45,64r0,13r-45,63r-43,0xm97,-25r0,-6r45,-63r-45,-65r0,-6r42,0r45,64r0,13r-45,63r-42,0"
        },
        "\u00bc": {
            "d": "265,-25r0,25r-32,0r0,-25r-61,0r0,-26r56,-76r37,0r0,78r18,0r0,24r-18,0xm234,-102v-11,19,-24,36,-37,53r36,0v1,-17,-1,-37,1,-53xm96,0r-36,0r158,-248r35,0xm16,-122r0,-21r33,0r0,-83r-31,19r0,-21r32,-21r31,0r0,106r30,0r0,21r-95,0",
            "w": 300
        },
        "\u00bd": {
            "d": "92,0r-35,0r157,-248r35,0xm16,-122r0,-21r33,0r0,-83r-31,19r0,-21r32,-21r31,0r0,106r30,0r0,21r-95,0xm281,-92v0,40,-46,42,-61,68r63,0r0,24r-103,0v-6,-58,56,-49,66,-90v0,-10,-3,-17,-14,-16v-10,0,-16,6,-17,17r-34,-1v1,-48,100,-55,100,-2",
            "w": 300
        },
        "\u00be": {
            "d": "265,-25r0,25r-32,0r0,-25r-61,0r0,-26r56,-76r37,0r0,78r18,0r0,24r-18,0xm234,-102v-11,19,-24,36,-37,53r36,0v1,-17,-1,-37,1,-53xm96,0r-36,0r158,-248r35,0xm92,-188v16,4,30,11,30,31v0,47,-85,48,-100,14v-2,-4,-3,-9,-4,-14r33,-2v2,10,7,17,20,16v12,0,17,-5,18,-16v0,-18,-17,-17,-34,-17r0,-22v15,-1,31,0,31,-16v0,-9,-7,-14,-16,-14v-10,0,-16,6,-17,15r-33,-2v2,-45,99,-50,99,-3v0,18,-10,27,-27,30",
            "w": 300
        },
        "\u00bf": {
            "d": "109,61v-83,7,-118,-89,-53,-130v17,-10,36,-20,38,-46r47,0v-2,56,-65,53,-71,103v-2,21,17,33,39,33v26,0,39,-15,44,-37r50,2v-8,47,-39,70,-94,75xm142,-190r0,47r-51,0r0,-47r51,0",
            "w": 219
        },
        "\u00c0": {
            "d": "135,-269r-60,-42r0,-8r46,0r44,45r0,5r-30,0xm199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259
        },
        "\u00c1": {
            "d": "101,-269r0,-5r44,-45r45,0r0,8r-59,42r-30,0xm199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259
        },
        "\u00c2": {
            "d": "195,-274r0,5r-28,0v-13,-8,-24,-18,-37,-26v-19,11,-30,31,-65,26r0,-5r45,-49r41,0xm199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259
        },
        "\u00c3": {
            "d": "101,-320v28,0,65,44,74,0r23,0v0,29,-10,51,-39,51v-28,-1,-66,-45,-74,0r-24,0v2,-28,9,-52,40,-51xm199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259
        },
        "\u00c4": {
            "d": "153,-269r0,-38r34,0r0,38r-34,0xm73,-269r0,-38r34,0r0,38r-34,0xm199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259
        },
        "\u00c5": {
            "d": "130,-317v27,0,45,18,45,44v0,27,-19,45,-45,45v-27,0,-45,-18,-45,-45v0,-26,18,-44,45,-44xm130,-250v14,0,22,-10,22,-23v0,-13,-9,-22,-22,-22v-13,0,-22,9,-22,22v0,13,8,23,22,23xm199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0",
            "w": 259
        },
        "\u00c6": {
            "d": "164,0r0,-63r-79,0r-31,63r-53,0r123,-248r215,0r0,40r-123,0r0,63r112,0r0,38r-112,0r0,67r130,0r0,40r-182,0xm164,-210v-21,-3,-17,25,-28,37r-34,71r62,0r0,-108",
            "w": 360
        },
        "\u00c7": {
            "d": "67,-125v0,53,21,87,73,88v37,1,54,-22,65,-47r45,17v-17,42,-51,71,-110,71v-82,0,-120,-46,-125,-129v-7,-110,109,-156,196,-107v18,10,29,29,36,50r-46,12v-8,-25,-30,-41,-62,-41v-52,0,-71,34,-72,86xm141,14v20,1,33,9,33,27v0,32,-36,36,-71,33r0,-21v15,1,39,4,39,-11v0,-13,-16,-12,-31,-12r11,-30r25,0",
            "w": 259
        },
        "\u00c8": {
            "d": "129,-269r-59,-42r0,-8r45,0r44,45r0,5r-30,0xm24,0r0,-248r195,0r0,40r-143,0r0,63r132,0r0,40r-132,0r0,65r150,0r0,40r-202,0",
            "w": 240
        },
        "\u00c9": {
            "d": "91,-269r0,-5r44,-45r46,0r0,8r-60,42r-30,0xm24,0r0,-248r195,0r0,40r-143,0r0,63r132,0r0,40r-132,0r0,65r150,0r0,40r-202,0",
            "w": 240
        },
        "\u00ca": {
            "d": "190,-274r0,5r-28,0r-36,-26r-37,26r-29,0r0,-5r46,-49r40,0xm24,0r0,-248r195,0r0,40r-143,0r0,63r132,0r0,40r-132,0r0,65r150,0r0,40r-202,0",
            "w": 240
        },
        "\u00cb": {
            "d": "148,-269r0,-38r34,0r0,38r-34,0xm68,-269r0,-38r34,0r0,38r-34,0xm24,0r0,-248r195,0r0,40r-143,0r0,63r132,0r0,40r-132,0r0,65r150,0r0,40r-202,0",
            "w": 240
        },
        "\u00cc": {
            "d": "53,-269r-60,-42r0,-8r45,0r44,45r0,5r-29,0xm24,0r0,-248r52,0r0,248r-52,0",
            "w": 100
        },
        "\u00cd": {
            "d": "18,-269r0,-5r45,-45r45,0r0,8r-60,42r-30,0xm24,0r0,-248r52,0r0,248r-52,0",
            "w": 100
        },
        "\u00ce": {
            "d": "115,-274r0,5r-28,0v-13,-8,-24,-18,-37,-26v-19,11,-30,31,-65,26r0,-5r45,-49r41,0xm24,0r0,-248r52,0r0,248r-52,0",
            "w": 100
        },
        "\u00cf": {
            "d": "73,-269r0,-38r34,0r0,38r-34,0xm-7,-269r0,-38r34,0r0,38r-34,0xm24,0r0,-248r52,0r0,248r-52,0",
            "w": 100
        },
        "\u00d0": {
            "d": "24,-248v120,-7,223,5,221,122v-1,80,-44,126,-121,126r-100,0r0,-104r-23,0r0,-39r23,0r0,-105xm76,-41v74,8,117,-17,117,-85v0,-67,-46,-86,-117,-81r0,64r63,0r0,39r-63,0r0,63",
            "w": 259
        },
        "\u00d1": {
            "d": "198,-320v0,29,-9,51,-39,51v-28,-1,-66,-46,-74,0r-24,0v2,-28,10,-51,40,-51v28,0,66,44,74,0r23,0xm175,0r-108,-191v6,58,2,128,3,191r-46,0r0,-248r59,0r110,193v-6,-58,-2,-129,-3,-193r46,0r0,248r-61,0",
            "w": 259
        },
        "\u00d2": {
            "d": "156,-269r-60,-42r0,-8r46,0r44,45r0,5r-30,0xm140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "\u00d3": {
            "d": "110,-269r0,-5r44,-45r46,0r0,8r-60,42r-30,0xm140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "\u00d4": {
            "d": "204,-274r0,5r-28,0v-12,-8,-23,-19,-36,-26v-19,11,-30,31,-65,26r0,-5r45,-49r40,0xm140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "\u00d5": {
            "d": "109,-320v28,0,66,44,74,0r24,0v-2,27,-9,51,-39,51v-28,0,-66,-46,-74,0r-24,0v1,-28,9,-51,39,-51xm140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "\u00d6": {
            "d": "162,-269r0,-38r35,0r0,38r-35,0xm82,-269r0,-38r35,0r0,38r-35,0xm140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88",
            "w": 280
        },
        "\u00d7": {
            "d": "15,-57r63,-63r-62,-62r28,-28r61,62r62,-62r28,28r-62,62r62,62r-28,28r-62,-62r-62,62",
            "w": 210
        },
        "\u00d8": {
            "d": "15,-125v-6,-104,98,-150,187,-113r14,-21r34,0r-25,36v25,20,40,54,40,98v0,104,-99,155,-189,115r-16,23r-34,0r27,-38v-25,-22,-35,-55,-38,-100xm102,-47v77,43,144,-56,95,-135xm176,-202v-79,-41,-140,58,-94,135",
            "w": 280
        },
        "\u00d9": {
            "d": "133,-269r-60,-42r0,-8r45,0r45,45r0,5r-30,0xm238,-95v0,69,-44,99,-111,99v-64,0,-105,-29,-105,-97r0,-155r51,0r0,151v-1,38,19,59,55,60v90,1,49,-130,58,-211r52,0r0,153",
            "w": 259
        },
        "\u00da": {
            "d": "104,-269r0,-5r44,-45r46,0r0,8r-60,42r-30,0xm238,-95v0,69,-44,99,-111,99v-64,0,-105,-29,-105,-97r0,-155r51,0r0,151v-1,38,19,59,55,60v90,1,49,-130,58,-211r52,0r0,153",
            "w": 259
        },
        "\u00db": {
            "d": "194,-274r0,5r-28,0v-12,-8,-23,-19,-36,-26v-19,11,-30,31,-65,26r0,-5r45,-49r40,0xm238,-95v0,69,-44,99,-111,99v-64,0,-105,-29,-105,-97r0,-155r51,0r0,151v-1,38,19,59,55,60v90,1,49,-130,58,-211r52,0r0,153",
            "w": 259
        },
        "\u00dc": {
            "d": "152,-269r0,-38r35,0r0,38r-35,0xm73,-269r0,-38r34,0r0,38r-34,0xm238,-95v0,69,-44,99,-111,99v-64,0,-105,-29,-105,-97r0,-155r51,0r0,151v-1,38,19,59,55,60v90,1,49,-130,58,-211r52,0r0,153",
            "w": 259
        },
        "\u00dd": {
            "d": "92,-269r0,-5r44,-45r46,0r0,8r-60,42r-30,0xm146,-102r0,102r-52,0r0,-102r-88,-146r54,0r60,105r60,-105r54,0",
            "w": 240
        },
        "\u00de": {
            "d": "76,-207v79,-3,153,1,152,77v-1,75,-69,86,-152,80r0,50r-52,0r0,-248r52,0r0,41xm76,-86v48,1,100,6,100,-43v0,-47,-53,-42,-100,-41r0,84",
            "w": 240
        },
        "\u00df": {
            "d": "112,-261v71,-6,103,72,49,109v-30,40,49,42,49,97v0,58,-67,69,-114,51r0,-36v19,10,68,20,68,-12v-10,-39,-87,-53,-50,-107v9,-13,29,-19,29,-41v-1,-16,-13,-25,-31,-25v-27,1,-37,16,-37,47r0,178r-50,0r0,-177v0,-56,31,-80,87,-84",
            "w": 219
        },
        "\u00e0": {
            "d": "132,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm84,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27xm102,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0"
        },
        "\u00e1": {
            "d": "132,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm84,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27xm66,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0"
        },
        "\u00e2": {
            "d": "165,-213r0,5r-28,0v-13,-11,-23,-24,-37,-34r-37,34r-28,0v9,-26,32,-39,45,-61r41,0xm132,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm84,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27"
        },
        "\u00e3": {
            "d": "166,-259v-2,27,-9,52,-40,51v-23,-1,-35,-22,-56,-22v-13,0,-17,10,-17,22r-25,0v2,-28,10,-51,40,-51v28,0,66,44,74,0r24,0xm132,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm84,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27"
        },
        "\u00e4": {
            "d": "132,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm84,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27xm117,-211r0,-38r38,0r0,38r-38,0xm41,-211r0,-38r37,0r0,38r-37,0"
        },
        "\u00e5": {
            "d": "98,-296v28,0,45,18,45,44v0,26,-17,45,-45,45v-27,0,-44,-18,-44,-45v0,-27,17,-44,44,-44xm98,-274v-28,0,-28,45,0,45v14,0,23,-9,23,-23v0,-13,-10,-22,-23,-22xm132,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm84,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27"
        },
        "\u00e6": {
            "d": "183,-84v-10,50,58,74,73,32r46,4v-13,30,-37,53,-82,52v-38,0,-63,-15,-76,-41v-14,23,-36,41,-73,41v-37,-1,-59,-20,-59,-58v0,-60,57,-63,119,-61v1,-27,-3,-47,-29,-47v-18,1,-29,8,-30,27r-52,-2v3,-59,101,-73,142,-38v15,-13,35,-19,59,-19v63,0,84,46,84,110r-122,0xm63,-58v0,17,9,27,24,27v31,0,45,-24,44,-57v-33,1,-69,-4,-68,30xm257,-117v5,-46,-56,-63,-70,-21v-2,6,-3,13,-3,21r73,0",
            "w": 320
        },
        "\u00e7": {
            "d": "190,-63v-7,42,-38,67,-86,67v-59,0,-84,-38,-90,-98v-12,-110,154,-137,174,-36r-49,2v-2,-19,-15,-32,-35,-32v-30,0,-35,28,-38,64v-6,74,65,87,74,30xm106,14v20,1,33,9,33,27v0,32,-36,36,-71,33r0,-21v15,1,39,4,39,-11v0,-13,-16,-12,-31,-12r11,-30r25,0"
        },
        "\u00e8": {
            "d": "185,-48v-13,30,-37,53,-82,52v-60,-2,-89,-37,-89,-100v0,-63,30,-98,90,-98v62,0,83,45,84,108r-122,0v0,31,8,55,39,56v18,0,30,-7,34,-22xm140,-117v5,-46,-57,-63,-70,-21v-2,6,-4,13,-4,21r74,0xm110,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0"
        },
        "\u00e9": {
            "d": "185,-48v-13,30,-37,53,-82,52v-60,-2,-89,-37,-89,-100v0,-63,30,-98,90,-98v62,0,83,45,84,108r-122,0v0,31,8,55,39,56v18,0,30,-7,34,-22xm140,-117v5,-46,-57,-63,-70,-21v-2,6,-4,13,-4,21r74,0xm73,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0"
        },
        "\u00ea": {
            "d": "169,-213r0,5r-28,0v-13,-11,-23,-24,-37,-34r-37,34r-28,0r0,-5r46,-56r40,0xm185,-48v-13,30,-37,53,-82,52v-60,-2,-89,-37,-89,-100v0,-63,30,-98,90,-98v62,0,83,45,84,108r-122,0v0,31,8,55,39,56v18,0,30,-7,34,-22xm140,-117v5,-46,-57,-63,-70,-21v-2,6,-4,13,-4,21r74,0"
        },
        "\u00eb": {
            "d": "185,-48v-13,30,-37,53,-82,52v-60,-2,-89,-37,-89,-100v0,-63,30,-98,90,-98v62,0,83,45,84,108r-122,0v0,31,8,55,39,56v18,0,30,-7,34,-22xm140,-117v5,-46,-57,-63,-70,-21v-2,6,-4,13,-4,21r74,0xm122,-211r0,-38r38,0r0,38r-38,0xm46,-211r0,-38r37,0r0,38r-37,0"
        },
        "\u00ec": {
            "d": "25,0r0,-190r50,0r0,190r-50,0xm48,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0",
            "w": 100
        },
        "\u00ed": {
            "d": "25,0r0,-190r50,0r0,190r-50,0xm20,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0",
            "w": 100
        },
        "\u00ee": {
            "d": "115,-213r0,5r-28,0r-36,-34r-37,34r-29,0r0,-5r46,-56r40,0xm25,0r0,-190r50,0r0,190r-50,0",
            "w": 100
        },
        "\u00ef": {
            "d": "25,0r0,-190r50,0r0,190r-50,0xm69,-211r0,-38r38,0r0,38r-38,0xm-7,-211r0,-38r37,0r0,38r-37,0",
            "w": 100
        },
        "\u00f0": {
            "d": "97,-261r28,17r47,-20r0,33r-22,8v30,31,56,69,56,129v0,61,-33,97,-96,97v-59,-1,-94,-29,-96,-87v-2,-67,61,-101,125,-81v-8,-17,-15,-29,-27,-42r-51,22r0,-33r29,-12v-14,-11,-29,-22,-45,-31r52,0xm109,-30v32,0,45,-19,45,-54v0,-35,-11,-52,-43,-53v-31,0,-45,20,-45,53v0,32,12,54,43,54",
            "w": 219
        },
        "\u00f1": {
            "d": "84,-259v28,0,66,44,74,0r23,0v0,29,-9,51,-39,51v-28,-1,-66,-46,-74,0r-24,0v2,-28,9,-52,40,-51xm135,-194v87,-1,58,113,63,194r-50,0v-7,-57,23,-157,-34,-157v-59,0,-34,97,-39,157r-50,0r-1,-190r47,0v2,12,-1,28,3,38v12,-26,28,-41,61,-42",
            "w": 219
        },
        "\u00f2": {
            "d": "110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65xm117,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0",
            "w": 219
        },
        "\u00f3": {
            "d": "110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65xm81,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0",
            "w": 219
        },
        "\u00f4": {
            "d": "175,-213r0,5r-28,0v-13,-11,-23,-24,-37,-34r-37,34r-28,0v9,-26,32,-39,45,-61r41,0xm110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65",
            "w": 219
        },
        "\u00f5": {
            "d": "178,-259v-2,27,-9,51,-39,51v-28,0,-66,-46,-74,0r-24,0v2,-28,9,-51,40,-51v29,0,62,45,74,0r23,0xm110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65",
            "w": 219
        },
        "\u00f6": {
            "d": "110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65xm129,-211r0,-38r38,0r0,38r-38,0xm53,-211r0,-38r37,0r0,38r-37,0",
            "w": 219
        },
        "\u00f7": {
            "d": "78,-169r0,-41r42,0r0,41r-42,0xm9,-100r0,-39r180,0r0,39r-180,0xm78,-30r0,-41r42,0r0,41r-42,0",
            "w": 197
        },
        "\u00f8": {
            "d": "14,-95v-6,-85,88,-121,154,-84r18,-20r32,0r-32,36v14,17,18,39,20,68v6,86,-88,121,-154,83r-20,22r-32,0r35,-38v-14,-17,-19,-37,-21,-67xm140,-148v-43,-37,-91,19,-71,81xm80,-43v36,35,89,-9,73,-68v0,-5,-1,-9,-2,-13",
            "w": 219
        },
        "\u00f9": {
            "d": "85,4v-87,1,-58,-113,-63,-194r50,0v7,57,-23,150,33,157v60,-5,35,-97,40,-157r50,0r1,190r-47,0v-2,-12,1,-28,-3,-38v-12,25,-28,42,-61,42xm109,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0",
            "w": 219
        },
        "\u00fa": {
            "d": "85,4v-87,1,-58,-113,-63,-194r50,0v7,57,-23,150,33,157v60,-5,35,-97,40,-157r50,0r1,190r-47,0v-2,-12,1,-28,-3,-38v-12,25,-28,42,-61,42xm81,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0",
            "w": 219
        },
        "\u00fb": {
            "d": "174,-213r0,5r-28,0r-36,-34r-38,34r-28,0r0,-5r46,-56r40,0xm85,4v-87,1,-58,-113,-63,-194r50,0v7,57,-23,150,33,157v60,-5,35,-97,40,-157r50,0r1,190r-47,0v-2,-12,1,-28,-3,-38v-12,25,-28,42,-61,42",
            "w": 219
        },
        "\u00fc": {
            "d": "85,4v-87,1,-58,-113,-63,-194r50,0v7,57,-23,150,33,157v60,-5,35,-97,40,-157r50,0r1,190r-47,0v-2,-12,1,-28,-3,-38v-12,25,-28,42,-61,42xm129,-211r0,-38r38,0r0,38r-38,0xm53,-211r0,-38r37,0r0,38r-37,0",
            "w": 219
        },
        "\u00fd": {
            "d": "123,10v-15,43,-43,76,-104,62r0,-35v35,8,53,-11,59,-39r-75,-188r52,0r48,148v12,-52,28,-100,44,-148r51,0xm72,-208r0,-5r45,-51r45,0r0,8r-60,48r-30,0"
        },
        "\u00fe": {
            "d": "132,4v-31,1,-45,-17,-59,-34v3,33,2,69,2,105r-50,0r0,-336r50,0r0,111v11,-24,29,-35,60,-35v52,0,70,41,70,94v0,55,-20,93,-73,95xm114,-30v30,0,40,-26,40,-61v0,-35,-10,-60,-40,-60v-30,0,-41,26,-40,61v0,35,10,60,40,60",
            "w": 219
        },
        "\u00ff": {
            "d": "123,10v-15,43,-43,76,-104,62r0,-35v35,8,53,-11,59,-39r-75,-188r52,0r48,148v12,-52,28,-100,44,-148r51,0xm121,-211r0,-38r38,0r0,38r-38,0xm45,-211r0,-38r37,0r0,38r-37,0"
        },
        "\u2013": {
            "d": "11,-79r0,-35r178,0r0,35r-178,0"
        },
        "\u2014": {
            "d": "0,-79r0,-35r360,0r0,35r-360,0",
            "w": 360
        },
        "\u2018": {
            "d": "24,-146v-1,-41,2,-78,19,-102r33,0v-12,14,-23,31,-23,56r22,0r0,46r-51,0",
            "w": 100,
            "k": {
                "\u2018": 13
            }
        },
        "\u2019": {
            "d": "76,-248v1,41,0,81,-20,102r-32,0v12,-14,23,-31,23,-56r-22,0r0,-46r51,0",
            "w": 100,
            "k": {
                "\u2019": 13,
                "s": 13,
                " ": 20
            }
        },
        "\u201c": {
            "d": "102,-146v0,-40,-1,-80,19,-102r32,0v-11,15,-21,32,-23,56r23,0r0,46r-51,0xm27,-146v0,-40,-1,-80,19,-102r32,0v-10,15,-24,30,-23,56r22,0r0,46r-50,0",
            "w": 180
        },
        "\u201d": {
            "d": "153,-248v0,40,1,80,-19,102r-32,0v12,-14,22,-35,23,-56r-22,0r0,-46r50,0xm78,-248v1,41,0,80,-19,102r-32,0v11,-15,21,-32,23,-56r-23,0r0,-46r51,0",
            "w": 180
        },
        "\u2026": {
            "d": "269,0r0,-54r50,0r0,54r-50,0xm155,0r0,-54r50,0r0,54r-50,0xm40,0r0,-54r50,0r0,54r-50,0",
            "w": 360
        },
        "\u2032": {
            "d": "15,-156r11,-92r54,0r-28,92r-37,0",
            "w": 86
        },
        "\u2033": {
            "d": "15,-156r11,-92r54,0r-28,92r-37,0xm101,-156r11,-92r54,0r-28,92r-37,0",
            "w": 172
        },
        "\u2122": {
            "d": "186,-135r-29,0r0,-113r44,0r35,81r37,-81r43,0r0,113r-29,0r1,-90v-12,31,-26,60,-40,90r-23,0r-40,-90xm96,-223r0,88r-31,0r0,-88r-43,0r0,-25r118,0r0,25r-44,0",
            "w": 360
        }
    }
});
/*
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data ? 2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({
    "w": 200,
    "face": {
        "font-family": "Liberation Sans",
        "font-weight": 400,
        "font-style": "italic",
        "font-stretch": "normal",
        "units-per-em": "360",
        "panose-1": "2 11 6 4 2 2 2 9 2 4",
        "ascent": "288",
        "descent": "-72",
        "x-height": "4",
        "bbox": "-40 -316.101 368 80",
        "underline-thickness": "26.3672",
        "underline-position": "-51.3281",
        "slope": "-12",
        "unicode-range": "U+0020-U+2122"
    },
    "glyphs": {
        " ": {
            "w": 100,
            "k": {
                "Y": 7,
                "A": 13
            }
        },
        "\u00a0": {
            "w": 100
        },
        "!": {
            "d": "58,-70r-26,0r30,-178r35,0xm14,0r7,-35r34,0r-7,35r-34,0",
            "w": 100
        },
        "\"": {
            "d": "123,-170r-25,0r11,-78r32,0xm58,-170r-25,0r11,-78r32,0",
            "w": 127
        },
        "#": {
            "d": "163,-156r-14,65r46,0r0,19r-50,0r-15,72r-20,0r15,-72r-63,0r-15,72r-20,0r15,-72r-35,0r0,-19r39,0r14,-65r-44,0r0,-19r48,0r16,-71r19,0r-16,71r64,0r16,-71r19,0r-15,71r37,0r0,19r-41,0xm80,-156r-14,65r64,0r13,-65r-63,0"
        },
        "$": {
            "d": "121,-140v32,11,67,22,67,65v0,52,-40,70,-93,71r-6,29r-20,0r6,-29v-46,-3,-70,-23,-77,-62r29,-7v4,27,23,41,53,43r17,-87v-33,-9,-65,-20,-65,-62v0,-47,42,-62,89,-64r5,-23r20,0r-5,24v35,4,58,20,65,51r-28,8v-6,-19,-19,-31,-42,-34xm100,-30v50,8,78,-55,32,-75v-5,-2,-10,-4,-16,-6xm117,-218v-44,-7,-75,49,-31,67v5,2,10,4,16,6"
        },
        "%": {
            "d": "75,0r-29,0r208,-248r30,0xm26,-148v1,-56,18,-102,70,-102v31,0,46,20,45,54v-2,54,-18,104,-70,104v-32,0,-46,-22,-45,-56xm117,-199v0,-19,-6,-32,-21,-32v-40,0,-44,48,-46,86v-1,19,6,33,22,33v38,0,45,-51,45,-87xm189,-54v2,-54,18,-102,70,-102v32,0,46,22,46,55v0,53,-18,103,-70,103v-32,0,-47,-21,-46,-56xm280,-105v1,-20,-5,-32,-21,-32v-39,0,-43,50,-46,86v-2,19,6,33,22,33v39,0,42,-49,45,-87",
            "w": 320
        },
        "&": {
            "d": "76,-182v-8,-73,125,-95,125,-21v0,51,-54,56,-87,74v9,28,22,52,38,74v18,-21,33,-48,44,-75r23,10v-14,30,-29,60,-51,83v10,12,32,18,53,12r-3,23v-25,10,-55,0,-69,-17v-42,35,-147,33,-143,-43v3,-51,38,-63,75,-80v-2,-12,-3,-27,-5,-40xm36,-62v0,51,68,50,96,25v-18,-23,-33,-52,-44,-82v-24,12,-52,20,-52,57xm145,-228v-39,-2,-46,38,-38,76v28,-11,67,-14,67,-50v0,-17,-12,-25,-29,-26",
            "w": 240
        },
        "'": {
            "d": "60,-170r-24,0r11,-78r32,0",
            "w": 68
        },
        "(": {
            "d": "17,-49v1,-102,45,-165,103,-212r30,0v-58,51,-101,116,-101,215v0,50,14,89,36,121r-31,0v-24,-32,-36,-73,-37,-124",
            "w": 119
        },
        ")": {
            "d": "98,-137v-1,102,-44,166,-102,212r-31,0v58,-52,102,-116,102,-215v0,-50,-15,-89,-37,-121r31,0v24,32,36,73,37,124",
            "w": 119
        },
        "*": {
            "d": "95,-196r47,-18r8,23r-50,13r33,44r-21,13r-27,-46r-27,45r-21,-12r33,-44r-49,-13r8,-23r47,19r-2,-53r24,0",
            "w": 140
        },
        "+": {
            "d": "123,-107r0,75r-26,0r0,-75r-74,0r0,-26r74,0r0,-75r26,0r0,75r75,0r0,26r-75,0",
            "w": 210
        },
        ",": {
            "d": "58,-38v-5,33,-12,64,-30,84r-21,0v12,-14,20,-28,25,-46r-15,0r7,-38r34,0",
            "w": 100
        },
        "-": {
            "d": "18,-82r6,-28r88,0r-6,28r-88,0",
            "w": 119
        },
        "\u00ad": {
            "d": "18,-82r6,-28r88,0r-6,28r-88,0",
            "w": 119
        },
        ".": {
            "d": "14,0r8,-38r34,0r-8,38r-34,0",
            "w": 100
        },
        "\/": {
            "d": "-20,4r123,-265r28,0r-123,265r-28,0",
            "w": 100
        },
        "0": {
            "d": "16,-82v0,-90,25,-169,113,-169v48,0,68,33,68,82v0,90,-27,173,-113,173v-47,0,-68,-35,-68,-86xm46,-77v0,32,11,55,40,55v69,0,76,-79,80,-149v2,-32,-10,-55,-39,-55v-69,0,-81,81,-81,149"
        },
        "1": {
            "d": "9,0r6,-27r63,0r36,-188r-63,39r6,-31r66,-41r29,0r-42,221r60,0r-5,27r-156,0",
            "k": {
                "1": 27
            }
        },
        "2": {
            "d": "123,-251v66,0,92,69,53,113v-38,44,-103,63,-137,111r128,0r-5,27r-164,0v17,-92,123,-93,159,-163v14,-28,-1,-64,-36,-62v-29,2,-46,17,-54,41r-30,-6v13,-36,37,-61,86,-61"
        },
        "3": {
            "d": "148,-71v0,-36,-31,-44,-71,-41r5,-28v46,3,81,-6,81,-50v0,-23,-15,-35,-39,-35v-30,0,-49,17,-56,41r-32,-3v12,-39,42,-63,90,-64v43,0,69,19,71,60v1,43,-30,58,-65,66v27,5,49,22,49,53v0,85,-133,99,-164,35v-4,-7,-7,-15,-9,-22r29,-9v8,25,25,45,58,45v34,1,53,-17,53,-48"
        },
        "4": {
            "d": "149,-56r-11,56r-32,0r11,-56r-115,0r5,-25r144,-167r35,0r-32,167r33,0r-5,25r-33,0xm145,-203r-105,122r82,0"
        },
        "5": {
            "d": "151,-85v6,-55,-69,-56,-94,-29r-31,0r34,-134r141,0r-5,27r-112,0r-20,79v41,-34,127,-11,121,53v14,102,-155,127,-177,35r29,-8v15,62,122,49,114,-23"
        },
        "6": {
            "d": "184,-94v-4,58,-33,98,-90,98v-50,0,-74,-35,-74,-86v0,-94,36,-181,136,-167v24,3,39,21,44,47r-29,6v-8,-40,-68,-34,-87,-5v-13,20,-24,43,-30,73v28,-51,135,-39,130,34xm111,-136v-35,2,-61,22,-60,62v1,30,14,52,44,52v38,0,55,-31,56,-70v1,-26,-14,-46,-40,-44"
        },
        "7": {
            "d": "206,-222r-58,71v-33,43,-59,89,-72,151r-33,0v20,-96,77,-159,130,-221r-136,0r5,-27r169,0"
        },
        "8": {
            "d": "39,-185v1,-48,36,-66,85,-66v42,0,74,18,74,59v0,38,-25,57,-56,64v23,7,40,22,40,52v0,55,-39,80,-94,80v-48,0,-78,-21,-79,-67v-1,-44,31,-60,63,-71v-20,-7,-33,-25,-33,-51xm70,-182v0,26,17,39,46,39v34,0,48,-18,49,-48v0,-25,-18,-36,-45,-36v-32,0,-50,15,-50,45xm149,-77v0,-29,-19,-41,-50,-41v-37,0,-57,20,-57,55v0,29,19,42,49,42v36,0,58,-19,58,-56"
        },
        "9": {
            "d": "40,-53v7,41,73,38,88,5v14,-18,25,-43,30,-72v-13,20,-31,35,-60,35v-44,0,-69,-27,-69,-70v0,-57,32,-96,91,-96v58,0,76,44,72,106v-6,89,-67,182,-157,136v-12,-6,-19,-20,-23,-36xm102,-110v67,0,87,-116,17,-116v-39,0,-58,29,-58,71v1,27,12,45,41,45"
        },
        ":": {
            "d": "44,-154r7,-36r35,0r-8,36r-34,0xm14,0r7,-36r35,0r-7,36r-35,0",
            "w": 100
        },
        ";": {
            "d": "58,-36v-5,32,-11,63,-30,82r-21,0v12,-14,20,-28,25,-46r-15,0r7,-36r34,0xm47,-154r7,-36r34,0r-7,36r-34,0",
            "w": 100
        },
        "\u037e": {
            "d": "58,-36v-5,32,-11,63,-30,82r-21,0v12,-14,20,-28,25,-46r-15,0r7,-36r34,0xm47,-154r7,-36r34,0r-7,36r-34,0",
            "w": 100
        },
        "<": {
            "d": "23,-100r0,-36r175,-74r0,27r-151,65r151,64r0,27",
            "w": 210
        },
        "=": {
            "d": "23,-150r0,-26r175,0r0,26r-175,0xm23,-60r0,-26r175,0r0,26r-175,0",
            "w": 210
        },
        ">": {
            "d": "23,-27r0,-27r151,-64r-151,-65r0,-27r175,74r0,36",
            "w": 210
        },
        "?": {
            "d": "28,-184v13,-41,42,-62,95,-67v81,-7,97,95,38,128v-25,14,-56,24,-63,57r-31,0v6,-67,99,-52,99,-119v0,-27,-20,-37,-46,-38v-33,0,-55,19,-63,46xm53,0r6,-35r35,0r-7,35r-34,0"
        },
        "@": {
            "d": "204,-261v85,0,136,45,136,128v0,61,-22,110,-78,115v-28,2,-39,-18,-37,-44v-13,22,-31,44,-66,44v-40,0,-58,-27,-58,-68v0,-60,30,-105,88,-108v29,-1,43,15,54,32r7,-28r27,0r-27,134v-1,11,6,16,15,16v39,0,51,-48,51,-92v0,-69,-42,-107,-112,-107v-94,0,-145,59,-145,153v0,72,41,113,114,113v43,0,78,-13,106,-28r10,19v-30,18,-68,32,-116,32v-88,0,-139,-50,-139,-136v0,-107,62,-175,170,-175xm164,-41v46,0,70,-44,70,-90v0,-26,-17,-40,-43,-40v-44,0,-59,41,-61,85v-1,26,9,45,34,45",
            "w": 365
        },
        "A": {
            "d": "187,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm168,-99r-22,-123r-70,123r92,0",
            "w": 240,
            "k": {
                "\u2019": 13,
                "y": 3,
                "w": 7,
                "v": 7,
                "Y": 27,
                "W": 7,
                "V": 20,
                "T": 27,
                " ": 13
            }
        },
        "B": {
            "d": "219,-77v0,94,-115,75,-208,77r48,-248v73,2,169,-15,169,57v0,38,-24,54,-60,60v29,5,51,21,51,54xm193,-188v0,-44,-62,-31,-105,-33r-16,79v55,0,121,9,121,-46xm186,-78v-1,-49,-69,-36,-119,-38r-17,89v61,-1,137,12,136,-51",
            "w": 240
        },
        "C": {
            "d": "125,-24v46,0,70,-25,89,-51r25,16v-25,35,-56,63,-116,63v-115,0,-128,-150,-63,-212v32,-50,158,-61,191,-5v5,7,9,14,11,22r-32,10v-9,-28,-33,-43,-69,-43v-74,0,-108,51,-108,125v0,46,24,75,72,75",
            "w": 259
        },
        "D": {
            "d": "248,-139v-1,125,-104,148,-237,139r48,-248v105,-6,190,8,189,109xm214,-139v1,-70,-52,-87,-126,-82r-38,194v98,7,163,-21,164,-112",
            "w": 259
        },
        "E": {
            "d": "11,0r48,-248r184,0r-5,28r-151,0r-15,79r140,0r-5,27r-140,0r-17,87r158,0r-5,27r-192,0",
            "w": 240
        },
        "F": {
            "d": "87,-220r-18,92r140,0r-5,28r-140,0r-19,100r-34,0r48,-248r178,0r-5,28r-145,0",
            "w": 219,
            "k": {
                "A": 27,
                ".": 46,
                ",": 46,
                " ": 7
            }
        },
        "G": {
            "d": "52,-101v-6,87,114,94,164,50r9,-45r-74,0r6,-28r105,0r-18,87v-27,25,-63,41,-114,41v-70,0,-112,-35,-112,-105v0,-106,78,-167,188,-146v30,6,48,27,59,54r-34,9v-10,-26,-31,-41,-67,-40v-75,1,-107,50,-112,123",
            "w": 280
        },
        "H": {
            "d": "179,0r23,-115r-135,0r-22,115r-34,0r48,-248r34,0r-21,105r135,0r21,-105r32,0r-48,248r-33,0",
            "w": 259
        },
        "I": {
            "d": "14,0r48,-248r34,0r-48,248r-34,0",
            "w": 100
        },
        "J": {
            "d": "29,-66v0,49,71,55,82,11v13,-52,22,-111,33,-165r-51,0r5,-28r85,0r-34,174v2,85,-142,111,-150,14",
            "w": 180
        },
        "K": {
            "d": "180,0r-83,-118r-34,22r-18,96r-34,0r48,-248r34,0r-24,122v44,-43,94,-81,141,-122r43,0r-132,111r98,137r-39,0",
            "w": 240
        },
        "L": {
            "d": "11,0r48,-248r34,0r-43,221r125,0r-5,27r-159,0",
            "k": {
                "\u2019": 20,
                "y": 7,
                "Y": 33,
                "W": 13,
                "V": 20,
                "T": 27,
                " ": 7
            }
        },
        "M": {
            "d": "222,0r43,-216v-8,16,-17,34,-26,49r-96,167r-22,0r-40,-216r-40,216r-30,0r48,-248r42,0r38,208r116,-208r45,0r-48,248r-30,0",
            "w": 299
        },
        "N": {
            "d": "173,0r-93,-213r-39,213r-30,0r48,-248r37,0r94,214r40,-214r30,0r-48,248r-39,0",
            "w": 259
        },
        "O": {
            "d": "20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110",
            "w": 280
        },
        "P": {
            "d": "238,-179v0,84,-86,86,-175,82r-18,97r-34,0r48,-248v82,0,179,-12,179,69xm204,-178v0,-53,-64,-42,-116,-43r-19,98v63,0,135,9,135,-55",
            "w": 240,
            "k": {
                "A": 27,
                ".": 46,
                ",": 46,
                " ": 13
            }
        },
        "Q": {
            "d": "24,-61v-25,-104,35,-190,139,-190v67,1,105,36,105,101v0,88,-46,140,-124,152v2,33,24,47,60,39r-3,23v-50,15,-89,-11,-89,-61v-46,-3,-79,-26,-88,-64xm234,-134v6,-55,-18,-91,-72,-90v-77,1,-111,51,-111,125v0,49,24,75,73,75v72,0,103,-45,110,-110",
            "w": 280
        },
        "R": {
            "d": "249,-183v0,48,-29,72,-75,77r47,106r-36,0r-43,-103r-77,0r-20,103r-34,0r48,-248v83,2,190,-17,190,65xm215,-180v0,-55,-74,-39,-127,-41r-18,92v63,-1,145,13,145,-51",
            "w": 259,
            "k": {
                "Y": 13,
                "W": 7,
                "V": 7,
                "T": 7
            }
        },
        "S": {
            "d": "194,-120v59,52,2,134,-86,124v-53,-6,-90,-18,-98,-63r31,-7v8,30,29,43,70,43v46,0,84,-17,71,-62v-32,-43,-135,-20,-137,-98v-3,-89,178,-90,191,-16r-30,9v-8,-48,-127,-53,-127,5v0,53,81,35,115,65",
            "w": 240
        },
        "T": {
            "d": "151,-220r-43,220r-33,0r42,-220r-85,0r6,-28r203,0r-5,28r-85,0",
            "w": 219,
            "k": {
                "y": 27,
                "w": 27,
                "u": 27,
                "s": 33,
                "r": 27,
                "o": 33,
                "i": 3,
                "e": 33,
                "c": 33,
                "a": 33,
                "O": 7,
                "A": 27,
                ";": 27,
                ":": 27,
                ".": 33,
                "-": 33,
                ",": 33
            }
        },
        "U": {
            "d": "62,-99v-23,68,61,99,108,59v47,-40,38,-139,58,-208r34,0v-28,104,-9,252,-147,252v-66,0,-97,-47,-84,-116r26,-136r34,0",
            "w": 259
        },
        "V": {
            "d": "119,0r-35,0r-53,-248r34,0r41,218r126,-218r36,0",
            "w": 240,
            "k": {
                "y": 7,
                "u": 7,
                "r": 7,
                "o": 13,
                "i": 7,
                "e": 13,
                "a": 13,
                "A": 20,
                ";": 7,
                ":": 7,
                ".": 27,
                "-": 13,
                ",": 27
            }
        },
        "W": {
            "d": "247,0r-39,0r-15,-214r-24,57r-74,157r-39,0r-25,-248r35,0r16,218r101,-218r33,0r16,218r101,-218r35,0",
            "w": 339,
            "k": {
                "i": 3,
                "e": 7,
                "a": 7,
                "A": 7,
                ".": 13,
                "-": 7,
                ",": 13
            }
        },
        "X": {
            "d": "176,0r-54,-107r-92,107r-37,0r115,-131r-60,-117r35,0r48,97r83,-97r37,0r-105,119r65,129r-35,0",
            "w": 240
        },
        "Y": {
            "d": "138,-103r-20,103r-33,0r20,-103r-68,-145r35,0r54,119r98,-119r38,0",
            "w": 240,
            "k": {
                "v": 13,
                "u": 13,
                "q": 20,
                "p": 20,
                "o": 20,
                "i": 7,
                "e": 20,
                "a": 27,
                "A": 20,
                ";": 13,
                ":": 13,
                ".": 33,
                "-": 27,
                ",": 33,
                " ": 7
            }
        },
        "Z": {
            "d": "190,0r-197,0r5,-25r185,-195r-134,0r5,-28r176,0r-5,25r-185,196r155,0",
            "w": 219
        },
        "[": {
            "d": "-7,75r65,-336r72,0r-5,23r-41,0r-56,290r41,0r-4,23r-72,0",
            "w": 100
        },
        "\\": {
            "d": "56,4r-30,-265r26,0r31,265r-27,0",
            "w": 100
        },
        "]": {
            "d": "-30,75r5,-23r40,0r57,-290r-41,0r4,-23r72,0r-65,336r-72,0",
            "w": 100
        },
        "^": {
            "d": "144,-118r-55,-112r-53,112r-29,0r65,-130r35,0r65,130r-28,0",
            "w": 168
        },
        "_": {
            "d": "-28,44r0,-13r207,0r0,13r-207,0"
        },
        "`": {
            "d": "72,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0",
            "w": 119
        },
        "a": {
            "d": "165,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm42,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44"
        },
        "b": {
            "d": "68,-162v25,-46,127,-43,121,31v-6,71,-20,132,-91,135v-29,1,-45,-15,-55,-35r-7,31r-31,0r52,-261r31,0xm156,-126v2,-27,-9,-43,-34,-43v-55,0,-70,51,-70,103v0,29,15,45,43,46v52,0,58,-58,61,-106"
        },
        "c": {
            "d": "44,-68v0,29,11,47,38,47v30,0,42,-19,51,-41r28,9v-13,32,-35,57,-79,57v-51,0,-72,-33,-70,-89v3,-77,74,-140,146,-93v12,8,15,23,18,40r-31,5v-1,-22,-13,-36,-36,-36v-52,0,-65,49,-65,101",
            "w": 180
        },
        "d": {
            "d": "133,-28v-30,54,-138,36,-120,-49v13,-62,24,-115,90,-117v29,-1,46,15,56,35r19,-102r32,0r-50,261r-30,0xm45,-64v-2,27,10,43,35,43v54,-1,69,-50,69,-103v0,-29,-15,-46,-42,-46v-53,-1,-58,58,-62,106"
        },
        "e": {
            "d": "111,-194v62,-3,86,47,72,106r-138,0v-7,38,6,69,45,68v27,-1,43,-14,53,-32r24,11v-15,26,-38,45,-80,45v-49,-1,-75,-27,-75,-75v0,-70,32,-119,99,-123xm155,-113v14,-66,-71,-72,-95,-28v-4,8,-8,17,-11,28r106,0"
        },
        "f": {
            "d": "76,-167r-32,167r-32,0r33,-167r-27,0r4,-23r27,0v3,-47,25,-81,82,-69r-4,24v-35,-8,-44,15,-46,45r37,0r-5,23r-37,0",
            "w": 100,
            "k": {
                "\u2019": -13
            }
        },
        "g": {
            "d": "103,-194v29,0,47,14,56,36v2,-11,5,-23,8,-32r30,0r-37,185v-3,66,-78,102,-139,67v-12,-7,-17,-17,-20,-32r28,-7v7,42,83,31,92,-3v4,-16,9,-37,13,-55v-13,20,-29,36,-62,36v-40,0,-60,-25,-60,-64v0,-71,23,-131,91,-131xm107,-170v-53,0,-58,54,-61,104v-2,27,10,44,36,44v49,0,65,-50,67,-102v1,-29,-15,-46,-42,-46"
        },
        "h": {
            "d": "67,-158v15,-20,31,-36,64,-36v94,0,33,127,27,194r-32,0r25,-140v3,-38,-53,-32,-70,-12v-29,35,-30,101,-44,152r-31,0r51,-261r31,0"
        },
        "i": {
            "d": "50,-231r6,-30r32,0r-6,30r-32,0xm6,0r37,-190r31,0r-37,190r-31,0",
            "w": 79
        },
        "j": {
            "d": "51,-231r6,-30r31,0r-6,30r-31,0xm33,24v-5,36,-31,60,-73,48v3,-12,-1,-29,18,-22v17,-1,21,-13,24,-31r41,-209r32,0",
            "w": 79
        },
        "k": {
            "d": "127,0r-47,-88r-30,22r-13,66r-31,0r51,-261r31,0r-31,161r99,-90r39,0r-93,82r59,108r-34,0",
            "w": 180
        },
        "l": {
            "d": "6,0r50,-261r32,0r-51,261r-31,0",
            "w": 79
        },
        "m": {
            "d": "248,-111v6,-24,9,-61,-24,-58v-72,9,-57,108,-77,169r-31,0r26,-142v3,-37,-50,-30,-64,-10v-26,37,-28,101,-41,152r-31,0r36,-190r30,0v-1,10,-6,24,-4,32v13,-43,101,-52,105,5v13,-22,29,-41,61,-41v90,0,28,129,23,194r-31,0",
            "w": 299
        },
        "n": {
            "d": "67,-158v22,-48,132,-52,116,29r-25,129r-32,0r25,-140v3,-38,-53,-32,-70,-12v-29,35,-30,100,-43,152r-32,0r36,-190r30,0"
        },
        "o": {
            "d": "30,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm88,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53"
        },
        "p": {
            "d": "67,-162v32,-53,139,-36,121,50v-13,61,-25,114,-91,116v-29,0,-45,-15,-55,-35v-4,37,-14,70,-20,106r-31,0r50,-265r29,0v-1,10,0,20,-3,28xm156,-126v0,-26,-10,-43,-35,-43v-54,0,-67,50,-69,103v-1,29,14,45,42,46v53,0,62,-58,62,-106"
        },
        "q": {
            "d": "133,-28v-30,54,-138,36,-120,-49v13,-62,24,-115,90,-117v29,-1,46,15,56,35v2,-12,6,-24,8,-34r31,0r-54,268r-31,0xm45,-64v-2,27,10,43,35,43v54,-1,69,-50,69,-103v0,-29,-15,-46,-42,-46v-53,-1,-58,58,-62,106"
        },
        "r": {
            "d": "66,-151v12,-25,30,-51,66,-40r-6,26v-81,-11,-68,100,-88,165r-32,0r36,-190r30,0",
            "w": 119,
            "k": {
                "\u2019": -13,
                ".": 13,
                "-": 7,
                ",": 20
            }
        },
        "s": {
            "d": "55,-144v13,50,104,24,104,88v0,77,-144,79,-158,17r26,-10v6,40,102,42,102,-4v-13,-50,-104,-23,-104,-87v0,-71,143,-71,148,-8r-29,4v-5,-35,-85,-37,-89,0",
            "w": 180
        },
        "t": {
            "d": "51,-54v-9,22,5,41,31,30r-3,23v-36,15,-69,-3,-60,-51r22,-115r-22,0r5,-23r22,0r19,-43r21,0r-9,43r35,0r-4,23r-35,0",
            "w": 100
        },
        "u": {
            "d": "67,3v-93,-2,-31,-127,-26,-193r32,0r-25,140v-3,39,53,32,70,12v30,-34,30,-101,43,-152r32,0r-36,190r-30,0v1,-10,6,-24,4,-33v-14,20,-29,37,-64,36"
        },
        "v": {
            "d": "89,0r-37,0r-32,-190r33,0r21,165r89,-165r34,0",
            "w": 180,
            "k": {
                ".": 27,
                ",": 27
            }
        },
        "w": {
            "d": "188,0r-37,0r-8,-164r-72,164r-37,0r-16,-190r31,0r8,164r75,-164r34,0r8,164r74,-164r31,0",
            "w": 259,
            "k": {
                ".": 20,
                ",": 20
            }
        },
        "x": {
            "d": "124,0r-37,-78r-66,78r-35,0r86,-98r-46,-92r33,0r34,74r61,-74r37,0r-83,92r50,98r-34,0",
            "w": 180
        },
        "y": {
            "d": "198,-190r-129,220v-16,28,-44,53,-89,42v4,-11,-1,-27,19,-22v33,-1,43,-29,59,-52r-38,-188r32,0r27,156r84,-156r35,0",
            "w": 180,
            "k": {
                ".": 27,
                ",": 27
            }
        },
        "z": {
            "d": "-8,0r5,-24r140,-142r-106,0r5,-24r145,0r-5,24r-140,142r119,0r-5,24r-158,0",
            "w": 180
        },
        "{": {
            "d": "54,8v-6,25,-1,50,32,44r-5,23v-77,11,-58,-72,-46,-129v0,-20,-11,-27,-31,-28r4,-22v93,-3,3,-173,138,-157r-4,23v-85,-8,-22,124,-103,145v41,9,23,65,15,101",
            "w": 120
        },
        "|": {
            "d": "37,80r0,-341r30,0r0,341r-30,0",
            "w": 93
        },
        "}": {
            "d": "65,-194v6,-26,0,-49,-32,-44r4,-23v79,-12,59,72,46,129v1,20,12,27,32,28r-5,22v-92,5,-4,173,-138,157r4,-23v86,9,21,-124,103,-145v-41,-8,-21,-66,-14,-101",
            "w": 120
        },
        "~": {
            "d": "199,-111v-49,42,-130,-35,-178,9r0,-25v53,-44,130,35,178,-10r0,26",
            "w": 210
        },
        "\u00a1": {
            "d": "50,-121r26,0r-30,178r-35,0xm94,-190r-7,35r-34,0r7,-35r34,0",
            "w": 119
        },
        "\u00a2": {
            "d": "87,-50r28,-146v-50,7,-67,88,-46,135v3,7,10,9,18,11xm161,-161v-1,-18,-10,-29,-24,-34r-29,145v23,-4,33,-20,41,-39r28,8v-12,31,-33,56,-74,57r-5,29r-22,0r6,-30v-41,-5,-59,-39,-54,-87v6,-58,29,-106,92,-109r5,-27r22,0r-5,28v30,5,48,23,50,55"
        },
        "\u00a3": {
            "d": "36,-27v50,-4,120,15,126,-32r27,5v-10,73,-112,51,-191,54r5,-27v30,-13,41,-45,47,-83r-33,0r4,-23r33,0v9,-66,26,-135,112,-116v20,5,36,17,41,38r-29,9v-4,-25,-50,-30,-67,-13v-17,16,-18,55,-25,82r72,0r-5,23r-72,0v-4,38,-16,70,-45,83"
        },
        "\u00a4": {
            "d": "61,-182v20,-20,67,-19,89,-1r17,-17r18,19r-17,16v17,22,18,67,0,89r17,18r-18,18r-17,-18v-22,17,-67,18,-89,0r-18,18r-18,-18r18,-18v-18,-22,-18,-67,0,-89r-18,-17r18,-18xm105,-170v-29,0,-49,20,-49,49v0,30,20,50,49,50v29,0,50,-20,50,-50v0,-29,-21,-49,-50,-49"
        },
        "\u00a5": {
            "d": "131,-125r56,0r-4,22r-67,0r-5,27r67,0r-5,23r-67,0r-10,53r-31,0r10,-53r-67,0r4,-23r67,0r6,-27r-67,0r4,-22r56,0r-50,-123r34,0r43,114r88,-114r36,0"
        },
        "\u00a6": {
            "d": "37,-124r0,-137r30,0r0,137r-30,0xm37,80r0,-137r30,0r0,137r-30,0",
            "w": 93
        },
        "\u00a7": {
            "d": "73,-209v16,48,106,26,105,91v-1,32,-23,43,-49,50v13,8,23,19,24,39v4,77,-144,77,-159,17r26,-10v8,45,123,36,98,-16v-26,-33,-100,-20,-100,-80v0,-31,21,-44,48,-50v-13,-8,-23,-20,-23,-40v-2,-71,143,-70,148,-8r-29,4v-5,-36,-88,-36,-89,3xm147,-116v-4,-44,-95,-57,-98,-5v3,45,93,54,98,5"
        },
        "\u00a8": {
            "d": "92,-214r6,-33r30,0r-6,33r-30,0xm24,-214r6,-33r31,0r-6,33r-31,0",
            "w": 119
        },
        "\u00a9": {
            "d": "138,-251v77,0,127,50,127,127v0,79,-50,127,-127,127v-77,0,-127,-49,-127,-127v0,-77,48,-127,127,-127xm138,-14v67,0,111,-44,111,-110v0,-66,-45,-111,-111,-111v-65,0,-110,44,-110,111v0,67,43,110,110,110xm93,-125v-6,59,71,76,88,30r20,6v-11,22,-26,41,-61,40v-47,-1,-65,-30,-70,-76v-8,-77,102,-101,129,-37r-20,5v-8,-13,-19,-24,-40,-24v-33,0,-42,24,-46,56",
            "w": 265
        },
        "\u00aa": {
            "d": "128,-154v-4,13,1,23,15,18v-2,11,-1,21,-16,21v-18,0,-26,-12,-24,-27v-13,32,-87,42,-87,-9v0,-47,50,-44,95,-45v5,-18,5,-38,-19,-38v-19,0,-29,9,-32,24r-24,-3v3,-48,109,-56,103,3xm43,-152v3,33,51,14,58,-5v5,-6,5,-15,7,-23v-29,2,-67,-4,-65,28",
            "w": 133
        },
        "\u00ab": {
            "d": "144,-25r-47,-64r2,-11r72,-65r28,0r-1,6r-72,66r47,64v-2,9,-20,2,-29,4xm60,-25r-47,-64r2,-11r72,-65r28,0r-1,6r-72,66r47,64v-2,9,-20,2,-29,4"
        },
        "\u00ac": {
            "d": "167,-32r0,-75r-149,0r0,-26r174,0r0,101r-25,0",
            "w": 210
        },
        "\u00ae": {
            "d": "138,-251v77,0,127,50,127,127v0,79,-50,127,-127,127v-77,0,-127,-49,-127,-127v0,-77,48,-127,127,-127xm138,-14v67,0,111,-44,111,-110v0,-66,-45,-111,-111,-111v-65,0,-110,44,-110,111v0,67,43,110,110,110xm142,-197v59,-9,67,78,18,85r39,61r-26,0r-34,-59r-29,0r0,59r-22,0r0,-146r54,0xm110,-127v31,1,61,4,61,-28v0,-28,-32,-26,-61,-25r0,53",
            "w": 265
        },
        "\u00af": {
            "d": "202,-264r-205,0r0,-21r205,0r0,21",
            "w": 198
        },
        "\u00b0": {
            "d": "85,-251v32,0,50,20,50,50v0,30,-20,50,-50,50v-30,0,-51,-20,-51,-50v0,-30,19,-50,51,-50xm85,-170v19,0,31,-12,31,-31v1,-20,-13,-32,-31,-32v-18,0,-32,12,-31,32v0,19,12,31,31,31",
            "w": 143
        },
        "\u00b1": {
            "d": "112,-120r0,70r-26,0r0,-70r-75,0r0,-25r75,0r0,-69r26,0r0,69r74,0r0,25r-74,0xm11,0r0,-25r175,0r0,25r-175,0",
            "w": 197
        },
        "\u00b2": {
            "d": "29,-209v2,-48,101,-59,101,-3v0,58,-70,56,-94,93r78,0r-3,20r-106,0v6,-65,89,-53,102,-111v-4,-33,-54,-24,-56,4",
            "w": 119
        },
        "\u00b3": {
            "d": "94,-144v0,-20,-19,-22,-39,-21r3,-19v25,1,46,-5,46,-28v0,-31,-51,-20,-54,5r-22,-5v4,-45,98,-55,100,-2v0,21,-12,34,-38,39v15,4,27,13,28,31v4,55,-88,62,-105,20v-2,-5,-3,-9,-4,-14r23,-3v2,16,12,26,31,26v18,0,31,-9,31,-29",
            "w": 119
        },
        "\u00b4": {
            "d": "31,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0",
            "w": 119
        },
        "\u00b5": {
            "d": "133,-30v-14,27,-61,48,-85,20r-17,85r-31,0r51,-265r32,0r-25,138v-5,39,46,36,62,14v26,-37,27,-101,40,-152r32,0r-29,156v-1,12,10,15,20,11r-4,23v-25,9,-49,1,-46,-30",
            "w": 207
        },
        "\u00b6": {
            "d": "25,-184v-3,-79,89,-63,164,-64r0,18r-22,0r0,276r-20,0r0,-276r-38,0r0,276r-20,0r0,-168v-40,-1,-63,-22,-64,-62",
            "w": 193
        },
        "\u00b7": {
            "d": "29,-78r8,-39r34,0r-8,39r-34,0",
            "w": 100
        },
        "\u2219": {
            "d": "29,-78r8,-39r34,0r-8,39r-34,0",
            "w": 100
        },
        "\u00b8": {
            "d": "61,43v0,-13,-18,-15,-31,-12r17,-31r19,0r-10,17v16,1,28,8,28,24v0,34,-40,36,-72,32r4,-16v19,4,44,4,45,-14",
            "w": 119
        },
        "\u00b9": {
            "d": "11,-99r3,-19r37,0r21,-107r-40,24r4,-23v20,-9,31,-27,64,-24r-26,130r38,0r-4,19r-97,0",
            "w": 119
        },
        "\u00ba": {
            "d": "144,-199v-1,52,-23,85,-73,85v-38,0,-57,-23,-53,-64v4,-43,26,-74,73,-74v34,0,53,18,53,53xm119,-203v1,-21,-10,-30,-29,-30v-36,0,-44,32,-46,68v0,21,8,32,28,32v37,-1,45,-34,47,-70",
            "w": 131
        },
        "\u00bb": {
            "d": "112,-25r-27,0r1,-7r72,-64v-15,-24,-34,-43,-46,-69r28,0r47,65r-3,11xm29,-25r-28,0r1,-7r72,-64v-15,-24,-34,-43,-46,-69r28,0r46,65r-2,11"
        },
        "\u00bc": {
            "d": "253,-31r-7,31r-23,0r7,-31r-72,0r4,-20r85,-98r28,0r-19,98r22,0r-3,20r-22,0xm248,-126v-20,27,-41,49,-62,75r47,0xm75,0r-27,0r202,-248r27,0xm17,-99r3,-19r37,0r21,-107r-40,24r4,-23v20,-9,31,-27,64,-24r-26,130r38,0r-4,19r-97,0",
            "w": 300
        },
        "\u00bd": {
            "d": "66,0r-27,0r203,-248r27,0xm9,-99r3,-19r37,0r21,-107r-40,24r4,-23v20,-9,31,-27,64,-24r-26,130r38,0r-4,19r-97,0xm188,-110v2,-48,101,-59,101,-3v0,58,-70,56,-94,93r78,0r-3,20r-106,0v6,-65,89,-53,102,-111v-4,-33,-54,-24,-56,4",
            "w": 300
        },
        "\u00be": {
            "d": "253,-31r-7,31r-23,0r7,-31r-72,0r4,-20r85,-98r28,0r-19,98r22,0r-3,20r-22,0xm248,-126v-20,27,-41,49,-62,75r47,0xm75,0r-27,0r202,-248r27,0xm109,-144v0,-20,-19,-22,-39,-21r3,-19v25,1,46,-5,46,-28v0,-31,-51,-20,-54,5r-22,-5v4,-45,98,-55,100,-2v0,21,-12,34,-38,39v15,4,27,13,28,31v4,55,-88,62,-105,20v-2,-5,-3,-9,-4,-14r23,-3v2,16,12,26,31,26v18,0,31,-9,31,-29",
            "w": 300
        },
        "\u00bf": {
            "d": "183,-6v-14,40,-41,68,-96,67v-44,-1,-76,-21,-76,-63v0,-75,84,-66,102,-122r31,0v-7,66,-93,53,-100,119v2,25,20,37,46,38v34,0,57,-19,64,-46xm158,-190r-7,35r-34,0r7,-35r34,0",
            "w": 219
        },
        "\u00c0": {
            "d": "166,-269r-52,-38r1,-5r37,0v8,15,26,27,29,43r-15,0xm190,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm171,-99r-22,-123r-70,123r92,0",
            "w": 240
        },
        "\u00c1": {
            "d": "131,-269v11,-19,32,-27,46,-43r36,0r0,5r-62,38r-20,0xm190,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm171,-99r-22,-123r-70,123r92,0",
            "w": 240
        },
        "\u00c2": {
            "d": "179,-315v10,16,24,28,31,46v-28,3,-34,-16,-51,-24v-22,8,-33,26,-65,24v12,-20,34,-29,49,-46r36,0xm190,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm171,-99r-22,-123r-70,123r92,0",
            "w": 240
        },
        "\u00c3": {
            "d": "226,-316v-7,22,-15,47,-44,47v-28,0,-57,-46,-72,0r-18,0v9,-21,14,-49,44,-47v28,2,58,46,72,0r18,0xm190,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm171,-99r-22,-123r-70,123r92,0",
            "w": 240
        },
        "\u00c4": {
            "d": "174,-269r6,-32r31,0r-7,32r-30,0xm107,-269r6,-32r30,0r-6,32r-30,0xm190,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm171,-99r-22,-123r-70,123r92,0",
            "w": 240
        },
        "\u00c5": {
            "d": "151,-314v26,0,42,16,42,42v0,27,-18,40,-42,43v-25,-2,-41,-18,-43,-43v3,-24,16,-42,43,-42xm151,-248v13,0,23,-8,23,-24v0,-15,-8,-23,-23,-23v-15,-1,-24,9,-24,23v0,15,10,24,24,24xm187,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm168,-99r-22,-123r-70,123r92,0",
            "w": 240
        },
        "\u00c6": {
            "d": "152,0r14,-72r-96,0r-49,72r-35,0r168,-248r209,0r-5,28r-130,0r-15,79r119,0r-5,27r-120,0r-16,87r137,0r-6,27r-170,0xm195,-222v-36,-7,-40,22,-53,42r-54,81r83,0",
            "w": 360
        },
        "\u00c7": {
            "d": "125,-24v46,0,70,-25,89,-51r25,16v-25,35,-56,63,-116,63v-115,0,-128,-150,-63,-212v32,-50,158,-61,191,-5v5,7,9,14,11,22r-32,10v-9,-28,-33,-43,-69,-43v-74,0,-108,51,-108,125v0,46,24,75,72,75xm130,43v0,-13,-18,-15,-31,-12r17,-31r19,0r-10,17v16,1,28,8,28,24v0,34,-40,36,-72,32r4,-16v19,4,44,4,45,-14",
            "w": 259
        },
        "\u00c8": {
            "d": "165,-269r-52,-38r1,-5r36,0v9,15,26,27,30,43r-15,0xm11,0r48,-248r184,0r-5,28r-151,0r-15,79r140,0r-5,27r-140,0r-17,87r158,0r-5,27r-192,0",
            "w": 240
        },
        "\u00c9": {
            "d": "128,-269v11,-19,32,-27,46,-43r37,0r-1,5r-62,38r-20,0xm11,0r48,-248r184,0r-5,28r-151,0r-15,79r140,0r-5,27r-140,0r-17,87r158,0r-5,27r-192,0",
            "w": 240
        },
        "\u00ca": {
            "d": "181,-315v9,16,26,29,30,46v-28,3,-33,-17,-51,-24v-21,8,-33,27,-65,24v14,-18,34,-30,50,-46r36,0xm11,0r48,-248r184,0r-5,28r-151,0r-15,79r140,0r-5,27r-140,0r-17,87r158,0r-5,27r-192,0",
            "w": 240
        },
        "\u00cb": {
            "d": "172,-269r6,-32r30,0r-6,32r-30,0xm104,-269r6,-32r31,0r-6,32r-31,0xm11,0r48,-248r184,0r-5,28r-151,0r-15,79r140,0r-5,27r-140,0r-17,87r158,0r-5,27r-192,0",
            "w": 240
        },
        "\u00cc": {
            "d": "89,-269r-52,-38r1,-5r36,0v9,15,26,27,30,43r-15,0xm14,0r48,-248r34,0r-48,248r-34,0",
            "w": 100
        },
        "\u00cd": {
            "d": "64,-269v13,-17,32,-28,47,-43r36,0r-1,5r-62,38r-20,0xm14,0r48,-248r34,0r-48,248r-34,0",
            "w": 100
        },
        "\u00ce": {
            "d": "108,-315v9,16,27,29,31,46v-28,3,-34,-16,-51,-24v-21,8,-33,27,-65,24v12,-20,35,-29,50,-46r35,0xm14,0r48,-248r34,0r-48,248r-34,0",
            "w": 100
        },
        "\u00cf": {
            "d": "100,-269r7,-32r30,0r-6,32r-31,0xm33,-269r6,-32r31,0r-6,32r-31,0xm14,0r48,-248r34,0r-48,248r-34,0",
            "w": 100
        },
        "\u00d0": {
            "d": "252,-139v0,127,-106,148,-241,139r22,-114r-27,0r5,-27r27,0r21,-107v106,-7,193,8,193,109xm218,-139v0,-71,-54,-88,-130,-82r-16,80r71,0r-5,27r-71,0r-17,87v99,7,168,-20,168,-112",
            "w": 259
        },
        "\u00d1": {
            "d": "235,-316v-9,21,-14,47,-44,47v-23,0,-31,-20,-50,-23v-14,1,-18,12,-23,23r-18,0v9,-21,15,-46,44,-47v23,0,31,20,50,23v14,-1,18,-12,23,-23r18,0xm173,0r-93,-213r-39,213r-30,0r48,-248r37,0r94,214r40,-214r30,0r-48,248r-39,0",
            "w": 259
        },
        "\u00d2": {
            "d": "171,-269r-52,-38r1,-5r36,0v9,15,26,27,30,43r-15,0xm20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110",
            "w": 280
        },
        "\u00d3": {
            "d": "144,-269v11,-19,32,-27,46,-43r36,0r0,5r-62,38r-20,0xm20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110",
            "w": 280
        },
        "\u00d4": {
            "d": "191,-315v10,16,24,28,31,46v-28,3,-34,-16,-51,-24v-22,8,-34,26,-66,24v14,-18,34,-30,50,-46r36,0xm20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110",
            "w": 280
        },
        "\u00d5": {
            "d": "244,-316v-9,21,-14,47,-44,47v-23,0,-31,-20,-50,-23v-14,1,-18,12,-23,23r-18,0v8,-21,15,-47,44,-47v23,0,31,20,50,23v14,-1,18,-12,23,-23r18,0xm20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110",
            "w": 280
        },
        "\u00d6": {
            "d": "184,-269r6,-32r31,0r-6,32r-31,0xm117,-269r6,-32r31,0r-7,32r-30,0xm20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110",
            "w": 280
        },
        "\u00d7": {
            "d": "30,-58r62,-62r-61,-62r18,-18r61,62r62,-62r18,19r-61,61r62,62r-18,18r-62,-62r-63,62",
            "w": 210
        },
        "\u00d8": {
            "d": "163,-251v31,-1,54,8,71,22r29,-29r34,0r-47,46v11,16,18,36,18,62v-3,95,-53,150,-145,154v-30,1,-54,-8,-71,-22r-29,27r-33,0r46,-44v-12,-17,-19,-38,-18,-66v4,-92,52,-147,145,-150xm162,-224v-89,-3,-125,84,-103,166r153,-150v-13,-11,-29,-16,-50,-16xm124,-24v89,0,126,-83,103,-165r-153,149v12,10,28,16,50,16",
            "w": 280
        },
        "\u00d9": {
            "d": "173,-269r-52,-38r1,-5r36,0v9,15,26,27,30,43r-15,0xm62,-99v-23,68,61,99,108,59v47,-40,38,-139,58,-208r34,0v-28,104,-9,252,-147,252v-66,0,-97,-47,-84,-116r26,-136r34,0",
            "w": 259
        },
        "\u00da": {
            "d": "136,-269v13,-17,32,-28,47,-43r36,0r-1,5r-62,38r-20,0xm62,-99v-23,68,61,99,108,59v47,-40,38,-139,58,-208r34,0v-28,104,-9,252,-147,252v-66,0,-97,-47,-84,-116r26,-136r34,0",
            "w": 259
        },
        "\u00db": {
            "d": "188,-315v9,16,27,29,31,46v-28,3,-34,-16,-51,-24v-21,8,-33,27,-65,24v12,-20,35,-29,50,-46r35,0xm62,-99v-23,68,61,99,108,59v47,-40,38,-139,58,-208r34,0v-28,104,-9,252,-147,252v-66,0,-97,-47,-84,-116r26,-136r34,0",
            "w": 259
        },
        "\u00dc": {
            "d": "179,-269r6,-32r31,0r-7,32r-30,0xm111,-269r7,-32r30,0r-6,32r-31,0xm62,-99v-23,68,61,99,108,59v47,-40,38,-139,58,-208r34,0v-28,104,-9,252,-147,252v-66,0,-97,-47,-84,-116r26,-136r34,0",
            "w": 259
        },
        "\u00dd": {
            "d": "123,-269v13,-17,32,-28,47,-43r36,0r-1,5r-62,38r-20,0xm138,-103r-20,103r-33,0r20,-103r-68,-145r35,0r54,119r98,-119r38,0",
            "w": 240
        },
        "\u00de": {
            "d": "224,-135v0,85,-86,86,-175,83r-10,52r-34,0r48,-248r34,0r-9,45v74,-3,146,-2,146,68xm190,-133v0,-54,-64,-42,-116,-43r-19,97v63,0,135,10,135,-54",
            "w": 240
        },
        "\u00df": {
            "d": "171,-208v2,-35,-59,-34,-77,-15v-11,11,-19,25,-22,44r-34,179r-32,0r35,-181v11,-52,35,-76,93,-80v63,-5,90,65,41,96v-11,7,-25,13,-27,28v7,35,49,39,49,83v0,62,-74,69,-124,49r10,-25v25,14,85,18,83,-24v-2,-40,-47,-38,-48,-79v-1,-44,51,-36,53,-75",
            "w": 219
        },
        "\u00e0": {
            "d": "166,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm43,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44xm132,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0"
        },
        "\u00e1": {
            "d": "166,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm43,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44xm95,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0"
        },
        "\u00e2": {
            "d": "147,-262v8,17,26,32,29,51v-29,2,-32,-20,-49,-30v-22,10,-32,33,-67,30v13,-21,35,-33,51,-51r36,0xm166,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm43,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44"
        },
        "\u00e3": {
            "d": "192,-258v-7,23,-16,46,-44,47v-22,0,-29,-19,-49,-21v-15,-1,-22,9,-25,21r-16,0v8,-21,14,-48,44,-47v21,1,31,17,49,21v14,0,22,-9,25,-21r16,0xm166,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm43,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44"
        },
        "\u00e4": {
            "d": "166,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm43,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44xm139,-214r6,-33r30,0r-6,33r-30,0xm71,-214r6,-33r31,0r-6,33r-31,0"
        },
        "\u00e5": {
            "d": "129,-290v26,0,42,16,42,42v0,27,-18,40,-42,43v-25,-2,-41,-18,-43,-43v3,-24,16,-42,43,-42xm129,-224v14,0,24,-9,23,-24v0,-15,-8,-23,-23,-23v-15,-1,-24,9,-24,23v0,14,10,24,24,24xm166,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm43,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44"
        },
        "\u00e6": {
            "d": "34,-144v7,-55,114,-67,140,-22v46,-59,164,-17,129,78r-129,0v-7,36,5,69,41,68v25,-1,39,-15,48,-32r24,11v-14,26,-35,45,-76,45v-36,-1,-58,-19,-66,-48v-18,27,-42,48,-84,48v-33,0,-55,-19,-55,-53v0,-69,73,-66,141,-67v10,-27,0,-56,-33,-54v-27,1,-42,10,-49,31xm39,-50v-1,42,62,30,80,10v13,-14,21,-31,24,-54v-46,3,-104,-5,-104,44xm275,-113v15,-63,-65,-75,-87,-28v-4,7,-8,17,-10,28r97,0",
            "w": 320
        },
        "\u00e7": {
            "d": "44,-68v0,29,11,47,38,47v30,0,42,-19,51,-41r28,9v-13,32,-35,57,-79,57v-51,0,-72,-33,-70,-89v3,-77,74,-140,146,-93v12,8,15,23,18,40r-31,5v-1,-22,-13,-36,-36,-36v-52,0,-65,49,-65,101xm85,43v0,-13,-18,-15,-31,-12r17,-31r19,0r-10,17v16,1,28,8,28,24v0,34,-40,36,-72,32r4,-16v19,4,44,4,45,-14",
            "w": 180
        },
        "\u00e8": {
            "d": "111,-194v62,-3,86,47,72,106r-138,0v-7,38,6,69,45,68v27,-1,43,-14,53,-32r24,11v-15,26,-38,45,-80,45v-49,-1,-75,-27,-75,-75v0,-70,32,-119,99,-123xm155,-113v14,-66,-71,-72,-95,-28v-4,8,-8,17,-11,28r106,0xm124,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0"
        },
        "\u00e9": {
            "d": "111,-194v62,-3,86,47,72,106r-138,0v-7,38,6,69,45,68v27,-1,43,-14,53,-32r24,11v-15,26,-38,45,-80,45v-49,-1,-75,-27,-75,-75v0,-70,32,-119,99,-123xm155,-113v14,-66,-71,-72,-95,-28v-4,8,-8,17,-11,28r106,0xm94,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0"
        },
        "\u00ea": {
            "d": "146,-262v8,17,26,32,29,51v-29,2,-32,-20,-49,-30v-22,10,-32,32,-67,30v13,-21,35,-33,51,-51r36,0xm111,-194v62,-3,86,47,72,106r-138,0v-7,38,6,69,45,68v27,-1,43,-14,53,-32r24,11v-15,26,-38,45,-80,45v-49,-1,-75,-27,-75,-75v0,-70,32,-119,99,-123xm155,-113v14,-66,-71,-72,-95,-28v-4,8,-8,17,-11,28r106,0"
        },
        "\u00eb": {
            "d": "111,-194v62,-3,86,47,72,106r-138,0v-7,38,6,69,45,68v27,-1,43,-14,53,-32r24,11v-15,26,-38,45,-80,45v-49,-1,-75,-27,-75,-75v0,-70,32,-119,99,-123xm155,-113v14,-66,-71,-72,-95,-28v-4,8,-8,17,-11,28r106,0xm134,-214r6,-33r30,0r-6,33r-30,0xm66,-214r6,-33r31,0r-6,33r-31,0"
        },
        "\u00ec": {
            "d": "16,0r37,-190r31,0r-37,190r-31,0xm71,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0",
            "w": 100
        },
        "\u00ed": {
            "d": "16,0r37,-190r31,0r-37,190r-31,0xm46,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0",
            "w": 100
        },
        "\u00ee": {
            "d": "97,-262v8,17,26,32,29,51v-29,3,-31,-21,-49,-30v-22,10,-32,33,-67,30v13,-21,35,-33,51,-51r36,0xm16,0r37,-190r31,0r-37,190r-31,0",
            "w": 100
        },
        "\u00ef": {
            "d": "16,0r37,-190r31,0r-37,190r-31,0xm91,-214r6,-33r30,0r-6,33r-30,0xm23,-214r6,-33r31,0r-6,33r-31,0",
            "w": 100
        },
        "\u00f0": {
            "d": "12,-71v-6,-80,80,-129,140,-83v-4,-26,-15,-49,-29,-66r-48,20r3,-21r32,-12v-12,-11,-21,-19,-34,-28v28,-3,46,5,58,18r46,-18r-3,19r-30,12v59,55,56,240,-61,233v-47,-3,-70,-28,-74,-74xm150,-102v4,-30,-16,-47,-44,-47v-46,0,-62,36,-62,81v0,29,14,47,43,47v48,0,57,-38,63,-81"
        },
        "\u00f1": {
            "d": "192,-258v-6,23,-16,46,-44,47v-22,0,-29,-20,-49,-21v-15,-1,-22,9,-25,21r-16,0v8,-21,14,-48,44,-47v22,0,31,18,50,21v13,-1,20,-9,24,-21r16,0xm67,-158v22,-48,132,-52,116,29r-25,129r-32,0r25,-140v3,-38,-53,-32,-70,-12v-29,35,-30,100,-43,152r-32,0r36,-190r30,0"
        },
        "\u00f2": {
            "d": "31,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm89,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53xm126,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0"
        },
        "\u00f3": {
            "d": "31,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm89,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53xm94,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0"
        },
        "\u00f4": {
            "d": "147,-262v9,18,24,30,30,51v-30,3,-32,-21,-50,-30v-22,10,-32,33,-67,30v13,-21,35,-33,51,-51r36,0xm31,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm89,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53"
        },
        "\u00f5": {
            "d": "187,-258v-8,21,-15,46,-44,47v-22,0,-29,-19,-49,-21v-15,-1,-22,9,-25,21r-16,0v8,-21,14,-48,44,-47v21,1,31,17,49,21v14,0,22,-9,25,-21r16,0xm31,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm89,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53"
        },
        "\u00f6": {
            "d": "31,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm89,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53xm136,-214r6,-33r30,0r-6,33r-30,0xm68,-214r6,-33r31,0r-6,33r-31,0"
        },
        "\u00f7": {
            "d": "87,-168r0,-33r30,0r0,33r-30,0xm14,-107r0,-26r175,0r0,26r-175,0xm87,-39r0,-32r30,0r0,32r-30,0",
            "w": 197
        },
        "\u00f8": {
            "d": "51,-10r-14,17r-29,0r27,-32v-33,-70,1,-169,88,-169v19,0,35,4,47,12r12,-14r30,0r-26,30v48,94,-41,210,-135,156xm123,-170v-58,-1,-74,63,-66,119r95,-110v-7,-5,-16,-10,-29,-9xm98,-21v60,1,71,-61,66,-120r-95,111v7,5,16,10,29,9",
            "w": 219
        },
        "\u00f9": {
            "d": "67,3v-93,-2,-31,-127,-26,-193r32,0r-25,140v-3,39,53,32,70,12v30,-34,30,-101,43,-152r32,0r-36,190r-30,0v1,-10,6,-24,4,-33v-14,20,-29,37,-64,36xm129,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0"
        },
        "\u00fa": {
            "d": "67,3v-93,-2,-31,-127,-26,-193r32,0r-25,140v-3,39,53,32,70,12v30,-34,30,-101,43,-152r32,0r-36,190r-30,0v1,-10,6,-24,4,-33v-14,20,-29,37,-64,36xm95,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0"
        },
        "\u00fb": {
            "d": "149,-262v9,18,24,30,30,51v-29,2,-32,-20,-49,-30v-22,10,-32,32,-67,30r0,-4r51,-47r35,0xm67,3v-93,-2,-31,-127,-26,-193r32,0r-25,140v-3,39,53,32,70,12v30,-34,30,-101,43,-152r32,0r-36,190r-30,0v1,-10,6,-24,4,-33v-14,20,-29,37,-64,36"
        },
        "\u00fc": {
            "d": "67,3v-93,-2,-31,-127,-26,-193r32,0r-25,140v-3,39,53,32,70,12v30,-34,30,-101,43,-152r32,0r-36,190r-30,0v1,-10,6,-24,4,-33v-14,20,-29,37,-64,36xm140,-214r6,-33r30,0r-6,33r-30,0xm72,-214r6,-33r31,0r-6,33r-31,0"
        },
        "\u00fd": {
            "d": "198,-190r-129,220v-16,28,-44,53,-89,42v4,-11,-1,-27,19,-22v33,-1,43,-29,59,-52r-38,-188r32,0r27,156r84,-156r35,0xm89,-211v10,-23,31,-35,45,-54r38,0r-1,5r-66,49r-16,0",
            "w": 180
        },
        "\u00fe": {
            "d": "67,-162v32,-53,139,-36,121,50v-13,61,-25,114,-91,116v-29,0,-45,-15,-55,-35r-20,106r-31,0r65,-336r32,0xm156,-126v0,-26,-10,-43,-35,-43v-54,0,-67,50,-69,103v-1,29,14,45,42,46v53,0,62,-58,62,-106"
        },
        "\u00ff": {
            "d": "198,-190r-129,220v-16,28,-44,53,-89,42v4,-11,-1,-27,19,-22v33,-1,43,-29,59,-52r-38,-188r32,0r27,156r84,-156r35,0xm130,-214r6,-33r30,0r-6,33r-30,0xm62,-214r6,-33r31,0r-6,33r-31,0",
            "w": 180
        },
        "\u2013": {
            "d": "-2,-79r4,-24r200,0r-4,24r-200,0"
        },
        "\u2014": {
            "d": "-2,-79r4,-24r360,0r-4,24r-360,0",
            "w": 360
        },
        "\u2018": {
            "d": "35,-167v6,-31,11,-63,30,-81r21,0v-13,13,-21,27,-26,46r16,0r-7,35r-34,0",
            "w": 79,
            "k": {
                "\u2018": 13
            }
        },
        "\u2019": {
            "d": "85,-248v-6,31,-12,62,-30,81r-21,0v12,-13,20,-29,25,-46r-15,0r6,-35r35,0",
            "w": 79,
            "k": {
                "\u2019": 13,
                "s": 7,
                " ": 20
            }
        },
        "\u201c": {
            "d": "84,-167v6,-31,12,-62,30,-81r21,0v-12,14,-20,28,-25,46r15,0r-7,35r-34,0xm26,-167v6,-31,12,-62,30,-81r21,0v-13,13,-21,27,-26,46r16,0r-7,35r-34,0",
            "w": 119
        },
        "\u201d": {
            "d": "133,-248v-6,31,-12,62,-29,81r-22,0v13,-13,21,-27,26,-46r-16,0r7,-35r34,0xm75,-248v-6,31,-12,62,-29,81r-22,0v13,-13,21,-27,26,-46r-16,0r7,-35r34,0",
            "w": 119
        },
        "\u2026": {
            "d": "261,0r7,-38r35,0r-8,38r-34,0xm147,0r8,-38r33,0r-7,38r-34,0xm33,0r7,-38r35,0r-8,38r-34,0",
            "w": 360
        },
        "\u2032": {
            "d": "32,-156r11,-92r35,0r-28,92r-18,0",
            "w": 67
        },
        "\u2033": {
            "d": "32,-156r11,-92r35,0r-28,92r-18,0xm92,-156r11,-92r35,0r-28,92r-18,0",
            "w": 127
        },
        "\u2122": {
            "d": "297,-111r0,-109r-44,109r-19,0r-42,-109r0,109r-23,0r0,-137r34,0r42,107r42,-107r32,0r0,137r-22,0xm101,-228r0,117r-23,0r0,-117r-45,0r0,-20r114,0r0,20r-46,0",
            "w": 360
        }
    }
});
/*
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data `2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({
    "w": 200,
    "face": {
        "font-family": "Liberation Sans",
        "font-weight": 700,
        "font-style": "italic",
        "font-stretch": "normal",
        "units-per-em": "360",
        "panose-1": "2 11 7 4 2 2 2 9 2 4",
        "ascent": "288",
        "descent": "-72",
        "x-height": "4",
        "bbox": "-39 -323 369 77.1055",
        "underline-thickness": "37.793",
        "underline-position": "-56.9531",
        "slope": "-12",
        "unicode-range": "U+0020-U+2122"
    },
    "glyphs": {
        " ": {
            "w": 100,
            "k": {
                "Y": 7,
                "A": 13
            }
        },
        "\u00a0": {
            "w": 100
        },
        "!": {
            "d": "74,-75r-40,0r28,-173r52,0xm14,0r9,-47r51,0r-9,47r-51,0",
            "w": 119
        },
        "\"": {
            "d": "152,-158r-39,0r13,-90r48,0xm77,-158r-39,0r13,-90r48,0",
            "w": 170
        },
        "#": {
            "d": "165,-152r-12,59r38,0r0,26r-44,0r-14,67r-27,0r14,-67r-54,0r-14,67r-27,0r14,-67r-28,0r0,-26r33,0r13,-59r-37,0r0,-26r42,0r15,-67r27,0r-15,67r54,0r15,-67r28,0r-15,67r29,0r0,26r-35,0xm84,-152r-12,59r54,0r12,-59r-54,0"
        },
        "$": {
            "d": "118,-147v83,-2,96,123,15,137v-12,3,-26,5,-42,6r-6,31r-20,0r6,-31v-41,-1,-69,-21,-73,-60r46,-8v2,20,12,32,34,31r13,-68v-33,-10,-66,-24,-66,-65v0,-52,42,-68,93,-71r4,-22r20,1r-5,22v38,0,63,18,66,53r-45,10v-4,-15,-10,-28,-28,-28xm97,-41v33,4,58,-26,38,-52v-5,-5,-14,-8,-25,-11xm111,-210v-32,-4,-55,40,-23,54v3,1,7,3,11,4"
        },
        "%": {
            "d": "20,-148v0,-55,21,-102,76,-102v34,0,55,18,54,54v-2,57,-24,104,-78,104v-35,0,-52,-21,-52,-56xm113,-199v0,-15,-4,-24,-17,-24v-35,0,-36,44,-39,78v-1,15,3,25,15,25v34,0,41,-48,41,-79xm179,-53v0,-54,21,-102,77,-102v34,0,56,18,54,54v-2,57,-24,104,-79,104v-33,0,-52,-22,-52,-56xm272,-104v0,-15,-3,-24,-16,-24v-35,1,-36,44,-39,77v-1,15,3,25,15,25v34,0,37,-46,40,-78xm85,0r-34,0r191,-248r35,0",
            "w": 320
        },
        "&": {
            "d": "152,-18v-39,36,-149,32,-143,-44v4,-49,39,-65,74,-81v-18,-56,8,-109,70,-106v34,2,59,13,59,45v0,48,-46,60,-83,76v9,21,16,43,31,59v17,-18,29,-41,41,-65r33,15v-12,28,-30,52,-49,73v11,11,33,14,52,9r-7,35v-28,9,-62,1,-78,-16xm92,-111v-44,5,-56,92,6,80v12,-2,21,-7,29,-13v-15,-19,-27,-43,-35,-67xm150,-219v-31,-2,-39,34,-29,61v22,-10,49,-14,51,-43v0,-12,-10,-18,-22,-18",
            "w": 259
        },
        "'": {
            "d": "73,-158r-38,0r13,-90r47,0",
            "w": 85
        },
        "(": {
            "d": "13,-52v0,-97,37,-163,91,-209r50,0v-53,52,-92,115,-92,212v0,48,8,90,25,124r-48,0v-17,-35,-26,-77,-26,-127",
            "w": 119
        },
        ")": {
            "d": "109,-139v0,100,-38,166,-91,214r-50,0v54,-54,93,-119,93,-217v0,-46,-11,-87,-27,-119r47,0v17,31,28,75,28,122",
            "w": 119
        },
        "*": {
            "d": "101,-200r41,-18r12,35r-44,11r33,37r-32,21r-26,-44r-26,44r-33,-21r33,-37r-44,-11r12,-35r42,18r-3,-48r38,0",
            "w": 140
        },
        "+": {
            "d": "132,-100r0,72r-40,0r0,-72r-70,0r0,-39r70,0r0,-72r40,0r0,72r70,0r0,39r-70,0",
            "w": 210
        },
        ",": {
            "d": "69,-54v-8,42,-15,86,-40,110r-33,0v15,-15,29,-33,35,-56r-23,0r10,-54r51,0",
            "w": 100
        },
        "-": {
            "d": "10,-72r8,-43r92,0r-9,43r-91,0",
            "w": 119
        },
        "\u00ad": {
            "d": "10,-72r8,-43r92,0r-9,43r-91,0",
            "w": 119
        },
        ".": {
            "d": "8,0r10,-54r51,0r-10,54r-51,0",
            "w": 100
        },
        "\/": {
            "d": "-13,7r103,-268r42,0r-103,268r-42,0",
            "w": 100
        },
        "0": {
            "d": "15,-80v0,-86,24,-171,112,-171v50,0,70,31,70,82v0,85,-26,173,-113,173v-50,0,-69,-33,-69,-84xm149,-172v6,-42,-44,-55,-60,-23v-17,35,-34,101,-21,149v4,6,9,12,19,11v56,-6,53,-82,62,-137"
        },
        "1": {
            "d": "6,0r7,-41r62,0r31,-161r-67,37r8,-42r70,-41r48,0r-41,207r57,0r-8,41r-167,0",
            "k": {
                "1": 27
            }
        },
        "2": {
            "d": "121,-251v83,0,93,87,42,126v-35,27,-77,48,-103,84r115,0r-7,41r-174,0v12,-94,108,-103,147,-168v11,-20,3,-46,-24,-44v-23,2,-33,13,-39,32r-47,-10v12,-38,39,-61,90,-61"
        },
        "3": {
            "d": "131,-73v0,-31,-25,-35,-58,-33r8,-40v36,2,64,-5,65,-39v0,-17,-10,-28,-28,-27v-23,1,-35,12,-41,32r-47,-9v11,-39,39,-63,90,-62v44,1,76,17,76,60v0,42,-26,59,-63,64v28,5,48,20,48,54v0,95,-172,105,-178,13r49,-7v3,21,16,31,40,31v24,0,39,-13,39,-37"
        },
        "4": {
            "d": "154,-50r-10,50r-47,0r10,-50r-113,0r7,-37r126,-161r65,0r-31,161r33,0r-7,37r-33,0xm114,-87r27,-125v-29,45,-64,83,-95,125r68,0"
        },
        "5": {
            "d": "137,-85v4,-43,-51,-49,-69,-23r-48,0r36,-140r148,0r-7,41r-105,0r-15,59v40,-35,118,-7,110,57v10,93,-131,128,-176,58v-5,-8,-6,-16,-7,-25r49,-8v4,19,14,30,37,30v30,-1,44,-19,47,-49"
        },
        "6": {
            "d": "189,-94v-5,59,-36,98,-95,98v-53,0,-78,-35,-77,-90v1,-95,38,-177,138,-163v27,4,44,25,47,55r-47,7v-4,-34,-45,-30,-62,-5v-9,14,-17,34,-22,61v26,-45,125,-35,118,37xm108,-123v-49,-6,-61,88,-10,88v46,5,60,-88,10,-88"
        },
        "7": {
            "d": "33,-248r181,0r-7,40v-48,63,-107,114,-124,208r-52,0v18,-93,73,-148,126,-207r-132,0"
        },
        "8": {
            "d": "35,-185v2,-48,38,-66,89,-66v44,1,76,17,76,59v0,37,-25,55,-56,62v24,7,40,24,40,54v0,56,-41,80,-97,80v-50,0,-82,-20,-82,-67v0,-41,29,-59,63,-67v-20,-10,-33,-26,-33,-55xm84,-179v0,20,9,31,30,31v25,0,36,-17,36,-39v0,-19,-11,-31,-31,-30v-22,1,-36,13,-35,38xm134,-78v0,-21,-11,-34,-35,-34v-29,0,-42,18,-43,46v0,23,13,35,35,35v28,0,43,-19,43,-47"
        },
        "9": {
            "d": "57,-63v1,32,46,34,62,12v12,-16,20,-37,25,-64v-30,46,-125,30,-118,-42v6,-58,37,-94,96,-94v58,0,82,45,75,106v-10,86,-46,165,-141,145v-27,-6,-43,-26,-48,-55xm107,-125v29,0,44,-20,43,-52v0,-21,-11,-35,-31,-36v-46,-5,-63,88,-12,88"
        },
        ":": {
            "d": "41,-132r10,-50r51,0r-10,50r-51,0xm16,0r9,-49r51,0r-10,49r-50,0",
            "w": 119
        },
        ";": {
            "d": "41,-132r10,-50r51,0r-10,50r-51,0xm76,-49v-9,39,-14,83,-40,105r-32,0v15,-15,29,-32,34,-56r-22,0r9,-49r51,0",
            "w": 119
        },
        "\u037e": {
            "d": "41,-132r10,-50r51,0r-10,50r-51,0xm76,-49v-9,39,-14,83,-40,105r-32,0v15,-15,29,-32,34,-56r-22,0r9,-49r51,0",
            "w": 119
        },
        "<": {
            "d": "22,-91r0,-56r180,-69r0,40r-146,57r146,57r0,40",
            "w": 210
        },
        "=": {
            "d": "22,-148r0,-39r180,0r0,39r-180,0xm22,-51r0,-39r180,0r0,39r-180,0",
            "w": 210
        },
        ">": {
            "d": "22,-22r0,-40r146,-57r-146,-57r0,-40r180,69r0,56",
            "w": 210
        },
        "?": {
            "d": "163,-185v-5,-40,-82,-31,-84,8r-47,-7v13,-42,43,-68,99,-67v46,1,82,17,82,62v0,69,-80,60,-96,114r-47,0v8,-55,68,-59,91,-98v1,-4,2,-7,2,-12xm54,0r9,-47r51,0r-9,47r-51,0",
            "w": 219
        },
        "@": {
            "d": "198,-261v86,0,138,44,138,128v0,63,-27,110,-85,115v-25,2,-35,-18,-33,-42v-12,21,-31,42,-62,42v-41,0,-58,-29,-58,-68v0,-60,30,-105,88,-108v25,-1,39,15,48,31r6,-27r28,0r-27,131v-1,11,5,16,14,17v38,-7,54,-45,54,-90v0,-68,-42,-104,-111,-104v-94,0,-143,58,-143,150v0,71,39,112,113,112v42,0,75,-12,103,-27r11,22v-32,17,-67,31,-116,31v-89,0,-140,-50,-140,-138v0,-107,63,-175,172,-175xm162,-43v43,-4,60,-45,60,-89v0,-23,-14,-38,-37,-38v-42,0,-58,41,-58,84v0,24,11,45,35,43",
            "w": 351
        },
        "A": {
            "d": "183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0",
            "w": 259,
            "k": {
                "\u2019": 20,
                "Y": 27,
                "W": 20,
                "V": 27,
                "T": 27,
                " ": 13
            }
        },
        "B": {
            "d": "240,-76v-1,102,-136,71,-234,76r48,-248v79,4,193,-21,193,58v0,38,-25,53,-57,60v29,5,49,21,50,54xm195,-182v0,-40,-58,-24,-96,-27r-12,61v45,-3,108,12,108,-34xm188,-77v0,-44,-65,-31,-109,-33r-13,72v51,-3,122,14,122,-39",
            "w": 259
        },
        "C": {
            "d": "161,-211v-63,0,-91,46,-91,110v0,39,17,65,58,64v38,-1,60,-20,74,-45r40,20v-22,39,-58,62,-117,66v-116,9,-135,-148,-68,-212v33,-50,166,-62,196,-1v4,8,9,18,11,27r-48,12v-6,-24,-25,-41,-55,-41",
            "w": 259
        },
        "D": {
            "d": "250,-142v-3,89,-53,142,-142,142r-102,0r48,-248v105,-5,200,3,196,106xm201,-140v1,-57,-42,-72,-103,-68r-32,168v84,6,135,-22,135,-100",
            "w": 259
        },
        "E": {
            "d": "6,0r48,-248r195,0r-8,40r-143,0r-12,63r132,0r-7,40r-132,0r-13,65r150,0r-8,40r-202,0",
            "w": 240
        },
        "F": {
            "d": "98,-208r-15,77r118,0r-8,40r-117,0r-18,91r-52,0r48,-248r174,0r-8,40r-122,0",
            "w": 219,
            "k": {
                "A": 20,
                ".": 40,
                ",": 40
            }
        },
        "G": {
            "d": "70,-104v-4,71,81,81,132,50r8,-40r-60,0r7,-37r108,0r-19,100v-30,21,-65,34,-116,34v-70,-1,-112,-35,-112,-105v-1,-106,79,-169,188,-144v33,8,53,31,63,63r-50,14v-6,-26,-25,-42,-56,-42v-62,0,-89,43,-93,107",
            "w": 280
        },
        "H": {
            "d": "168,0r21,-106r-110,0r-21,106r-52,0r48,-248r52,0r-19,99r110,0r19,-99r50,0r-48,248r-50,0",
            "w": 259
        },
        "I": {
            "d": "6,0r48,-248r52,0r-48,248r-52,0",
            "w": 100
        },
        "J": {
            "d": "51,-77v-1,38,59,57,67,15r29,-145r-49,0r7,-41r101,0r-34,174v3,81,-127,106,-159,37v-4,-9,-7,-19,-9,-30"
        },
        "K": {
            "d": "175,0r-63,-112r-37,21r-17,91r-52,0r48,-248r52,0r-23,113r134,-113r65,0r-132,109r82,139r-57,0",
            "w": 259
        },
        "L": {
            "d": "6,0r48,-248r52,0r-40,208r133,0r-8,40r-185,0",
            "w": 219,
            "k": {
                "\u2019": 27,
                "Y": 27,
                "W": 20,
                "V": 20,
                "T": 27,
                " ": 7
            }
        },
        "M": {
            "d": "212,0r43,-212r-104,212r-37,0r-24,-212v-8,75,-25,142,-38,212r-46,0r48,-248r70,0r20,187r93,-187r69,0r-48,248r-46,0",
            "w": 299
        },
        "N": {
            "d": "155,0r-65,-199r-38,199r-46,0r48,-248r62,0r66,201r38,-201r46,0r-48,248r-63,0",
            "w": 259
        },
        "O": {
            "d": "18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96",
            "w": 280
        },
        "P": {
            "d": "241,-173v-1,82,-78,91,-166,86r-17,87r-52,0r48,-248v87,0,188,-12,187,75xm188,-171v0,-43,-48,-36,-90,-36r-15,80v50,0,105,7,105,-44",
            "w": 240,
            "k": {
                "A": 27,
                ".": 46,
                ",": 46,
                " ": 13
            }
        },
        "Q": {
            "d": "23,-63v-24,-104,36,-188,140,-188v68,0,111,34,111,101v0,87,-44,137,-119,151v2,31,28,37,61,31r-8,34v-54,13,-105,-9,-105,-64v-40,-7,-72,-29,-80,-65xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96",
            "w": 280
        },
        "R": {
            "d": "258,-177v0,46,-32,67,-71,75r48,102r-57,0r-41,-94r-61,0r-18,94r-52,0r48,-248v89,2,204,-19,204,71xm205,-174v0,-46,-63,-30,-107,-33r-14,73v51,-2,120,13,121,-40",
            "w": 259,
            "k": {
                "Y": 7,
                "W": 7,
                "T": 7
            }
        },
        "S": {
            "d": "178,-136v88,48,22,151,-73,140v-56,-7,-93,-19,-101,-68r51,-9v1,50,111,53,115,3v-16,-63,-132,-20,-133,-112v0,-93,190,-91,199,-10r-50,12v-4,-41,-93,-50,-97,-4v7,38,59,32,89,48",
            "w": 240
        },
        "T": {
            "d": "157,-208r-40,208r-52,0r40,-208r-80,0r8,-40r212,0r-8,40r-80,0",
            "w": 219,
            "k": {
                "y": 13,
                "w": 13,
                "u": 7,
                "s": 13,
                "r": 7,
                "o": 13,
                "i": 7,
                "e": 13,
                "c": 13,
                "a": 13,
                "O": 7,
                "A": 27,
                ";": 27,
                ":": 27,
                ".": 27,
                "-": 20,
                ",": 27
            }
        },
        "U": {
            "d": "76,-105v-23,59,45,89,88,55v12,-10,18,-24,22,-45r30,-153r51,0v-29,105,-8,252,-149,252v-70,0,-107,-43,-93,-116r26,-136r52,0",
            "w": 259
        },
        "V": {
            "d": "130,0r-60,0r-40,-248r54,0r24,206v31,-72,69,-137,103,-206r54,0",
            "w": 240,
            "k": {
                "y": 7,
                "u": 7,
                "r": 7,
                "o": 13,
                "i": 13,
                "e": 13,
                "a": 13,
                "A": 27,
                ";": 13,
                ":": 13,
                ".": 33,
                "-": 13,
                ",": 33
            }
        },
        "W": {
            "d": "253,0r-61,0r-6,-196v-25,68,-54,131,-82,196r-62,0r-16,-248r50,0r7,204r86,-204r55,0r8,204r82,-204r51,0",
            "w": 339,
            "k": {
                "y": 7,
                "u": 7,
                "r": 7,
                "o": 7,
                "i": 3,
                "e": 7,
                "a": 7,
                "A": 20,
                ";": 13,
                ":": 13,
                ".": 27,
                "-": 13,
                ",": 27
            }
        },
        "X": {
            "d": "39,-248r54,0r39,83r71,-83r55,0r-105,119r64,129r-54,0r-44,-94r-80,94r-56,0r115,-129",
            "w": 240
        },
        "Y": {
            "d": "147,-102r-20,102r-51,0r19,-102r-65,-146r52,0r45,107r83,-107r57,0",
            "w": 240,
            "k": {
                "v": 13,
                "u": 13,
                "q": 13,
                "p": 13,
                "o": 13,
                "i": 13,
                "e": 13,
                "a": 13,
                "A": 27,
                ";": 20,
                ":": 20,
                ".": 33,
                "-": 27,
                ",": 33,
                " ": 7
            }
        },
        "Z": {
            "d": "190,0r-198,0r7,-37r163,-170r-117,0r8,-41r178,0r-7,36r-163,171r137,0",
            "w": 219
        },
        "[": {
            "d": "-9,75r65,-336r95,0r-7,34r-48,0r-52,268r48,0r-6,34r-95,0",
            "w": 119
        },
        "\\": {
            "d": "51,7r-31,-268r41,0r33,268r-43,0",
            "w": 100
        },
        "]": {
            "d": "-31,75r7,-34r49,0r52,-268r-49,0r6,-34r96,0r-65,336r-96,0",
            "w": 119
        },
        "^": {
            "d": "169,-90r-57,-133r-57,133r-40,0r69,-158r56,0r69,158r-40,0",
            "w": 210
        },
        "_": {
            "d": "-21,44r0,-14r207,0r0,14r-207,0"
        },
        "`": {
            "d": "105,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5",
            "w": 119
        },
        "a": {
            "d": "166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0"
        },
        "b": {
            "d": "87,-160v15,-17,32,-34,63,-34v99,1,59,172,-1,192v-36,12,-78,0,-87,-29r-8,31r-48,0r52,-261r49,0xm158,-122v0,-24,-5,-37,-29,-37v-46,0,-55,46,-57,89v-1,25,12,40,35,40v44,0,51,-50,51,-92",
            "w": 219
        },
        "c": {
            "d": "67,-101v-8,29,-7,73,27,71v23,-2,32,-16,39,-37r48,9v-11,39,-40,62,-90,62v-55,0,-84,-32,-79,-90v6,-75,61,-124,140,-103v26,7,40,29,43,59r-50,4v-1,-20,-9,-34,-29,-34v-35,0,-41,29,-49,59"
        },
        "d": {
            "d": "132,-28v-14,19,-31,32,-63,32v-39,0,-59,-27,-59,-66v0,-70,24,-129,92,-132v31,-1,47,14,56,35r19,-102r49,0r-47,261r-49,0xm62,-69v0,22,7,39,29,39v45,-2,54,-45,57,-90v2,-27,-10,-40,-33,-40v-44,0,-53,48,-53,91",
            "w": 219
        },
        "e": {
            "d": "114,-194v63,-2,87,48,72,110r-123,0v-3,28,1,55,31,54v21,-1,32,-13,37,-29r44,13v-15,32,-38,50,-84,50v-50,0,-80,-26,-80,-77v0,-71,33,-119,103,-121xm144,-117v14,-47,-50,-61,-67,-22v-3,6,-6,13,-8,22r75,0"
        },
        "f": {
            "d": "93,-157r-31,157r-49,0r31,-157r-28,0r6,-33r28,0v2,-54,40,-81,100,-68r-6,32v-29,-8,-44,9,-45,36r38,0r-7,33r-37,0",
            "w": 119,
            "k": {
                "\u2019": -7,
                "f": 7
            }
        },
        "g": {
            "d": "45,-171v29,-32,103,-29,114,14v2,-11,5,-23,8,-33r47,0r-38,188v-3,70,-92,96,-155,64v-12,-6,-20,-20,-22,-37r50,-5v2,28,48,27,63,11v13,-13,20,-45,21,-66v-13,20,-30,35,-62,36v-87,3,-60,-134,-26,-172xm94,-35v41,-3,55,-43,55,-86v0,-24,-12,-39,-35,-39v-43,0,-51,48,-51,90v0,22,9,37,31,35",
            "w": 219
        },
        "h": {
            "d": "150,-105v8,-23,8,-54,-22,-51v-68,7,-54,98,-72,156r-50,0r50,-261r50,0r-21,103v15,-20,33,-36,66,-36v95,0,34,128,28,194r-49,0",
            "w": 219
        },
        "i": {
            "d": "50,-224r7,-37r49,0r-7,37r-49,0xm6,0r37,-190r49,0r-37,190r-49,0",
            "w": 100
        },
        "j": {
            "d": "50,-224r7,-37r49,0r-7,37r-49,0xm51,22v-6,42,-44,63,-90,49r7,-33v23,5,33,-8,36,-27r39,-201r49,0",
            "w": 100
        },
        "k": {
            "d": "128,0r-33,-87r-25,13r-15,74r-49,0r51,-261r49,0r-29,150r82,-79r56,0r-83,74r48,116r-52,0"
        },
        "l": {
            "d": "6,0r51,-261r49,0r-51,261r-49,0",
            "w": 100
        },
        "m": {
            "d": "255,-194v90,0,29,129,24,194r-49,0r25,-136v-7,-39,-53,-14,-60,9v-12,38,-18,85,-28,127r-49,0r25,-136v2,-29,-39,-23,-50,-7v-24,35,-25,96,-37,143r-50,0r36,-190r48,0v-1,10,-6,24,-4,32v12,-20,27,-36,57,-36v30,0,46,15,50,41v14,-21,29,-41,62,-41",
            "w": 320
        },
        "n": {
            "d": "151,-194v95,0,34,128,28,194r-49,0r25,-134v0,-29,-45,-25,-59,-9v-29,32,-27,95,-40,143r-50,0r36,-190r47,0r-4,32v15,-20,33,-36,66,-36",
            "w": 219
        },
        "o": {
            "d": "124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46",
            "w": 219
        },
        "p": {
            "d": "156,-122v2,-23,-7,-37,-28,-37v-47,0,-58,44,-58,89v0,24,12,40,36,40v43,0,47,-49,50,-92xm-8,75r50,-265r48,0v0,10,-3,24,-3,30v22,-50,127,-45,121,29v-6,73,-21,135,-92,135v-29,0,-46,-14,-55,-35r-20,106r-49,0",
            "w": 219
        },
        "q": {
            "d": "102,-194v32,-2,46,14,56,35v2,-10,4,-23,8,-31r48,0r-53,265r-49,0r21,-104v-14,20,-32,33,-64,33v-38,0,-59,-26,-59,-65v0,-70,24,-129,92,-133xm63,-82v-3,28,2,52,28,52v46,-1,55,-45,57,-90v1,-24,-7,-40,-30,-40v-43,0,-50,40,-55,78",
            "w": 219
        },
        "r": {
            "d": "84,-151v13,-25,34,-51,72,-40r-8,41v-81,-20,-77,86,-92,150r-50,0r36,-190r47,0",
            "w": 140,
            "k": {
                "\u2019": -13,
                ".": 20,
                ",": 20
            }
        },
        "s": {
            "d": "144,-137v-1,-29,-70,-35,-71,-2v16,41,103,10,103,80v0,68,-97,75,-144,50v-14,-8,-23,-22,-28,-39r44,-6v3,32,80,36,82,1v-15,-42,-103,-11,-103,-82v0,-77,157,-79,161,-8"
        },
        "t": {
            "d": "72,-63v-8,23,5,39,32,30r-6,32v-44,15,-86,-5,-75,-63r18,-93r-26,0r7,-33r28,0r24,-45r31,0r-8,45r35,0r-6,33r-36,0",
            "w": 119
        },
        "u": {
            "d": "69,3v-96,0,-34,-126,-28,-193r49,0r-25,133v6,42,62,18,71,-6v14,-38,17,-86,28,-127r50,0r-36,190r-47,0v0,-11,4,-26,3,-33v-14,20,-30,37,-65,36",
            "w": 219
        },
        "v": {
            "d": "109,0r-59,0r-31,-190r51,0r16,153r77,-153r54,0",
            "k": {
                ".": 20,
                ",": 20
            }
        },
        "w": {
            "d": "212,0r-52,0r-8,-156r-70,156r-52,0r-13,-190r46,0r2,145r66,-145r53,0r8,145r60,-145r47,0",
            "w": 280,
            "k": {
                ".": 13,
                ",": 13
            }
        },
        "x": {
            "d": "127,0r-32,-67r-58,67r-53,0r89,-99r-49,-91r52,0r30,61r52,-61r54,0r-85,92r52,98r-52,0"
        },
        "y": {
            "d": "100,10v-23,37,-50,77,-115,62r7,-35v37,9,51,-18,65,-41r-37,-186r51,0r18,146r73,-146r53,0",
            "k": {
                ".": 13,
                ",": 13
            }
        },
        "z": {
            "d": "-6,0r7,-35r114,-120r-84,0r7,-35r142,0r-7,35r-114,119r100,0r-7,36r-158,0",
            "w": 180
        },
        "{": {
            "d": "73,9v-6,25,6,36,34,32r-7,34v-48,4,-86,-7,-75,-57v7,-33,31,-97,-22,-94r7,-34v90,1,16,-151,121,-151r35,0r-7,34v-82,-9,-21,116,-102,134v42,8,25,65,16,102",
            "w": 140
        },
        "|": {
            "d": "34,75r0,-336r46,0r0,336r-46,0",
            "w": 100
        },
        "}": {
            "d": "65,-195v6,-24,-6,-36,-34,-32r7,-34v47,-5,85,7,75,57v-7,34,-31,95,22,94r-7,34v-97,1,-2,174,-155,151r6,-34v83,10,20,-118,103,-134v-43,-7,-26,-65,-17,-102",
            "w": 140
        },
        "~": {
            "d": "203,-105v-54,44,-135,-36,-182,10r0,-38v51,-45,135,36,182,-10r0,38",
            "w": 210
        },
        "\u00a1": {
            "d": "43,-143r10,-47r50,0r-9,47r-51,0xm4,57r39,-172r40,0r-28,172r-51,0",
            "w": 119
        },
        "\u00a2": {
            "d": "105,-185v-35,12,-55,96,-24,124xm13,-98v0,-70,33,-118,99,-123r6,-27r28,0r-5,29v32,6,53,26,56,61r-50,5v-1,-14,-5,-24,-13,-30r-24,123v14,-6,20,-17,26,-34r47,9v-10,37,-37,57,-80,61r-6,29r-28,0r5,-30v-38,-7,-61,-30,-61,-73"
        },
        "\u00a3": {
            "d": "41,-37v48,-2,109,12,114,-34r39,7v-9,38,-33,64,-77,64r-126,0r7,-36v29,-9,39,-38,45,-70r-33,0r5,-30r32,0v11,-58,16,-115,89,-115v41,0,64,17,70,52r-43,9v0,-33,-48,-36,-57,-10v-6,19,-9,44,-14,64r51,0r-6,30r-51,0v-4,35,-17,59,-45,69"
        },
        "\u00a4": {
            "d": "36,-82v-13,-20,-13,-58,1,-77r-24,-23r28,-28r23,23v20,-12,57,-13,77,0r24,-23r28,28r-24,23v13,18,14,59,0,77r24,23r-28,28r-23,-23v-22,14,-58,13,-78,0r-24,24r-27,-28xm103,-157v-22,0,-37,14,-37,36v0,22,15,37,37,37v22,0,36,-15,36,-37v0,-22,-14,-36,-36,-36"
        },
        "\u00a5": {
            "d": "140,-121r49,0r-5,25r-60,0r-5,29r59,0r-5,26r-59,0r-8,41r-48,0r8,-41r-59,0r5,-26r59,0r6,-29r-60,0r5,-25r49,0r-40,-127r50,0r27,105r69,-105r52,0"
        },
        "\u00a6": {
            "d": "34,-129r0,-132r46,0r0,132r-46,0xm34,75r0,-132r46,0r0,132r-46,0",
            "w": 100
        },
        "\u00a7": {
            "d": "39,-193v-4,-72,124,-73,156,-32v4,6,7,13,7,22r-43,5v-1,-32,-76,-31,-77,0v15,46,108,15,108,81v0,32,-19,45,-44,52v13,7,23,21,23,40v4,70,-99,78,-152,54v-14,-7,-21,-20,-24,-39r43,-7v1,39,88,37,90,0v-12,-52,-109,-12,-109,-86v0,-31,22,-41,47,-48v-13,-9,-24,-20,-25,-42xm146,-105v-1,-38,-82,-43,-85,-5v3,35,79,42,85,5"
        },
        "\u00a8": {
            "d": "100,-211r7,-38r39,0r-8,38r-38,0xm24,-211r7,-38r38,0r-8,38r-37,0",
            "w": 119
        },
        "\u00a9": {
            "d": "138,-251v76,0,127,50,127,127v0,79,-50,127,-127,127v-77,0,-127,-48,-127,-127v0,-78,49,-127,127,-127xm138,-17v65,0,107,-42,107,-107v0,-65,-42,-107,-107,-107v-65,0,-107,42,-107,107v0,64,42,107,107,107xm101,-125v-9,51,61,66,74,25r28,8v-11,23,-29,42,-63,42v-46,0,-71,-27,-71,-75v0,-81,109,-97,132,-32r-28,7v-15,-40,-80,-23,-72,25",
            "w": 265
        },
        "\u00aa": {
            "d": "125,-157v-4,13,5,17,16,14v0,14,-3,24,-22,20v-19,2,-25,-11,-24,-24v-10,33,-78,37,-77,-8v0,-42,42,-44,84,-44v4,-17,3,-33,-19,-29v-9,1,-14,7,-16,16r-30,-4v1,-40,108,-49,99,0xm81,-181v-28,-4,-40,34,-13,38v19,-3,28,-19,31,-38r-18,0",
            "w": 133
        },
        "\u00ab": {
            "d": "127,-24r-34,-64r3,-12r56,-65r42,0r-1,7r-57,65r33,62r-1,7r-41,0xm46,-24r-33,-64r2,-12r57,-65r42,0r-1,7r-58,65r33,62r-1,7r-41,0"
        },
        "\u00ac": {
            "d": "154,-25r0,-75r-141,0r0,-39r181,0r0,114r-40,0",
            "w": 210
        },
        "\u00ae": {
            "d": "138,-251v76,0,127,50,127,127v0,79,-50,127,-127,127v-77,0,-127,-48,-127,-127v0,-78,49,-127,127,-127xm138,-17v65,0,107,-42,107,-107v0,-65,-42,-107,-107,-107v-65,0,-107,42,-107,107v0,64,42,107,107,107xm142,-195v61,-11,70,74,23,84r38,59r-35,0r-32,-55r-20,0r0,55r-32,0r0,-143r58,0xm116,-130v24,1,48,2,48,-23v0,-23,-25,-20,-48,-20r0,43",
            "w": 265
        },
        "\u00af": {
            "d": "202,-255r-205,0r0,-17r205,0r0,17",
            "w": 198
        },
        "\u00b0": {
            "d": "89,-250v35,0,57,22,57,55v0,33,-23,55,-57,55v-34,0,-56,-22,-56,-55v0,-33,22,-55,56,-55xm89,-166v18,0,29,-12,29,-29v0,-18,-11,-29,-29,-29v-18,0,-28,13,-29,29v2,16,11,29,29,29",
            "w": 143
        },
        "\u00b1": {
            "d": "125,-124r0,60r-39,0r0,-60r-71,0r0,-39r71,0r0,-60r39,0r0,60r71,0r0,39r-71,0xm15,0r0,-39r181,0r0,39r-181,0",
            "w": 197
        },
        "\u00b2": {
            "d": "33,-217v4,-43,95,-48,95,-1v0,45,-53,44,-73,71r61,0r-4,25r-100,0v4,-49,54,-53,79,-81v8,-10,4,-26,-10,-25v-11,1,-17,6,-20,17",
            "w": 119
        },
        "\u00b3": {
            "d": "95,-215v0,-21,-33,-17,-35,2r-29,-4v3,-42,95,-49,97,-2v0,20,-16,28,-33,32v14,2,25,12,25,27v1,50,-102,53,-103,4r32,-4v1,12,6,17,19,17v20,0,27,-29,7,-32r-19,-1r4,-22v18,1,35,-2,35,-17",
            "w": 119
        },
        "\u00b4": {
            "d": "45,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0",
            "w": 119
        },
        "\u00b5": {
            "d": "174,-57v-4,13,0,29,16,22r-3,34v-29,7,-66,10,-63,-28v-7,29,-50,46,-67,17r-16,87r-49,0r51,-265r49,0r-23,127v-4,33,36,37,48,14v21,-38,22,-95,34,-141r49,0",
            "w": 207
        },
        "\u00b6": {
            "d": "19,-184v0,-84,98,-61,175,-64r0,25r-23,0r0,269r-27,0r0,-269r-34,0r0,269r-28,0r0,-168v-39,-1,-63,-21,-63,-62"
        },
        "\u00b7": {
            "d": "22,-93r11,-54r50,0r-10,54r-51,0",
            "w": 100
        },
        "\u2219": {
            "d": "22,-93r11,-54r50,0r-10,54r-51,0",
            "w": 100
        },
        "\u00b8": {
            "d": "95,38v-1,33,-40,40,-80,36v4,-11,1,-25,20,-20v15,-1,26,0,27,-13v0,-12,-15,-11,-28,-11r17,-30r25,0r-9,15v16,-1,28,7,28,23",
            "w": 119
        },
        "\u00b9": {
            "d": "17,-122r4,-21r33,0r16,-82r-34,19r4,-22v18,-10,33,-24,66,-20r-20,105r29,0r-4,21r-94,0",
            "w": 119
        },
        "\u00ba": {
            "d": "91,-249v34,-1,55,18,55,48v0,48,-27,80,-74,80v-32,0,-54,-18,-54,-51v0,-48,26,-76,73,-77xm75,-145v28,0,35,-26,35,-53v0,-16,-6,-27,-22,-27v-27,1,-33,24,-34,52v0,16,6,27,21,28",
            "w": 131
        },
        "\u00bb": {
            "d": "74,-165r34,64r-3,12r-56,65r-42,0r1,-8r58,-64v-10,-24,-27,-41,-33,-69r41,0xm155,-165r33,64r-2,12r-57,65r-42,0r1,-8r58,-64r-33,-62r1,-7r41,0"
        },
        "\u00bc": {
            "d": "250,-25r-5,25r-32,0r4,-25r-61,0r5,-26r70,-76r38,0r-14,77r18,0r-5,25r-18,0xm233,-102v-14,19,-30,35,-46,52r35,0xm75,0r-34,0r191,-248r35,0xm17,-122r4,-21r33,0r16,-82r-34,19r4,-22v18,-10,33,-24,66,-20r-20,105r29,0r-4,21r-94,0",
            "w": 300
        },
        "\u00bd": {
            "d": "75,0r-34,0r191,-248r35,0xm17,-122r4,-21r33,0r16,-82r-34,19r4,-22v18,-10,33,-24,66,-20r-20,105r29,0r-4,21r-94,0xm187,-95v4,-43,95,-48,95,-1v0,45,-53,44,-73,71r61,0r-4,25r-100,0v4,-49,54,-53,79,-81v8,-10,4,-26,-10,-25v-11,1,-17,6,-20,17",
            "w": 300
        },
        "\u00be": {
            "d": "250,-25r-5,25r-32,0r4,-25r-61,0r5,-26r70,-76r38,0r-14,77r18,0r-5,25r-18,0xm233,-102v-14,19,-30,35,-46,52r35,0xm75,0r-34,0r191,-248r35,0xm97,-215v0,-21,-33,-17,-35,2r-29,-4v3,-42,95,-49,97,-2v0,20,-16,28,-33,32v14,2,25,12,25,27v1,50,-102,53,-103,4r32,-4v1,12,6,17,19,17v20,0,27,-29,7,-32r-19,-1r4,-22v18,1,35,-2,35,-17",
            "w": 300
        },
        "\u00bf": {
            "d": "54,-5v5,40,82,31,84,-8r47,7v-13,42,-45,62,-99,67v-84,8,-107,-95,-40,-126v20,-15,49,-20,54,-50r47,0v-8,55,-68,59,-91,98v-1,4,-2,7,-2,12xm163,-190r-9,47r-51,0r9,-47r51,0",
            "w": 219
        },
        "\u00c0": {
            "d": "168,-269r-54,-41r2,-8r42,0r35,44v0,10,-17,3,-25,5xm183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0",
            "w": 259
        },
        "\u00c1": {
            "d": "134,-269v12,-20,33,-32,49,-49r47,0r-2,8r-68,41r-26,0xm183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0",
            "w": 259
        },
        "\u00c2": {
            "d": "192,-323v10,19,27,31,34,54r-27,0v-11,-8,-19,-19,-31,-26v-21,11,-34,31,-72,26r1,-5r55,-49r40,0xm183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0",
            "w": 259
        },
        "\u00c3": {
            "d": "237,-320v-7,25,-17,51,-49,51v-29,0,-61,-45,-74,0r-24,0v6,-26,17,-51,49,-51v22,0,33,19,52,21v15,2,17,-11,22,-21r24,0xm183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0",
            "w": 259
        },
        "\u00c4": {
            "d": "183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0xm183,-269r7,-38r39,0r-8,38r-38,0xm107,-269r7,-38r38,0r-8,38r-37,0",
            "w": 259
        },
        "\u00c5": {
            "d": "163,-315v26,0,44,17,44,45v0,27,-17,44,-44,44v-28,0,-45,-18,-45,-44v0,-27,18,-45,45,-45xm163,-248v13,0,22,-9,22,-22v0,-13,-8,-22,-22,-22v-14,0,-22,8,-22,22v0,15,9,22,22,22xm183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0",
            "w": 259
        },
        "\u00c6": {
            "d": "147,0r12,-63r-79,0r-42,63r-55,0r170,-248r216,0r-8,40r-123,0r-12,63r112,0r-8,38r-112,0r-13,67r131,0r-8,40r-181,0xm188,-210v-23,-1,-21,26,-35,37r-47,71r61,0",
            "w": 360
        },
        "\u00c7": {
            "d": "158,-211v-63,0,-91,46,-91,110v0,39,17,65,58,64v38,-1,60,-20,74,-45r40,20v-22,39,-58,62,-117,66v-116,9,-135,-148,-68,-212v33,-50,166,-62,196,-1v4,8,9,18,11,27r-48,12v-6,-24,-25,-41,-55,-41xm156,38v-1,33,-40,40,-80,36v4,-11,1,-25,20,-20v15,-1,26,0,27,-13v0,-12,-15,-11,-28,-11r17,-30r25,0r-9,15v16,-1,28,7,28,23",
            "w": 259
        },
        "\u00c8": {
            "d": "151,-269r-53,-41r1,-8r42,0r36,44v0,10,-18,3,-26,5xm6,0r48,-248r195,0r-8,40r-143,0r-12,63r132,0r-7,40r-132,0r-13,65r150,0r-8,40r-202,0",
            "w": 240
        },
        "\u00c9": {
            "d": "126,-269v11,-22,33,-31,48,-49r47,0r-1,8r-68,41r-26,0xm6,0r48,-248r195,0r-8,40r-143,0r-12,63r132,0r-7,40r-132,0r-13,65r150,0r-8,40r-202,0",
            "w": 240
        },
        "\u00ca": {
            "d": "186,-323v10,19,27,31,34,54r-27,0v-11,-8,-19,-19,-31,-26v-21,11,-34,31,-72,26r1,-5r55,-49r40,0xm6,0r48,-248r195,0r-8,40r-143,0r-12,63r132,0r-7,40r-132,0r-13,65r150,0r-8,40r-202,0",
            "w": 240
        },
        "\u00cb": {
            "d": "6,0r48,-248r195,0r-8,40r-143,0r-12,63r132,0r-7,40r-132,0r-13,65r150,0r-8,40r-202,0xm175,-269r7,-38r39,0r-8,38r-38,0xm99,-269r7,-38r38,0r-8,38r-37,0",
            "w": 240
        },
        "\u00cc": {
            "d": "85,-269r-54,-41r2,-8r42,0r35,44v0,10,-17,3,-25,5xm6,0r48,-248r52,0r-48,248r-52,0",
            "w": 100
        },
        "\u00cd": {
            "d": "57,-269v12,-20,33,-32,49,-49r47,0r-2,8r-68,41r-26,0xm6,0r48,-248r52,0r-48,248r-52,0",
            "w": 100
        },
        "\u00ce": {
            "d": "149,-274v-1,10,-18,3,-27,5v-11,-8,-20,-19,-32,-26v-21,11,-34,31,-72,26r1,-5r55,-49r40,0xm6,0r48,-248r52,0r-48,248r-52,0",
            "w": 100
        },
        "\u00cf": {
            "d": "6,0r48,-248r52,0r-48,248r-52,0xm103,-269r7,-38r39,0r-8,38r-38,0xm27,-269r7,-38r38,0r-8,38r-37,0",
            "w": 100
        },
        "\u00d0": {
            "d": "250,-142v-3,89,-53,142,-142,142r-102,0r21,-104r-23,0r7,-39r23,0r20,-105v105,-5,200,3,196,106xm201,-140v1,-57,-42,-72,-103,-68r-12,65r63,0r-8,39r-63,0r-12,64v84,6,135,-22,135,-100",
            "w": 259
        },
        "\u00d1": {
            "d": "243,-320v-8,24,-17,53,-50,51v-28,-1,-60,-44,-73,0r-24,0v6,-26,17,-51,49,-51v23,0,32,19,52,21v15,1,17,-11,22,-21r24,0xm155,0r-65,-199r-38,199r-46,0r48,-248r62,0r66,201r38,-201r46,0r-48,248r-63,0",
            "w": 259
        },
        "\u00d2": {
            "d": "174,-269r-54,-41r2,-8r42,0r35,44v0,10,-17,3,-25,5xm18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96",
            "w": 280
        },
        "\u00d3": {
            "d": "151,-269v11,-22,33,-31,48,-49r47,0r-1,8r-68,41r-26,0xm18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96",
            "w": 280
        },
        "\u00d4": {
            "d": "232,-274v-1,10,-19,3,-28,5v-11,-8,-19,-19,-31,-26v-21,11,-34,31,-72,26r1,-5r55,-49r40,0xm18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96",
            "w": 280
        },
        "\u00d5": {
            "d": "249,-320v-7,25,-17,51,-49,51v-28,0,-60,-45,-74,0r-24,0v6,-26,17,-51,49,-51v29,0,62,42,74,0r24,0xm18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96",
            "w": 280
        },
        "\u00d6": {
            "d": "18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96xm190,-269r7,-38r39,0r-8,38r-38,0xm114,-269r7,-38r38,0r-8,38r-37,0",
            "w": 280
        },
        "\u00d7": {
            "d": "22,-57r63,-63r-62,-62r28,-28r61,62r62,-62r28,28r-62,62r62,62r-28,28r-62,-62r-62,62",
            "w": 210
        },
        "\u00d8": {
            "d": "18,-101v0,-91,52,-147,145,-150v29,0,53,6,70,18r23,-25r35,0r-39,42v13,16,22,37,22,66v0,118,-106,184,-211,138r-20,21r-37,0r36,-38v-15,-17,-24,-42,-24,-72xm200,-198v-78,-45,-155,42,-123,131xm95,-46v78,35,146,-42,121,-130",
            "w": 280
        },
        "\u00d9": {
            "d": "163,-269r-53,-41r1,-8r42,0r36,44v-1,9,-17,4,-26,5xm76,-105v-23,59,45,89,88,55v12,-10,18,-24,22,-45r30,-153r51,0v-29,105,-8,252,-149,252v-70,0,-107,-43,-93,-116r26,-136r52,0",
            "w": 259
        },
        "\u00da": {
            "d": "139,-269v11,-22,33,-31,48,-49r47,0r-1,8r-68,41r-26,0xm76,-105v-23,59,45,89,88,55v12,-10,18,-24,22,-45r30,-153r51,0v-29,105,-8,252,-149,252v-70,0,-107,-43,-93,-116r26,-136r52,0",
            "w": 259
        },
        "\u00db": {
            "d": "227,-274v-1,10,-18,3,-27,5v-11,-8,-20,-19,-32,-26v-21,11,-34,31,-71,26r0,-5r55,-49r40,0xm76,-105v-23,59,45,89,88,55v12,-10,18,-24,22,-45r30,-153r51,0v-29,105,-8,252,-149,252v-70,0,-107,-43,-93,-116r26,-136r52,0",
            "w": 259
        },
        "\u00dc": {
            "d": "76,-105v-23,59,45,89,88,55v12,-10,18,-24,22,-45r30,-153r51,0v-29,105,-8,252,-149,252v-70,0,-107,-43,-93,-116r26,-136r52,0xm182,-269r7,-38r39,0r-8,38r-38,0xm106,-269r7,-38r38,0r-8,38r-37,0",
            "w": 259
        },
        "\u00dd": {
            "d": "126,-269v11,-22,34,-31,49,-49r46,0r-1,8r-68,41r-26,0xm147,-102r-20,102r-51,0r19,-102r-65,-146r52,0r45,107r83,-107r57,0",
            "w": 240
        },
        "\u00de": {
            "d": "233,-134v0,82,-77,91,-165,86r-10,48r-52,0r48,-248r52,0r-7,40v73,-4,133,6,134,74xm181,-131v0,-42,-47,-38,-90,-37r-16,80v49,0,106,8,106,-43",
            "w": 240
        },
        "\u00df": {
            "d": "164,-205v2,-26,-43,-25,-57,-10v-9,8,-14,21,-17,36r-34,179r-50,0r35,-181v11,-52,39,-80,99,-80v38,0,68,13,69,51v2,45,-42,45,-51,77v8,30,44,30,44,72v0,64,-76,78,-127,54r12,-32v21,12,70,18,68,-18v-2,-35,-44,-30,-43,-69v1,-42,49,-40,52,-79",
            "w": 219
        },
        "\u00e0": {
            "d": "166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0xm123,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5"
        },
        "\u00e1": {
            "d": "166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0xm95,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0"
        },
        "\u00e2": {
            "d": "151,-269v10,21,26,36,33,61r-27,0v-10,-11,-19,-24,-30,-34r-43,34r-30,0v14,-26,39,-39,57,-61r40,0xm166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0"
        },
        "\u00e3": {
            "d": "195,-259v-7,25,-17,51,-49,51v-29,0,-61,-45,-74,0r-24,0v6,-26,17,-51,49,-51v22,0,33,19,52,21v15,2,17,-11,22,-21r24,0xm166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0"
        },
        "\u00e4": {
            "d": "166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0xm138,-211r7,-38r39,0r-8,38r-38,0xm62,-211r7,-38r38,0r-8,38r-37,0"
        },
        "\u00e5": {
            "d": "124,-296v28,0,45,18,45,44v0,26,-17,45,-45,45v-27,0,-44,-18,-44,-45v0,-27,17,-44,44,-44xm124,-274v-28,0,-28,45,0,45v14,0,23,-9,23,-23v0,-13,-10,-22,-23,-22xm166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0"
        },
        "\u00e6": {
            "d": "36,-142v5,-54,101,-68,135,-32v46,-38,137,-21,137,53v0,11,-2,27,-4,37r-123,0v-16,44,35,75,62,37r6,-12r43,13v-15,32,-37,50,-84,50v-35,0,-58,-15,-69,-39v-15,25,-40,39,-78,39v-33,0,-54,-21,-54,-53v0,-64,62,-69,129,-67v9,-24,2,-52,-29,-45v-14,3,-22,10,-25,24xm60,-57v0,38,49,28,58,5v7,-8,10,-23,13,-36v-34,-1,-71,-2,-71,31xm262,-117v14,-47,-50,-60,-68,-22v-3,6,-6,13,-8,22r76,0",
            "w": 320
        },
        "\u00e7": {
            "d": "67,-101v-8,29,-7,73,27,71v23,-2,32,-16,39,-37r48,9v-11,39,-40,62,-90,62v-55,0,-84,-32,-79,-90v6,-75,61,-124,140,-103v26,7,40,29,43,59r-50,4v-1,-20,-9,-34,-29,-34v-35,0,-41,29,-49,59xm129,38v-1,33,-40,40,-80,36v4,-11,1,-25,20,-20v15,-1,26,0,27,-13v0,-12,-15,-11,-28,-11r17,-30r25,0r-9,15v16,-1,28,7,28,23"
        },
        "\u00e8": {
            "d": "114,-194v63,-2,87,48,72,110r-123,0v-3,28,1,55,31,54v21,-1,32,-13,37,-29r44,13v-15,32,-38,50,-84,50v-50,0,-80,-26,-80,-77v0,-71,33,-119,103,-121xm144,-117v14,-47,-50,-61,-67,-22v-3,6,-6,13,-8,22r75,0xm126,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5"
        },
        "\u00e9": {
            "d": "114,-194v63,-2,87,48,72,110r-123,0v-3,28,1,55,31,54v21,-1,32,-13,37,-29r44,13v-15,32,-38,50,-84,50v-50,0,-80,-26,-80,-77v0,-71,33,-119,103,-121xm144,-117v14,-47,-50,-61,-67,-22v-3,6,-6,13,-8,22r75,0xm92,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0"
        },
        "\u00ea": {
            "d": "151,-269v10,21,26,36,33,61r-27,0v-10,-11,-19,-24,-30,-34r-43,34r-30,0v14,-26,39,-39,57,-61r40,0xm114,-194v63,-2,87,48,72,110r-123,0v-3,28,1,55,31,54v21,-1,32,-13,37,-29r44,13v-15,32,-38,50,-84,50v-50,0,-80,-26,-80,-77v0,-71,33,-119,103,-121xm144,-117v14,-47,-50,-61,-67,-22v-3,6,-6,13,-8,22r75,0"
        },
        "\u00eb": {
            "d": "114,-194v63,-2,87,48,72,110r-123,0v-3,28,1,55,31,54v21,-1,32,-13,37,-29r44,13v-15,32,-38,50,-84,50v-50,0,-80,-26,-80,-77v0,-71,33,-119,103,-121xm144,-117v14,-47,-50,-61,-67,-22v-3,6,-6,13,-8,22r75,0xm140,-211r7,-38r39,0r-8,38r-38,0xm64,-211r7,-38r38,0r-8,38r-37,0"
        },
        "\u00ec": {
            "d": "6,0r37,-190r49,0r-37,190r-49,0xm71,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5",
            "w": 100
        },
        "\u00ed": {
            "d": "6,0r37,-190r49,0r-37,190r-49,0xm46,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0",
            "w": 100
        },
        "\u00ee": {
            "d": "102,-269v9,21,29,38,32,61r-26,0v-10,-11,-19,-24,-30,-34r-44,34r-29,0v14,-26,39,-39,57,-61r40,0xm6,0r37,-190r49,0r-37,190r-49,0",
            "w": 100
        },
        "\u00ef": {
            "d": "6,0r37,-190r49,0r-37,190r-49,0xm91,-211r7,-38r39,0r-8,38r-38,0xm15,-211r7,-38r38,0r-8,38r-37,0",
            "w": 100
        },
        "\u00f0": {
            "d": "10,-72v-4,-78,75,-121,145,-89v-4,-17,-13,-33,-22,-46r-49,19r6,-31r26,-10v-12,-12,-23,-23,-39,-32v32,-1,61,-3,76,17r52,-19r-5,30r-26,10v19,24,32,52,32,95v-1,80,-36,132,-113,132v-52,0,-81,-26,-83,-76xm153,-107v0,-20,-14,-31,-37,-31v-57,0,-79,108,-18,108v38,0,55,-37,55,-77",
            "w": 219
        },
        "\u00f1": {
            "d": "211,-259v-7,25,-17,51,-49,51v-29,0,-61,-45,-74,0r-24,0v6,-26,17,-51,49,-51v22,0,33,19,52,21v15,2,17,-11,22,-21r24,0xm151,-194v95,0,34,128,28,194r-49,0r25,-134v0,-29,-45,-25,-59,-9v-29,32,-27,95,-40,143r-50,0r36,-190r47,0r-4,32v15,-20,33,-36,66,-36",
            "w": 219
        },
        "\u00f2": {
            "d": "124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46xm130,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5",
            "w": 219
        },
        "\u00f3": {
            "d": "124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46xm109,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0",
            "w": 219
        },
        "\u00f4": {
            "d": "161,-269v9,21,29,38,32,61r-27,0r-29,-34r-44,34r-30,0v14,-26,39,-39,57,-61r41,0xm124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46",
            "w": 219
        },
        "\u00f5": {
            "d": "206,-259v-7,25,-17,51,-49,51v-23,0,-33,-19,-53,-22v-13,1,-17,12,-21,22r-24,0v6,-26,17,-51,49,-51v29,0,60,44,74,0r24,0xm124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46",
            "w": 219
        },
        "\u00f6": {
            "d": "124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46xm151,-211r7,-38r39,0r-8,38r-38,0xm75,-211r7,-38r38,0r-8,38r-37,0",
            "w": 219
        },
        "\u00f7": {
            "d": "81,-169r0,-41r42,0r0,41r-42,0xm12,-100r0,-39r181,0r0,39r-181,0xm81,-30r0,-41r42,0r0,41r-42,0",
            "w": 197
        },
        "\u00f8": {
            "d": "11,-74v-4,-90,78,-141,161,-110r10,-12r34,0r-24,27v11,12,16,29,16,49v4,90,-73,145,-157,115r-10,12r-34,0r23,-27v-12,-13,-19,-30,-19,-54xm144,-152v-52,-29,-91,31,-80,93xm78,-36v55,24,84,-34,78,-91",
            "w": 219
        },
        "\u00f9": {
            "d": "69,3v-96,0,-34,-126,-28,-193r49,0r-25,133v6,42,62,18,71,-6v14,-38,17,-86,28,-127r50,0r-36,190r-47,0v0,-11,4,-26,3,-33v-14,20,-30,37,-65,36xm129,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5",
            "w": 219
        },
        "\u00fa": {
            "d": "69,3v-96,0,-34,-126,-28,-193r49,0r-25,133v6,42,62,18,71,-6v14,-38,17,-86,28,-127r50,0r-36,190r-47,0v0,-11,4,-26,3,-33v-14,20,-30,37,-65,36xm106,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0",
            "w": 219
        },
        "\u00fb": {
            "d": "162,-269v9,21,29,38,32,61r-26,0v-10,-11,-19,-24,-30,-34r-43,34r-30,0v14,-26,39,-39,57,-61r40,0xm69,3v-96,0,-34,-126,-28,-193r49,0r-25,133v6,42,62,18,71,-6v14,-38,17,-86,28,-127r50,0r-36,190r-47,0v0,-11,4,-26,3,-33v-14,20,-30,37,-65,36",
            "w": 219
        },
        "\u00fc": {
            "d": "69,3v-96,0,-34,-126,-28,-193r49,0r-25,133v6,42,62,18,71,-6v14,-38,17,-86,28,-127r50,0r-36,190r-47,0v0,-11,4,-26,3,-33v-14,20,-30,37,-65,36xm150,-211r7,-38r39,0r-8,38r-38,0xm74,-211r7,-38r38,0r-8,38r-37,0",
            "w": 219
        },
        "\u00fd": {
            "d": "100,10v-23,37,-50,77,-115,62r7,-35v37,9,51,-18,65,-41r-37,-186r51,0r18,146r73,-146r53,0xm93,-208v10,-23,30,-36,44,-56r49,0r-1,8r-67,48r-25,0"
        },
        "\u00fe": {
            "d": "156,-122v2,-23,-7,-37,-28,-37v-47,0,-58,44,-58,89v0,24,12,40,36,40v43,0,47,-49,50,-92xm61,-31r-20,106r-49,0r65,-336r49,0r-19,101v22,-50,127,-45,121,29v-6,73,-21,135,-92,135v-29,0,-46,-14,-55,-35",
            "w": 219
        },
        "\u00ff": {
            "d": "103,10v-23,37,-50,77,-115,62r7,-35v37,9,51,-18,65,-41r-37,-186r51,0r18,146r73,-146r53,0xm142,-210r7,-38r39,0r-8,38r-38,0xm66,-210r7,-38r38,0r-8,38r-37,0"
        },
        "\u2013": {
            "d": "8,-79r5,-35r179,0r-6,35r-178,0"
        },
        "\u2014": {
            "d": "-3,-79r6,-35r360,0r-7,35r-359,0",
            "w": 360
        },
        "\u2018": {
            "d": "33,-146v8,-39,15,-79,39,-102r32,0v-14,15,-28,33,-34,56r23,0r-9,46r-51,0",
            "w": 100,
            "k": {
                "\u2018": 13
            }
        },
        "\u2019": {
            "d": "104,-248v-6,41,-15,79,-39,102r-32,0v14,-14,29,-35,34,-56r-22,0r9,-46r50,0",
            "w": 100,
            "k": {
                "\u2019": 13,
                "t": -7,
                "s": 7,
                " ": 13
            }
        },
        "\u201c": {
            "d": "108,-146v9,-38,15,-80,40,-102r32,0v-15,15,-29,32,-34,56r22,0r-9,46r-51,0xm33,-146v8,-39,15,-79,39,-102r32,0v-14,15,-28,33,-34,56r23,0r-9,46r-51,0",
            "w": 180
        },
        "\u201d": {
            "d": "180,-248v-8,39,-15,79,-39,102r-33,0v15,-15,29,-33,35,-56r-23,0r9,-46r51,0xm104,-248v-8,39,-14,80,-39,102r-32,0v14,-14,29,-35,34,-56r-22,0r9,-46r50,0",
            "w": 180
        },
        "\u2026": {
            "d": "23,0r11,-54r51,0r-11,54r-51,0xm138,0r11,-54r51,0r-11,54r-51,0xm253,0r10,-54r51,0r-11,54r-50,0",
            "w": 360
        },
        "\u2032": {
            "d": "34,-156r12,-92r53,0r-27,92r-38,0",
            "w": 86
        },
        "\u2033": {
            "d": "34,-156r12,-92r53,0r-27,92r-38,0xm120,-156r12,-92r53,0r-27,92r-38,0",
            "w": 172
        },
        "\u2122": {
            "d": "197,-135r-29,0r0,-113r43,0r36,81v10,-29,24,-55,37,-81r42,0r0,113r-29,0r2,-90r-41,90r-23,0r-40,-90v3,28,2,59,2,90xm107,-223r0,88r-32,0r0,-88r-42,0r0,-25r118,0r0,25r-44,0",
            "w": 360
        }
    }
});;
jQuery(document).ready(function ($) {
    if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 7) {
        $j("ul.sf-menu").superfish({
            delay: 400,
            animation: {
                height: "show"
            },
            speed: 275
        })
    } else {
        $j("ul.sf-menu").supersubs({
            minWidth: 12,
            maxWidth: 27,
            extraWidth: 0
        }).superfish({
            delay: 400,
            animation: {
                height: "show"
            },
            speed: 275
        })
    }
    jQuery('a[href$="#popup"]').addClass("zoom iframe").each(function () {
        jQuery(this).attr("href", this.href.replace("#popup", ""))
    });
    jQuery('a[href$="#login"]').addClass("login").each(function () {
        theHref = jQuery(this).attr("href");
        if (theHref == "#login") {
            theHref = themePath + "login.html"
        }
        jQuery(this).attr("href", theHref.replace("#login", ""))
    });
    jQuery("a.zoom[href*='http://www.youtube.com/watch?']").each(function () {
        jQuery(this).addClass("fancyYouTube").removeClass("zoom").removeClass("iframe")
    });
    jQuery("a.zoom[href*='http://www.vimeo.com/'], a.zoom[href*='http://vimeo.com/']").each(function () {
        jQuery(this).addClass("fancyVimeo").removeClass("zoom").removeClass("iframe")
    });
    var overlayColor = jQuery("#fancybox-overlay").css("background-color") || "#2c2c2c";
    jQuery("a.zoom").fancybox({
        padding: 12,
        overlayOpacity: 0.2,
        overlayColor: overlayColor,
        onComplete: modalStart
    });
    jQuery("a.login").fancybox({
        padding: 12,
        overlayOpacity: 0.2,
        overlayColor: overlayColor,
        showCloseButton: false,
        frameWidth: 400,
        frameHeight: 208,
        scrolling: "no",
        titleShow: false,
        hideOnContentClick: false,
        callbackOnShow: modalStart
    });
    jQuery("a.fancyYouTube").click(function () {
        jQuery.fancybox({
            padding: 12,
            overlayOpacity: 0.2,
            overlayColor: overlayColor,
            onComplete: modalStart,
            title: this.title,
            href: this.href.replace(new RegExp("watch\\?v=", "i"), "v/"),
            type: "swf",
            swf: {
                wmode: "transparent",
                allowfullscreen: "true"
            }
        });
        return false
    });
    jQuery("a.fancyVimeo").click(function () {
        jQuery.fancybox({
            padding: 12,
            overlayOpacity: 0.2,
            overlayColor: overlayColor,
            onComplete: modalStart,
            title: this.title,
            href: this.href.replace(new RegExp("([0-9])", "i"), "moogaloop.swf?clip_id=$1"),
            type: "swf"
        });
        return false
    });
    $j('.topReveal, a[href$="#topReveal"]').click(function () {
        $j("#ContentPanel").slideToggle(800, "easeOutQuart");
        $j.scrollTo("#ContentPanel");
        return false
    });
    $j("a.img").hover(function () {
        if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) <= 8) {
            $j(this).stop(false, true).toggleClass("imgHover")
        } else {
            $j(this).stop(false, true).toggleClass("imgHover", 200)
        }
    });
    $j("input[type='text']:not(.noStyle), input[type='password']:not(.noStyle)").each(function () {
        $j(this).addClass("textInput")
    });
    if ($(".portfolio-description").length > 0) {
        var pi = $(".portfolio-description");
        pi.each(function (i, val) {
            if (pi[i].scrollHeight > 120) {
                pi.css("height", pi[i].scrollHeight + "px");
                return false
            }
        })
    }
    $j("label.overlabel").overlabel();
    searchInputEffect();
    buttonStyles();
    if (!jQuery.browser.msie) {
        $j("a.img, div.img, .pagination a, .textInput, input[type='text'], input[type='password'], textarea").addClass("rounded");
        roundCorners()
    }
});
