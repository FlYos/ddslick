import placeHolderTemplate from './templates/default.html';
import selectedItemTemplate from './templates/selectedItem.html';

class DDSlick {
    constructor(element, options) {
        this.$element = $(element)
        this.data = this.$element.data('ddslick')
        this.options = options;

        this._init()
    }

    /************* PUBLIC METHODS *************/

    select(options) {
        if (options.index!==undefined)
            this.selectIndex(options.index);
        else if (options.id)
            this.selectId(options.id);

        return this;
    }
    
    selectId(id) {

       var index = this.$placeHolder.find(".dd-option-value[value= '" + id + "']").parents("li").prevAll().length;
       this.selectIndex(index);

    }

    selectIndex (index, runCallbacks = true) {
        //Get plugin data
        let pluginData = this.__getPluginData();

        //Get required elements
        let ddSelected = this.$placeHolder.find('.dd-selected'),
            ddSelectedValue = ddSelected.siblings('.dd-selected-value'),
            selectedOption = this.$placeHolder.find('.dd-option').eq(index),
            selectedLiItem = selectedOption.closest('li'),
            selectedData = this.selectedData(index);


        //Highlight selected option
        this.$placeHolder.find('.dd-option.dd-option-selected').removeClass('dd-option-selected');
        selectedOption.addClass('dd-option-selected');

        //Update or Set plugin data with new selection
        pluginData.selectedIndex = index;
        pluginData.selectedItem = selectedLiItem;
        pluginData.selectedData = selectedData;

        ddSelected.html(this.__getSelectedContent(selectedData));

        if(!!selectedData.value){
            //Updating selected option value
            ddSelectedValue.val(selectedData.value);

            //BONUS! Update the original element attribute with the new selection
            this.$element.val(selectedData.value).trigger('change');
        }

        this._setPluginData(pluginData);

        //Close options on selection
        this.close(runCallbacks);

        //Adjust appearence for selected option
        this.__adjustSelectedHeight();

        //Callback function on selection
        this.__runCallback('onSelected')
    }

    toggle(runCallback = true) {
        //Close all open options (multiple plugins) on the page
        $('.dd-click-off-close').not(this.$ddOptions).slideUp(50);
        $('.dd-pointer').removeClass('dd-pointer-up');
        this.$ddSelect.removeClass('dd-open');

        this.$ddOptions.is(':visible')
            ? this.close(runCallback)
            : this.open(runCallback)

        //Fix text height (i.e. display title in center), if there is no description
        this.__adjustOptionsHeight();
    }

    open(runCallback = true) {

        this.$ddSelect.addClass('dd-open');
        this.$ddOptions.slideDown('fast');
        this.$ddSelect.find('.dd-pointer').addClass('dd-pointer-up');

        this.__runCallback(runCallback, 'onOpen')
    }

    close (runCallback = true) {

        this.$ddOptions.slideUp('fast');
        this.$ddSelect.find('.dd-pointer').removeClass('dd-pointer-up');
        this.$ddSelect.removeClass('dd-open');

        this.__runCallback(runCallback, 'onClose')
    }

    selectedData (index = null, callback = $.noop ) {
        if(typeof index == 'function') {
            callback = index;
            index = null;
        }

        if(index == null) {
            index = this.__getPluginData().selectedIndex
        }

        let selectedData = this.options.data[index] || {}

        callback(selectedData);

        return selectedData;
    }

    selectedValue (index = null) {
        return this.selectedData(index).value
    }

    destroy() {
        //Check if already destroyed
        if(this.$element.is('select')) {
            this.$placeHolder.unbind('.ddslick').remove();
            this.$element.removeData('ddslick').show();
        } else {
            this.$placeHolder
                .removeData('ddslick')
                .unbind('.ddslick')
                .replaceWith(this.$element);
        }
    }

    /************* PROTECTED METHODS *************/

    static retrieveInstance(element, dataName) {

        let $el = $(element);

        if($el.is('select'))
            return $el.data(dataName);

        if($el.data('ddslick'))
            return $el.data('ddslick').original.data(dataName);

        return null
    }

    _init () {
        if(!this.data) {
            this._mergeOptionsData(this.__getOptionsData())
                ._buildTemplate()
                ._appendSelector()
                ._appendCss()
                ._setPluginData()
                ._setDefaultValue()
                ._addEvents()
        }
    }

    _mergeOptionsData(ddSelect) {
        //Update Plugin data merging both HTML select data and JSON data for the dropdown
        this.options.data = this.options.keepJSONItemsOnTop
            ? $.merge(this.options.data, ddSelect)
            : $.merge(ddSelect, this.options.data)

        return this;
    }

    _buildTemplate() {
        

        this.$placeHolder = $( placeHolderTemplate({
            container_id: this.$element.attr('id') + ( this.$element.is('select') ? '-dd':''),
            selected_value: '',
            input_name: this.__getInputName(),
            empty_value: this.options.selectText,
            selected: false,
            options: this.options.data,
            imagePosition: this.__getImagePosition()
        }) );

        this.$ddSelect = this.$placeHolder.find('.dd-select');
        this.$ddOptions = this.$placeHolder.find('.dd-options');

        return this;
    }

