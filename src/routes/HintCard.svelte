<script lang="ts">
	let { name, imgDataURL } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-3 rounded p-4">
	<img class="h-36 w-36 rounded-md border bg-white" src={imgDataURL} alt="{name}のタイル画像" />
	<div class="font-bold">{name}</div>
</div>
