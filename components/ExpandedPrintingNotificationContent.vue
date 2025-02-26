<template>
    <div class="p-2">
        <div class="text-lg font-bold mb-2">Printing</div>
        <div class="mb-4">Document name: papers-2000.pdf</div>

        <button
            @click.stop="cancelPrinting"
            class="bg-gray-700 px-3 py-1 rounded-full">
            
            Cancel
        </button>
    </div>
</template>

<script setup lang="ts">
    const { hideDynamicIsland } = useDynamicIsland()

    const cancelPrinting = () => {
        hideDynamicIsland()
    }
</script>
