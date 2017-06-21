'use strict';

/**
 * IIFE
 *
 * 1. Create the module execution controller (MEC);
 * 2. Create the application controller for SmoothState and Mapping;
 * 3. Attach our app's initializer and the MEC's executor to jQuery's Ready handler (executes once);
 * 4. Replace jQuery's Ready handler with the MEC's registrar;
 * 5. Attach a module to the MEC (executes on jQuery's onReady event and all SmoothState onAfter events);
 */
var app = {};

;(function($) {
    var $doc = $(document);

    /** [1] */
    $.readyFn = {
        list: [],
        register: function(fn) {
            $.readyFn.list.push(fn);
        },
        execute: function() {
            console.log('Modules Executing');
            for (var i = 0; i < $.readyFn.list.length; i++) {
                try {
                    $.readyFn.list[i].apply(document, [$]);
                } catch (e) {
                    throw e;
                }
            };
        }
    };

    /** [2] */
    app = {
        initSmoothState: function () {
            console.log('Module Executed: SmoothState.js');

            var $page = $('#main'),
                options = {
                    debug: true,
                    prefetch: true,
                    cacheLength: 2,
                    onStart: {
                        duration: 500,
                        render: function($container) {
                            // Add your CSS animation reversing class
                            $container.addClass('is-exiting');
                            // Restart your animation
                            app.smoothState.restartCSSAnimations();
                        }
                    },
                    onReady: {
                        duration: 0,
                        render: function($container, $newContent) {
                            // Remove your CSS animation reversing class
                            $container.removeClass('is-exiting');
                            // Inject the new content
                            $container.html($newContent);
                        }
                    },
                    onAfter: function($container, $newContent) {
                        $.readyFn.execute();
                    }
                };
            this.smoothState = $page.smoothState(options).data('smoothState');
        },
        initializeFeedEffect: function () {
            this.feedExists = document.getElementById('feed');
            if (this.feedExists) {
              // console.log('Module Executed: LWYH scroll');
              document.getElementById('feed').addEventListener('scroll', function(){
               var y = document.getElementById('feed').scrollTop;
               if(y > 0 && y < window.innerHeight)
               {
                var img = document.getElementById('lwyh-logo');
                var initScale = 1;
                img.style.transform = 'scale(' + (initScale-(y/65)) + ')';
                img.style.opacity  = 1 / (y / 10);
              }
            });
              $('body').addClass('fixed');
            }
            else{
                $('body').removeClass('fixed');
            }
        },
        hideNavBar: function() {
            this.aboutExists = document.getElementById('about');
            if (this.aboutExists) {
                // console.log('Nav-hiding in motion');
                document.addEventListener('scroll', function(){
                    var scroll = document.body.scrollTop;
                    var nav = document.getElementById('nav');
                    if (scroll > 45) {
                        $('#nav').addClass('navup');
                        $('#social-bar').addClass('scrolled');                        
                    }
                    else{
                        $('#nav').removeClass('navup');
                        $('#social-bar').removeClass('scrolled');                        
                    }
                });
            }
        },
        logOut: function() {
            this.feedExists = document.getElementById('feed');
            if (this.feedExists) {
                document.getElementById('logout').addEventListener('click', function(){
                    $('.logout-container').toggleClass('closed');
                });
            }
        },
        disableScroll: function(){
          document.documentElement.addEventListener('gesturestart', function (event) {
            event.preventDefault();      
          }, false);
        }
      };

    /** [3] */
    $doc.ready(function() {
        console.log('Initial Document Ready');
        app.initSmoothState();
        app.disableScroll();
        $.readyFn.execute();
    });

    /** [4] */
    $.fn.ready = $.readyFn.register;

})(jQuery);

/** [5] */
$(function() {
    app.initializeFeedEffect();
    app.hideNavBar();
    app.logOut();
});

