<script lang="ts">
  import { colorClass, sizeClass, type LinkProps } from ".";

  export let props: LinkProps = {
    href: "",
    size: "medium",
    variant: "blue",
    withIcon: false
  };

  let iconClass = "";
  if (props.withIcon) iconClass = "flex items-center justify-center gap-2";
</script>

<a href={props.href} class="{iconClass} rounded-lg px-4 py-2 text-center font-medium text-white focus:outline-none focus:ring-0 {sizeClass[props.size ]} {colorClass[props.variant]}">
  <slot />
</a>
