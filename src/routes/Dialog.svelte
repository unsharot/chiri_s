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
	class="absolute h-[100vh] w-100 shadow-gray-500"
>
	<slot />
</dialog>
