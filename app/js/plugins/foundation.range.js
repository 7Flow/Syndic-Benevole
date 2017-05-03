;(function ($, window, document, undefined) {
    'use strict';

    Foundation.libs.range = {
        name : 'range-slider',

        version : '0.1.0',

        settings: {
            start: 0,
            end: 100,
            step: 1,
            initial: [0, 3],
            max: 20,
            min: 0,
            display_selector: '',
            vertical: false,
            handles_position: "inside",
            on_change: function(){}
        },

        cache : {},

        init : function (scope, method, options) {
            //Foundation.inherit(this,'slider');
            Foundation.inherit(this,'throttle');
            this.bindings(method, options);
            this.reflow();
        },

        events : function() {
            var self = this;

            $(this.scope)
                .off('.slider')
                .on('mousedown.fndtn.slider touchstart.fndtn.slider pointerdown.fndtn.slider',
                    '[' + self.attr_name() + ']:not(.disabled, [disabled]) .range-slider-handle', function(e) {
                    if (!self.cache.active) {
                        //console.log('::mousemove');
                        //console.log( $(e.target) );
                        e.preventDefault();
                        self.set_active_slider($(e.target));
                    }
                })
                .on('mousemove.fndtn.slider touchmove.fndtn.slider pointermove.fndtn.slider', function(e) {
                    if (!!self.cache.active) {
                        e.preventDefault();
                        //console.log('::mousemove');
                        //console.log( $.data(self.cache.active[0]) );

                        if ($.data(self.cache.active[0], 'settings').vertical) {
                            var scroll_offset = 0;
                            if (!e.pageY) {
                                scroll_offset = window.scrollY;
                            }
                            self.calculate_position(self.cache.active, (e.pageY ||
                                e.originalEvent.clientY ||
                                e.originalEvent.touches[0].clientY ||
                                e.currentPoint.y)
                                + scroll_offset);
                        } else {
                            self.calculate_position(self.cache.active, e.pageX ||
                                e.originalEvent.clientX ||
                                e.originalEvent.touches[0].clientX ||
                                e.currentPoint.x);
                        }
                    }
                })
                .on('mouseup.fndtn.slider touchend.fndtn.slider pointerup.fndtn.slider', function(e) {
                    self.remove_active_slider();
                })
                .on('change.fndtn.slider', function(e) {
                    self.settings.on_change();
                });

            self.S(window)
                .on('resize.fndtn.slider', self.throttle(function(e) {
                    self.reflow();
                }, 300));
        },

        set_active_slider : function($handle) {
            this.cache.active = $handle;
        },

        remove_active_slider : function() {
            this.cache.active = null;
        },

        calculate_position : function($handle, cursor_x) {
            var self = this,
                settings = $.data($handle[0], 'settings'),
                handle_l = $.data($handle[0], 'handle_l'),
                handle_p = $.data($handle[0], 'handle_padding'),
                bar_l = $.data($handle[0], 'bar_l'),
                bar_o = $.data($handle[0], 'bar_o');

            cursor_x -= handle_p;

            requestAnimationFrame(function(){
                var pct;

                if (Foundation.rtl && !settings.vertical) {
                    pct = self.limit_to(((bar_o+bar_l-cursor_x)/bar_l),0,1);
                } else {
                    pct = self.limit_to(((cursor_x-bar_o)/bar_l),0,1);
                }
                pct = settings.vertical ? 1-pct : pct;
                var norm = self.normalized_value(pct, settings.start, settings.end, settings.step);

                var _values = {start: 0, end: 0},
                    _modified = false,
                    _$otherHandle;

                if ($.data($handle[0], 'handle_start')) {
                    _$otherHandle = $handle.parent().find('.range-slider-handle:eq(1)');
                    _values.end = $.data( _$otherHandle[0], 'handle_norm' );
                    _values.start = norm;
                    _modified = self.clamp_values(_values, true);

                    self.set_ui($handle, _values.start);
                    if (_modified) self.set_ui(_$otherHandle, _values.end);
                } else {
                    _$otherHandle = $handle.parent().find('.range-slider-handle:first');
                    _values.start = $.data( _$otherHandle[0], 'handle_norm' );
                    _values.end = norm;
                    _modified = self.clamp_values(_values, false);

                    self.set_ui($handle, _values.end);
                    if (_modified) self.set_ui(_$otherHandle, _values.start);
                }
                console.log('     |--> calculate_position:', _values);

                self.set_global_ui( _values, $handle.parent().find('.range-slider-active-segment'), $handle );
            });
        },

        set_global_ui : function( values, $activeBar, $handle ) {
            var progress_bar_offset = this.normalized_percentage(values.start, this.settings.start, this.settings.end) * 100,
                progress_bar_length = this.normalized_percentage((values.end - values.start), this.settings.start, this.settings.end) * 100,
                // -> transform % of total bar to % of total bar minus the 2 handles length ('cause we have 2 handle in the bar)
                handlePercent = ($.data( $handle[0], 'handle_l' ) * 2) / $.data( $handle[0], 'bar_l' ),
                // -> adjust offset the active bar of half handle length (handle is arrow shaped)
                // -> adjust length of the active bar of one handle length
                progress_bar_offset = progress_bar_offset - progress_bar_offset * handlePercent + handlePercent * 25,
                progress_bar_length = progress_bar_length - progress_bar_length * handlePercent + handlePercent * 50;

            if (this.settings.vertical) {
                $activeBar.css('top', progress_bar_offset + '%')
                    .css('height', progress_bar_length + '%');
            } else {
                $activeBar.css('left', progress_bar_offset + '%')
                    .css('width', progress_bar_length + '%');
            }

            $activeBar.parent()
                .attr(this.attr_name()+'-start', values.start)
                .attr(this.attr_name()+'-end', values.end)
                .trigger('change')
                .trigger('change.fndtn.slider');

            $activeBar.parent().children('input[type=hidden]:first').val( values.start );
            $activeBar.parent().children('input[type=hidden]:eq(1)').val( values.end );
        },

        set_ui : function($handle, value) {
            var settings = $.data($handle[0], 'settings'),
                handle_l = $.data($handle[0], 'handle_l'),
                bar_l = $.data($handle[0], 'bar_l'),
                norm_pct = this.normalized_percentage(value, settings.start, settings.end),
                handle_offset = norm_pct*(bar_l-handle_l)-1 + $.data($handle[0], 'handle_padding');

            if (Foundation.rtl && !settings.vertical) {
                handle_offset = -handle_offset;
            }

            handle_offset = settings.vertical ? -handle_offset + bar_l + 1 : handle_offset;
            this.set_translate($handle, handle_offset, settings.vertical);

            if (!$handle[0].hasAttribute('aria-valuemin')) {
                $handle.attr({
                    'aria-valuemin': settings.start,
                    'aria-valuemax': settings.end
                });
            }

            // store norm value
            $.data($handle[0], 'handle_norm', value);
            $handle.attr('aria-valuenow', value);

            if (settings.display_selector != '') {
                $(settings.display_selector).each(function () {
                    if (this.hasOwnProperty('value')) {
                        $(this).val(value);
                    } else {
                        $(this).text(value);
                    }
                });
            }
        },

        clamp_values: function( values, start_active ) {
            var _modified = false,
                _range;

            console.log( '::clamp_values', values, this.settings.min, this.settings.max );

            if (values.start >= values.end) {
                if (start_active) {
                    values.end = values.start + this.settings.min;
                    if (values.end > this.settings.end) {
                        values.end = this.settings.end;
                        values.start = values.end - this.settings.min;
                    }
                }
                else {
                    values.start = values.end - this.settings.min;
                    if (values.start < this.settings.start) {
                        values.start = this.settings.start;
                        values.end = values.start + this.settings.min;
                    }
                }
                _modified = true;
            }

            _range = values.end - values.start;
            if (_range>this.settings.max) {
                if (start_active) values.end = values.start + this.settings.max;
                else values.start = values.end - this.settings.max;
                _modified = true;
            }

            console.log('   |-->', values);
            return _modified;
        },

        normalized_percentage : function(val, start, end) {
            return Math.min(1, (val - start)/(end - start));
        },

        normalized_value : function(val, start, end, step) {
            var range = end - start,
                point = val*range,
                mod = (point-(point%step)) / step,
                rem = point % step,
                round = ( rem >= step*0.5 ? step : 0);
            return (mod*step + round) + start;
        },

        set_translate : function(ele, offset, vertical) {
            if (vertical) {
                $(ele)
                    .css('-webkit-transform', 'translateY('+offset+'px)')
                    .css('-moz-transform', 'translateY('+offset+'px)')
                    .css('-ms-transform', 'translateY('+offset+'px)')
                    .css('-o-transform', 'translateY('+offset+'px)')
                    .css('transform', 'translateY('+offset+'px)');
            } else {
                $(ele)
                    .css('-webkit-transform', 'translateX('+offset+'px)')
                    .css('-moz-transform', 'translateX('+offset+'px)')
                    .css('-ms-transform', 'translateX('+offset+'px)')
                    .css('-o-transform', 'translateX('+offset+'px)')
                    .css('transform', 'translateX('+offset+'px)');
            }
        },

        limit_to : function(val, min, max) {
            return Math.min(Math.max(val, min), max);
        },

        initialize_settings : function(handle, index) {
            var settings = $.extend({}, this.settings, this.data_options($(handle).parent()));

            if (settings.vertical) {
                $.data(handle, 'bar_o', $(handle).parent().offset().top);
                $.data(handle, 'bar_l', $(handle).parent().outerHeight() - $(handle).outerHeight());
                $.data(handle, 'handle_o', $(handle).offset().top);
                $.data(handle, 'handle_l', $(handle).outerHeight());
                $.data(handle, 'handle_padding', index==0 ? 0 : $(handle).outerHeight());
            } else {
                $.data(handle, 'bar_o', $(handle).parent().offset().left);
                $.data(handle, 'bar_l', $(handle).parent().outerWidth() - $(handle).outerWidth());
                $.data(handle, 'handle_o', $(handle).offset().left);
                $.data(handle, 'handle_l', $(handle).outerWidth());
                $.data(handle, 'handle_padding', index==0 ? 0 : $(handle).outerWidth());
            }

            $.data(handle, 'handle_start', (index==0));

            $.data(handle, 'bar', $(handle).parent());
            $.data(handle, 'settings', settings);
        },

        set_initial_position : function($ele) {
            console.log('-- set_initial_position');

            var handles = $ele.children('.range-slider-handle');
            for (var i= 0, _l=handles.length; i<_l; ++i) {
                var settings = $.data(handles[i], 'settings'),
                    initial = (!!settings.initial ? settings.initial[i] : Math.floor((settings.end - settings.start) * 0.5 / settings.step) * settings.step + settings.start);

                console.log(' |--> set_ui', initial);
                this.set_ui( $(handles[i]), initial);
            }
        },

        set_value : function(value) {
            console.log('::set_value');
            var self = this;
            $('[' + self.attr_name() + ']', this.scope).each(function(){
                $(this).attr(self.attr_name(), value);
            });
            if (!!$(this.scope).attr(self.attr_name())) {
                $(this.scope).attr(self.attr_name(), value);
            }
            self.reflow();
        },

        reflow : function() {
            var self = this;
            self.S('[' + this.attr_name() + ']').each(function() {
                var handles = $(this).children('.range-slider-handle'),
                    _start = parseFloat( $(this).attr(self.attr_name()+'-start') ),
                    _end = parseFloat( $(this).attr(self.attr_name()+'-end') );

                self.initialize_settings( handles[0], 0 );
                self.initialize_settings( handles[1], 1 );

                if (_start && _end) {
                    self.set_ui($(handles[0]), _start);
                    self.set_ui($(handles[1]), _end);
                } else {
                    self.set_initial_position($(this));
                }
            });
        }
    };

}(jQuery, window, window.document));
