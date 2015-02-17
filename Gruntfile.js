module.exports = function (grunt) {
    
    grunt.initConfig({

        connect: {
            server: {
                options: {
                    port: 80,
                    hostname: '*'
                }
            },
            dev: {
                options: {
                    port: 3000,
                    hostname: '*'
                }
            }
        },
        watch: {
            src: {
                files: [
                    'index.html',
                    '*.js',
                    'main.css',
                    'templates/*.html'
                ],
                options: {
                    livereload: true
                }
            }
        }
    
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect:dev', 'watch']);
    grunt.resisterTask('server', ['connect:server']);

};
