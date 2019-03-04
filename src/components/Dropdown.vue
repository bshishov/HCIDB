<i18n>
{
  "en": {
    "custom": "Custom",
    "clear": "Clear",
    "no-items": "No Items"
  },
  "ru": {
    "custom": "Не из списка",
    "clear": "Очистить",
    "no-items": "Нет элементов"
  }
}
</i18n>

<template>
  <div class="dropdown">
    <input type="text"
           :value="inputValue"
           :placeholder="placeholder"
           @input="onInput"
           @focus="onFocus"
           @blur="onBlur">
    <div class="controls">
      <div class="item" v-if="isCustomInput">{{ $t('custom') }}</div>
      <div class="item" v-if="hasValue" @click="clear">{{ $t('clear') }}</div>
    </div>
    <div class="items" v-if="inputFocused && hasItems">
      <div class="item" v-for="(item, i) in items" @click="selected(i)">
        <slot name="item" :item="item">
          <div class="default-item">
            {{ itemToString(item) }}
          </div>
        </slot>
      </div>
    </div>
    <div class="items" v-if="inputFocused && !hasItems && !allowCustomInput">
      <slot name="no-items">
        <div class="default-item no-items">
          {{ $t('no-item') }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Dropdown",
    props: {
      placeholder: { type: String },
      allowCustomInput: { type: Boolean, default: false },
      items: { type: Array },
      itemStringKey: { type: String, default: null },
      value: { content: null, type: null }
    },
    data() {
      return {
        inputFocused: false,
        inputValue: null,
        selectedItem: null,
        localValue: null
      }
    },
    watch: {
      localValue: function (newVal) {
        this.$emit('input', newVal);
      },
      value: function (newVal) {
        this.localValue = newVal;
        this.inputValue = this.itemToString(newVal);
      }
    },
    methods: {
      itemToString(item) {
        if (!item)
          return null;
        if (typeof item === 'string' || item instanceof String)
          return item;
        if (!this.itemStringKey || !(this.itemStringKey in item))
          return item;
        return item[this.itemStringKey];
      },
      selected(index) {
        if (index >= 0 && index < this.items.length) {
          this.selectedItem = this.items[index];
          this.inputValue = this.itemToString(this.selectedItem);
          this.localValue = this.selectedItem;
          this.$emit('selected', this.selectedItem);
          this.inputFocused = false;
        }
      },
      onFocus() {
        this.inputFocused = true;
      },
      onBlur() {
        setTimeout(() => {
          if(!this.inputFocused)
            return;

          this.inputFocused = false;
          if (!this.allowCustomInput) {
            if(!this.inputValue) {
              this.clear();
            }
            else {
              this.inputValue = this.itemToString(this.selectedItem);
              this.value = this.selectedItem;
            }

            this.$emit('input', this.value);
          }
        }, 200);
      },
      onInput(e) {
        this.inputValue = e.target.value;
        this.$emit('textInput', this.inputValue);
        if(this.allowCustomInput) {
          this.localValue = this.inputValue;
        }
      },
      clear() {
        this.inputValue = null;
        this.selectedItem = null;
        this.localValue = null;
      }
    },
    computed: {
      hasItems() {
        if(!this.items)
          return false;
        return this.items.length > 0;
      },
      hasValue() {
        if(!this.localValue)
          return false;
        return true;
      },
      isCustomInput() {
        if (!this.inputValue)
          return false;
        return this.selectedItem !== this.localValue;
      }
    }
  }
</script>

<style scoped lang="sass">
@import "../assets/style.sass"

.dropdown
  position: relative
  width: 100%
.items
  position: absolute
  z-index: 99
  width: inherit
  background-color: white
  box-shadow: 1px 3px 2px rgba(0,0,0,0.2)
  display: flex
  flex-flow: column nowrap
  align-items: stretch
  max-height: 300px
  overflow: auto
  .item
    cursor: pointer
    &:hover
      background-color: lighten($primary-color, 10%)
.default-item
  padding: 5px 10px
.no-items
  font-style: italic
  color: #ccc
.controls
  position: absolute
  font-size: 0.6em
  top: 0
  right: 0
  color: #4b9fff
  cursor: pointer
  display: flex
  flex-flow: row nowrap
  & > *
    margin-right: 5px
</style>
