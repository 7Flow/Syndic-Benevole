module.exports = function(grunt) {
    
    var DEV_PATH            = 'app/',
        DIST_PATH           = 'www/',
        SERVER_PATH         = 'app-server/';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! \n' +
' * MossieuChat: ESyndic  \n' +
' * @package   --\n' +
' * @author    Florian Fievet\n' +
' * @copyright <%= grunt.template.today("yyyy") %> ESyndic',
        
        sprite:{
            desktop: {
                algorithm: 'top-down',
                src: DEV_PATH+'sprites/*.png',
                destImg: DEV_PATH+'img/sprites.png',
                destCSS: DEV_PATH+'css/sprites.css'
            }
        },
        
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7,
                    cache: false
                },
                files: [
                    {
                        expand: true,
                        cache: false,
                        cwd: DEV_PATH+'img/',
                        src: ['**/*.png'],
                        dest: DIST_PATH+'img/',
                        ext: '.png'
                    }
                ]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cache: false,
                        cwd: DEV_PATH+'img/',
                        src: ['**/*.jpg'],
                        dest: DIST_PATH+'img/',
                        ext: '.jpg'
                    }
                ]
            }
        },
        
        copy: {
            assets: {
                files: [
                    {expand: true, flatten: true, src: [DEV_PATH+'i18n/*'],         dest: DIST_PATH+'i18n', filter: 'isFile'}
                ]
            }
        },
        
        compass: {
            desktop: {
                options: {
                    specify: DEV_PATH+'sass/app.scss',
                    sassDir: DEV_PATH+'sass/',
                    cssDir: DEV_PATH+'css',
                    sourcemap: true
                }
            }
        },
        
        concat: {
            css: {
                src: [
                    DEV_PATH+'css/*.css'
                ],
                dest: DIST_PATH+'css/app.css'
            },
            js: {
                src: [
                    DEV_PATH+'vendor/*.js',
                    SERVER_PATH+'config/api.js',
                    DEV_PATH+'js/00-templates.js',
                    DEV_PATH+'js/plugins/**/*.js',
                    DEV_PATH+'js/app.intro.js',
                    DEV_PATH+'js/modules/**/*.js',
                    DEV_PATH+'js/app.outro.js'
                ],
                dest: DIST_PATH+'js/app.js'
            }
        },
        
        jshint: {
            files: [DEV_PATH+'js/*.js']
        },

        jade: {
            compile: {
                options: {
                    compileDebug: false,
                    pretty: true,
                    client: true,
                    namespace: 'JST',
                    amd: false,
                    expand: false
                },
                src: [DEV_PATH+"templates/**/*.jade"],
                dest: DEV_PATH+"js/00-templates.js"
            }
        },

        watch: {
            files: [DEV_PATH+'sass/*.scss', DEV_PATH+'js/*.js'],
            tasks: ['compass', 'concat:js', 'concat:css'],
            options: {
                debounceDelay: 250
            }
        }
    });

    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('dev', [
        'watch'
    ]);
    
    
    grunt.registerTask('default', [
        'compass:desktop',
        'concat:js',
        'concat:css'
    ]);
    
    grunt.registerTask('build', [
        'sprite:desktop',
        'compass:desktop',
        'concat:js',
        'concat:css',
        'copy:assets',
        'imagemin'
    ]);
    
};