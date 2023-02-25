<script lang="ts">
  import { disabledClass, sizeClass, widthClass, type InputProps } from ".";

  export let props: InputProps = {
    type: "text",
    placeholder: "Optional placeholder",
    value: "",
    label: "",
    disabled: false,
    readonly: false,
    required: false,
    tip: undefined,

    id: Math.random().toString(36).substring(7),
    name: "",

    size: "small",
    width: "full"
  };

  export let value: string;

  let disabled: string;
  if (props.disabled) disabled = disabledClass["true"];
  else disabled = disabledClass["false"];

  let roundedClass: string;
  if (props.tip) roundedClass = "rounded-r-lg";
  else roundedClass = "rounded-lg";

  function update(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
  }
</script>

{#if props.label}
  <label for={props.id} class="mb-2 block text-sm font-medium text-white">{props.label}</label>
{/if}

<div class="flex">
  {#if props.tip}
    <span
      class="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-600 px-3 text-sm text-gray-400"
    >
      {props.tip ?? "coucou"}
    </span>
  {/if}

  <input
    type={props.type}
    id={props.id}
    name={props.name}
    class="border {sizeClass[props.size]} {roundedClass} block p-2.5 text-white {widthClass[
      props.width
    ]} border-gray-600 bg-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 {disabled}"
    placeholder={props.placeholder}
    disabled={props.disabled}
    readonly={props.readonly}
    required={props.required}
    value={value ?? ""}
    on:input={update}
    on:input
  />
</div>