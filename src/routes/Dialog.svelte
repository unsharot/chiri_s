<script lang="ts">
	export let dialog: HTMLElement;

	function closeIfOutside(e: MouseEvent) {
		console.log('aaa');
		console.log(e.target);
		if (dialog && e.target === dialog) {
			console.log('!');
		}
	}
</script>

<dialog
	bind:this={dialog}
	onclick={(e) => closeIfOutside(e)}
	class="absolute z-3 h-auto w-100 rounded shadow-gray-800"
>
	<slot />
</dialog>