    _appendSelector(html) {

        this.$element.is('select')
            ? this.$placeHolder.insertAfter(this.$element.hide())
            : this.$element.replaceWith(this.$placeHolder)

        return this;
    }

    _appendCss() {
        if(!! this.options.width) {
            this.$ddOptions.css({ width: this.options.width });
            this.$ddSelect.css({ width: this.options.width});
            this.$placeHolder.css({ width: this.options.width });
        }

        if(!! this.options.height) {
            this.$ddOptions.css({ height: this.options.height, overflow: 'auto' });
        }

        return this;
    }

    _setPluginData(pluginData = null) {
        let obj = this.$element.is('select')
            ? this.$element
            : this.$placeHolder;

        if(!pluginData) {
            pluginData = {
                settings: this.options,
                original: this.$element,
                selectedIndex: -1,
                selectedItem: null,
                selectedData: null
            }
        }

        obj.data('ddslick', pluginData);

        return this
    }

    _setDefaultValue() {
        if(this.options.selectText.length == 0) {
            let index = (this.options.defaultSelectedIndex != null && this.options.defaultSelectedIndex >= 0 && this.options.defaultSelectedIndex < this.options.data.length)
                ? this.options.defaultSelectedIndex
                : 0;

            this.selectIndex(index, false);

        }

        return this;
    }

    _addEvents() {
        this.$ddSelect.on('click.ddslick', () => this.toggle(true))
        this.$ddOptions.on('click.ddslick', (e) => {
            this.selectIndex(
                $(e.target).closest('li').index()
            )
        });

        if (this.options.clickOffToClose) {
            this.$ddOptions.addClass('dd-click-off-close');
            this.$placeHolder.on('click.ddslick', (e) => e.stopPropagation());
            $('body').on('click', () => {
                $('.dd-open').removeClass('dd-open');
                $('.dd-click-off-close').slideUp(50).siblings('.dd-select').find('.dd-pointer').removeClass('dd-pointer-up');
            });
        }

        return this;
    }

    /************* PRIVATE METHODS *************/

    __getOptionsData () {
        let ddSelect = [];

        this.$element.find('option').each(function () {
            let $this = $(this);
            let thisData = $this.data();
            ddSelect.push({
                text: $.trim($this.text()),
                value: $this.val(),
                selected: $this.is(':selected'),
                description: thisData.description,
                imageSrc: thisData.imagesrc //keep it lowercase for HTML5 data-attributes
            });
        });

        return ddSelect;
    }

    __getInputName() {
        return this.options.name || this.$element.attr('name') || '';
    }

    __getPluginData() {
        return this.$element.is('select')
            ? this.$element.data('ddslick')
            : this.$placeHolder.data('ddslick');
    }

    __getImagePosition () {
        return this.options.imagePosition == "right" ? ' dd-image-right' : ''
    }

    __getSelectedContent(selectedData = {}) {
        if(this.options.showSelectedHTML) {
            return selectedItemTemplate({
                imagePosition: this.__getImagePosition(),
                imageSrc: selectedData.imageSrc ? selectedData.imageSrc : '',
                text: selectedData.text ? selectedData.text : '',
                description: selectedData.description ? selectedData.description : '',
            });
        }

        return selectedData.text;
    }

    __adjustSelectedHeight() {
        //Get height of dd-selected
        let lSHeight = this.$ddSelect.css('height');

        //Check if there is selected description
        var descriptionSelected = this.$placeHolder.find('.dd-selected-description');
        var imgSelected = this.$placeHolder.find('.dd-selected-image');
        if (descriptionSelected.length <= 0 && imgSelected.length > 0) {
            this.$placeHolder.find('.dd-selected-text').css('lineHeight', lSHeight);
        }
    }

    __adjustOptionsHeight() {
        let obj = this.$placeHolder;
         this.$placeHolder.find('.dd-option').each(function () {
            var $this = $(this);
            var lOHeight = $this.css('height');
            var descriptionOption = $this.find('.dd-option-description');
            var imgOption = obj.find('.dd-option-image');
            if (descriptionOption.length <= 0 && imgOption.length > 0) {
                $this.find('.dd-option-text').css('lineHeight', lOHeight);
            }
        });
    }

    __runCallback(runCallback, callbackName) {
        if(typeof runCallback == 'string') {
            callbackName = runCallback;
            runCallback = true;
        }
        if (runCallback && typeof this.options[callbackName] == 'function') {
            this.options[callbackName].call(this, this.__getPluginData());
        }

        return this;
    }
}

DDSlick.DEFAULTS = {
    data: [],
    keepJSONItemsOnTop: false,
    name: '',
    width: null,
    height: null,
    selectText: "",
    defaultSelectedIndex: null,
    truncateDescription: true,
    imagePosition: "left",
    showSelectedHTML: true,
    clickOffToClose: true,
    embedCSS: true,
    onSelected: function () { },
    onOpen: function () { },
    onClose: function () { }
};

export default DDSlick;