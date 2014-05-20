module.exports = function(grunt) {

	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    uglify: {
		    options: {
		        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
		    },
		    vendor: {
		        src: [
		        		'bower_components/angular/angular.js',
		        		'bower_components/angular-route/angular-route.js',
		        		'bower_components/underscore/underscore-min.js',
		        		'bower_components/angular-google-maps/dist/angular-google-maps.js',
		        		'bower_components/jquery/dist/jquery.js',
		        		'bower_components/sass-bootstrap/dist/js/bootstrap.js',
		        	],
		        dest: 'app/js/vendor.min.js',
		    },
		    IE: {
		        src: [
		        		'bower_components/html5shiv/dist/html5shiv.js',
		        		'bower_components/respond/dest/respond.js',
		        	],
		        dest: 'app/js/IE.min.js',
		    },
		    custom: {
		        src: [
		        		'app/js/app.js',
		        		'app/js/services/*.js',
		        		'app/js/controllers/*.js',
		        		'!app/js/*.min.js',
		        	],
		        dest: 'app/js/app.min.js',
		    },
	    },
	    compass: { 
		    dev: {
		        options: {
		    	    config: 'config.rb',
		        },
		    },
		    dist: {
		        options: {
		      	    config: 'config.rb',
		        },
		    },
		},
	    cssmin: {
			custom: {
		        src:  'app/styles/app.css',
		        dest: 'app/styles/app.min.css',
			},
			vendor: {
				src: [
						'bower_components/sass-bootstrap/dist/css/bootstrap.css',
						'bower_components/flat-ui-official/css/flat-ui.css',
					],
				dest: 'app/styles/vendor.min.css',
			}
		},
		watch: {
		  	css_custom: {
		    	files: 'app/styles/sass/*.scss',
		    	tasks: [
		    			'compass', 
		    			'cssmin:custom'
		    	],
				options: { livereload: true }
		  	},
		  	css_vendor: {
				options: { livereload: true },
		    	files: 'bower_components/**/*.css',
		    	tasks: ['cssmin:vendor']
		  	},
		  	js_vendor: {
				files: 'bower_components/**/*.js',
			  	tasks: 'uglify:vendor',
				options: { livereload: true }
		  	},
		  	js_custom: {
				files: [
						'app/js/**/*.js', 
	  					'!app/js/*.min.js',
		 		],
		  		tasks: 'uglify:custom',
				options: { livereload: true }
	  		},
		  	html: {
		  		files: [
		  				'app/**/*.html', 
		  		],
				options: { livereload: true }
		  	}
		},
		connect: {
		    app: {
		      	options: {
		        	port: 9001,
		        	base: 'app'
		      	}
		    }
		},
		clean: [
			"dist/*",
		],
		copy: {
			main: {
			    expand: true,
			    cwd: 'app/',
			    src: [
			    		'index.html',
			    		'fonts/**',
			    		'images/**',
			    		'views/**',
			    		'php/**'
			    ],
			    dest: 'dist/',
			    flatten: false,
			},
			js: {
			    expand: true,
			    cwd: 'app/',
			    src: 'js/**.min.js',
			    dest: 'dist/',
			    flatten: false,
			},
			styles: {
			    expand: true,
			    cwd: 'app/',
			    src: 'styles/**.min.css',
			    dest: 'dist/',
			    flatten: false,
			}
		}
	});

	  // Load plugins
	  grunt.loadNpmTasks('grunt-contrib-uglify');
	  grunt.loadNpmTasks('grunt-contrib-compass');
	  grunt.loadNpmTasks('grunt-contrib-cssmin');
	  grunt.loadNpmTasks('grunt-contrib-watch');
	  grunt.loadNpmTasks('grunt-contrib-connect');
	  grunt.loadNpmTasks('grunt-contrib-clean');
	  grunt.loadNpmTasks('grunt-contrib-copy');

	  grunt.registerTask('build', ['uglify', 'compass', 'cssmin', 'clean','copy']);

	  grunt.registerTask('serve', ['uglify', 'compass', 'cssmin', 'connect','watch']);

	  grunt.registerTask('default', ['uglify', 'compass', 'cssmin']);
};