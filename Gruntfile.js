module.exports = function (grunt) {
    
    grunt.initConfig({

        clean: ['dest'],

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.html'],
                        dest: 'dest/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/',
                        src: ['js/lib/*'],
                        dest: 'dest/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/',
                        src: ['css/*'],
                        dest: 'dest/'
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['fonts/*'],
                        dest: 'dest/'
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['templates/**'],
                        dest: 'dest/'
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['images/**'],
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
                    'src/**/*.html'
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

    grunt.registerTask('default', ['clean', 'copy', 'concat', 'connect', 'watch']);
    grunt.registerTask('deploy', ['clean', 'copy', 'uglify']);

};
