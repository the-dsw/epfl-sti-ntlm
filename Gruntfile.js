// Gruntfile.js
module.exports = function(grunt){

    // Load grunt mocha task
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-zip');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Define an unzip task
        unzip: {
            'test/': 'test/copernic20161108110016.zip'
        },
        mochaTest: {
            test: {
                src: ['test/**/*.js', '!test/learn.spec.js', '!test/lib/**']
            },
            options: {
                run: true
            }
        }
    });

    grunt.registerTask('default', function() {
        grunt.task.run('mochaTest');
    });
    grunt.registerTask('acceptance', function() {
        grunt.config.set('mochaTest.test.src', 'test/scrape.spec.js');
        grunt.task.run('mochaTest');
    });
    grunt.registerTask('learntests', function () {
        grunt.config.set('mochaTest.test.src', 'test/learn.spec.js');
        grunt.task.run('mochaTest');

    })
};