/*globals Template7, data */

var templateToCompile = [
  {
    'name': 'SplashSection',
    'selector': '#t7__splash',
    'template': null
  },
  {
    'name': 't7_cTab',
    'selector': '#c-tab',
    'template': null
  },
  {
    'name': 't7__sideMenu__item',
    'selector': '#t7__sideMenu__item',
    'template': null
  },
  {
    'name': 'About',
    'selector': '#t7__about',
    'template': null
  },
  {
    'name': 'Graph',
    'selector': '#t7__graph',
    'template': null
  },
  {
    'name': 'Skills',
    'selector': '#t7__skills',
    'template': null
  },
  {
    'name': 'SocialFooter',
    'selector': '#t7__socialFooter',
    'template': null
  }
];

function mergeOptions(obj1,obj2){
  var obj3 = {};
  var attrname;
  for (attrname in obj1) {
    if (obj1.hasOwnProperty(attrname)) {
      obj3[attrname] = obj1[attrname];
    }
  }
  for (attrname in obj2) {
    if (obj2.hasOwnProperty(attrname)) {
      obj3[attrname] = obj2[attrname];
    }
  }
  return obj3;
}

var strToObj = function(s, needle) {
  var obj = {};
  var parts = s.split(needle || '=');
  for (var i = 0, lenI = parts.length; i < lenI; i++) {
    obj[parts[0]] = parts[1];
  }
  return obj;
};

var objToLink = function(obj) {
  var link = '<a href="' + obj.URL +
              (obj.path ? obj.path : '') + ' "' +
              (obj.class ? ' class="' + obj.class + '"' : '') +
              ' target="' + obj.target + '"' +
              ' title="' + obj.title + '">' +
              obj.text +
            '</a>';
  return link;
};

// Template
var t7TabList = document.getElementById('t7__tab__item').innerHTML;
Template7.registerPartial('tabItems', t7TabList.toString());
Template7.registerHelper('replaceAll', function(text, needle, width) {
  return text.split(needle).join(width);
});
Template7.registerHelper('parseLinks', function(description, options) {
  var linksObj = options.root.links;
  var linkReg = /@@[^@]+@@/g;
  var result;
  while ((result = linkReg.exec(description)) !== null) {
    var linkText = result[0].split('@').join('');
    var match = result[0];
    var parts = linkText.split('/');
    var linkObj = parts.slice(1).reduce(function(res, part) {
      var partObj = strToObj(part);
      return mergeOptions(res, partObj);
    }, {});
    var l = mergeOptions(linksObj[parts[0]], linkObj);
    description = description.replace(new RegExp(match, 'g'), objToLink(l));
  }
  return description;
});
Template7.registerHelper('circle', function(x1, x2) {
    return Math.round((x1 * x2) / 100);
});
Template7.registerHelper('getCookie', function(name) {
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');
    var cookie = cookies.filter(function(c) {
        return c.indexOf('counter') !== -1;
    }).map(function(c) {
      return c.trim().split('=')[1];
    });
    return cookie[0];
});
Template7.registerHelper('lookup', function(obj, counter, prop) {
    var o;
    if (counter > 0) {
      if (obj['message-' + counter]) {
        o = obj['message-' + counter];
      } else {
        o = obj['message-2'];
      }
    } else {
      o = obj['message-1'];
    }
    return o[prop];
});
Template7.registerHelper('lookupByCookie', function(obj, prop) {
  var counter = Template7.helpers.getCookie('counter');
  return Template7.helpers.lookup(obj, parseInt(counter), prop);
});

templateToCompile.forEach(function(template) {
  var node = document.querySelector(template.selector);
  if (!node) { return;}
  var html = node.innerHTML;
  var compiled = new Template7(html).compile();
  var compiledRendered = compiled(data);
  template.template = compiled;
  node.parentNode.innerHTML = compiledRendered;
});