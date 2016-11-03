// Gruntfile.js
module.exports = function(grunt){

    // Load grunt mocha task
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Mocha
        mochaTest: {
            test: {
                src: ['tests/tests.js'],
            },
            options: {
                run: true
            }
        }
    });

    grunt.registerTask('default', ['mochaTest']);
};