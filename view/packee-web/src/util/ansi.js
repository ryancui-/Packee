const ANSI_Styles = {
  '': { color: null, 'background-color': null, 'font-weight': null, 'text-decoration': null, opacity: null },
  0: { color: null, 'background-color': null, 'font-weight': null, 'text-decoration': null, opacity: null },
  1: { 'font-weight': 'bold' },
  2: { 'opacity': '0.8' }, //DIM
  4: { 'text-decoration': 'underline' }, //underlined
  5: {}, //BLINK
  7: {}, //REVERSE (swap fg & bg)
  8: { opacity: '0' }, // hidden

  21: { 'font-weight': null }, //Reset bold/bright - "22 isn't wildly supported"
  22: { opacity: null, 'font-weight': null }, //Reset dim
  24: { 'text-decoration': null }, //Reset underlined
  25: {}, //Reset blink
  27: {}, //Reset reverse
  28: { opacity: null }, //Reset hidden


  30: { color: 'black;' },
  31: { color: 'red;' },
  32: { color: 'green;' },
  33: { color: '#c5c527;' }, //yellow
  34: { color: 'blue;' },
  35: { color: 'darkmagenta;' }, //magenta
  36: { color: 'darkcyan;' }, //cyan
  37: { color: 'lightgrey;' },
  39: { color: null }, //initial
  90: { color: '#555;' }, //darkgrey
  91: { color: 'orangered;' },
  92: { color: 'lime;' },
  93: { color: 'yellow;' }, //lightyellow
  94: { color: 'steelblue;' }, //lightblue
  95: { color: 'magenta;' }, //lightmagenta
  96: { color: 'cyan;' }, //lightcyan
  97: { color: 'white;' },

  40: { 'background-color': 'black' },
  41: { 'background-color': 'red' },
  42: { 'background-color': 'green' },
  43: { 'background-color': '#c5c527' }, //yellow
  44: { 'background-color': 'blue' },
  45: { 'background-color': 'darkmagenta' }, //magenta
  46: { 'background-color': 'darkcyan' }, //cyan
  47: { 'background-color': 'lightgrey' },
  49: { 'background-color': null }, //initial
  100: { 'background-color': '#555' }, //darkgrey
  101: { 'background-color': 'orangered' },
  102: { 'background-color': 'lime' },
  103: { 'background-color': 'yellow' }, //lightyellow
  104: { 'background-color': 'steelblue' }, //lightblue
  105: { 'background-color': 'magenta' }, //lightmagenta
  106: { 'background-color': 'cyan' }, //lightcyan
  107: { 'background-color': 'white' }
}
// http://wiki.bash-hackers.org/scripting/terminalcodes
// https://misc.flogisoft.com/bash/tip_colors_and_formatting#colors
// https://github.com/chalk/ansi-styles/blob/master/index.js
// http://ascii-table.com/ansi-escape-sequences-vt-100.php
// http://invisible-island.net/xterm/ctlseqs/ctlseqs.html
// http://www.inwap.com/pdp10/ansicode.txt

function ansiToHTML(s, parseInteractive = true) {
  if (!s && typeof stringValue !== 'string') {
    return ''
  }

  function objToCSS(o, del1 = ': ', del2 = ';') {
    return Object.keys(o)
      .map((k) => [k, o[k]].join(del1))
      .join(del2)
  }

  function getNewStyle(old, next) {
    const updated = { ...old, ...next }

    for (const k of Object.keys(updated)) {
      if (updated[k] === null) {
        delete updated[k]
      }
    }

    return updated
  }

  const escapeRegex = '\\x1B[=>]|\\x1B\\x5b((?:[0-9;]*m|[0-9]?[KG]|\\?1[hl]))'
  const regex = new RegExp(escapeRegex + '([^\\x1B]*)', 'g')

  let curStyle = {}

  function line(s) {

    function repl(match, p1, p2) {
      if (p1 && p1.endsWith('m')) {
        p1 = p1.slice(0, -1)
        const vi = parseInt(p1, 10) || ''
        const style = ANSI_Styles[vi]
        if (!style) {
          console.error('unknown ansi code:' + p1)
        }
        curStyle = getNewStyle(curStyle, style)

        return `<span style="${objToCSS(curStyle)}">${p2 || ''}</span>`
      } else {
        return p2 || ''
      }
    }

    const content = s.replace(regex, repl).replace(/^\r+/g, '')
    return content.replace(/<[^>]*><\/[^>]*>/g, '') //remove empty tags
  }

  // http://www.rapidtables.com/code/text/ascii-table.htm
  // http://wiki.bash-hackers.org/scripting/terminalcodes
  let output = parseInteractive ? s.replace(/\r\n/g, '\n').replace(/^.*\r(?!\n)/mg, '').replace(/.\\x08/g, '') : s

  return output.split('\n').map((s) => {
    return line(s)
  }).join('<br/>')
}

export default ansiToHTML
