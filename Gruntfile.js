module.exports = function (grunt) {
    
    grunt.initConfig({

        connect: {
            server: {
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
                    'main.js',
                    'main.css',
                    'background-top.html',
                    'background-bottom.html',
                    'meta-stuff.html',
                    'main-content.html'
                ],
                options: {
                    livereload: true
                }
            }
        }
    
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect', 'watch']);

};
