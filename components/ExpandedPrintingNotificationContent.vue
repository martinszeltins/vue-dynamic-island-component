<template>
    <div class="p-2">
        <div class="text-lg font-bold mb-2">Printing</div>
        <div class="mb-4">Document name: papers-2000.pdf</div>

        <div>Title: {{ props.title }}</div>

        <div class="my-4 font-bold">Context</div>

        <p>Here is more info. Currently the system is printing a document. You should see that your printer is doing some work. If something is not working as it should, do not hesitate to contact support.</p>

        <button
            @click.stop="cancelPrinting"
            class="bg-gray-700 px-3 py-1 rounded-full">
            
            Cancel
        </button>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        title?: string
    }>()

    const { hideDynamicIsland } = useDynamicIsland()

    const cancelPrinting = () => {
        hideDynamicIsland()
    }
</script>
