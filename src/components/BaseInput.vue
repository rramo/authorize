<template>
  <div class="b-input">
    <input
      :value="value"
      v-bind="$attrs"
      v-on="listeners"
      :type="type"
      placeholder=" "
    />
    <label for="email">{{ label }}</label>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text",
      validator: value =>
        ["text", "email", "hidden", "password"].indexOf(value) !== -1
    }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit("input", event.target.value)
      };
    }
  }
};
</script>

<style>
.b-input {
  position: relative;
  padding: 0.5rem;
}
.b-input label {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  left: 1.7rem;
  font-size: 1rem;
  font-weight: bold;
  color: green;
  pointer-events: none;
}
.b-input input:focus + label,
.b-input input:not(:placeholder-shown) + label {
  left: 1.7rem;
  top: 12px;
  font-size: 0.8rem;
  transform: translateY(0);
  transition: all 0.2s;
}
.b-input input {
  padding: 1.5rem 1rem 1.1rem;
  font-size: 1rem;
  min-width: 15rem;
  background: white;
  border: 1px solid darkgreen;
}
.b-input input:focus {
  padding: 1.5rem 1rem 1.1rem;
}
</style>
