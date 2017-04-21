/// <binding ProjectOpened='watch' />
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    assemble: {
      options: {
        //assets: '',
        partials: ['hbs/**/*.hbs'],
        layout: ['hbs/layouts/default.hbs'],
        data: ['data/*.{json,yml}'],
        flatten: true
      },

      bzkl: {
        files: [
          {
            'html/chapter-1.html': ['hbs/chapter-1.hbs']
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24',
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },

      site: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['less/**/*.less'],
            dest: 'less/'
          },
          {
            expand: true,
            flatten: true,
            src: ['css/bzkl.css'],
            dest: 'css/'
          }
        ]
      }
    },

    csscomb: {
      options: {
      },

      less: {
        files: [{
          expand: true,
          flatten: true,
          src: ['less/**/*.less'],
          dest: 'less/'
        }]
      },

      css: {
        files: [{
          expand: true,
          flatten: true,
          src: ['css/bzkl.css'],
          dest: 'css/'
        }]
      }
    },

    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      bzkl_css: {
        files: {
          'css/bzkl.min.css': 'css/bzkl.css'
        }
      }
    },

    htmlmin: {
      bzkl: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'html/chapter-1.min.html': 'html/chapter-1.html'
        }
      }
    },

    less: {
      options: {
      },
      bzkl: {
        files: {
          'css/bzkl.css': 'less/bzkl.less'
        }
      }
    },

    uglify: {
      bzkl: {
        files: {
          'js/data.min.js': ['js/data.js'],
          'js/bzkl.min.js': ['js/bzkl.js']
        }
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },

      assemble: {
        files: ['hbs/**/*.hbs', 'data/*.{json,yml}'],
        tasks: ['assemble', 'htmlmin'],
        options: {
          spawn: false,
          event: ['all'],
          debounceDelay: 0
        },
      },

      less: {
        files: 'less/**/*.less',
        tasks: ['buildLESS'],
        options: {
          spawn: false,
          event: ['all'],
          debounceDelay: 0
        }
      },

      css: {
        files: ['css/*.css'],
        tasks: ['buildCSS'],
        options: {
          spawn: false,
          event: ['all'],
          debounceDelay: 0
        }
      },

      uglify: {
        files: ['js/data.js', 'js/bzkl.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
          event: ['all'],
          debounceDelay: 0
        }
      },

      html: {
        files: ['html/*.html'],
        tasks: ['htmlmin'],
        options: {
          spawn: false,
          event: ['all'],
          debounceDelay: 0
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csscomb');

  grunt.registerTask('default', ['less', 'autoprefixer', 'csscomb', 'cssmin', 'uglify', 'assemble', 'htmlmin']);

  grunt.registerTask('build', ['autoprefixer', 'csscomb:less', 'less', 'csscomb:css', 'cssmin', 'uglify', 'assemble', 'htmlmin']);
  grunt.registerTask('buildLESS', ['autoprefixer', 'csscomb', 'less', 'csscomb:css', 'cssmin']);
  grunt.registerTask('buildCSS', ['autoprefixer', 'csscomb:css', 'cssmin']);
};
