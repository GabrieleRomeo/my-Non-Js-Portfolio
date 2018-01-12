data = {
  sections: [
    {
      name: 'About',
      icon: 'fa-user-o',
    },
    {
      name: 'Projects',
      icon: 'fa-cubes',
    },
    {
      name: 'Skills',
      icon: 'fa-address-card',
    },
    {
      name: 'Contact',
      icon: 'fa-envelope-o',
    },
  ],
  links: {
    BovAcademy: {
      text: 'Bov Academy',
      title: 'Bov Academy',
      URL: 'https://www.bovacademy.com/',
      target: '_blank',
    },
    StudentsBovAcademy: {
      text: 'students',
      title: 'Students Bov Academy',
      URL: 'https://students.bovacademy.com/',
      target: '_blank',
    },
    BlogBovAcademy: {
      text: 'Bov Academy Blog',
      title: 'Bov Academy Blog',
      URL: 'https://blog.bovacademy.com/',
      target: '_blank',
    },
    Turin: {
      text: 'Turin',
      title: 'Turin - Italy',
      URL: 'https://en.wikipedia.org/wiki/Turin',
      target: '_blank',
    },
    Romeo: {
      text: 'Romeo',
      title: 'Romeo',
      URL: 'https://en.wikipedia.org/wiki/Romeo',
      target: '_blank',
    },
    Urbino: {
      text: 'University of Urbino',
      title: 'University of Urbino - Carlo Bo',
      URL: 'http://informatica.uniurb.it/en/home-en/',
      target: '_blank',
    },
    Social: [
      {
        name: 'GitHub',
        icon: 'icon-github-circled-alt2',
        url: 'https://github.com/GabrieleRomeo',
        title: 'Visit my GitHub profile',
      },
      {
        name: 'Twitter',
        icon: 'icon-twitter',
        url: 'https://twitter.com/Gabriele__Romeo',
        title: 'Follow me on Twitter',
      },
      {
        name: 'Linkedin',
        icon: 'icon-linkedin-circled',
        url: 'http://www.linkedin.com/in/gabriele-romeo-24968ba8',
        title: 'Visit my Linkedin profile',
      },
    ],
  },
  splash: {
    'message-1': {
      'part-1': 'welcome to',
      'part-2': 'my portfolio',
      'part-3': 'would you like to start a new journey',
      'part-4': "together<i class='animation__info'>",
      'part-5': 'I am glad you are here today!',
    },
    'message-2': {
      'part-1': 'welcome back',
      'part-2': '',
      'part-3': 'I feel like you believe in me...',
      'part-4': "isn't it<i class='animation__info'>?</i>",
      'part-5': "That's a wonderful thing!",
    },
  },
  info: {
    work: 'Full-stack Developer',
    education: '@@Urbino@@',
  },
  about: {
    paragraphs: [
      {
        text:
          'I am a student at the prestigious @@BovAcademy/class=about__link@@, and I am an aspiring Full-stack developer who specializes in creating modern and attractive web pages.',
      },
      {
        text:
          'I am living in @@Turin/class=about__link@@, a beautiful city in northern Italy.',
      },
      {
        text:
          "As you probably know, We @@Romeo/class=about__link@@(s) are famous for being passionate lovers.<br> <em class='about__emphasis'> Probably it is for this reason that I love what I do, and I am always looking for new exciting projects. </em>",
      },
      {
        text:
          'If you are interested in my work, feel free to contact me anytime.',
      },
      {
        text:
          'Check out some of the projects below to see what I have been up to recently.',
      },
      {
        text:
          "My hobbies include sports (bodybuilding in particular), gardening, writing (I wrote some technical articles for the Bov academy), reading some interesting book and, above all, <em class='about__emphasis'>enjoy my life</em>.",
        isSpaced: true,
      },
    ],
  },
  projects: [
    {
      name: 'Modern Developer Home Page',
      technologies: [
        'HTML5',
        'CSS3',
        'GreenSock',
        'Vanilla JavaScript',
        "and a bit of <em>passion &amp; love</em><i class='icon-heartbeat double-flash' aria-hidden='true'></i>",
      ],
      description:
        'When @@BovAcademy/text=Richard Bovell/class=about__link@@, the founder of @@BovAcademy/class=about__link@@, asked me to develop the new homepage for the course, sincerely, I was a little bit nervous because of the big responsibility.<br> Now I can say that I am very proud and honored to have been involved in a project so ambitious and formidable. The most difficult part was the synchronization of the various animations at different screen dimensions.<br> <em>I want to say thank you to Richard for the great opportunity he gave me.</em>',
      URLs: [
        {
          text: 'Live Page',
          title: 'Modern Developer Home Page',
          URL: 'https://gabrieleromeo.github.io/Modern-Developer-Homepage/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Modern Developer - Repository',
          URL: 'https://github.com/GabrieleRomeo/Modern-Developer-Homepage',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/moderndeveloper',
      images: [
        'moderndeveloper_01.png',
        'moderndeveloper_02.png',
        'moderndeveloper_03.png',
        'moderndeveloper_04.png',
      ],
      isActive: true,
    },
    {
      name: 'Evolution UI Framework',
      technologies: ['HTML5', 'CSS3', 'Sass', 'Vanilla JavaScript', 'ES6'],
      description:
        'The first of its kind, Evolution UI is an open source front-end web framework comprising a collection of innovative and unique web components. These never-before-seen web components are intended to provide a different and enriched online experience and were created by the @@StudentsBovAcademy@@ of Bov Academy Institute of Programming and Futuristic Engineering (you can learn more about this project and read a write-up on each component by visiting the @@BlogBovAcademy/path=evolution-ui-a-ui-framework-of-dozens-of-innovative-ui-components/@@ ).<br>This framework is intended to be a hub of web development innovation and we invite everyone to explore their creativity and contribute something innovative of their own to keep the project thriving.<br> <em> I want to say thank all guys from the Evolution Core Team </em>',
      URLs: [
        {
          text: 'Live Page',
          title: 'Take a look at Evolution UI',
          URL: 'https://evolution-ui.github.io/evolution-ui/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Evolution UI - Repository',
          URL: 'https://github.com/evolution-ui/evolution-ui/',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/evolutionUI',
      images: [
        'evolutionUI_01.png',
        'evolutionUI_02.png',
        'evolutionUI_03.png',
        'evolutionUI_04.png',
      ],
    },
    {
      name: 'SJS Library',
      technologies: [
        'Gulp',
        'Babel',
        'Webpack',
        'JsDoc',
        'Vanilla Javascript',
        'ES6',
      ],
      description:
        'Sjs is a collection of algorithms and functions wrote during my studies at @@BovAcademy/class=about__link@@. <br> Unlike many other js libraries, Sjs aims to be strongly-typed. The main benefit to being strongly-type is that when you pass an argument to a function, the Library checks if it belongs to an expected data type.<br>If this is not the case, the System throws a TypeError Exception.',
      URLs: [
        {
          text: 'API Docs',
          title: "Visit Sjs's API",
          URL: 'http://api.sjs.surge.sh/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Sjs Repository',
          URL: 'https://github.com/GabrieleRomeo/sjs',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/sjs',
      images: ['sjs_01.png', 'sjs_02.png'],
    },
    {
      name: 'Seed UI Framework',
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description:
        'This showcase shows the result of the Hackathon number 3 at <em>Bov Academy</em>. A three-day event, February the 26(th) - 27(th) - 28(th), 2017, during which our Team developed an UI Framework called <em>Seed UI</em>.',
      Team: [
        {
          name: 'Jake Tom',
          role: 'Project Manager',
          url: 'https://github.com/codephobe',
        },
        {
          name: 'Gabriele Romeo',
          role: 'Product Manager',
          url: 'https://github.com/gabrieleromeo',
        },
        {
          name: 'Joseph Michael Matembu',
          role: 'Developer',
          url: 'https://github.com/jmatembu',
        },
        {
          name: 'Vojislav Grujić',
          role: 'Developer',
          url: 'https://github.com/Gruximillian',
        },
        {
          name: 'Brian Hernandez',
          role: 'Developer',
          url: 'https://github.com/brianhernandez',
        },
        {
          name: 'Léna Faure',
          role: 'Developer',
          url: 'https://github.com/lenafaure',
        },
      ],
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit Seed UI',
          URL: 'https://codephobe.github.io/seed-ui/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Visit the repository',
          URL: 'https://github.com/codephobe/seed-ui',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/seedUI',
      images: ['seedUI_01.png', 'seedUI_02.png', 'seedUI_03.png'],
    },
    {
      name: 'JIGSAW Drag & Drop Puzzle',
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description:
        'This showcase shows the JIGSAW Drag & Drop Puzzle Project that has a full drag and drop interface. <p> The system is based on the <strong>Model-View-ViewModel (MVVM) Architectural Pattern</strong></p>',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit DEMO',
          URL: 'https://gabrieleromeo.github.io/Bov-Jigsaw-Puzzle/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Visit the repository',
          URL: 'https://github.com/GabrieleRomeo/Bov-Jigsaw-Puzzle',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/JIGSAW',
      images: ['JIGSAW_01.png', 'JIGSAW_02.png', 'JIGSAW_03.png'],
    },
    {
      name: 'The Game Of Life',
      technologies: [
        'HTML5 - Canvas',
        'CSS3',
        'ES6 Vanilla JavaScript',
        'WebWorkers',
        'WebPack',
        'Babel',
      ],
      description:
        'This showcase shows the Game Of Life Project<p><em> This is a classic computer science project which results in interesting random patterns emerging on the screen.</em></p>',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit DEMO',
          URL: 'https://gabrieleromeo.github.io/gameOfLife/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Visit the repository',
          URL: 'https://github.com/GabrieleRomeo/gameOfLife',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/gameOfLife',
      images: ['gameOfLife_01.png', 'gameOfLife_02.png', 'gameOfLife_03.png'],
    },
    {
      name: 'Forms',
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description:
        'A list of web forms developed with the aim to practice modern development techniques. They make use of a self-made validation library written in pure Javascript as well as a utility library. Have a look at the demos to see the final result.',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit the DEMO',
          URL:
            'http://gabrieleromeo.github.io/Bov-Projects/CSS-projects/project_4.html',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/forms',
      images: ['forms_01.png', 'forms_02.png', 'forms_03.png', 'forms_04.png'],
    },
    {
      name: 'Calculator',
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description:
        "A fully functional calculator made in three different versions with a little bit of <em>passion &amp; love</em> <i class='icon-heartbeat double-flash' aria-hidden='true'></i> for the <em>Introduction to CSS</em> course.",
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit the DEMO',
          URL:
            'http://gabrieleromeo.github.io/Bov-Projects/CSS-projects/project_5.html',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'The Calculator - Repository',
          URL:
            'https://github.com/GabrieleRomeo/Bov-Projects/tree/master/CSS-projects/project_5.html',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/calculator',
      images: ['calculator_01.png', 'calculator_02.png', 'calculator_03.png'],
    },
    {
      name: 'Shopping Cart',
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description:
        'A demo of an e-commerce website with an integrated shopping cart at the end of the page. I built it using pure javascript in functional reactive style.',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit the DEMO',
          URL:
            'http://gabrieleromeo.github.io/Bov-Projects/CSS-projects/project_6.html',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Shopping Cart - Repository',
          URL:
            'https://github.com/GabrieleRomeo/Bov-Projects/tree/master/CSS-projects/project_6.html',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/shoppingCart',
      images: [
        'shoppingCart_01.png',
        'shoppingCart_02.png',
        'shoppingCart_03.png',
      ],
    },
    {
      name: 'Image Gallery',
      technologies: ['HTML5', 'CSS3'],
      description:
        'Image gallery carousel created during the <em>Mastering CSS</em> course.',
      URLs: [
        {
          text: 'Live Page 1',
          title: 'Visit DEMO 1',
          URL: 'http://codepen.io/DrLeleMeo/pen/bwLxVW',
          target: '_blank',
        },
        {
          text: 'Live Page 2',
          title: 'Visit DEMO 2',
          URL: 'http://codepen.io/DrLeleMeo/pen/XjkPWP',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/imageGallery',
      images: ['imageGallery_01.jpg', 'imageGallery_02.jpg'],
    },
    {
      name: 'CSS Accordion',
      technologies: ['HTML5', 'CSS3'],
      description:
        'A customized version of a <em>CSS3 accordion</em> project developed during the <em>Mastering CSS</em> course.',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit DEMO',
          URL: 'http://codepen.io/DrLeleMeo/pen/rrqYXg',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/accordion',
      images: ['accordion_01.png', 'accordion_02.png', 'accordion_03.png'],
    },
    {
      name: 'CSS Tab',
      technologies: ['HTML5', 'CSS3'],
      description:
        'A customized version of a <em>CSS3 tab</em> project developed during the <em>Mastering CSS</em> course.',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit DEMO',
          URL: 'http://codepen.io/DrLeleMeo/pen/JRryqb',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/tab',
      images: ['tab_01.png', 'tab_02.png'],
    },
    {
      name: 'Questionnaire',
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description:
        "I developed this questionnaire with my teammate, <a class='project__link' href='https://github.com/stefanfrede' target='_blank'>@Stefan Frede</a>. The initial requirements were: 'Build an app similar to the popular Google Forms app called the Questionnaire App including some response fields for collecting information from end users using HTML and CSS.'<br> As a naming convention for classes in HTML and CSS, we used the Block, Element, Modifier (BEM) methodology whereas for the layout we followed a Mobile-First Responsive-Design approach based on a vertical rhythm with a base font-size of 16px (100&#37;) and a line-height of 1.5rem. We used plain Javascript for the validation as well as HTML5 Local Storage to memorize the information. The application logic is written almost entirely in the functional style (FP).<br>  Well done, Stefan!",
      Team: [
        {
          name: 'Gabriele Romeo',
          role: 'Developer',
          url: 'https://github.com/gabrieleromeo',
        },
        {
          name: 'Stefan Frede',
          role: 'Developer',
          url: 'https://github.com/stefanfrede',
        },
      ],
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit DEMO',
          URL: 'http://stefanfrede.github.io/moderndeveloper-questionnaire/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Visit the repository',
          URL: 'https://github.com/stefanfrede/moderndeveloper-questionnaire',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/questionnaire',
      images: ['questionnaire_01.png', 'questionnaire_02.png'],
    },
    {
      name: 'Music Catalog',
      technologies: [
        'HTML5',
        'CSS3',
        'Vanilla Javascript',
        'ES6',
        'Indexed DB',
        'localStorage',
      ],
      description:
        'Each album is stored as an IndexedDB record. The first time a user visits the page, the data are downloaded from the Free Music Archive through a <em>XMLHttpRequest</em> and then stored in IndexedDB.<p> Subsequent visits to the page are loaded the data from IndexedDB. </p><p> The Music Catalog project I developed makes use of <em>IndexedDB</em> as well as the <em>sessionStorage object</em> for holding user preference about the view. </p> <p> Long text descriptions are cut and the system shows a <em>Show More</em> link so that the user can see the remaining text. </p> <p> A user may switch between the <em>list</em> and <em>table</em> view using the appropriate button. </p> <p> I also added the search capability so that a user can seek a particular text within Albums titles and descriptions. </p>',
      URLs: [
        {
          text: 'Live Page',
          title: 'Visit Music Catalog',
          URL:
            'http://gabrieleromeo.github.io/Bov-Projects/Course-08-Building-high-performance-modern-javascript-web-applications/chapter-08-Frontend-Datastore/music-catalog',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Visit the repository',
          URL:
            'https://github.com/GabrieleRomeo/Bov-Projects/tree/master/Course-08-Building-high-performance-modern-javascript-web-applications/chapter-08-Frontend-Datastore/music-catalog',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/projects/musicCatalog',
      images: [
        'musicCatalog_01.png',
        'musicCatalog_02.png',
        'musicCatalog_03.png',
      ],
    },
    /*
    {
      "name": "MD-Toolkit",
      "technologies": ["HTML5", "CSS3", "Vanilla Javascript"],
      "description": "",
      "URLs": [
      {
        "text": "Live Page",
        "title": "Visit MD-Toolkit",
        "URL": "https://gabrieleromeo.github.io/MD-U-toolkit/",
        "target": "_blank"
      },
      {
        "text": "Project Repository",
        "title": "MD-Toolkit Repository",
        "URL": "https://github.com/GabrieleRomeo/MD-U-toolkit",
        "target": "_blank"
      }
      ],
      "images_path": "components/tab/img/projects/md_toolkit",
      "images": ["webButtons_01.png", "webButtons_02.png", "webButtons_03.png"]
    },
    */
  ],
  hackathons: [
    {
      name: 'October-2016',
      technologies: ['HTML5', 'CSS3'],
      description:
        "This showcase shows the result of the first Hackathon at <em>Bov Academy</em>. A three-day event, during which our Team replicated four <a class='project__link' href='http://materializecss.com/' target='_blank'>Materialize.css </a> components in pure CSS3 <em>from scratch</em>.",
      Team: [
        {
          name: 'Gabriele Romeo',
          role: 'Project and Product Manager',
          url: 'https://github.com/gabrieleromeo',
        },
        {
          name: 'Frank Stepanski',
          role: 'Developer',
          url: 'https://github.com/frankstepanski',
        },
      ],
      URLs: [
        {
          text: 'Live Page',
          title: "Visit the hackathon's projects",
          URL: 'https://frankstepanski.github.io/hackathon-oct-2016',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Repository',
          URL: 'https://github.com/frankstepanski/hackathon-oct-2016',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/hackathons/hackathon_1',
      images: ['image_1.png', 'image_2.png', 'image_3.png'],
    },
    {
      name: 'december-2016',
      technologies: ['HTML5', 'CSS3'],
      description:
        'This showcase shows the result of the Hackathon number 2 at <em>Bov Academy</em>. A three-day event, December the 9(th) - 10(th) - 11(th), 2016, during which our Team developed a preliminary version of the <em>Bov Academy Blog</em>.',
      Team: [
        {
          name: 'Brian Hernandez',
          role: 'Project Manager',
          url: 'https://github.com/brianhernandez',
        },
        {
          name: 'Gabriele Romeo',
          role: 'Developer',
          url: 'https://github.com/gabrieleromeo',
        },
        {
          name: 'Imanuel Gittens',
          role: 'Developer',
          url: 'https://github.com/imanuelgittens',
        },
        {
          name: 'David Gierman',
          role: 'Developer',
          url: 'https://github.com/DGeero89',
        },
      ],
      URLs: [
        {
          text: 'Live Page',
          title: "Visit the hackathon's projects",
          URL: 'https://gabrieleromeo.github.io/bov-academy-blog/',
          target: '_blank',
        },
        {
          text: 'Project Repository',
          title: 'Repository',
          URL: 'https://github.com/GabrieleRomeo/bov-academy-blog',
          target: '_blank',
        },
      ],
      images_path: 'components/tab/img/hackathons/hackathon_2',
      images: ['image_1.png', 'image_2.png', 'image_3.png'],
    },
  ],
  skills: {
    levels: ['Expert', 'Proficent', 'Competent', 'Learning'],
    types: [
      {
        name: 'Frontend',
        percentage: 80,
        list: [
          {
            name: 'Javascript',
            level: 'expert',
            description: '<strong>Expert: </strong>Cool stuff',
          },
          {
            name: 'Sass',
            level: 'expert',
            description:
              '<strong>Expert: </strong> I love mixins, functions, and all the other stuff',
          },
          {
            name: 'JQuery',
            level: 'competent',
            description:
              '<strong>Competent: </strong> Lovely (JS) library. I know how to control It, but I want to master it',
          },
          {
            name: '(JS) GreenSock',
            level: 'competent',
            description:
              "<strong>Competent: </strong> Have a look at the MD's Homepage animations, Please",
          },
          {
            name: 'React JS',
            level: 'learning',
            description:
              "<strong>Learning: </strong> I'm sure that BovAcademy will improve this",
          },
          {
            name: 'Vue.js',
            level: 'learning',
            description:
              "<strong>Learning: </strong> I'm sure that BovAcademy will improve this",
          },
        ],
      },
      {
        name: 'Backend',
        percentage: 20,
        list: [
          {
            name: 'NodeJs',
            level: 'competent',
            description:
              '<strong>Competent: </strong> Not too bad but I need to improve its profound aspects',
          },
          {
            name: 'PHP',
            level: 'learning',
            description:
              '<strong>Learning: </strong> I used Symfony PHP for a while',
          },
          {
            name: 'MongoDB',
            level: 'learning',
            description:
              "<strong>Learning: </strong> I'm sure that L.MD will improve this",
          },
          {
            name: 'MySQL',
            level: 'learning',
            description:
              '<strong>Learning: </strong> I used it during University and for some personal projects.',
          },
        ],
      },
      {
        name: 'Other',
        list: [
          {
            name: 'Written Communication',
            level: 'proficent',
            description:
              '<strong>Proficent: </strong> I like writing. I wrote some articles for BovAcademy',
          },
          {
            name: 'Problem-Solving',
            level: 'expert',
            description:
              "<strong>Expert: </strong> I like to solve problems! It's funny",
          },
          {
            name: 'Project-Management',
            level: 'competent',
            description:
              '<strong>Competent: </strong> I reach the goals, always, whatever it takes.',
          },
          {
            name: 'Research',
            level: 'proficent',
            description: '<strong>Proficent: </strong> I like it.',
          },
          {
            name: 'Public Speaking',
            level: 'learning',
            description:
              "<strong>Learning: </strong> I'm working on this aspect.",
          },
        ],
      },
    ],
  },
};
