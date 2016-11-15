// Gruntfile.js
module.exports = function(grunt){

    // Load grunt mocha task
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-zip');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Define an unzip task
        unzip: {
            'tests/': 'tests/copernic20161108110016.zip'
        },
        // Mocha
        mochaTest: {
            test: {
                src: ['tests/**/*.js'],
            },
            options: {
                run: true
            }
        }
    });

    grunt.registerTask('default', ['mochaTest']);
};