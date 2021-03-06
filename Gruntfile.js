'use strict'

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    ec2: '../permissions/aws.json',

    clean: ['dest'],

    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'src/',
            src: ['*.html', '*.pdf', 'templates/*', 'fonts/*', 'images/*'],
            dest: 'dest/'
          },
          {
            expand: true,
            flatten: true,
            cwd: 'src/',
            src: ['js/lib/*', 'css/*'],
            dest: 'dest/'
          },
          {
            src: ['.htaccess'],
            dest: 'dest/'
          }
        ]
      },
    },

    concat: {
      main: {
        files: {
          'dest/main.js': ['src/js/*.js']
        }
      }
    },

    uglify: {
      options: {
        mangle: true,
        banner: '/*! (c) <%= pkg.author %> - ' +
        '<%= grunt.template.today("mm-dd-yyyy") %> */\n'
      },
      main: {
        files: {
          'dest/main.js': ['src/js/*.js']
        }
      }
    },

    connect: {
      main: {
        options: {
          base: 'dest',
          port: 3000,
          hostname: '*',
          livereload: true,
        }
      }
    },

    watch: {
      src: {
        tasks: ['clean', 'copy', 'concat'],
        files: [
          'src/**/*.js',
          'src/**/*.css',
          'src/**/*.html',
          'src/**/*.pdf'
        ],
        options: {
          livereload: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ec2');

  grunt.registerTask('default', ['dev', 'connect', 'watch']);
  grunt.registerTask('dev', ['clean', 'copy', 'concat']);
  grunt.registerTask('build', ['clean', 'copy', 'uglify']);
  grunt.registerTask('deploy' , name => {
    grunt.task.run([
      'build',
      'ec2-launch:' + name,
      'ec2-setup:' + name,
      'ec2-deploy:' + name,
      'ec2-elb-attach:' + name,
    ])
  });
  grunt.registerTask('redeploy' , name => {
    grunt.task.run([
      'build',
      'ec2-deploy:' + name,
    ])
  });
  grunt.registerTask('undeploy' , name => {
    grunt.task.run([
      'ec2-shutdown:' + name,
    ])
  });

};
